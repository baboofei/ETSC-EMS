# encoding: utf-8
class BusinessUnit < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :city_id, :comment, :en_addr, :en_name, :name, :postcode, :site, :user_id

    has_many :business_contacts
    has_many :unit_aliases, :class_name => "BusinessUnitAlias", :foreign_key => "business_unit_id"

    belongs_to :city

    has_many :contracts

    belongs_to :user

    #快递单多态
    has_one :express_sheet, :as => :unit_receivable

    def self.query_by(query)
        where("business_unit_aliases.unit_alias like ? or business_units.en_name like ?", "%#{query}%", "%#{query}%").includes(:unit_aliases)
    end

    def for_combo_json
        attr = attributes
        attr
    end

    def for_grid_json
        attr = attributes
        #binding.pry if city.nil?
        attr['name|en_name|unit_aliases>unit_alias'] = name
        attr['city>name'] = city.name
        attr['city_id'] = city.id
        #名称不显示在别称里
        business_unit_aliases_id_array = []
        business_unit_aliases_name_array = []
        unit_aliases.each do |business_unit_alias|
            if business_unit_alias.unit_alias != name
                business_unit_aliases_id_array << business_unit_alias.id
                business_unit_aliases_name_array << business_unit_alias.unit_alias
            end
        end
        attr['unit_aliases>id'] = business_unit_aliases_id_array.join('|')
        attr['unit_aliases>unit_alias'] = business_unit_aliases_name_array.join('、')
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "商务相关单位"
        if !params[:id].blank?
            #修改时判断重名要看name和id
            if BusinessUnit.where("name = ? and id != ?", params['name|en_name|unit_aliases>unit_alias'], params[:id]).size > 0
                return {:success => false, :message => $etsc_duplicate_unit_name}
            else
                business_unit = BusinessUnit.find(params[:id])
                message = $etsc_update_ok
            end
        else
            #新增时判断重名只看name
            if BusinessUnit.where("name = ?", params['name|en_name|unit_aliases>unit_alias']).size > 0
                return {success: false, :message => $etsc_duplicate_unit_name}
            else
                business_unit = BusinessUnit.new
                message = $etsc_create_ok
            end
        end

        fields_to_be_updated = %w(name city_id postcode addr en_name en_addr site cu_sort comment)
        fields_to_be_updated.each do |field|
            business_unit[field] = params[field]
        end
        #binding.pry
        business_unit.user_id = user_id
        business_unit.name = params['name|en_name|unit_aliases>unit_alias']
        business_unit.save

        #别称单独存
        if params[:id] != ""
            BusinessUnitAlias.delete_all("business_unit_id = #{params[:id]}")
            business_unit_id = params[:id].to_i
        else
            business_unit_id = business_unit.id
        end
        #本名也作为别称的一条存起来
        alias_array = params['unit_aliases>unit_alias'].multi_split << params['name|en_name|unit_aliases>unit_alias']
        alias_array.each do |unit_alias|
            business_unit_alias_params = {
                :business_unit_id => business_unit_id,
                :unit_alias => unit_alias
            }
            BusinessUnitAlias.create_or_update_with(business_unit_alias_params, user_id)
        end
        return {:success => true, :message => "#{item}#{message}", :id => business_unit.id}

    end
end
