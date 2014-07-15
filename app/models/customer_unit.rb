# encoding: utf-8
class CustomerUnit < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :comment, :credit_level, :cu_sort, :en_name, :name, :site, :user_id
    has_many :customers
    has_many :quotes
    has_many :contracts
    #has_many :customer_unit_aliases
    has_many :unit_aliases, :class_name => 'CustomerUnitAlias', :foreign_key => 'customer_unit_id'

    #个案和客户单位多对多
    has_many :customer_units_salecases
    has_many :salecases, :through => :customer_units_salecases

    #水单和客户单位多对多
    has_many :customer_units_flow_sheets, :class_name => 'CustomerUnitsFlowSheet', :foreign_key => :customer_unit_id
    has_many :flow_sheets, :through => :customer_units_flow_sheets, :source => :flow_sheet

    #belongs_to :city
    has_many :customer_unit_addrs, :class_name => 'CustomerUnitAddr', :foreign_key => 'unit_id'

    belongs_to :user

    #快递单多态
    has_one :express_sheet, :as => :unit_receivable

    def self.query_by(query)
        where("customer_unit_aliases.unit_alias like ?", "%#{query}%").includes(:unit_aliases)
    end

    def for_combo_json
        attributes
    end

    def city
        customer_unit_addrs.map(&:city)[0]
    end
    def addr
        customer_unit_addrs.map(&:addr)[0]
    end
    def en_addr
        customer_unit_addrs.map(&:en_addr)[0]
    end
    def postcode
        customer_unit_addrs.map(&:postcode)[0]
    end

    def for_grid_json
        attr = attributes
        #binding.pry if city.nil?
        attr['name|en_name|unit_aliases>unit_alias'] = name
        attr['customer_unit_addrs>city>name'] = city.name if city

        attr['customer_unit_addrs>addr'] = addr
        attr['customer_unit_addrs>en_addr'] = en_addr
        attr['customer_unit_addrs>postcode'] = postcode
        #attr['city_id'] = city.id if city
        #名称不显示在别称里
        customer_unit_aliases_id_array = []
        customer_unit_aliases_name_array = []
        unit_aliases.each do |customer_unit_alias|
            if customer_unit_alias.unit_alias != name
                customer_unit_aliases_id_array << customer_unit_alias.id
                customer_unit_aliases_name_array << customer_unit_alias.unit_alias
            end
        end
        attr['unit_aliases>id'] = customer_unit_aliases_id_array.join('|')
        attr['unit_aliases>unit_alias'] = customer_unit_aliases_name_array.join('、')
        attr
    end

    #成员组能看到的客户的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        where("customers.user_id in #{str} or users.id in #{str}", *member_ids, *member_ids).includes(:shared_to)
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "客户单位"
        if !params[:id].blank?
            #修改时判断重名要看name和id
            if CustomerUnit.where("name = ? and id != ?", params['name|en_name|unit_aliases>unit_alias'], params[:id]).size > 0
                return {:success => false, :message => $etsc_duplicate_unit_name}
            else
                customer_unit = CustomerUnit.find(params[:id])
                message = $etsc_update_ok
            end
        else
            #新增时判断重名只看name
            if CustomerUnit.where("name = ?", params['name|en_name|unit_aliases>unit_alias']).size > 0
                return {success: false, :message => $etsc_duplicate_unit_name}
            else
                customer_unit = CustomerUnit.new
                customer_unit.credit_level = 4 #默认D级客户
                message = $etsc_create_ok
            end
        end

        fields_to_be_updated = %w(city_id postcode addr en_name en_addr site cu_sort comment)
        fields_to_be_updated.each do |field|
            customer_unit[field] = params[field]
        end
        #binding.pry
        customer_unit.user_id = user_id
        customer_unit.name = params['name|en_name|unit_aliases>unit_alias']
        customer_unit.save

        #别称单独存
        if params[:id] != ""
            CustomerUnitAlias.delete_all("customer_unit_id = #{params[:id]}")
            customer_unit_id = params[:id].to_i
        else
            customer_unit_id = customer_unit.id
        end
        #本名也作为别称的一条存起来
        alias_array = params['unit_aliases>unit_alias'].multi_split << params['name|en_name|unit_aliases>unit_alias']
        alias_array.each do |unit_alias|
            customer_unit_alias_params = {
                :customer_unit_id => customer_unit_id,
                :unit_alias => unit_alias
            }
            CustomerUnitAlias.create_or_update_with(customer_unit_alias_params, user_id)
        end
        return {:success => true, :message => "#{item}#{message}", :id => customer_unit.id}

    end
end
