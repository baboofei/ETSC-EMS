# encoding: utf-8
class VipUnit < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :city_id, :comment, :en_addr, :en_name, :name, :postcode, :site, :user_id

    has_many :unit_aliases, :class_name => "VipUnitAlias", :foreign_key => "vip_unit_id"
    has_many :vips
    
    belongs_to :city
    belongs_to :user

    #快递单多态
    has_one :express_sheet, :as => :unit_receivable

    def self.query_by(query)
        where("vip_unit_aliases.unit_alias like ?", "%#{query}%").includes(:unit_aliases)
    end

    def for_combo_json
        attributes
    end

    def for_grid_json
        attr = attributes
        #binding.pry if city.nil?
        attr['name|en_name|unit_aliases>unit_alias'] = name
        attr['city>name'] = city.name
        attr['city_id'] = city.id
        #名称不显示在别称里
        vip_unit_aliases_id_array = []
        vip_unit_aliases_name_array = []
        unit_aliases.each do |vip_unit_alias|
            if vip_unit_alias.unit_alias != name
                vip_unit_aliases_id_array << vip_unit_alias.id
                vip_unit_aliases_name_array << vip_unit_alias.unit_alias
            end
        end
        attr['unit_aliases>id'] = vip_unit_aliases_id_array.join('|')
        attr['unit_aliases>unit_alias'] = vip_unit_aliases_name_array.join('、')
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "公共单位"
        if !params[:id].blank?
            #修改时判断重名要看name和id
            if VipUnit.where("name = ? and id != ?", params['name|en_name|unit_aliases>unit_alias'], params[:id]).size > 0
                return {:success => false, :message => $etsc_duplicate_unit_name}
            else
                vip_unit = VipUnit.find(params[:id])
                message = $etsc_update_ok
            end
        else
            #新增时判断重名只看name
            if VipUnit.where("name = ?", params['name|en_name|unit_aliases>unit_alias']).size > 0
                return {success: false, :message => $etsc_duplicate_unit_name}
            else
                vip_unit = VipUnit.new
                message = $etsc_create_ok
            end
        end

        fields_to_be_updated = %w(city_id postcode addr en_name en_addr site comment)
        fields_to_be_updated.each do |field|
            vip_unit[field] = params[field]
        end
        #binding.pry
        vip_unit.user_id = user_id
        vip_unit.name = params['name|en_name|unit_aliases>unit_alias']
        vip_unit.save

        #别称单独存
        if params[:id] != ""
            VipUnitAlias.delete_all("vip_unit_id = #{params[:id]}")
            vip_unit_id = params[:id].to_i
        else
            vip_unit_id = vip_unit.id
        end
        #本名也作为别称的一条存起来
        alias_array = params['unit_aliases>unit_alias'].multi_split << params['name|en_name|unit_aliases>unit_alias']
        alias_array.each do |unit_alias|
            vip_unit_alias_params = {
                :vip_unit_id => vip_unit_id,
                :unit_alias => unit_alias
            }
            VipUnitAlias.create_or_update_with(vip_unit_alias_params, user_id)
        end
        return {:success => true, :message => "#{item}#{message}", :id => vip_unit.id}

    end
end