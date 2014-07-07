# encoding: utf-8
class Customer < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :comment, :customer_unit_id, :department, :email, :en_addr, :en_name, :fax, :im, :is_obsolete, :lead_id, :mobile, :name, :phone, :position, :user_id, :postcode

    #客户的归属用户
    belongs_to :user, :class_name => 'User', :foreign_key => :user_id
    #客户被共享给的用户
    has_many :customers_users, :class_name => 'CustomersUser', :foreign_key => :customer_id
    has_many :shared_to, :through => :customers_users, :source => :user

    #个案和客户多对多
    has_many :customers_salecases
    has_many :salecases, :through => :customers_salecases

    belongs_to :customer_unit

    has_many :customers_prod_applications
    has_many :prod_applications, :through => :customers_prod_applications
    has_many :quotes

    has_many :owned_contract, :class_name => 'Contract', :foreign_key => 'end_user_customer_id'
    has_many :issued_contract, :class_name => 'Contract', :foreign_key => 'buyer_customer_id'

    #水单和客户多对多
    has_many :customers_flow_sheets, :class_name => 'CustomersFlowSheet', :foreign_key => :customer_id
    has_many :flow_sheets, :through => :customers_flow_sheets, :source => :flow_sheet

    belongs_to :group
    has_one :m_inquire

    scope :valid, where("customers.is_obsolete = 0")

    def self.in_unit(customer_unit_id)
        where("customer_unit_id = ?", "#{customer_unit_id}")
    end

    def self.in_salecase(salecase_id)
        where("salecases.id = ?", salecase_id).includes(:salecases)
    end

    def self.in_flow_sheet(flow_sheet_id)
        where("flow_sheets.id = ?", flow_sheet_id).includes(:flow_sheets)
    end

    def self.last_month
        where("customers.created_at < ? and customers.created_at >= ?", "#{0.month.ago.to_s[0..7]}01", "#{1.month.ago.to_s[0..7]}01").order("customers.created_at DESC")
    end

    def for_combo_json
        attributes
    end

    def for_grid_json(user_id)
        attr = attributes
        #binding.pry if customer_unit.nil?
        if customer_unit
            attr['customer_unit>(name|unit_aliases>unit_alias)'] = customer_unit.name
            #attr['customer_unit>customer_unit_aliases>unit_alias'] = customer_unit.name
            attr['customer_unit>id'] = customer_unit.id
            #binding.pry if customer_unit.city.nil?
            attr['customer_unit>city>name'] = customer_unit.city.name
            attr['customer_unit>city>id'] = customer_unit.city.id
            if customer_unit.city && customer_unit.city.prvc && customer_unit.city.prvc.area
                attr['customer_unit>city>prvc>area>name'] = customer_unit.city.prvc.area.name
                attr['customer_unit>city>prvc>area>id'] = customer_unit.city.prvc.area.id
            else
                attr['customer_unit>city>prvc>area>name'] = $etsc_empty_data
                attr['customer_unit>city>prvc>area>id'] = 0
            end
            #名称不显示在别称里
            customer_unit_aliases = customer_unit.unit_aliases
            customer_unit_aliases_name_array = []
            customer_unit_aliases.each do |customer_unit_alias|
                if customer_unit_alias.unit_alias != customer_unit.name
                    customer_unit_aliases_name_array << customer_unit_alias.unit_alias
                end
            end
            attr['customer_unit>unit_aliases>unit_alias'] = customer_unit_aliases_name_array.join("、")
            attr['customer_unit>cu_sort'] = customer_unit.cu_sort
        else
            attr['customer_unit>(name|unit_aliases>unit_alias)'] = $etsc_empty_data
            #attr['customer_unit>name'] = $etsc_empty_data
            attr['customer_unit>id'] = 0
            attr['customer_unit>city>name'] = $etsc_empty_data
            attr['customer_unit>city>id'] = 0
            attr['customer_unit>cu_sort'] = 0
        end
        attr['prod_applications>id'] = prod_applications.map(&:id).join('|')
        attr['prod_applications>description'] = prod_applications.map(&:description).join('、')
        attr[:user_name] = user.name
        attr[:user_id] = user.id
        attr['group_name'] = (group && group.id != 0) ? group.whole_name : ""
        attr[:already_shared_to] = shared_to.map(&:id).join('|')
        attr['editable'] = User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    def for_mini_grid_json
        attr = attributes
        #binding.pry if customer_unit.nil?
        attr['customer_unit>name'] = customer_unit.name
        attr['customer_unit>id'] = customer_unit.id
        attr['email'] = email
        attr
    end

    #成员组能看到的客户的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        #三种可以看到的情况：
        #1.自己的客户
        #2.别人共享给自己的客户
        #3.与自己同一项目组的人选择了该项目组的客户
        #本来想用多重includes，但都指向同一个users表的时候会混乱，于是这样子了，效率似乎也还行
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        if User.find(user_id).groups.blank?
            where("customers.user_id in #{str} or users.id in #{str}", *member_ids, *member_ids).includes(:shared_to)
        else
            g_ids = User.find(user_id).groups.map(&:id)
            g_str = "(" + g_ids.map{"?"}.join(",") + ")"
            where("customers.user_id in #{str} or users.id in #{str} or customers.group_id in #{g_str}", *member_ids, *member_ids, *g_ids).includes(:shared_to)
        end
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "客户"
        if params[:id] != ""
            customer = Customer.find(params[:id])
            message = $etsc_update_ok
        else
            customer = Customer.new
            customer.user_id = user_id
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(customer_unit_id name en_name email mobile phone fax im department position addr
            postcode en_addr lead_id comment group_id
        )
        fields_to_be_updated.each do |field|
            customer[field] = params[field]
        end
        customer['group_id'] = nil if customer['group_id'] == "0"
        customer.save

        #应用单独存
        #binding.pry
        if params[:id] != ""
            CustomersProdApplication.delete_all("customer_id = #{params[:id]}")
            customer_id = params[:id]
        else
            customer_id = customer.id
        end
        params[:application_names].split(", ").each do |app_name|
            current_app = ProdApplication.where("description = ?", app_name)
            customer_app = CustomersProdApplication.new
            if current_app.size > 0
                customer_app.customer_id = customer_id
                customer_app.prod_application_id = current_app[0].id
            else
                prod_application = ProdApplication.new
                prod_application.description = app_name
                prod_application.user_id = user_id
                prod_application.save

                customer_app.customer_id = customer_id
                customer_app.prod_application_id = prod_application.id
            end
            customer_app.save
        end

        return {:success => true, :message => "#{item}#{message}", :id => customer.id}
    end

    #共享客户给……
    def self.update_sharing_with(params)
        #对目标客户循环
        #binding.pry
        customer_array = params[:customer_ids].split("|")
        customer_array.each do |customer|
            #相关的关联全删
            CustomersUser.delete_all("customer_id = #{customer}")
            #再加新的
            #对用户循环
            user_array = params[:share_to].split("|")
            user_array.each do |user|
                customer_user = CustomersUser.new
                customer_user.customer_id = customer
                customer_user.user_id = user
                customer_user.save
            end
        end
    end

    #转让客户给……
    def self.trans_to(params)
        #对目标客户循环
        customer_array = params[:customer_ids].split("|")
        customer_array.each do |customer|
            #转user
            update_customer = Customer.find(customer)
            update_customer.user_id = params[:trans_to]
            #update_customer.created_at =
            update_customer.save
        end
    end

    #保存客户|销售日志对应关系
    def self.save_customers_in_salecase(params, user_id)
        #如果已经有对应关系则先删掉，避免重复
        CustomersSalecase.delete_all(["customer_id = ? and salecase_id = ?", params[:customer_id], params[:salecase_id]])
        #再加
        customer_salecase_params = {
            :customer_id => params[:customer_id],
            :salecase_id => params[:salecase_id]
        }
        CustomersSalecase.new_or_save_with(customer_salecase_params)

        #也处理一下客户单位的问题吧，虽然可能不应该放这个model里
        #先删
        CustomerUnitsSalecase.delete_all(["customer_unit_id = ? and salecase_id = ?", params[:customer_unit_id], params[:salecase_id]])
        #再加
        customer_unit_salecase_params = {
            :customer_unit_id => params[:customer_unit_id],
            :salecase_id => params[:salecase_id]
        }
        CustomerUnitsSalecase.new_or_save_with(customer_unit_salecase_params)

        #新建一条“增加联系人”的日志
        need_sign = !Salecase.find(params[:salecase_id]).group.nil?
        process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 19).first.display
        customer_unit = CustomerUnit.find(params[:customer_unit_id]).name
        customer = Customer.find(params[:customer_id]).name
        #如果传来的日期是今天，则存当前时间
        #如果不是，说明填的是以前的日子，则存当日零点（判断不出时间啊……）
        contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
        salelog_params = {
            :process => 19,
            :contact_at => contact_at,
            :salecase_id => params[:salecase_id],
            :user_id => user_id,
            :natural_language => "#{process}：#{customer_unit}的#{customer}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
        }
        Salelog.create_or_update_with(salelog_params)
    end

    def self.delete_customers_in_salecases(params, user_id)
        need_sign = !Salecase.find(params[:salecase_id]).group.nil?
        CustomersSalecase.delete_all(["customer_id = ? and salecase_id = ?", params[:customer_id], params[:salecase_id]])
        #新建一条“删除联系人”的日志
        process = Dictionary.where("data_type = 'sales_processes' and value = ?", 23).first.display
        customer = Customer.find(params[:customer_id])
        customer_name = customer.name
        customer_unit = customer.customer_unit
        customer_unit_name = customer_unit.name
        salelog_params = {
            :process => 23,
            :contact_at => Time.now, #这里没办法了，只能存当前时间
            :salecase_id => params[:salecase_id],
            :user_id => user_id,
            :natural_language => "#{process}：#{customer_unit_name}的#{customer_name}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
        }
        Salelog.create_or_update_with(salelog_params)

        #如果删除后本个案中没有其它同单位的人，则删除个案/客户单位的关联
        case_customer_cus = CustomerUnit.where("salecases.id = 789").includes(:customers => :salecases)
        case_cus = CustomerUnit.where("salecases.id = 789").includes(:salecases)
        diffs = case_cus - case_customer_cus
        diffs.each { |diff|
            CustomerUnitsSalecase.delete_all(["customer_unit_id = ? and salecase_id = ?", diff.id, params[:salecase_id]])
        }
    end

    def self.get_possible_customers(params)
        customers = []
        #先解析出取哪个模型
        model = params['source_controller'].singularize.constantize
        #然后看id对应的数据
        inquire = model.find(params[:id])
        if !inquire.customer_unit_name.blank?
            #如果填了单位
            if !inquire.name.blank? && inquire.en_name.blank?
                #只填了姓名，则列出此单位所有和姓名第一个字一样的人
                customers += Customer.where("customer_unit_aliases.unit_alias like ? and customers.name like ?",
                                            "%#{inquire.customer_unit_name}%",
                                            "#{inquire.name[0]}%"
                ).includes(:customer_unit => :unit_aliases)
            elsif inquire.name.blank? && !inquire.en_name.blank?
                #只填了英文名，则列出此单位所有英文名里包含此姓或此名的人
                if inquire.en_name.split(" ").size > 1
                    customers += Customer.where("customer_unit_aliases.unit_alias like ? and (customers.en_name like ? or customers.en_name like ?)",
                                                "%#{inquire.customer_unit_name}%",
                        "#{inquire.en_name.split(" ")[0]}%",
                        "#{inquire.en_name.split(" ")[1]}%"
                    ).includes(:customer_unit => :unit_aliases)
                else
                    customers += Customer.where("customer_unit_aliases.unit_alias like ? and customers.en_name like ?",
                                                "%#{inquire.customer_unit_name}%",
                                                "#{inquire.en_name}%"
                    ).includes(:customer_unit => :unit_aliases)
                end
            elsif !inquire.name.blank? && !inquire.en_name.blank?
                #中英文名都填了，则上面两种都列出
                if inquire.en_name.split(" ").size > 1
                    customers += Customer.where("customer_unit_aliases.unit_alias like ? and customers.name like ? and (customers.en_name like ? or customers.en_name like ?)",
                                                "%#{inquire.customer_unit_name}%",
                                                "#{inquire.name[0]}%",
                                                "#{inquire.en_name.split(" ")[0]}%",
                                                "#{inquire.en_name.split(" ")[1]}%"
                    ).includes(:customer_unit => :unit_aliases)
                else
                    customers += Customer.where("customer_unit_aliases.unit_alias like ? and customers.name like ? and customers.en_name like ?",
                                                "%#{inquire.customer_unit_name}%",
                                                "#{inquire.name[0]}%",
                                                "#{inquire.en_name}%"
                    ).includes(:customer_unit => :unit_aliases)
                end
            else
                #都没填，列出该单位所有人
                customers += Customer.where("customer_unit_aliases.unit_alias like ?", "%#{inquire.customer_unit_name}%").includes(:customer_unit => :unit_aliases)
            end
        else
            #如果没填单位
            if !inquire.name.blank? && inquire.en_name.blank?
                #填了姓名，列出同名的人
                customers += Customer.where("name like ?", "%#{inquire.name}%")
            elsif inquire.name.blank? && !inquire.en_name.blank?
                #填了英文名，列出所有英文名里包含此姓或此名的人
                if inquire.en_name.split(" ").size > 1
                    customers += Customer.where("customers.en_name like ? or customers.en_name like ?",
                                                "#{inquire.en_name.split(" ")[0]}%",
                                                "#{inquire.en_name.split(" ")[1]}%"
                    )
                else
                    customers += Customer.where("customers.en_name like ?",
                                                "#{inquire.en_name}%"
                    )
                end
            elsif !inquire.name.blank? && !inquire.en_name.blank?
                #都填了，都列出
                if inquire.en_name.split(" ").size > 1
                    customers += Customer.where("customers.name like ? and (customers.en_name like ? or customers.en_name like ?)",
                                                "#{inquire.name[0]}%",
                                                "#{inquire.en_name.split(" ")[0]}%",
                                                "#{inquire.en_name.split(" ")[1]}%"
                    )
                else
                    customers += Customer.where("customers.name like ? and customers.en_name like ?",
                                                "#{inquire.name[0]}%",
                                                "#{inquire.en_name}%"
                    )
                end
            else
                #都没填……
            end
        end
        other_array = %w(mobile phone fax im email)
        other_array.each do |item|
            #binding.pry
            customers += Customer.where("#{item} = ?", inquire[item]) unless inquire[item].blank?
        end

        customers.uniq!
        return customers
    end

    def self.set_obsolete(params, user_id)
        item = "客户"
        message = "已经转为非目标客户"
        #先把需求转成客户，然后转为非目标
        customer = Customer.new()
        inquire = params[:inquire_type].singularize.constantize.find(params[:inquire_id])
        fields_to_be_updated = %w(customer_unit_id name en_name email mobile phone fax im department position addr
            postcode en_addr lead_id comment group_id
        )
        fields_to_be_updated.each do |field|
            customer[field] = inquire[field]
        end
        customer['group_id'] = nil if customer['group_id'] == "0"

        customer['is_obsolete'] = 1
        customer['lead_id'] = params['lead_id']
        customer['user_id'] = user_id
        customer.save
        inquire.customer_id = customer.id
        inquire.save
        return {:success => true, :message => "#{item}#{message}", :id => customer.id}
    end
end

