# encoding: UTF-8
class ExpressSheetsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    @@cfg = File.read("#{Rails.root}/lib/pdf/express_sheet_cfg.json")

    def updated_print_express_sheet
        user_id = session[:user_id]
        remote_ip = request.remote_ip
        timestamp = ExpressSheet.gen_express_sheet_pdf(params, user_id, remote_ip)
        render :json => {:success => true, :timestamp => timestamp}.to_json
    end

    def print_express_sheet
        page_config = JSON.parse(@@cfg, :symbolize_names => true)
        normal_font = "#{Rails.root}/app/assets/fonts/yahei_mono.ttf"
        #image = "shunfeng_96dpi.jpg"
        require "prawn"
        require "prawn/measurement_extensions"

        user = User.find(session[:user_id])
        customer_array = params[:customer_ids].split("|")
        our_company = OurCompany.find(params[:our_company_id])
        sym = params[:express_id].to_sym

        #binding.pry
        #p params
        sender = {
            :company => our_company.name,
            :name => user.name,
            :addr => our_company.addr,
            :phone => our_company.phone,
            #:cell => "",
            :monthly_payment_ac => page_config[sym][:monthly_payment_ac],
            :month => "%02d" % Time.now.month,
            :day => "%02d" % Time.now.day
        }
        using = page_config[sym]

        #binding.pry
        Prawn::Document.generate("ExpressSheet.pdf",
                                 #"page_size" => [609,397],
                                 :page_size => using[:page_size].map { |p| p.mm },
                                 #:page_size => using[:page_size],
                                 #"background" => image,
                                 :margin => using[:margin].map { |p| p.mm }) do |pdf|

            customer_array.each_with_index do |c, index|
                customer = Customer.find(c)
                addr = customer.customer_unit.city.prvc.name + customer.customer_unit.city.name + customer.addr
                merged_addr = addr.gsub(/(.*?市)\1+/, '\1') + "#{customer.postcode.blank? ? '' : "(#{customer.postcode})"}"
                receiver = {
                    :company => customer.customer_unit.name,
                    :name => customer.name,
                    :addr => merged_addr,
                    :phone => customer.phone,
                    :cell => customer.mobile
                }

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

                pdf.start_new_page unless (index + 1 == customer_array.size)
            end

        end
        #binding.pry
        #p request.remote_ip
        p "就当是打了吧"
        #printer_name = page_config[sym][:printer_name]
        #system("lpoptions -d #{printer_name}")
        #system("lp ExpressSheet.pdf")

        #system("lp -o media=Custom.#{actually_width}x#{actually_height}mm ExpressSheet.pdf")
        #http://www.cups.org/documentation.php/options.html
        render :json => {:success => true}.to_json
    end

    #因为体现到ExtJS里，是要查名为GridExpressSheets的store与角色关联的数据，所以用grid_express_sheets
    def get_grid_express_sheets
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
                                                  #target_model = eval(controller_name.singularize.camelize)
                                                  #研究一下能不能提取“Customer”这个model，可能用不上

        express_sheets = ExpressSheet.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :express_sheets => express_sheets.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => express_sheets.size
                }
            }
        end
    end

    def add_from_grid
        user_id = session[:user_id]
        ExpressSheet.add_from_grid(params, user_id)

        render :json => {:success => true, :message => "OK"}.to_json
    end


    def update_cost
        ExpressSheet.update_cost(params)

        render :json => {:success => true, :message => "OK"}.to_json
    end
end


