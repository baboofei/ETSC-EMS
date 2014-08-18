#!/bin/env ruby
# encoding: utf-8
# magic comment……解决汉字UTF8问题
class User < ActiveRecord::Base
    require "reusable"
    include Reusable

    validates :reg_name, :presence => true
    validates :etsc_email, :presence => true, :uniqueness => true

    #用户和部门多对多
    has_many :departments_users, :class_name => 'DepartmentsUser', :foreign_key => :user_id
    has_many :belongs_to_departments, :through => :departments_users, :source => :department

    ##部门和经理多对多
    #has_many :departments_managers, :class_name => 'DepartmentsManager', :foreign_key => :user_id
    #has_many :manage_departments, :through => :departments_managers, :source => :department

    #部门和经理多对一
    has_many :manage_departments, :class_name => 'Department', :foreign_key => :manager_id

    #用户和角色多对多
    has_many :roles_users
    has_many :roles, :through => :roles_users

    #用户和工作组多对多
    has_many :groups_users
    has_many :groups, :through => :groups_users

    #用户拥有的客户
    has_many :customers, :class_name => 'Customer', :foreign_key => :user_id
    #用户可看到的客户
    has_many :customers_users, :class_name => 'CustomersUser', :foreign_key => :user_id
    has_many :browse_customers, :through => :customers_users, :source => :customer

    has_many :customer_units
    has_many :customer_unit_aliases

    has_many :salecases
    has_many :reminds

    has_many :quotes, :foreign_key => 'sale_user_id'
    has_many :deal_quotes, :class_name => 'Quote', :foreign_key => 'business_user_id'

    has_many :deal_contracts, :class_name => 'Contract', :foreign_key => 'dealer_user_id'
    has_many :sign_contracts, :class_name => 'Contract', :foreign_key => 'signer_user_id'

    has_many :sent_messages, :class_name => 'PersonalMessage', :foreign_key => 'sender_user_id'
    has_many :received_messages, :class_name => 'PersonalMessage', :foreign_key => 'receiver_user_id'

    has_many :kept_admin_items, :class_name => 'AdminInventory', :foreign_key => 'keeper_user_id'
    has_many :bought_admin_items, :class_name => 'AdminInventory', :foreign_key => 'buyer_user_id'
    has_many :handle_admin_items, :class_name => 'AdminInventory', :foreign_key => 'user_id'

    #工厂和采购多对多
    has_many :purchasers_vendor_units, :class_name => 'PurchasersVendorUnit', :foreign_key => 'user_id'
    has_many :buy_from, :through => :purchasers_vendor_units, :source => :vendor_unit
    #工厂和商务多对多
    has_many :businesses_vendor_units, :class_name => 'BusinessesVendorUnit', :foreign_key => 'user_id'
    has_many :deal_with, :through => :businesses_vendor_units, :source => :vendor_unit
    #工厂和技术多对多
    has_many :supporters_vendor_units, :class_name => 'SupportersVendorUnit', :foreign_key => 'user_id'
    has_many :support, :through => :supporters_vendor_units, :source => :vendor_unit

    has_many :contract_histories

    has_many :business_units
    has_many :business_contacts

    #颜色和用户多对多
    has_many :colors_users, :class_name => 'ColorsUser', :foreign_key => :user_id
    has_many :use_color, :through => :colors_users, :source => :color

    #水单和用户多对多
    has_many :flow_sheets_users, :class_name => 'FlowSheetsUser', :foreign_key => :user_id
    has_many :flow_sheets, :through => :flow_sheets_users, :source => :flow_sheet

    has_many :m_inquires
    has_many :p_inquires

    has_many :pop_units
    has_many :pop_unit_aliases
    has_many :pops

    has_many :vip_units
    has_many :vip_unit_aliases
    has_many :vips
    #TODO 在职的和离职的要分开
    scope :at_job, where(:status => 1)
    scope :business, at_job.where("roles.id = 5").includes(:roles)
    scope :all_business, where("roles.id = 5").includes(:roles)
    scope :supporter, at_job.where("roles.id = 10").includes(:roles)
    scope :all_supporter, where("roles.id = 10").includes(:roles)
    scope :sale, at_job.where("roles.id = 1").includes(:roles)
    scope :all_sale, where("roles.id = 1").includes(:roles)
    scope :financial, at_job.where("roles.id = 2 or roles.id = 3").includes(:roles)
    scope :all_financial, where("roles.id = 2 or roles.id = 3").includes(:roles)
    scope :cashier, at_job.where("roles.id = 3").includes(:roles)
    scope :all_cashier, where("roles.id = 3").includes(:roles)
    scope :accounting, at_job.where("roles.id = 2").includes(:roles)
    scope :all_accounting, where("roles.id = 2").includes(:roles)
    scope :supporter_assistant, at_job.where("roles.id = 12").includes(:roles)
    scope :all_supporter_assistant, where("roles.id = 12").includes(:roles)
    scope :purchaser, at_job.where("roles.id = 14").includes(:roles)
    scope :all_purchaser, where("roles.id = 14").includes(:roles)
    scope :admin_keeper, at_job.where("roles.id = 17").includes(:roles)
    scope :all_admin_keeper, where("roles.id = 17").includes(:roles)
    scope :freighter, at_job.where("roles.id = 18").includes(:roles)
    scope :all_freighter, where("roles.id = 18").includes(:roles)

    scope :is_some_manager, at_job.where("departments.id is not null").includes(:manage_departments)

    def is_manager?
        self.manage_departments.count > 0
    end

    def get_all_member_ids
        #binding.pry
        if is_manager?
            #是经理，则取出其部门下所有成员，以及子部门、子子部门成员
            #MySQL的递归太复杂了，直接写死吧，先来个四层，短期内应该够了……
            #掌管的部门
            depts = manage_departments
            #部门成员id
            member_ids = []
            depts.each do |dept|
                member_ids << dept.members.map(&:id)

                #子部门
                child_depts = dept.children
                #子部门成员id
                child_member_ids = []
                child_depts.each do |child_dept|
                    child_member_ids << child_dept.members.map(&:id)

                    #子子部门
                    child_child_depts = child_dept.children
                    #子子部门成员id
                    child_child_member_ids = []
                    child_child_depts.each do |child_child_dept|
                        child_child_member_ids << child_child_dept.members.map(&:id)

                        #子子子部门
                        child_child_child_depts = child_child_dept.children
                        #子子子部门成员id
                        child_child_child_member_ids = []
                        child_child_child_depts.each do |child_child_child_dept|
                            child_child_child_member_ids << child_child_child_dept.members.map(&:id)
                        end
                        child_member_ids << child_child_child_member_ids

                    end
                    child_member_ids << child_child_member_ids
                end
                member_ids << child_member_ids
            end
            #return member_ids.flatten.uniq
        else
            member_ids = [id]
            #return [id]
        end
        group_ids = User.find(self.id).group_ids
        unless group_ids.blank?
            group_str = "(#{group_ids.map{|p| "?"}.join(",")})"
            member_ids << User.where("groups.id in #{group_str}", *group_ids).includes(:groups).map(&:id)
        end
        return member_ids.flatten.uniq
    end

    def get_all_member_ids_in_group
        if is_manager?
            #是经理，则取出其部门下所有成员，以及子部门、子子部门成员
            #MySQL的递归太复杂了，直接写死吧，先来个四层，短期内应该够了……
            #掌管的部门
            depts = manage_departments
            #部门成员id
            member_ids = []
            depts.each do |dept|
                member_ids << dept.members.map(&:id)

                #子部门
                child_depts = dept.children
                #子部门成员id
                child_member_ids = []
                child_depts.each do |child_dept|
                    child_member_ids << child_dept.members.map(&:id)

                    #子子部门
                    child_child_depts = child_dept.children
                    #子子部门成员id
                    child_child_member_ids = []
                    child_child_depts.each do |child_child_dept|
                        child_child_member_ids << child_child_dept.members.map(&:id)

                        #子子子部门
                        child_child_child_depts = child_child_dept.children
                        #子子子部门成员id
                        child_child_child_member_ids = []
                        child_child_child_depts.each do |child_child_child_dept|
                            child_child_child_member_ids << child_child_child_dept.members.map(&:id)
                        end
                        child_member_ids << child_child_child_member_ids

                    end
                    child_member_ids << child_child_member_ids
                end
                member_ids << child_member_ids
            end
            #return member_ids.flatten.uniq
        else
            member_ids = [id]
            #return [id]
        end
        group_ids = User.find(self.id).group_ids
        unless group_ids.blank?
            group_str = "(#{group_ids.map{"?"}.join(",")})"
            member_ids << User.where("groups.id in #{group_str}", *group_ids).includes(:groups).map(&:id)
        end
        return member_ids.flatten.uniq
    end

    #所有管理此人的经理……和上面的方法相反
    def get_all_manager_ids
        depts = belongs_to_departments
        #部门经理id
        manager_ids = []
        depts.each do |dept|
            manager_ids << dept.manager_id
            #manager_ids << dept.managers.map(&:id)
            #改成多对一之后要调整

            #父部门
            parent_dept = dept.parent
            if parent_dept
                #父部门经理id
                manager_ids << parent_dept.manager_id

                #父父部门
                parent_parent_dept = parent_dept.parent
                if parent_parent_dept
                    #父父部门经理id
                    manager_ids << parent_parent_dept.manager_id

                    #父父父部门
                    parent_parent_parent_dept = parent_parent_dept.parent
                    if parent_parent_parent_dept
                    #父父父部门经理id
                        manager_ids << parent_parent_parent_dept.manager_id
                    end
                end
            end
        end
        return manager_ids.flatten.uniq
    end

    #此人的直属经理
    def get_direct_manager_ids
        depts = belongs_to_departments
        manager_ids = []
        depts.each do |dept|
            manager_ids << dept.manager_id
        end
        return manager_ids.flatten.uniq
    end

    #上面方法的改进版
    #因为审批什么的都只会给一个人审批，所以改成了只返回一个值
    def get_direct_manager_id
        if id == 1 || id == 2
            #如果是肖娜或者王辉文，则算成王辉文
            return 1
        else
            #如果不是，则先取出此人所有所属部门，然后选所有部门的经理。
            #某一个所属部门没有经理就再往上，追溯到肖娜为准
            #然后把所有取出来的经理列表取id最小的那一个（先到公司的对情况了解得多一些）
            depts = belongs_to_departments
            manager_ids = []
            depts.each do |dept|
                if dept.manager
                    #如果有经理就用上
                    manager_ids << dept.manager_id
                else
                    #没有的时候往上追溯，不递归了，暂定两层吧
                    if dept.parent.manager
                        manager_ids << dept.parent.manager_id
                    else
                        if dept.parent.parent.manager
                            manager_ids << dept.parent.parent.manager_id
                        else
                            manager_ids << 2
                        end
                    end
                end
            end
            return manager_ids.sort[0]
        end
    end

    def self.manager_test
        array = []
        1.upto(62).each do |u|
            unless User.where("id=? and status=?", u, 1).size == 0
                array << "user_name = #{User.find(u).name}, manager_name = #{User.find(u).get_direct_manager_id}"
            end
        end
        p array.join("|")
    end

    #此人的同组组员的并集(包含自己)
    def get_group_mate_ids
        #binding.pry
        #groups = groups
        mate_ids = [id]
        groups.each do |group|
            mate_ids << group.users.map(&:id)
        end
        return mate_ids.flatten.uniq
    end

    #成员组能看到的用户的并集，但这个没有shared_to
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        where("users.id in #{str}", *member_ids)
    end


    #给下拉列表或者筛选用的JSON
    def for_list_json
        attributes
    end

    #给列表用的JSON
    def for_grid_json(store_name, user_id)
        #检查editable状态
        editable = false
        store = Store.find_by_name(store_name)
        user = User.find(user_id)
        #binding.pry
        if store
            if (store.editable_to_roles & user.roles).size > 0
                #全部可见并全部可改的角色，直接为true
                editable = true
            elsif (store.visible_to_roles & user.roles).size > 0
                #全部可见并全部不可改的角色，直接为false
            elsif (store.partial_editable_to_roles & user.roles).size > 0
                #部分可见部分可改的角色，判断是否为本人
                editable = (sale_user_id == user_id)
            else
                #未分配的角色，返回空集
            end
        end
        #binding.pry
        attr = attributes
        attr['editable'] = editable
        attr
    end

    def self.create_or_update_with(params, user_id)
        item = "用户"
        #binding.pry
        if !params[:id].blank?
            user = User.find(params[:id])
            message = $etsc_update_ok
        else
            user = User.new
            message = $etsc_create_ok
        end

        #binding.pry
        fields_to_be_updated = %w(name en_name reg_name email etsc_email mobile extension qq msn)
        fields_to_be_updated.each do |field|
            user[field] = params[field]
        end
        #user.user_id = user_id
        if !params[:id].blank?
            user.save
        else
            #校验一下，如果是正常操作，也就是传过来的用户的角色是Admin或者行政，则正常发邮件，否则发邮件给Terry。
            action_user = User.find(user_id)
            if action_user.role_ids.include?(8) || action_user.role_ids.include?(9)
                user.status = "1"
                user.password = "!Q@W#E$R"
                user.save
                UserMailer.welcome_email(user, params['sex'], params['department_name'], params['position']).deliver
            else
                UserMailer.alert_email("非法注册操作！").deliver
            end
        end

        return {success: true, message: "#{item}#{message}"}
    end

    def self.validate_reg_name_unique(params)
        #binding.pry
        if params['id'].blank?
            #新增时校验是否和所有用户重复
            user = User.where("reg_name = ?", params['reg_name'])
        else
            #修改时校验是否和“其它”用户重复
            user = User.where("reg_name = ? and id <> ?", params['reg_name'], params['id'])
        end
        return {success: (user.size == 0)}
    end

    def self.change_password(user_id, old_password, new_password)
        item = "密码"
        message = $etsc_update_ok
        user = User.find(user_id)
        user_name = user.reg_name
        authenticate = User.authenticate(user_name, old_password)

        if authenticate
            user.password = new_password
            user.save
            return {success: true, message: "#{item}#{message}"}
        else
            return {success: false, message: "旧密码输入错误，修改失败！"}
        end
    end

    def self.authenticate(name, password)
        user = self.find_by_reg_name(name)
        if user
            expected_password = encrypted_password(password, user.salt)
            if user.hashed_password != expected_password
                user = nil
            end
        end
        user
    end

    def password
        @password
    end

    def password=(pwd)
        @password = pwd
        return if pwd.blank?
        create_new_salt
        self.hashed_password = User.encrypted_password(self.password, self.salt)
    end

    def to_etsc_json
        {
            "name" => self.name, #5.0用self.name,
            "en_name" => self.reg_name,
            "etsc_email" => self.etsc_email,
            "email" => self.email
            # "department" => self.departments ? self.departments[0].name : "--"
        }
    end

    def self.to_tsv(options = {})
        require "csv"

        csv_string = CSV.generate(:col_sep => "\t", :row_sep => "\r\n") do |csv|
            csv << ['姓名', 'en_name', 'email']
            all.each do |r|
                csv << [r.name, r.en_name, r.email]
            end
        end

        fh = File.new("#{Rails.root}/public/abc_col_sep.csv", "wb")  #创建一个可写文件流
        fh.puts csv_string #写入数据
        fh.close
    end

    def self.to_xls
        require 'spreadsheet'
        path = "#{Rails.root}/public/abc_col_sep.xls"

        book = Spreadsheet::Workbook.new
        sheet = book.create_worksheet
        sheet[0, 0] = '编号' #注：[行号,列号]
        sheet[0, 1] = '姓名'
        sheet[1, 0] = 1
        sheet[1, 1] = '中文测试'
        book.write path
    end

    def self.import_xls
        require 'spreadsheet'
        file = Spreadsheet.open("#{Rails.public_path}/8.4入库清单.xls")

        sheet = file.worksheet 0
        #p sheet.class
        sheet.each { |row|
            p row[1]
        }
    end

    private
    def self.encrypted_password(password, salt)
        string_to_hash = password + "terry" + salt
        Digest::SHA1.hexdigest(string_to_hash)
    end

    def create_new_salt
        self.salt = self.object_id.to_s + rand.to_s
    end


    def self.test_pdf
        pdf_font = "#{Rails.root}/app/assets/fonts/etsc.ttf"
        require "prawn"
        Prawn::Document.generate("#{Rails.root}/public/test.pdf",
                                 :page_size => 'A4',
                                 :margin => [20, 40]) do
            font pdf_font, :size => 11
            #nbsp = Prawn::Text::NBSP

            customers = Customer.where("user_id = 50")
            customer_array = customers.map do |p|
                if p.position == "工程师"
                    p.name[0] + "工"
                else
                    p.name + p.position
                end
            end
            customer_array.each do |customer|
                bounding_box [50, 685], :width => 420 do
                    text "尊敬的#{customer}，您好！", :inline_format => true
                    move_down 8
                    text "　　我是隽龙科技有限公司的马騵，主要负责基于光纤分布式传感系统解决方案的应用开发。基于之前与航空航天领域的科研人员交流，我得知您在从事复合材料方面的研 " +
                             "究，具有超高空间分辨率的光纤分布式传感系统也许能够为您的工作提供帮助。",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "　　在此，请允许我简单介绍一下该系统的原理和性能。该系统采用可调谐波长干涉技术，基于探测和分析光纤中背向瑞利散射信号的光谱频移，从而达到对温变及应变的传感测量。该系统采用通信光纤作为传感器，测量长度可达50m，同时具备1mm的空间分辨率。与传统的光纤传感系统相比，该系统具有更高的空间分辨率（mm量级）、更大的测量范围（应变±13000ustrain，温度-50～300℃）、更高的测量分辨率（应变 " +
                             "1ustrain，温度0.1℃），以及更高的测量精度（应变±2ustrain，温度±0.2℃）。该系统在复合材料应变测量方面具有卓越性能，可被广泛应用于复合材料的结构健康监测领域。同时，该系统具有强大的数据处理能力，并拥有用户可定制的数据分析及可视化模块。",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "　　我将该系统与FBG及应变片的测试方法进行对比，实验结果验证了该系统具有的高空间分辨率应变监测能力。这里，我将该系统的技术资料和应用案例放在信函中，请收阅。如果您需要更详细的其他资料，请和我联系。",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "　　目前，我司的开放实验室积极同材料力学领域的科研机构和企业单位开展联合实验项目。如果您对这套系统感兴趣，我们希望能同您进行深入交流，并为您现场演示该系统。我们非常期待与您的合作！",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "　　最后，祝您身体健康，工作愉快！ ",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "　　此致",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "敬礼！",
                         :inline_format => true,
                         :leading => 5
                    move_down 8
                    text "马騵",
                         :inline_format => true,
                         :leading => 5,
                         :align => :right
                    move_down 8
                    text "#{Time.now.year}年#{Time.now.month}月",
                         :inline_format => true,
                         :leading => 5,
                         :align => :right
                end
                start_new_page
            end

            #text z_text.chinese_wrap, :inline_format => true
        end
    end

    #临时
    def self.adjust_admin_inventory_data
        z = AdminInventoryHistory.where("after_inventory_id is null and (act_type like '%buy_in%' or act_type like '%reject%')")
        name_str_array = []
        z.each do |z_history|
            #name_str_array <<
            name = z_history.natural_language.split("，")[0].match(/.*\d+.(.*)/)[1]
            #binding.pry
            z_item = AdminInventory.where("name like ? and created_at like ? and state = 'b_stocking'", "%#{name}%", "%#{z_history.act_at.to_s.split(" ")[0]}%")
            #p item.size
            if z_item.size > 1
                #binding.pry
                #z_history.after_inventory_id = z_item[0].id
                #z_history.save
            end
        end
        #return name_str_array
    end

    #推广邮件测试
    #临时
    def self.promotion_email
        #receivers = User.where("id = 5")
        #receivers = Customer.where("prod_applications.description = '激光器测试'").includes(:prod_applications)
        #receivers << User.where("id = 59")
        #
        #receivers.each { |receiver|
        #    unless receiver.email.blank?
        #        email = receiver.email.split(",")[0]
        #        UserMailer.promotion_test_email(email).deliver
        #    end
        #}

        receivers = Customer.where(true).reject{|p| p.email.blank?}.map{|p| p.email.split(",")[0]}.shuffle[0..500]
        receivers << User.at_job.map(&:etsc_email)
        receivers.each do |receiver|
            UserMailer.promotion_test_email(receiver).deliver
            sleep 10
        end
    end

    #临时
    def self.function_introduce_email
        users = at_job
        #users = where("id = 2 or id = 5")
        users.each do |user|
            #@user = user
            #@functions = Function.where("users.id = ?", user.id).includes(:roles => :users).order("functions.id")

            UserMailer.function_instruction_email(user).deliver
            sleep 10
        end
    end

    #根据邮箱反查客户
    #mail_list = %w(xxx xxx)
    def self.find_customers_by_mail_list(mail_list)
        out_list = []
        mail_list.each do |em|
            customer = Customer.where("email like ?", "#{em}%")[0]
            if customer.blank?
                out_list << ["error", "error", "error"]
            else
                out_list << [customer.customer_unit.blank? ? "error": customer.customer_unit.name, customer.name, customer.user.name]
            end
        end
        out_list
    end

    #商务转岗时用到的，估计以后不会再用了，留着吧
    def self.change_business_vendor_unit
        vus = VendorUnit.where("regions.name not like '%欧%' and regions.name not like '%美%'").includes(:city => {:prvc => {:area => {:country => :region}}})
        vus.each do |vu|
            BusinessesVendorUnit.delete_all("vendor_unit_id = #{vu.id}")
            business_vendor_unit = BusinessesVendorUnit.new
            business_vendor_unit['user_id'] = 11
            business_vendor_unit['vendor_unit_id'] = vu.id
            business_vendor_unit.save
        end
    end


    def self.get_unassociated_customer_by(user_id)
        m_inquires = MInquire.where("customer_id is null and user_id = #{user_id}")
        p_inquires = PInquire.where("customer_id is null and user_id = #{user_id}")
        return m_inquires + p_inquires
    end

end
