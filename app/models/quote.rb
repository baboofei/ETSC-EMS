# encoding: utf-8
class Quote < ActiveRecord::Base
    require "reusable"
    include Reusable
    attr_accessible :business_user_id, :comment, :currency_id, :customer_id, :customer_unit_id, :declaration_fee, :fif,
                    :fif_currency_id, :final_price, :language, :other_cost, :our_company_id, :pdf, :quote_format,
                    :number, :quote_type, :request, :rmb, :salecase_id, :salelog_id, :sale_user_id, :state,
                    :summary, :term, :total, :total_discount, :vat, :work_task_id

    belongs_to :customer
    belongs_to :customer_unit

    belongs_to :quotable, :polymorphic => true
    #belongs_to :salelog

    belongs_to :our_company
    belongs_to :sale, :class_name => 'User', :foreign_key => 'sale_user_id'
    belongs_to :business, :class_name => 'User', :foreign_key => 'business_user_id'
    belongs_to :currency
    belongs_to :fif_currency, :class_name => 'Currency', :foreign_key => 'fif_currency_id'

    has_many :quote_items
    has_many :contracts

    belongs_to :group

    state_machine :initial => :start do
        #初步设计了以下状态：
        #开始      start
        #预处理    pre_quote       [写字]
        #待处理    progressing     [沙漏]
        #商务检查  checking        [放大镜]
        #可下载    downloadable    [下载箭头]
        #需改动    need_change     [问号]+[下载箭头]
        #完成      complete        [对勾]+[下载箭头]
        event :sale_save do
            #销售还没定下来产品，刚创建完报价的阶段
            #或者是加了一些报价产品，还没加完顺手保存一下
            transition [:start] => :pre_quote
        end
        event :support_save do
            #技术刚创建完报价的阶段
            #或者是加了一些报价产品，还没加完顺手保存一下
            transition [:start] => :pre_quote
        end
        event :sale_create do
            #报价项加完，确定要扔给商务做了
            #或者另存为新报价的时候，也是直接扔给商务
            transition [:start, :pre_quote] => :progressing
        end
        event :business_check do
            #报价做了一半，商务自己检查
            transition [:progressing] => :checking
        end
        event :business_first_done do
            #商务做完给销售审核
            transition [:progressing, :checking] => :downloadable
        end
        event :sale_check_ok do
            #销售审核通过，可以发了
            transition [:downloadable] => :complete
        end
        event :sale_check_fail do
            #销售审核发现有问题，再给商务改
            transition [:downloadable] => :need_change
        end
        event :business_fix do
            #商务修改完，给销售审核
            transition [:need_change] => :downloadable
        end
    end

    def self.query_by(query)
        where("number like ?", "%#{query}%")
    end

    def for_combo_json
        attr = attributes
        attr['customer_unit_name'] = customer_unit.name
        attr['customer_name'] = customer.name
        #attr['currency_name'] = currency.name
        #attr['our_company_name'] = our_company.name
        attr
    end

    def for_grid_json(store_name, user_id)
        #检查editable状态。之前貌似都没有判断角色
        editable = false
        store = Store.find_by_name(store_name)
        user = User.find(user_id)
        #binding.pry
        if store
            if (store.visible_to_roles & user.roles).size > 0
                #全部可见并全部不可改的角色，直接为false
            elsif (store.editable_to_roles & user.roles).size > 0
                #全部可见并全部可改的角色，直接为true
                editable = true
            elsif (store.partial_editable_to_roles & user.roles).size > 0
                #部分可见部分可改的角色，判断是否为本人或者属于本人所在项目组
                #binding.pry
                editable = (sale_user_id == user_id || (group && group.users.include?(user)))
            else
                #未分配的角色，返回空集
            end
        end

        attr = attributes
        #TODO 这里这样一处理，排序和筛选就得变了…………
        if quotable.class.name == "Salelog"
            #binding.pry
            attr['^quotable>(salecase|flow_sheet)>id'] = quotable.salecase.id if quotable
            attr['^quotable>(salecase|flow_sheet)>(number)'] = quotable.salecase.number if quotable
            #attr['salelog>salecase>id'] = quotable.salecase.id if quotable
            #attr['salelog>salecase>number'] = quotable.salecase.number if quotable
        else
            attr['^quotable>(salecase|flow_sheet)>id'] = quotable.flow_sheet.id if quotable
            attr['^quotable>(salecase|flow_sheet)>(number)'] = quotable.flow_sheet.number if quotable
            #attr['salelog>salecase>id'] = quotable.flow_sheet.id if quotable
            #attr['salelog>salecase>number'] = quotable.flow_sheet.number if quotable
        end
        #attr['sale_user_id'] = sale.id
        attr['sale>id'] = sale.id
        attr['sale>name'] = sale.name
        attr['business>id'] = business.id if business
        #attr['business_user_id'] = business.id if business
        attr['business>name'] = business.name if business
        attr['currency_name'] = currency.name
        attr['customer_unit>id'] = customer_unit.id
        attr['customer_unit>(name|unit_aliases>unit_alias)'] = customer_unit.name
        attr['customer>id'] = customer.id
        attr['customer>name'] = customer.name
        attr['editable'] = editable
        attr
    end

    #不共享，所以没有关联表，不includes
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        #所有权是自己，或者组id包含了自己所在的组
        where("quotes.sale_user_id in #{str} or users.id = ?", *member_ids, user_id).includes(:group => :users)
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "报价"
        if !params[:id].blank?
            quote = Quote.find(params[:id])
            message = $etsc_update_ok
        else
            quote = Quote.new
            message = $etsc_create_ok
        end
        #这里不要加“state”的更新，不然变nil了
        #“number”也不要，因为外面没地方传过来
        #“sale_user_id”和“business_user_id”也不要，下面单独赋值
        #“ salecase_id”也不要，根本就是无用的字段
        fields_to_be_updated = %w(customer_unit_id customer_id currency_id total_discount fif_currency_id
            fif vat other_cost total work_task_id language request quote_format our_company_id term comment quote_type
            pdf summary rmb final_price declaration_fee max_custom_tax does_count_ctvat x_discount group_id
        )
        fields_to_be_updated.each do |field|
            quote[field] = params[field]
        end

        #binding.pry
        case params['event']
            when 'sale_save'
                #销售首次创建
                quote.sale_user_id = params['sale>id']

                quote.sale_save
                quote.sale_create if User.business.map(&:id).include? user_id

                quote.number = self.gen_new_number_with_letter("Q")
                salecase_id = params['salelog>salecase>id']
                if salecase_id == "0"
                    #新个案，增一个个案，再加一条日志“个案开始”
                    # 报价摘要当成个案备注
                    # 默认50%成案率
                    salecase_params = {
                        :start_at => Time.now,
                        :customer_unit_id => params[:customer_unit_id],
                        :customer_id => params[:customer_id],
                        :comment => params[:summary],
                        :priority => 1,
                        :group_id => params[:group_id],
                        :feasible => 50,
                        :id => nil
                    }
                    actually_user_id = (User.business.map(&:id).include? user_id) ? params['sale>id'] : user_id
                    flow_sheet_result = Salecase.create_or_update_with(salecase_params, actually_user_id)
                    salecase_id = flow_sheet_result[:salecase_id]
                end
                #个案id有了，加日志
                #binding.pry
                quote.save
                process = Dictionary.where("data_type = 'sales_processes' and value = ?", 7).first.display
                salelog_params = {
                    :process => 7,
                    :contact_at => Time.now + 1,#时间要错开一秒，不然排序的时候会少掉一个
                    :salecase_id => salecase_id,
                    :user_id => user_id,
                    :natural_language => "#{process}：新增了报价#{quote.number.to_eim_link}"
                }
                salelog_id = Salelog.create_or_update_with(salelog_params)[:salelog_id]
                #再存一遍日志id
                #quote.salelog_id = salelog_id
                quote.quotable_type = "Salelog"
                quote.quotable_id = salelog_id
                quote.save
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'support_save'
                #binding.pry
                quote.sale_user_id = params['support>id']

                quote.support_save
                quote.sale_create if User.business.map(&:id).include? user_id

                quote.number = self.gen_new_number_with_letter("Q")
                quote.created_at = params[:created_at]
                flow_sheet_id = params['flow_sheet_id']
                if flow_sheet_id == "0"
                    #新水单
                    flow_sheet_params = {
                        :customer_unit_id => params[:customer_unit_id],
                        :customer_id => params[:customer_id],
                        :comment => params[:summary],
                        :priority => 1,
                        :deliver_by => 1,
                        :deal_requirement => 1,
                        :state => 'a_start'
                    }
                    actually_user_id = (User.business.map(&:id).include? user_id) ? params['sale>id'] : user_id
                    flow_sheet_result = FlowSheet.create_or_update_with(flow_sheet_params, actually_user_id)
                    flow_sheet_id = flow_sheet_result[:flow_sheet_id]
                end
                quote.save
                process_id = 14
                process = Dictionary.where("data_type = 'flow_sheet_processes' and value = ?", process_id).first.display
                service_log_params = {
                    :process_type => process_id,
                    :start_at => params[:created_at],
                    :end_at => params[:created_at],
                    :flow_sheet_id => flow_sheet_id,
                    :user_id => user_id,
                    :content => params[:summary],
                    :comment => params[:requirement],
                    :natural_language => "#{process}：新增了报价#{quote.number.to_eim_link}"
                }
                service_log_id = ServiceLog.create_or_update_with(service_log_params)[:service_log_id]
                #再存一遍日志id
                #binding.pry
                quote.quotable_type = "ServiceLog"
                quote.quotable_id = service_log_id
                quote.save
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'sale_create'
                #发至商务
                #binding.pry
                quote.sale_user_id = params['sale>id']
                quote.sale_create
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], params[:id])
                quote.save
                #binding.pry

                #给商务群发消息
                business_ids = User.business.map(&:id)
                business_ids.each do |business_id|
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "有一个新报价要处理：#{quote.number.to_eim_message_link(sn)}",
                        :receiver_user_id => business_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'business_check'
                #报价生成，商务检查
                #binding.pry
                quote.business_user_id = user_id
                quote.business_check
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], params[:id])
                quote.save
                quote.gen_quote_pdf
                #先不发消息给销售
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'business_first_done'
                #报价生成
                #binding.pry
                quote.business_user_id = user_id
                quote.business_first_done
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], params[:id])
                quote.save
                quote.gen_quote_pdf
                #发消息给对应销售
                sn = (Time.now.to_f*1000).ceil
                sales_id_array = [quote.sale_user_id]
                sales_id_array << quote.group.users.map(&:id) if quote.group
                sales_id_array.uniq!
                sales_id_array.each do |sales_id|
                    message_params = {
                        :content => "报价#{quote.number.to_eim_message_link(sn)}已经做好，请及时下载PDF并检查",
                        :receiver_user_id => sales_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'sale_check_fail'
                #有问题
                #binding.pry
                quote.sale_user_id = params['sale>id']
                quote.sale_check_fail
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], params[:id])
                #处理“PDF选项”
                #binding.pry
                quote.save

                #还是给商务群发消息吧，怕万一碰上谁不在的情况
                business_ids = User.business.map(&:id)
                business_ids.each do |business_id|
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "销售反映报价#{quote.number.to_eim_message_link(sn)}中出现了问题，描述如下：#{params[:issue]}",
                        :receiver_user_id => business_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'sale_check_ok'
                #没问题
                #binding.pry
                quote.sale_user_id = params['sale>id']
                quote.sale_check_ok
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], params[:id])
                quote.save
                #增一条日志
                #判断是增到销售日志还是维修水单里
                if quote.quotable_type == "Salelog"
                    #销售日志
                    process = Dictionary.where("data_type = 'sales_processes' and value = ?", 25).first.display
                    salecase_id = Salelog.find(params["quotable_id"]).salecase_id
                    #binding.pry
                    salelog_params = {
                        :process => 25,
                        :contact_at => Time.now,
                        :salecase_id => salecase_id,
                        :user_id => user_id,
                        :natural_language => "#{process}：报价#{quote.number.to_eim_link}(#{quote.summary})已完结"
                    }
                    Salelog.create_or_update_with(salelog_params)
                elsif quote.quotable_type == "ServiceLog"
                    #维修水单
                    process_id = 14
                    process = Dictionary.where("data_type = 'flow_sheet_processes' and value = ?", process_id).first.display
                    service_log = ServiceLog.find(params["quotable_id"])
                    flow_sheet_id = service_log['flow_sheet_id']
                    service_log_params = {
                        :process_type => process_id,
                        :start_at => params[:created_at],
                        :end_at => params[:created_at],
                        :flow_sheet_id => flow_sheet_id,
                        :user_id => user_id,
                        :content => params[:summary],
                        :comment => params[:requirement],
                        :natural_language => "#{process}：报价#{quote.number.to_eim_link}(#{quote.summary})已完结"
                    }
                    ServiceLog.create_or_update_with(service_log_params)
                end
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'business_fix'
                #商务改完
                #binding.pry
                quote.business_user_id = user_id
                quote.business_fix
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], params[:id])
                quote.save
                quote.gen_quote_pdf
                #发消息给对应销售
                sn = (Time.now.to_f*1000).ceil
                sales_id_array = [quote.sale_user_id]
                sales_id_array += quote.group.users.map(&:id) if quote.group
                sales_id_array.uniq!
                sales_id_array.each do |sales_id|
                    message_params = {
                        :content => "报价#{quote.number.to_eim_message_link(sn)}已经修改完毕，请及时查看",
                        :receiver_user_id => sales_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            when 'save_as'
                #另存为(并发至商务)
                #binding.pry
                quote.sale_user_id = params['sale>id']
                quote.number = self.gen_new_number_with_letter("Q")
                quote.quotable_type = params['quotable_type']
                quote.quotable_id = params['quotable_id']
                quote.sale_create
                quote.save
                #处理报价项的树
                QuoteItem.create_with_tree_string(params[:tree], quote.id)
                #quote.save
                #个案id用旧的个案id
                #判断是销售个案还是维修水单，生成对应的日志
                if quote.quotable.class.name == "Salelog"
                    process = Dictionary.where("data_type = 'sales_processes' and value = ?", 7).first.display
                    salelog_params = {
                        :process => 7,
                        :contact_at => Time.now,
                        :salecase_id => quote.quotable.salecase.id,
                        :user_id => user_id,
                        :natural_language => "#{process}：新增了报价#{quote.number.to_eim_link}"
                    }
                    salelog_id = Salelog.create_or_update_with(salelog_params)[:salelog_id]
                    #再存一遍日志id
                    quote.quotable_id = salelog_id
                else
                    process = Dictionary.where("data_type = 'flow_sheet_processes' and value = ?", 14).first.display
                    service_log_params = {
                        :process_type => 14,
                        :start_at => Time.now,
                        :flow_sheet_id => quote.quotable.flow_sheet.id,
                        :user_id => user_id,
                        :natural_language => "#{process}：新增了报价#{quote.number.to_eim_link}"
                    }
                    service_log_id = ServiceLog.create_or_update_with(service_log_params)[:service_log_id]
                    #再存一遍日志id
                    quote.quotable_id = service_log_id
                end
                quote.save
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}

                #给商务群发消息
                business_ids = User.business.map(&:id)
                business_ids.each do |business_id|
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "有一个新报价要处理：#{quote.number.to_eim_message_link(sn)}",
                        :receiver_user_id => business_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
            else
                # type code here
                return {success: true, message: "#{item}#{message}", quote_id:quote.id}
        end
    end

    def gen_quote_pdf
        #binding.pry
        quote = self
        pdf_font = "#{Rails.root}/app/assets/fonts/etsc.ttf"
        require "prawn"
        Prawn::Document.generate("#{Rails.root}/public/quotes/#{self.number}.pdf", :page_size => 'A4', :margin => [20, 40]) do
            font pdf_font, :size => 11
            #左上角客户方信息
            if quote.language == 1
                customer_info =  "客户单位：" + quote.customer_unit.name + "\n"
                customer_info += "收件人：" + quote.customer.name + "\n"
                customer_info += "手机：" + quote.customer.mobile.multi_split[0] + "\n" unless quote.customer.mobile.blank?
                customer_info += "电话：" + quote.customer.phone.multi_split[0] + "\n" unless quote.customer.phone.blank?
                customer_info += "传真：" + quote.customer.fax + "\n" unless quote.customer.fax.blank?
            else
                customer_info =  "To: " + quote.customer_unit.en_name + "\n"
                customer_info += "Attn: " + quote.customer.en_name + "\n"
                customer_info += "Cell: " + quote.customer.mobile.multi_split[0] + "\n" unless quote.customer.mobile.blank?
                customer_info += "Tel: " + quote.customer.phone.multi_split[0] + "\n" unless quote.customer.phone.blank?
                customer_info += "Fax: " + quote.customer.fax + "\n" unless quote.customer.fax.blank?
            end
            bounding_box [0, 785], :width => 220 do
                text customer_info, :leading => 4
            end

            #右上角我们公司的信息
            if quote.language == 1
                our_company = "报价单位：" + quote.our_company.name + "\n"
                our_company += "联系人：" + quote.sale.name + "\n"
                our_company += "电话：" + quote.our_company.phone + "\n"
                our_company += "传真：" + quote.our_company.fax unless quote.our_company.fax.blank?
            else
                our_company = "From: " + quote.our_company.en_name + "\n"
                our_company += "Contact: " + quote.sale.en_name + "\n"
                our_company += "Tel: " + quote.our_company.phone + "\n"
                our_company += "Fax: " + quote.our_company.fax unless quote.our_company.fax.blank?
            end
            bounding_box [340, 785], :width => 220 do
                text our_company, :leading => 4
            end

            #标题
            move_down 50
            text quote.language == 1 ? "报  价  单" : "QUOTATION", :align => :center, :size => 25.5

            #右边报价编号和日期信息
            info = []
            if quote.language == 1
                info << ["", "报价编号："+quote.number]
                info << ["", "报价日期："+quote.updated_at.strftime("%Y-%m-%d")]
            else
                # binding.pry
                info << ["", "No.: "+quote.number]
                info << ["", "Date: "+quote.updated_at.strftime("%Y-%m-%d")]
            end
            table(info,
                  :column_widths => {0 => 350, 1 => 165},
                  :cell_style => {:padding => 3}
            ) do |t|
                t.cells.style do |cell|
                    cell.borders -= [:left, :right, :top, :bottom]#非要这样写才行，而不能直接写=[]
                end
            end

            move_down 5
            text quote.language == 1 ? "根据您的需求，我们特提供报价如下：" : "Regarding to your request, we are pleasure inform you as follows: "

            #报价项目表
            move_down 2
            pdf_config_hash = JSON.parse(quote.pdf)
            show_discount_to = (pdf_config_hash['show_discount_to'] == 'on')
            show_sub_total = (quote.quote_format != 2) #阶梯报价不显示小计。硬性规定，无相应的配置项
            if quote.language == 1
                header = %W(项目 型号 描述 数量 单价 #{show_discount_to ? "折扣价" : nil} #{show_sub_total ? "小计" : nil}).reject(&:empty?).map{|p| "<font size=\"9\">" + p +"</font>"}
            else
                header = %W(Item Model Description Qty Unit\ Price #{show_discount_to ? "Discount Price" : nil} #{show_sub_total ? "Sub Total" : nil}).reject(&:empty?).map{|p| "<font size=\"9\">" + p +"</font>"}
            end

            quote_item_table = []
            if quote.quote_format != 2
                #普通报价的表格
                quote.quote_items.sort{|a,b| a.inner_id.split("-").map{|p| "%05d" % p}.join <=> b.inner_id.split("-").map{|p| "%05d" % p}.join}.each do |quote_item|
                    quote_item_array = []
                    quote_item_array << quote_item.inner_id
                    quote_item_array << (
                    if quote_item.product.nil? then
                        quote_item.product_model
                    else
                        #quote_item.product.reference.blank? ? quote_item.product.model : "#{quote_item.product.model}(#{quote_item.product.reference})"
                        quote_item.product.model
                    end)
                    if quote.language == 1
                        quote_item_array << quote_item.description.chinese_wrap#.gsub(/</, '&lt;')#.chinese_wrap
                    else
                        quote_item_array << quote_item.description.english_wrap#英文不应用了，用了反而错乱
                    end
                    quote_item_array << quote_item.quantity.to_s
                    #“单价”列
                    #看本行是“系统”“产品”或者“中间”的哪一种
                    #再根据“单价”列中勾了哪些来决定是否显示
                    to_be_added = ""
                    real_data = quote_item.currency.name + "%.2f" % quote_item.unit_price
                    if quote_item.parent_id == 0 && quote_item.leaf == "0"
                        to_be_added = (quote_item.unit_price == 0 ? "-" : real_data) if pdf_config_hash['show_original_price_system'] == 'on'
                    elsif quote_item.leaf == "1"
                        to_be_added = (quote_item.unit_price == 0 ? "-" : real_data) if pdf_config_hash['show_original_price_product'] == 'on'
                    else
                        to_be_added = (quote_item.unit_price == 0 ? "-" : real_data) if pdf_config_hash['show_original_price_middle'] == 'on'
                    end
                    quote_item_array << to_be_added
                    #“折至”列
                    #先看有没有勾，没勾就不显示
                    if show_discount_to
                        #看本行是“系统”“产品”或者“中间”的哪一种
                        #再根据“折至”列中勾了哪些来决定是否显示
                        to_be_added = ""
                        real_data = quote_item.currency.name + "%.2f" % quote_item.discount_to
                        if quote_item.parent_id == 0 && quote_item.leaf == "0"
                            to_be_added = (quote_item.discount_to == 0 ? "-" : real_data) if pdf_config_hash['show_discount_to_system'] == 'on'
                        elsif quote_item.leaf == "1"
                            to_be_added = (quote_item.discount_to == 0 ? "-" : real_data) if pdf_config_hash['show_discount_to_product'] == 'on'
                        else
                            to_be_added = (quote_item.discount_to == 0 ? "-" : real_data) if pdf_config_hash['show_discount_to_middle'] == 'on'
                        end
                        quote_item_array << to_be_added
                    end
                    #“小计”列
                    if show_sub_total
                        #看本行是“系统”“产品”或者“中间”的哪一种
                        #再根据“小计”列中勾了哪些来决定是否显示
                        to_be_added = ""
                        real_data = quote_item.currency.name + "%.2f" % quote_item.total
                        if quote_item.parent_id == 0 && quote_item.leaf == "0"
                            to_be_added = (quote_item.total == 0 ? "-" : real_data) if pdf_config_hash['show_total_system'] == 'on'
                        elsif quote_item.leaf == "1"
                            to_be_added = (quote_item.total == 0 ? "-" : real_data) if pdf_config_hash['show_total_product'] == 'on'
                        else
                            to_be_added = (quote_item.total == 0 ? "-" : real_data) if pdf_config_hash['show_total_middle'] == 'on'
                        end
                        quote_item_array << to_be_added
                    end

                    quote_item_table << quote_item_array
                end
            else
                #阶梯报价因为要合并，所以另外写
                #inner_id model description三列要合并，所以其实是先按inner_id排序，再按product_id分组。
                quote.quote_items.order("inner_id asc").group_by(&:product_id).each_with_index do |quote_item, index|
                    #根据每一分组的长度来做循环，循环的第一行加rowspan，后面的不加
                    rowspan_size = quote_item[1].size
                    1.upto(rowspan_size) do |o_index|
                        if o_index == 1
                            quote_item_table << [
                                {:content => "#{index + 1}", :rowspan => rowspan_size},
                                {:content => "#{quote_item[1][0].product_model}", :rowspan => rowspan_size},
                                {:content => "#{quote_item[1][0].description}", :rowspan => rowspan_size},
                                "#{quote_item[1][0].quantity}~#{quote_item[1][0].quantity_2}",
                                "#{quote_item[1][0].currency.name}#{"%.2f" % quote_item[1][0].unit_price}"
                            ]
                        else
                            quote_item_table << [
                                "#{quote_item[1][o_index - 1].quantity}~#{quote_item[1][o_index - 1].quantity_2}",
                                "#{quote_item[1][o_index - 1].currency.name}#{"%.2f" % quote_item[1][o_index - 1].unit_price}"
                            ]
                        end
                    end
                end
            end

            #binding.pry

            font pdf_font, :size => 9
            #分各种情况来定栏位宽度
            #总长度是515。项目 33 型号 84，这两个不变
            #数量宽度 = 30 + (n - 4) * 4，n为字符长度。相当于基础宽度30，可容纳4个字符
            #单价(折扣、小计类似)宽度 = 55 + (m - 9) * 4，m为字符长度。相当于基础宽度55，可容纳3个字母+3个数字+1个小数点+2个数字
            #描述宽度为算完后剩下的
            full_width = 515
            item_width = 33
            model_width = 84
            character_width = 5
            max_quantity = quote.quote_items.map{|p| (p.quantity.blank? ? 0 : p.quantity)}.max
            max_quantity_2 = quote.quote_items.map{|p| (p.quantity_2.blank? ? 0 : p.quantity_2)}.max
            max_unit_price = quote.quote_items.map{|p| (p.unit_price.blank? ? 0 : p.unit_price)}.max
            max_discount_to = quote.quote_items.map{|p| (p.discount_to.blank? ? 0 : p.discount_to)}.max
            max_total = quote.quote_items.map{|p| (p.total.blank? ? 0 : p.total)}.max
            if quote.quote_format != 2
                max_quantity_length = max_quantity.to_s.length
            else
                max_quantity_length = max_quantity.to_s.length + max_quantity_2.to_s.length + 1
            end
            quantity_width = 30 + [(max_quantity_length - 4), 0].max * character_width
            unit_price_width = 57 + [(("%0.2f" % max_unit_price).length + 3 - 9), 0].max * character_width
            discount_to_width = show_discount_to ? (57 + [(("%0.2f" % max_discount_to).length + 3 - 9), 0].max * character_width) : nil
            total_width = show_sub_total ? (57 + [(("%0.2f" % max_total).length + 3 - 9), 0].max * character_width) : nil
            description_width = full_width - %W(#{item_width}  #{model_width}  #{quantity_width}  #{unit_price_width}  #{discount_to_width.to_i}  #{total_width.to_i}).map(&:to_i).sum
            
            column_width_array = %W(#{item_width} #{model_width} #{description_width} #{quantity_width} #{unit_price_width} #{discount_to_width} #{total_width}).reject(&:empty?)
            #binding.pry
            table([header] + quote_item_table,
                :cell_style => {:inline_format => true, :border_width => 0.5},
                :header => true,
                :column_widths => column_width_array.map(&:to_i)
            ) do |t|
                t.column(0).style :align => :right
                t.column(0).row(0).style :padding => [5, 0]
                t.column(3..6).style :align => :right
                t.row(0).style :background_color => 'CCCCCC', :text_color => '000000', :align => :center, :valign => :center, :size => 11
            end

            #下面的合计表
            if pdf_config_hash['show_footer_total'] == 'on' || pdf_config_hash['show_footer_discount'] == 'on' || pdf_config_hash['show_footer_freight_insurance_cost'] == 'on' || pdf_config_hash['show_footer_final_price'] == 'on' || pdf_config_hash['show_footer_rmb'] == 'on'
                sum_table = []
                sum_table << [(quote.language == 1) ? "合计：" : "Total: ", quote.currency.name + "%.2f" % quote.total] if pdf_config_hash['show_footer_total'] == 'on'
                sum_table << [(quote.language == 1) ? "总折扣：" : "Less Special Discount: ", quote.currency.name + "%.2f" % quote.total_discount] if pdf_config_hash['show_footer_discount'] == 'on'
                sum_table << [(quote.language == 1) ? "运保费：" : "Freight & Insurance Cost: ", (quote.currency.id == 1 ? quote.fif_currency.name : quote.currency.name) + "%.2f" % quote.fif] if pdf_config_hash['show_footer_freight_insurance_cost'] == 'on'
                sum_table << [(quote.language == 1) ? "总计：" : "Final Price: ", quote.currency.name + "%.2f" % quote.final_price] if pdf_config_hash['show_footer_final_price'] == 'on'
                sum_table << [(quote.language == 1) ? "折合人民币：" : "RMB: ", "%.2f" % quote.rmb] if pdf_config_hash['show_footer_rmb'] == 'on'

                full_width = 515
                max_content = %W(#{quote.total} #{quote.final_price} #{quote.rmb}).map(&:to_i).max
                content_width =  57 + [(("%0.2f" % max_content).length + 3 - 9), 0].max * character_width
                #content_width = 74
                label_width = full_width - content_width
                table(sum_table,
                      :column_widths => [label_width, content_width],
                      :cell_style => {:border_width => 0.5, :padding => [3, 5]}
                ) do |t|
                    t.cells.style do |cell|
                        cell.borders -= [:top] unless cell.row == 0
                        cell.borders -= [:bottom] unless cell.row == sum_table.length - 1
                        cell.align = :right
                    end
                    t.column(0..1).style do |c| #两列右对齐
                        c.align = :right
                    end
                    t.column(0).style do |c| #左列无右框
                        c.borders -= [:right]
                    end
                    t.column(1).style do |c| #右列无左框
                        c.borders -= [:left]
                    end
                end
            end

            move_down 20
            text (quote.language == 1 ? "报价条款" : "NOTES:"), :size => 14

            move_down 10
            term_hash = JSON.parse(quote.term)
            list_item = 0
            if quote.language == 1
                term_1 = "#{term_hash['city_of_term']}#{Dictionary.where("data_type = ? and value = ?", "price_type_of_term", term_hash['price_type_of_term'])[0].display}。"
                if term_hash['is_include_tax'] == 'on'
                    term_1 += "以上价格#{Dictionary.where("data_type = ? and value = ?", "receipt", term_hash['receipt'])[0].display}。"
                end
            else
                term_1 = "#{Dictionary.where("data_type = ? and value = ?", "price_type_of_term_en", term_hash['price_type_of_term'])[0].display} #{term_hash['city_of_term']}."
            end
            list_item += 1
            text "#{list_item}. #{quote.language == 1 ? "价格条款：" : "Terms of Price: "}#{term_1}"

            term_2 = ""
            #binding.pry
            unless term_hash['pay_count1_currency_id'].blank? || (term_hash['pay_count1_amount'] == "0") || term_hash['pay_count1_amount'].blank? || term_hash['pay_way1'].blank?
                if term_hash['pay_way1'] == "1"
                    #信用证
                    if quote.language == 1
                        term_money1 = term_hash['pay_count1_currency_id'] == 2 ? "#{term_hash['pay_count1_amount']}%" : "金额为#{Currency.find(term_hash['pay_count1_currency_id']).name}#{term_hash['pay_count1_amount']}的"
                        term_2 += "签订报价后开立" + term_money1 + "即期不可撤销信用证，"
                        #binding.pry
                        if term_hash['cad_count_amount'] == '100' && term_hash['cad_count_currency_id'] == 2
                            #如果前面一个是100%，就没有“其余部分”了
                            term_2 += "100%见单即付。"
                        else
                            #不是100%，有“其余部分”
                            term_money2 = term_hash['cad_count_currency_id'] == 2 ? "#{term_hash['cad_count_amount']}%" : "#{Currency.find(term_hash['cad_count_currency_id']).name}#{term_hash['cad_count_amount']}"
                            term_2 += "其中#{term_money2}见单即付，"
                            term_money3 = term_hash['cad_left_count_currency_id'] == 2 ? "#{term_hash['cad_left_count_amount']}%" : "#{Currency.find(term_hash['cad_left_count_currency_id']).name}#{term_hash['cad_left_count_amount']}"
                            term_2 += "其余#{term_money3}凭#{Dictionary.where("data_type = ? and value = ?", "cad_left_via", term_hash['cad_left_via'])[0].display}议付。"
                        end
                    else
                        term_money1 = term_hash['pay_count1_currency_id'] == 2 ? "#{term_hash['pay_count1_amount']}% irrevocable L/C at sight " : "An irrevocable L/C at sight amount #{Currency.find(term_hash['pay_count1_currency_id']).name}#{term_hash['pay_count1_amount']} "
                        term_2 += term_money1 + "after signing the contract, "
                        if term_hash['cad_count_amount'] == "100" && term_hash['cad_count_currency_id'] == 2
                            #如果前面一个是100%，就没有“其余部分”了
                            term_2 += " should be paid against the shipping documents. "
                        else
                            #不是100%，有“其余部分”
                            term_money2 = term_hash['cad_count_currency_id'] == 2 ? "#{term_hash['cad_count_amount']}%" : "#{Currency.find(term_hash['cad_count_currency_id']).name}#{term_hash['cad_count_amount']}"
                            term_2 += "#{term_money2} of the L/C value should be paid against the shipping documents, "
                            term_money3 = term_hash['cad_left_count_currency_id'] == 2 ? "#{term_hash['cad_left_count_amount']}%" : "#{Currency.find(term_hash['cad_left_count_currency_id']).name}#{term_hash['cad_left_count_amount']}"
                            term_2 += "#{term_money3} of the L/C value should be paid against #{Dictionary.where("data_type = ? and value = ?", "cad_left_via_en", term_hash['cad_left_via'])[0].display}."
                        end
                    end
                else
                    #电汇
                    pay_time1 = Dictionary.where("data_type = ? and value = ?", "pay_time", term_hash['pay_time1'])[0].display
                    if quote.language == 1
                        term_money1 = term_hash['pay_count1_currency_id'] == 2 ? "#{term_hash['pay_count1_amount']}%款项" : "#{Currency.find(term_hash['pay_count1_currency_id']).name}#{term_hash['pay_count1_amount']}"
                        term_2 += "签订合同后#{pay_time1}天内电汇预付#{term_money1}。"
                    else
                        term_money1 = term_hash['pay_count1_currency_id'] == 2 ? "#{term_hash['pay_count1_amount']}%" : "#{Currency.find(term_hash['pay_count1_currency_id']).name}#{term_hash['pay_count1_amount']}"
                        term_2 += "#{term_money1} T/T in advance within #{pay_time1} days after signing the contract. "
                    end
                end
            end
            unless term_hash['pay_time2'].blank? || term_hash['pay_count2_currency_id'].blank? || (term_hash['pay_count2_amount'] == "0") || term_hash['pay_count2_amount'].blank?
                #有一个没填就算没填
                term_money3 = term_hash['pay_count2_currency_id'] == 2 ? "#{term_hash['pay_count2_amount']}%" : "#{Currency.find(term_hash['pay_count2_currency_id']).name}#{term_hash['pay_count2_amount']}"
                pay_time2 = Dictionary.where("data_type = ? and value = ?", "pay_time", term_hash['pay_time2'])[0].display
                if quote.language == 1
                    term_2 += "发货前#{pay_time2}天内电汇#{term_money3}款项。"
                else
                    term_2 += "#{term_money3} T/T within #{pay_time2} days before delivery. "
                end
            end
            unless term_hash['pay_time3'].blank? || term_hash['pay_count3_currency_id'].blank? || (term_hash['pay_count3_amount'] == "0") || term_hash['pay_count3_amount'].blank?
                #有一个没填就算没填
                term_money4 = term_hash['pay_count3_currency_id'] == 2 ? "#{term_hash['pay_count3_amount']}%" : "#{Currency.find(term_hash['pay_count3_currency_id']).name}#{term_hash['pay_count3_amount']}"
                pay_time3 = Dictionary.where("data_type = ? and value = ?", "pay_time", term_hash['pay_time3'])[0].display
                if quote.language == 1
                    term_2 += "发货后#{pay_time3}天内电汇#{term_money4}款项。"
                else
                    term_2 += "#{term_money4} T/T within #{pay_time3} days after delivery. "
                end
            end
            unless term_hash['pay_time4'].blank? || term_hash['pay_count4_currency_id'].blank? || (term_hash['pay_count4_amount'] == "0") || term_hash['pay_count4_amount'].blank?
                #有一个没填就算没填
                term_money4 = term_hash['pay_count4_currency_id'] == 2 ? "#{term_hash['pay_count4_amount']}%" : "#{Currency.find(term_hash['pay_count4_currency_id']).name}#{term_hash['pay_count4_amount']}"
                pay_time4 = Dictionary.where("data_type = ? and value = ?", "pay_time", term_hash['pay_time4'])[0].display
                if quote.language == 1
                    term_2 += "验收后#{pay_time4}天内电汇#{term_money4}款项。"
                else
                    term_2 += "#{term_money4} T/T within #{pay_time4} days after the acceptance at customer site. "
                end
            end
            unless term_hash['pay_count5_currency_id'].blank? || (term_hash['pay_count5_amount'] == "0") || term_hash['pay_count5_amount'].blank?
                #有一个没填就算没填
                term_money5 = term_hash['pay_count5_currency_id'] == 2 ? "#{term_hash['pay_count5_amount']}%" : "#{Currency.find(term_hash['pay_count5_currency_id']).name}#{term_hash['pay_count5_amount']}"
                if quote.language == 1
                    term_2 += "#{term_money5}货款交货付现。"
                else
                    term_2 += "#{term_money5} COD. "
                end
            end
            unless term_hash['pay_count6_currency_id'].blank? || term_hash['pay_count6_amount'] == "0" || term_hash['pay_count6_amount'].blank?
                #有一个没填就算没填
                term_money6 = term_hash['pay_count6_currency_id'] == 2 ? "#{term_hash['pay_count6_amount']}%" : "#{Currency.find(term_hash['pay_count6_currency_id']).name}#{term_hash['pay_count6_amount']}"
                if quote.language == 1
                    term_2 += "若采用信用证支付方式，需增加#{term_money6}信用证费用。"
                else
                    term_2 += "If the payment term is LC, #{term_money6} should be charged."
                end
            end
            move_down 6
            list_item += 1
            term_2 = term_2.chinese_wrap if quote.language == 1
            text "#{list_item}. #{quote.language == 1 ? "付款方式：" : "Terms of Payment: "}#{term_2}", :inline_format => true

            #勾了“交货期”，且两个日期都填了值才有，否则就不管
            if (term_hash['is_delivery'] == 'on') && !term_hash['deliver_time_from'].blank? && !term_hash['deliver_time_to'].blank?
                temp = []
                delivery_point = Dictionary.where("data_type = ? and value = ?", "delivery_point", term_hash['delivery_point'])[0].display
                deliver_time_unit = Dictionary.where("data_type = ? and value = ?", "deliver_time_unit", term_hash['deliver_time_unit'])[0].display
                delivery_point_en = Dictionary.where("data_type = ? and value = ?", "delivery_point_en", term_hash['delivery_point'])[0].display
                deliver_time_unit_en = Dictionary.where("data_type = ? and value = ?", "deliver_time_unit_en", term_hash['deliver_time_unit'])[0].display
                if quote.language == 1
                    # binding.pry
                    term_3 = "#{delivery_point}#{term_hash['deliver_time_from']}至#{term_hash['deliver_time_to']}#{deliver_time_unit}内发货。"
                    temp << '圣诞' if term_hash['fes_xmas']
                    temp << '新年' if term_hash['fes_newy']
                    temp << '春节' if term_hash['fes_sprg']
                    term_3 += "#{temp.join('、')}假期不在其中。" if temp.size > 0
                else
                    term_3 = "#{term_hash['deliver_time_from']}~#{term_hash['deliver_time_to']} #{deliver_time_unit_en} #{delivery_point_en}. "
                    temp << 'Christmas holiday' if term_hash['fes_xmas']
                    temp << 'New year holiday' if term_hash['fes_newy']
                    temp << 'Spring Festival holiday' if term_hash['fes_sprg']
                    term_3 += "The delivery time does not include the #{temp.join('/')}." if temp.size > 0
                end
                move_down 6
                list_item += 1
                term_3 = term_3.chinese_wrap if quote.language == 1
                text "#{list_item}. #{(quote.language == 1) ? "交货期：" : "Delivery if Schedule: "}#{term_3}", :inline_format => true
            end

            #勾了“质量保证”才有，没勾就不管
            if term_hash['is_warranty'] == 'on'
                term_4 = ""
                warranty_point = Dictionary.where("data_type = ? and value = ?", "warranty_point", term_hash['warranty_point'])[0].display
                warranty_point_en = Dictionary.where("data_type = ? and value = ?", "warranty_point_en", term_hash['warranty_point'])[0].display
                warranty_time = Dictionary.where("data_type = ? and value = ?", "warranty_time", term_hash['warranty_time'])[0].display
                if quote.language == 1
                    term_4 += "#{warranty_point}#{warranty_time}个月内质保。" unless term_hash['warranty_point'].blank?
                else
                    term_4 += "#{warranty_time} months #{warranty_point_en}." unless term_hash['warranty_point'].blank?
                end
                term_4 += term_hash['extra_warranty'] unless term_hash['extra_warranty'].blank?

                move_down 6
                list_item += 1
                term_4 = term_4.chinese_wrap if quote.language == 1
                text "#{list_item}. #{(quote.language == 1) ? "质量保证：" : "Warranty: "}#{term_4}", :inline_format => true
            end

            if term_hash['need_disassemble'] == 'on'
                move_down 6
                list_item += 1
                text "#{list_item}. #{(quote.language == 1) ? "开机检测费：确定故障原因后，若客户同意维修，则开机检测费可免；若客户决定不维修，则只需支付开机检测费。" : "After the equipment(s) inspection, ETSC will inform customer. If customer agrees to repair the equipment(s), then ETSC will not charge the inspection cost, or the inspection cost should be charged."}", :inline_format => true
            end

            pay_count = term_hash['pay_count7_amount']
            if term_hash['need_on-site'] == 'on' && pay_count != '0' && !pay_count.blank?
                term_6 = ""
                pay_unit = Currency.find(term_hash['pay_count7_currency_id']).name
                if quote.language == 1
                    term_6 += "上门服务费：若需上门服务，则需另外支付上门服务费#{pay_unit}#{pay_count}/次(含差旅费)。"
                else
                    term_6 += "Engineers on-site service cost #{pay_unit}#{pay_count} should be charged if customer need on-site service."#好像没有包含“每次”的意义？TODO
                end
                move_down 6
                list_item += 1
                term_6 = term_6.chinese_wrap if quote.language == 1
                text "#{list_item}. #{term_6}", :inline_format => true
            end

            if term_hash['is_special_discount'] == 'on'#特别折扣
                if quote.language == 1
                    term_7 = "此为给#{quote.customer_unit.name}的一次性特别折扣"
                    term_7 += "，此折扣有效期以工厂折扣结束时间为准" if term_hash["is_discount_limit"]#折扣有效期
                    term_7 += "。"
                else
                    term_7 = "This is one-time special discount to #{quote.customer_unit.en_name} only. "
                    term_7 += "This price is special promotion price, validates until the promotion period ending. " if term_hash["is_discount_limit"]#折扣有效期
                end

                move_down 6
                list_item += 1
                term_7 = term_7.chinese_wrap if quote.language == 1
                text "#{list_item}. #{((quote.language == 1) ? "特别折扣：" : "Special discount: ")}#{term_7}", :inline_format => true
            end

            move_down 6
            list_item += 1
            if quote.language == 1
                text "#{list_item}. 报价有效期：本报价有效期至#{DateTime.parse(term_hash['valid_time']).strftime('%Y年%m月%d日')}。", :inline_format => true
            else
                text "#{list_item}. This quotation's validity expands until #{DateTime.parse(term_hash['valid_time']).strftime('%Y-%m-%d')}.", :inline_format => true
            end

            unless term_hash['extra_term'].blank?
                #只有填了其它条款才有
                term_8 = term_hash['extra_term']
                term_8 = term_8.chinese_wrap if quote.language == 1
                move_down 6
                list_item += 1
                text "#{list_item}. #{((quote.language == 1) ? "其它条款：" : "Other terms: ")}#{term_8}", :inline_format => true
            end
        end
    end

    #多态时的“漂亮”方法
    #不过好像没什么用，不够人性化
    #def method_missing(method_id, *arguments, &block)
    #    #binding.pry
    #    match_name = read_attribute(:quotable_type).to_s.underscore
    #    if method_id.to_s == match_name
    #        self.quotable_type.underscore.camelize.constantize.find(self.quotable_id)
    #    elsif method_id.to_s == "#{match_name}_id"
    #        self.quotable_id
    #    else
    #        super method_id, *arguments, &block
    #    end
    #end


    def self.quarterly_salecase_count(year, season, customer_credit_level)
        start_date = "#{year}-#{season * 3 -2}-01"
        end_date = "#{year}-#{season * 3}-31"
        salecases = Salecase.where(["customer_units.credit_level = ?", customer_credit_level]).where(["quotes.created_at >= ? and quotes.created_at <= ?", start_date, end_date]).includes(:customer_units, :salelogs => :quote)
        return salecases.size
    end
    def self.customer_unit_count(customer_credit_level)
        customer_units = CustomerUnit.where(["credit_level = ?", customer_credit_level])
        return customer_units.size
    end

    def self.count_via_vendor_unit(start_at, end_at, vendor_unit_id)
        quotes = where("quotes.created_at >= ? and quotes.created_at <= ?", start_at, end_at).includes(:quote_items => {:product => :seller}).where("vendor_units.id = ?", vendor_unit_id)
        return quotes.map(&:number).size
    end

    def self.count_via_product(start_at, end_at, product_id)
        quotes = where("quotes.created_at >= ? and quotes.created_at <= ?", start_at, end_at).includes(:quote_items => :product).where("products.id = ?", product_id)
        return quotes.map(&:number).size
    end

    def self.count_via_user(start_at, end_at, user_or_group, id)
        if user_or_group == "user"
            return where("created_at >= ? and created_at <= ? and sale_user_id = ?", start_at, end_at, id).size
        else
            return where("created_at >= ? and created_at <= ? and group_id = ?", start_at, end_at, id).size
        end
    end

    def self.count_via_area(start_at, end_at, area_id)
        return where("quotes.created_at >= ? and quotes.created_at <= ? and areas.id = ?", start_at, end_at, area_id)\
        .includes(:customer_unit => {:city => {:prvc => :area}}).size
    end

    def self.get_no_contract_quotes_with(product_model)
        start_time = "2014-01-01"
        end_time = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")
        possible_quotes = where("products.model like ?", "%#{product_model}%").includes(:quote_items => :product)
        .where("contracts.quote_id is null").includes(:contracts)
        #.where("quotes.created_at > ? and quotes.created_at < ?", start_time, end_time)

        return possible_quotes
    end
end


