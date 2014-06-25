# encoding: utf-8
class BusinessContact < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :business_unit_id, :comment, :department, :email, :en_name, :fax, :im, :mobile, :name, :phone,
                    :en_addr, :postcode, :position, :user_id

    belongs_to :business_unit
    has_many :contracts

    belongs_to :user

    def self.in_unit(business_unit_id)
        where("business_unit_id = ?", "#{business_unit_id}")
    end

    def self.query_by(query)
        where("name like ? or en_name like ?", "%#{query}%", "%#{query}%")
    end

    def for_combo_json
        attr = attributes
        attr
    end

    def for_grid_json(user_id)
        attr = attributes
        #binding.pry if business_unit.nil?
        if business_unit
            attr['business_unit>(name|en_name|unit_aliases>unit_alias)'] = business_unit.name
            #attr['business_unit>business_unit_aliases>unit_alias'] = business_unit.name
            attr['business_unit>id'] = business_unit.id
            #binding.pry if business_unit.city.nil?
            attr['business_unit>city>name'] = business_unit.city.name
            attr['business_unit>city>id'] = business_unit.city.id
            if business_unit.city && business_unit.city.prvc && business_unit.city.prvc.area
                attr['business_unit>city>prvc>area>name'] = business_unit.city.prvc.area.name
                attr['business_unit>city>prvc>area>id'] = business_unit.city.prvc.area.id
            else
                attr['business_unit>city>prvc>area>name'] = $etsc_empty_data
                attr['business_unit>city>prvc>area>id'] = 0
            end
            #名称不显示在别称里
            business_unit_aliases = business_unit.unit_aliases
            business_unit_aliases_name_array = []
            business_unit_aliases.each do |business_unit_alias|
                if business_unit_alias.unit_alias != business_unit.name
                    business_unit_aliases_name_array << business_unit_alias.unit_alias
                end
            end
            attr['business_unit>unit_aliases>unit_alias'] = business_unit_aliases_name_array.join("、")
        else
            attr['business_unit>(name|en_name|unit_aliases>unit_alias)'] = $etsc_empty_data
            #attr['business_unit>name'] = $etsc_empty_data
            attr['business_unit>id'] = 0
            attr['business_unit>city>name'] = $etsc_empty_data
            attr['business_unit>city>id'] = 0
        end
        attr[:user_name] = user.name
        attr[:user_id] = user.id
        attr['editable'] = User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "进出口公司联系人"
        if params[:id] != ""
            business_contact = BusinessContact.find(params[:id])
            message = $etsc_update_ok
        else
            business_contact = BusinessContact.new
            business_contact.user_id = user_id
            message = $etsc_create_ok
        end

        #binding.pry
        fields_to_be_updated = %w(business_unit_id name en_name email mobile phone fax im addr postcode en_addr comment)
        fields_to_be_updated.each do |field|
            business_contact[field] = params[field]
        end
        business_contact.save

        return {:success => true, :message => "#{item}#{message}", :id => business_contact.id}
    end

end
