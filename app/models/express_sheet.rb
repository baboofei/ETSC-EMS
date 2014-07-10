# encoding: utf-8
class ExpressSheet < ActiveRecord::Base
    require "reusable"
    include Reusable
    attr_accessible :cost, :description, :number, :pdf_url, :send_at, :sender_user_id

    belongs_to :sender, :class_name => 'User', :foreign_key => 'sender_user_id'
    belongs_to :currency

    #多态
    belongs_to :unit_receivable, :polymorphic => true

    @@cfg = File.read("#{Rails.root}/lib/pdf/express_sheet_cfg.json")

    def for_grid_json(user_id)
        attr = attributes
        attr['express_unit_name'] = Dictionary.where("data_type = 'express' and value = ?", express_unit_id).first.display
        attr['sender>name'] = sender.name
        #attr['receiver_unit_id'] = unit_receivable_id
        attr['^unit_receivable>(name|unit_aliases>unit_alias)'] = unit_receivable_type.constantize.find(unit_receivable_id)['name']
        #attr['receiver_id'] = person_receivable_id
        attr['^person_receivable>(name|en_name)'] = person_receivable_type.constantize.find(person_receivable_id)['name']
        attr['^vestable>(number)'] = vestable_type.constantize.find(vestable_id)['number'] unless vestable_type.blank?
        attr['currency_name'] = currency.name if currency
        attr['editable'] = User.where("roles.id = 9").includes(:roles).map(&:id).include?(user_id)
        attr
    end

    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        #所有权是自己或自己组员
        where("express_sheets.sender_user_id in #{str}", *member_ids)
    end

    def self.gen_express_sheet_pdf(params, user_id, remote_ip)
        page_config = JSON.parse(@@cfg, :symbolize_names => true)
        normal_font = "#{Rails.root}/app/assets/fonts/yahei_mono.ttf"
        #image = "shunfeng_96dpi.jpg"
        require "prawn"
        require "prawn/measurement_extensions"

        user = User.find(user_id)
        receiver_array = params[:receiver_ids].split("|")
        our_company = OurCompany.find(params[:our_company_id])
        express_sym = params[:express_id].to_sym

        sender = {
            :company => our_company.name,
            :name => user.name,
            :addr => our_company.addr,
            :phone => our_company.phone,
            :monthly_payment_ac => page_config[express_sym][:monthly_payment_ac],
            :month => "%02d" % Time.now.month,
            :day => "%02d" % Time.now.day
        }
        using = page_config[express_sym]

        #binding.pry
        timestamp = "#{Time.now.strftime("%Y%m%d%H%M%S")}_#{user_id}"
        Prawn::Document.generate("#{Rails.root}/public/express_sheets/#{timestamp}.pdf",
                                 :page_size => using[:page_size].map { |p| p.mm },
                                 :margin => using[:margin].map { |p| p.mm }) do |pdf|

            receiver_array.each_with_index do |re, index|
                receiver = params[:receiver_type].camelcase.constantize.find(re)
                receiver_addr = receiver.addr.blank? ? receiver.send("#{params[:receiver_type]}_unit").addr : receiver.addr
                long_addr = receiver.send("#{params[:receiver_type]}_unit").city.prvc.name + receiver.send("#{params[:receiver_type]}_unit").city.name + receiver_addr

                merged_addr = long_addr.gsub(/(.*?市)\1+/, '\1') + "#{receiver.postcode.blank? ? '' : "(#{receiver.postcode})"}"
                receiver = {
                    :company => receiver.send("#{params[:receiver_type]}_unit").name,
                    :name => receiver.name,
                    :addr => merged_addr,
                    :phone => receiver.phone,
                    :cell => receiver.mobile
                }
                #binding.pry

                pdf.font normal_font, :size => 9
                pdf.text_box(sender[:company], :at => using[:sender][:company][:xy].map { |p| p.mm }, :width => using[:sender][:company][:w].mm)
                pdf.text_box(sender[:name], :at => using[:sender][:name][:xy].map { |p| p.mm })
                pdf.text_box(sender[:addr], :at => using[:sender][:addr][:xy].map { |p| p.mm }, :width => using[:sender][:addr][:w].mm)
                pdf.text_box(sender[:phone], :at => using[:sender][:phone][:xy].map { |p| p.mm })
                #pdf.text_box(sender[:cell], :at => using[:sender][:cell][:xy].map{|p| p.mm})
                pdf.text_box(sender[:monthly_payment_ac].to_s, :at => using[:sender][:monthly_payment_ac][:xy].map { |p| p.mm }, :size => 13)
                pdf.text_box(sender[:name], :at => using[:sender][:sign][:xy].map { |p| p.mm }, :size => 10)
                pdf.text_box(sender[:month], :at => using[:sender][:month][:xy].map { |p| p.mm })
                pdf.text_box(sender[:day], :at => using[:sender][:day][:xy].map { |p| p.mm })
                pdf.text_box(receiver[:company].to_s, :at => using[:receiver][:company][:xy].map { |p| p.mm }, :width => using[:receiver][:company][:w].mm)
                pdf.text_box(receiver[:name], :at => using[:receiver][:name][:xy].map { |p| p.mm })
                pdf.text_box(receiver[:addr], :at => using[:receiver][:addr][:xy].map { |p| p.mm }, :width => using[:receiver][:addr][:w].mm)
                pdf.text_box(receiver[:tel].multi_split[0], :at => using[:receiver][:tel][:xy].map { |p| p.mm }) unless receiver[:tel].blank?
                pdf.text_box(receiver[:cell].multi_split[0], :at => using[:receiver][:cell][:xy].map { |p| p.mm }) unless receiver[:cell].blank?
                #pdf.stroke_bounds

                pdf.start_new_page unless (index == receiver_array.size - 1)
            end
        end

        if remote_ip == "127.0.0.1" || remote_ip.match(/^172\.18\./)
            printer_name = page_config[express_sym][:printer_name]
        elsif remote_ip.match(/^172\.16\./)
            printer_name = page_config[express_sym][:printer_name] + "FC"
        end
        #p printer_name

        #system("lpoptions -d #{printer_name}")
        #system("lp #{Rails.root}/public/express_sheets/#{timestamp}.pdf")

        return timestamp
    end

    def self.add_from_salelog(action, params, user_id)
        #binding.pry
        if action == :sample || action == :content || action == :processing_piece_to_customer || action == :product
            JSON.parse(params["grid_data"]).each do |single_record|
                quantity = single_record['quantity'].blank? ? "" : "#{single_record['quantity']}件"
                timestamp = single_record['timestamp'].split("_")[0]

                new_sheet = ExpressSheet.new
                new_sheet['express_unit_id'] = single_record['express_id']
                new_sheet['number'] = single_record['tracking_number']
                new_sheet['sender_user_id'] = user_id
                new_sheet['description'] = "#{quantity}#{single_record['model']}"
                new_sheet['send_at'] = "#{timestamp[0..3]}-#{timestamp[4..5]}-#{timestamp[6..7]} #{timestamp[8..9]}:#{timestamp[10..11]}:#{timestamp[12..13]}".to_datetime
                new_sheet['pdf_url'] = "#{Rails.root}/public/express_sheets/#{single_record['timestamp']}.pdf"
                new_sheet['unit_receivable_id'] = Customer.find(single_record['customer_id']).customer_unit_id
                new_sheet['unit_receivable_type'] = "CustomerUnit"
                new_sheet['person_receivable_id'] = single_record['customer_id']
                new_sheet['person_receivable_type'] = "Customer"
                new_sheet['vestable_id'] = params["salecase_id"]
                new_sheet['vestable_type'] = "Salecase"
                new_sheet['comment'] = params["comment"]
                new_sheet.save
            end
        elsif action == :processing_piece_to_vendor
            JSON.parse(params["grid_data"]).each do |single_record|
                quantity = single_record['quantity'].blank? ? "" : "#{single_record['quantity']}件"
                timestamp = single_record['timestamp'].split("_")[0]

                new_sheet = ExpressSheet.new
                new_sheet['express_unit_id'] = single_record['express_id']
                new_sheet['number'] = single_record['tracking_number']
                new_sheet['sender_user_id'] = user_id
                new_sheet['description'] = "#{quantity}#{single_record['model']}"
                new_sheet['send_at'] = "#{timestamp[0..3]}-#{timestamp[4..5]}-#{timestamp[6..7]} #{timestamp[8..9]}:#{timestamp[10..11]}:#{timestamp[12..13]}".to_datetime
                new_sheet['pdf_url'] = "#{Rails.root}/public/express_sheets/#{single_record['timestamp']}.pdf"
                new_sheet['unit_receivable_id'] = Vendor.find(single_record['vendor_id']).vendor_unit_id
                new_sheet['unit_receivable_type'] = "VendorUnit"
                new_sheet['person_receivable_id'] = single_record['vendor_id']
                new_sheet['person_receivable_type'] = "Vendor"
                new_sheet['vestable_id'] = params["salecase_id"]
                new_sheet['vestable_type'] = "Salecase"
                new_sheet['comment'] = params["comment"]
                new_sheet.save
            end
        end
    end

    def self.add_from_grid(params, user_id)
        JSON.parse(params["grid_data"]).each do |single_record|
            timestamp = params['timestamp'].split("_")[0]

            new_sheet = ExpressSheet.new
            new_sheet['express_unit_id'] = params['express_id']
            new_sheet['number'] = single_record['tracking_number']
            new_sheet['sender_user_id'] = user_id
            new_sheet['description'] = "#{params['quantity']}件#{params['description']}"
            new_sheet['send_at'] = "#{timestamp[0..3]}-#{timestamp[4..5]}-#{timestamp[6..7]} #{timestamp[8..9]}:#{timestamp[10..11]}:#{timestamp[12..13]}".to_datetime
            new_sheet['pdf_url'] = "#{Rails.root}/public/express_sheets/#{single_record['timestamp']}.pdf"

            receiver = params['receiver_type'].camelcase.constantize.find(single_record['receiver_id'])
            #receiver_addr = receiver.addr.blank? ? receiver.send("#{params[:receiver_type]}_unit").addr : receiver.addr
            #long_addr = receiver.send("#{params[:receiver_type]}_unit").city.prvc.name + receiver.send("#{params[:receiver_type]}_unit").city.name + receiver_addr

            new_sheet['unit_receivable_id'] = receiver.send("#{params['receiver_type']}_unit_id")
            new_sheet['unit_receivable_type'] = "#{params['receiver_type'].split("_")[0].camelcase}Unit"
            new_sheet['person_receivable_id'] = single_record['receiver_id']
            new_sheet['person_receivable_type'] = params['receiver_type'].camelcase
            #new_sheet['vestable_id'] = params["salecase_id"]
            #new_sheet['vestable_type'] = "Salecase"
            #new_sheet['comment'] = params["comment"]
            new_sheet.save
        end
    end

    def self.update_cost(params)
        express_sheet = find(params['express_sheet_id'])
        express_sheet['currency_id'] = params['cost_currency_id']
        express_sheet['cost'] = params['cost_amount']
        express_sheet.save
    end
end
