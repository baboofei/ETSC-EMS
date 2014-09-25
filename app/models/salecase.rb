# encoding: utf-8
class Salecase < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :comment, :end_at, :feasible, :number, :priority, :remind_at, :remind_flag, :start_at, :status, :user_id

    belongs_to :user

    #个案和客户单位多对多
    has_many :customer_units_salecases
    has_many :customer_units, :through => :customer_units_salecases

    #个案和客户多对多
    has_many :customers_salecases
    has_many :customers, :through => :customers_salecases

    #个案和商务相关单位多对多
    has_many :business_units_salecases
    has_many :business_units, :through => :business_units_salecases

    #个案和商务相关联系人多对多
    has_many :business_contacts_salecases
    has_many :business_contacts, :through => :business_contacts_salecases

    has_many :salelogs

    belongs_to :group

    def self.to_customer_unit(customer_unit_id)
        where("customer_units.id = ?", "#{customer_unit_id}").includes(:customer_units)
    end

    def self.to_customer(customer_id)
        where("customers.id = ?", "#{customer_id}").includes(:customers)
    end

    #成员组能看到的销售个案的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map { "?" }.join(",") + ")"
        #所有权是自己，或者组id包含了自己所在的组
        where("salecases.user_id in #{str} or users.id = ?", *member_ids, user_id).includes(:group => :users)

    end

    def for_grid_json(user_id)
        attr = attributes
        attr['user_name'] = user.name
        attr['customers>id'] = customers.map(&:id).join("|")
        attr['customers>(name|en_name)'] = customers.map(&:name).join("、")
        attr['customer_units>(name|en_name|unit_aliases>unit_alias)'] = customer_units.map(&:name).join("、")
        attr['group_name'] = group.blank? ? "" : "#{group.name}(#{group.description})"
        attr['has_signed_contract'] = end_at.blank? ? "" : end_at.strftime("%Y-%m-%d")
        attr['updated_at'] = salelogs.sort_by{|p| p.contact_at}[-1].contact_at if salelogs != []#.strftime("%Y-%m-%d")
        attr['editable'] = User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    def for_combo_json
        attributes
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "销售个案"
        #binding.pry
        unless params[:id].blank?
            salecase = Salecase.find(params[:id])
            message = $etsc_update_ok
        else
            salecase = Salecase.new
            #生成个案编号
            salecase.number = self.gen_new_number_with_letter("G")
            #起始日期为创建日期
            salecase.start_at = params[:start_at]
            message = $etsc_create_ok
        end
        #binding.pry
        fields_to_be_updated = %w(comment priority feasible group_id).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            salecase[field] = params[field]
        end
        salecase.user_id = user_id
        salecase.save

        #如果是新增，则
        if params[:id].blank?
            #个案和客户单位关联
            customer_unit_salecase = CustomerUnitsSalecase.new
            customer_unit_salecase.customer_unit_id = params[:customer_unit_id]
            customer_unit_salecase.salecase_id = salecase.id
            customer_unit_salecase.save
            #个案和客户关联
            customer_salecase = CustomersSalecase.new
            customer_salecase.customer_id = params[:customer_id]
            customer_salecase.salecase_id = salecase.id
            customer_salecase.save

            #新建一条“个案开始”的日志
            process = Dictionary.where("data_type = 'sales_processes' and value = ?", 24).first.display
            salelog_params = {
                :process => 24,
                :contact_at => params[:start_at],
                :salecase_id => salecase.id,
                :user_id => user_id,
                :natural_language => "#{process}：#{params[:comment]}",
                :comment => params[:detail]
            }
            #binding.pry
            Salelog.create_or_update_with(salelog_params)
        end

        return {:success => true, :message => "#{item}#{message}", :salecase_id => salecase.id}
    end

    def self.trans_to(params, user_id)
        salecase = Salecase.find(params[:id])
        salecase.user_id = params[:trans_to]
        salecase.save

        salelogs = Salelog.in_salecase(params[:id])
        salelogs.each do |salelog|
            salelog.user_id = params[:trans_to]
            salelog.save
        end

        #新建一条“个案转让”的日志
        process = Dictionary.where("data_type = ? and value = ?", "sales_processes", 26).first.display
        salelog_params = {
            :process => 26,
            :contact_at => Time.now,
            :salecase_id => salecase.id,
            :user_id => params[:trans_to],
            :natural_language => "#{process}：#{User.find(user_id).name}将个案转让给#{User.find(params[:trans_to]).name}"
        }
        Salelog.create_or_update_with(salelog_params)
        return {:success => true, :message => "个案已经成功转让"}
    end

    def self.count_via_vendor_unit(start_at, end_at, vendor_unit_id)
        salecase_through_recommend = where("salecases.created_at >= ? and salecases.created_at <= ?", start_at, end_at).includes(:salelogs => :recommend_factories).where("vendor_units.id = ?", vendor_unit_id)
        salecase_through_quote = where("salecases.created_at >= ? and salecases.created_at <= ?", start_at, end_at).includes(:salelogs => {:quote => {:quote_items => {:product => :seller}}}).where("vendor_units.id = ?", vendor_unit_id)
        return (salecase_through_recommend + salecase_through_quote).uniq.map(&:number).size
    end

    def self.count_via_product(start_at, end_at, product_id)
        salecase_through_recommend = where("salecases.created_at >= ? and salecases.created_at <= ?", start_at, end_at).includes(:salelogs => :recommends).where("products.id = ?", product_id)
        salecase_through_quote = where("salecases.created_at >= ? and salecases.created_at <= ?", start_at, end_at).includes(:salelogs => {:quote => {:quote_items => :product}}).where("products.id = ?", product_id)
        return (salecase_through_recommend + salecase_through_quote).uniq.map(&:number).size
    end

    def self.count_via_user(start_at, end_at, user_or_group, id)
        if user_or_group == "user"
            return where("created_at >= ? and created_at <= ? and user_id = ?", start_at, end_at, id).size
        else
            return where("created_at >= ? and created_at <= ? and group_id = ?", start_at, end_at, id).size
        end
    end

    def self.count_via_area(start_at, end_at, area_id)
        return where("salecases.created_at >= ? and salecases.created_at <= ? and areas.id = ?", start_at, end_at, area_id)\
        .includes(:customer_units => {:city => {:prvc => :area}}).size
    end

    def self.get_possible_salecases(params, user_id)
        #binding.pry
    #    所有属于自己 and (customer_unit是XX or customer是YY) 的个案
        where("salecases.user_id = ?", user_id)
        .where("customer_units.id = ? or customers.id = ?", params['customer_unit_id'], params['customer_id'])
        .includes(:customer_units).includes(:customers)
    end
end

