# encoding: utf-8
class PopUnit < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :city_id, :comment, :en_name, :name, :postcode, :site, :user_id
    #has_many :unit_aliases
    has_many :unit_aliases, :class_name => "PopUnitAlias", :foreign_key => "pop_unit_id"
    has_many :pops

    belongs_to :city
    belongs_to :user

    #快递单多态
    has_one :express_sheet, :as => :unit_receivable

    def self.query_by(query)
        where("pop_unit_aliases.unit_alias like ?", "%#{query}%").includes(:unit_aliases)
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
        pop_unit_aliases_id_array = []
        pop_unit_aliases_name_array = []
        unit_aliases.each do |pop_unit_alias|
            if pop_unit_alias.unit_alias != name
                pop_unit_aliases_id_array << pop_unit_alias.id
                pop_unit_aliases_name_array << pop_unit_alias.unit_alias
            end
        end
        attr['unit_aliases>id'] = pop_unit_aliases_id_array.join('|')
        attr['unit_aliases>unit_alias'] = pop_unit_aliases_name_array.join('、')
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "公共单位"
        if !params[:id].blank?
            #修改时判断重名要看name和id
            if PopUnit.where("name = ? and id != ?", params['name|en_name|unit_aliases>unit_alias'], params[:id]).size > 0
                return {:success => false, :message => $etsc_duplicate_unit_name}
            else
                pop_unit = PopUnit.find(params[:id])
                message = $etsc_update_ok
            end
        else
            #新增时判断重名只看name
            if PopUnit.where("name = ?", params['name|en_name|unit_aliases>unit_alias']).size > 0
                return {success: false, :message => $etsc_duplicate_unit_name}
            else
                pop_unit = PopUnit.new
                message = $etsc_create_ok
            end
        end

        fields_to_be_updated = %w(city_id postcode addr en_name en_addr site comment)
        fields_to_be_updated.each do |field|
            pop_unit[field] = params[field]
        end
        #binding.pry
        pop_unit.user_id = user_id
        pop_unit.name = params['name|en_name|unit_aliases>unit_alias']
        pop_unit.save

        #别称单独存
        if params[:id] != ""
            PopUnitAlias.delete_all("pop_unit_id = #{params[:id]}")
            pop_unit_id = params[:id].to_i
        else
            pop_unit_id = pop_unit.id
        end
        #本名也作为别称的一条存起来
        alias_array = params['unit_aliases>unit_alias'].multi_split << params['name|en_name|unit_aliases>unit_alias']
        alias_array.each do |unit_alias|
            pop_unit_alias_params = {
                :pop_unit_id => pop_unit_id,
                :unit_alias => unit_alias
            }
            PopUnitAlias.create_or_update_with(pop_unit_alias_params, user_id)
        end
        return {:success => true, :message => "#{item}#{message}", :id => pop_unit.id}

    end
end
