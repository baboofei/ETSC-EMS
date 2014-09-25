# encoding: utf-8
class Salelog < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :comment, :complete_reason, :contact_at, :detail, :expected_sign_at, :natural_language, :process, :quote_id, :remind_at, :remind_flag, :salecase_id, :user_id, :wait_reason

    belongs_to :salecase
    #产品被推荐和销售日志的多对多
    has_many :recommended_products_salelogs, :class_name => 'RecommendedProductsSalelog', :foreign_key => 'salelog_id'
    has_many :recommends, :through => :recommended_products_salelogs, :source => :product
    #工厂被推荐和销售日志的多对多
    has_many :recommended_vendor_units_salelogs, :class_name => 'RecommendedProductsSalelog', :foreign_key => 'salelog_id'
    has_many :recommend_factories, :through => :recommended_vendor_units_salelogs, :source => :vendor_unit

    #has_many :quotes, :as => :quotable
    has_one :quote, :as => :quotable

    after_save do
        #日志保存后，同时更新一下个案的“最近联系时间”
        #binding.pry
        salecase = self.salecase
        salecase.updated_at = self.contact_at
        salecase.save
    end

    def self.in_salecase(salecase_id)
        where("salecase_id = ?", salecase_id)
    end

    def self.last_week
        where("salelogs.created_at <= ? and salelogs.created_at > ?", Date.today.strftime("%Y-%m-%d"), (Date.today - 7).strftime("%Y-%m-%d"))
    end

    def self.by_user(user_id)
        where("user_id = ?", user_id)
    end

    def self.by_user_or_group(user_id)
        user = User.find(user_id)
        if user.groups.size > 0
            group_ids = user.groups.map(&:id)
            group_str = "(" + group_ids.map { "?" }.join(",") + ")"
            where("groups.id in #{group_str} or salecases.user_id = ?", *group_ids, user.id).includes({:salecase => :group})
        else
            where("user_id = ?", user.id)
        end
    end

    #成员组能看到的销售日志的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map { "?" }.join(",") + ")"
        where("salelogs.user_id in #{str}", *member_ids)
    end

    def for_grid_json
        attributes

    end

    #根据参数保存日志，返回刚保存的id
    # @return [id]
    def self.create_or_update_with(params)
        item = "销售日志"
        salelog = Salelog.new(params)
        message = $etsc_create_ok
        salelog.save
        return {:success => true, :message => "#{item}#{message}", :salelog_id => salelog.id}
    end

    #从表单里来的提交，和从模型里来的还略有不同，需要预处理一步
    def self.add_salelog_from_form(params, user_id)
        #binding.pry
        need_sign = !Salecase.find(params[:salecase_id]).group.nil?
        case params[:type]
            when "recommend_product"
                #先新增一条“为其推荐产品”的日志
                grid_data_hash_array = JSON.parse(params[:grid_data])
                natural_array = []
                grid_data_hash_array.each do |grid_data_hash|
                    vendor_unit_name = VendorUnit.find(grid_data_hash['vendor_unit_id']).name
                    customer_requirement = grid_data_hash['customer_requirement'].blank? ? "" : "，客户需求为：#{grid_data_hash['customer_requirement']}"
                    if grid_data_hash['product_id'] == 0
                        natural_array << "#{vendor_unit_name}的全部产品#{customer_requirement}"
                    else
                        natural_array << "#{vendor_unit_name}的#{grid_data_hash['product_model']}#{customer_requirement}"
                    end
                end

                process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 1).first.display
                #如果传来的日期是今天，则存当前时间
                #如果不是，说明填的是以前的日子，则存当日零点，因为判断不出时间啊
                contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
                salelog_params = {
                    :process => 1,
                    :contact_at => contact_at,
                    :salecase_id => params[:salecase_id],
                    :user_id => user_id,
                    :comment => params[:comment],
                    :natural_language => "#{process}：#{natural_array.join('<br/>')}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
                }
                salelog = Salelog.new(salelog_params)
                salelog.save

                #然后往推荐产品|日志的关联表里加上数据
                grid_data_hash_array.each do |grid_data_hash|
                    recommended_products_salelog = RecommendedProductsSalelog.new
                    recommended_products_salelog.vendor_unit_id = grid_data_hash['vendor_unit_id']
                    recommended_products_salelog.product_id = grid_data_hash['product_id']
                    recommended_products_salelog.customer_requirement = grid_data_hash['customer_requirement']
                    recommended_products_salelog.salelog_id = salelog.id
                    recommended_products_salelog.save
                end
            when "mailed_sample_grid"
                self.add_mailing_salelog(:sample, params, user_id)

                #然后往寄出样品|日志的关联表里加上数据
                #TODO 这里将来如果有样品表的话，应该就是“样品|日志的关联表”，可能此表还得有额外的属性，比如个案号

                #发邮件
                grid_data_hash_array = JSON.parse(params[:grid_data])
                grid_data_hash_array.each do |grid_data_hash|
                    UserMailer.deliver_notice(grid_data_hash, user_id).deliver
                end

                ExpressSheet.add_from_salelog(:sample, params, user_id)
            when "mailed_content_grid"
                self.add_mailing_salelog(:content, params, user_id)

                #然后往寄出目录/文件|日志的关联表里加上数据
                #TODO 这一项要管理吗？

                #发邮件
                grid_data_hash_array = JSON.parse(params[:grid_data])
                grid_data_hash_array.each do |grid_data_hash|
                    UserMailer.deliver_notice(grid_data_hash, user_id).deliver
                end

                ExpressSheet.add_from_salelog(:content, params, user_id)
            when "mailed_processing_piece_to_vendor_grid"
                self.add_mailing_salelog(:process_to_vendor, params, user_id)

                #然后往寄出加工件|日志的关联表里加上数据
                #TODO 这个也不好管理吧

                #发邮件
                grid_data_hash_array = JSON.parse(params[:grid_data])
                grid_data_hash_array.each do |grid_data_hash|
                    UserMailer.deliver_notice(grid_data_hash, user_id).deliver
                end

                ExpressSheet.add_from_salelog(:processing_piece_to_vendor, params, user_id)
            when "mailed_processing_piece_to_customer_grid"
                self.add_mailing_salelog(:process_to_customer, params, user_id)

                #然后往寄出加工件|日志的关联表里加上数据
                #TODO 这个也不好管理吧……

                #发邮件
                grid_data_hash_array = JSON.parse(params[:grid_data])
                grid_data_hash_array.each do |grid_data_hash|
                    UserMailer.deliver_notice(grid_data_hash, user_id).deliver
                end

                ExpressSheet.add_from_salelog(:processing_piece_to_customer, params, user_id)
            when "mailed_product_grid"
                self.add_mailing_salelog(:product, params, user_id)

                #然后往寄出产品|日志的关联表里加上数据
                #TODO 这里将来如果有样品表的话，应该就是“样品|日志的关联表”，可能此表还得有额外的属性，比如个案号

                #发邮件
                grid_data_hash_array = JSON.parse(params[:grid_data])
                grid_data_hash_array.each do |grid_data_hash|
                    UserMailer.deliver_notice(grid_data_hash, user_id).deliver
                end

                ExpressSheet.add_from_salelog(:product, params, user_id)
            when "quote"
                #新增一个报价
                #传参数过去的时候会自动生成一条日志，这里就不加了
                form_data = JSON.parse(params['form_data'])
                form_data['customer_unit_id'] = Customer.find(form_data['customer_id']).customer_unit_id

                form_data['event'] = "sale_save"
                form_data['sale>id'] = user_id
                form_data['salelog>salecase>id'] = params['salecase_id']

                Quote.create_or_update_with(form_data, user_id)
            when "contract"
                #新增一条“预签合同”的日志
                #binding.pry
                form_data = JSON.parse(params['form_data'])
                natural_string = "预定于#{form_data['plan_to_sign_on']}签合同"

                salecase_number = Salecase.find(params[:salecase_id]).number
                remind_sn = (Time.now.to_f*1000).ceil
                remind_params = {
                    :remind_at => form_data['plan_to_sign_on'],
                    :remind_text => "你在个案#{salecase_number.to_eim_remind_link(remind_sn)}中预计要和客户签合同，请注意跟进。",
                    :sn => remind_sn
                }
                Remind.create_or_update_with(remind_params, user_id)

                process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 10).first.display
                #如果传来的日期是今天，则存当前时间
                #如果不是，说明填的是以前的日子，则存当日零点，因为判断不出时间啊
                contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
                salelog_params = {
                    :process => 10,
                    :contact_at => contact_at,
                    :salecase_id => params[:salecase_id],
                    :user_id => user_id,
                    :comment => params[:comment],
                    :expected_sign_at => form_data['plan_to_sign_on'],
                    :natural_language => "#{process}：#{natural_string}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
                }
                salelog = Salelog.new(salelog_params)
                salelog.save
            when "wait"
                #新增一条“等待”的日志
                #binding.pry
                form_data = JSON.parse(params['form_data'])
                wait_reason = Dictionary.where("data_type = ? and value = ?", 'wait_reason', form_data['wait_reason']).first.display
                natural_string = "等待#{wait_reason}"

                unless form_data['remind_at'].blank?
                    salecase_number = Salecase.find(params[:salecase_id]).number
                    remind_sn = (Time.now.to_f*1000).ceil
                    remind_params = {
                        :remind_at => form_data['remind_at'],
                        :remind_text => "你在个案#{salecase_number.to_eim_remind_link(remind_sn)}中设定的等待提醒已经到期，请注意跟进。",
                        :sn => remind_sn
                    }
                    Remind.create_or_update_with(remind_params, user_id)
                end

                process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 14).first.display
                #如果传来的日期是今天，则存当前时间
                #如果不是，说明填的是以前的日子，则存当日零点，因为判断不出时间啊
                contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
                salelog_params = {
                    :process => 14,
                    :contact_at => contact_at,
                    :salecase_id => params[:salecase_id],
                    :user_id => user_id,
                    :comment => params[:comment],
                    :natural_language => "#{process}：#{natural_string}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
                }
                salelog = Salelog.new(salelog_params)
                salelog.save
            when "cancel"
                #新增一条“个案完结”的日志
                #binding.pry
                form_data = JSON.parse(params['form_data'])
                case_cancel_reason = Dictionary.where("data_type = ? and value = ?", 'case_cancel_reason', form_data['case_cancel_reason']).first.display
                natural_string = "原因为：#{case_cancel_reason}"

                process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 15).first.display
                #如果传来的日期是今天，则存当前时间
                #如果不是，说明填的是以前的日子，则存当日零点，因为判断不出时间啊
                contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
                salelog_params = {
                    :process => 15,
                    :contact_at => contact_at,
                    :salecase_id => params[:salecase_id],
                    :user_id => user_id,
                    :comment => params[:comment],
                    :natural_language => "#{process}：#{natural_string}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
                }
                salelog = Salelog.new(salelog_params)
                salelog.save

                #个案本身状态改为完结
                salecase = salelog.salecase
                salecase.status = 2
                salecase.save
            when "other"
                #新增一条“进展”的日志
                #binding.pry
                form_data = JSON.parse(params['form_data'])
                natural_string = form_data['other'].gsub(/\n/, '<br/>')

                process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 18).first.display
                #如果传来的日期是今天，则存当前时间
                #如果不是，说明填的是以前的日子，则存当日零点，因为判断不出时间啊
                contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
                salelog_params = {
                    :process => 18,
                    :contact_at => contact_at,
                    :salecase_id => params[:salecase_id],
                    :user_id => user_id,
                    :comment => params[:comment],
                    :natural_language => "#{process}：#{natural_string}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
                }
                salelog = Salelog.new(salelog_params)
                salelog.save
        end
    end

    #合并后“寄XXX”操作的日志生成
    def self.add_mailing_salelog(action, params, user_id)
        need_sign = !Salecase.find(params[:salecase_id]).group.nil?
        action_hash = {
            :sample => 3,
            :content => 6,
            :process_to_vendor => 20,
            :process_to_customer => 22,
            :product => 13
        }
        #先新增一条“寄样品”的日志
        grid_data_hash_array = JSON.parse(params[:grid_data])
        #binding.pry
        natural_array = []
        grid_data_hash_array.each do |grid_data_hash|
            express = Dictionary.where("data_type = 'express' and value = ?", grid_data_hash['express_id']).first.display
            quantity = grid_data_hash['quantity'].blank? ? "" : "#{grid_data_hash['quantity']}件"
            target = (action == :process_to_vendor ? "往工厂" : "给#{grid_data_hash['customer_name']}")
            natural_array << "通过#{express}#{target}寄了#{quantity}#{grid_data_hash['model']}，快递单号为#{grid_data_hash['tracking_number']}"
            #如果有提醒时间则加提醒
            unless grid_data_hash['remind_at'].blank?
                salecase_number = Salecase.find(params[:salecase_id]).number
                remind_sn = (Time.now.to_f*1000).ceil
                remind_params = {
                    :remind_at => grid_data_hash['remind_at'],
                    :remind_text => "你在个案#{salecase_number.to_eim_link(remind_sn)}中通过#{express}给#{grid_data_hash['customer_name']}寄了#{quantity}#{grid_data_hash['model']}，提醒时间已到，请注意跟进。",
                    :sn => remind_sn
                }
                Remind.create_or_update_with(remind_params, user_id)
            end
        end

        process = Dictionary.where("data_type = ? and value = ?", "sales_processes", action_hash[action]).first.display
        #如果传来的日期是今天，则存当前时间
        #如果不是，说明填的是以前的日子，则存当日零点，因为判断不出时间啊
        contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
        salelog_params = {
            :process => action_hash[action],
            :contact_at => contact_at,
            :salecase_id => params[:salecase_id],
            :user_id => user_id,
            :comment => params[:comment],
            :natural_language => "#{process}：#{natural_array.join('<br/>')}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
        }
        salelog = Salelog.new(salelog_params)
        salelog.save
    end

    #统计邮件要用的原因统计
    # @param [String] start_at "2013-01-01"
    # @param [String] end_at "2013-12-31"
    # @param [Integer] reason nil, 1, 2, 3, ...
    # @param [String] user_or_group "user", "group"
    # @param [Integer] id user_id或者group_id
    def self.salecase_success_ratio_tally_via_user(start_at, end_at, reason, user_or_group, id)
        #binding.pry
        salelogs = where("salecases.created_at >= ? and salecases.created_at <= ? and salecases.status = 2", start_at, end_at).includes(:salecase)
        if id.blank?
            return salelogs.order("salelogs.contact_at DESC").group_by(&:salecase_id).select{|k, v| v[0]['complete_reason'] == reason}\
                .map{|k, v| [v[0].salecase.number, Nokogiri::HTML(v[0].natural_language).text]}.size#join("\n")
        else
            #项目组的问题
            if user_or_group == "user"
                return salelogs.where("salecases.user_id = ? and (salecases.group_id is null or salecases.group_id = 0)", id)\
                .order("salelogs.contact_at DESC").group_by(&:salecase_id).select{|k, v| v[0]['complete_reason'] == reason}\
                .map{|k, v| [v[0].salecase.number, Nokogiri::HTML(v[0].natural_language).text]}.size#join("\n")
            else
                return salelogs.where("salecases.group_id = ?", id)\
                .order("salelogs.contact_at DESC").group_by(&:salecase_id).select{|k, v| v[0]['complete_reason'] == reason}\
                .map{|k, v| [v[0].salecase.number, Nokogiri::HTML(v[0].natural_language).text]}.size#join("\n")
            end
        end
    end

    def self.salecase_success_ratio_tally_via_area(start_at, end_at, reason, area_id)
        salelogs = where("salecases.created_at >= ? and salecases.created_at <= ? and salecases.status = 2", start_at, end_at).includes(:salecase => {:customer_units => {:city => {:prvc => :area}}})
        return salelogs.where("areas.id = ?", area_id).order("salelogs.contact_at DESC").group_by(&:salecase_id).select{|k, v| v[0]['complete_reason'] == reason}\
                .map{|k, v| [v[0].salecase.number, Nokogiri::HTML(v[0].natural_language).text]}.size#join("\n")
    end

    def self.salecase_success_ratio_tally_via_product(start_at, end_at, reason, product_id)
        salelogs_through_recommend = where("salecases.created_at >= ? and salecases.created_at <= ? and salecases.status = 2", start_at, end_at).includes(:recommends, :salecase).where("products.id = ?", product_id).order("salelogs.contact_at DESC")
        salelogs_through_quote = where("salecases.created_at >= ? and salecases.created_at <= ? and salecases.status = 2", start_at, end_at).includes(:salecase, :quote => {:quote_items => :product}).where("products.id = ?", product_id).order("salelogs.contact_at DESC")
        salelogs = (salelogs_through_recommend + salelogs_through_quote).uniq
        return salelogs.group_by(&:salecase_id).select{|k, v| v[0]['complete_reason'] == reason}\
                .map{|k, v| [v[0].salecase.number, Nokogiri::HTML(v[0].natural_language).text]}.size#join("\n")
    end

    def self.salecase_success_ratio_tally_via_vendor_unit(start_at, end_at, reason, vendor_unit_id)
        salelogs_through_recommend = where("salecases.created_at >= ? and salecases.created_at <= ? and salecases.status = 2", start_at, end_at).includes(:recommend_factories, :salecase).where("vendor_units.id = ?", vendor_unit_id).order("salelogs.contact_at DESC")
        salelogs_through_quote = where("salecases.created_at >= ? and salecases.created_at <= ? and salecases.status = 2", start_at, end_at).includes(:salecase, :quote => {:quote_items => {:product => :seller}}).where("vendor_units.id = ?", vendor_unit_id).order("salelogs.contact_at DESC")
        salelogs = (salelogs_through_recommend + salelogs_through_quote).uniq
        return salelogs.group_by(&:salecase_id).select{|k, v| v[0]['complete_reason'] == reason}\
                .map{|k, v| [v[0].salecase.number, Nokogiri::HTML(v[0].natural_language).text]}.size#join("\n")
    end
end
