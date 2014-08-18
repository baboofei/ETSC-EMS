# encoding: utf-8
class Pop < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :comment, :department, :email, :en_name, :fax, :im, :mobile, :name, :phone, :pop_unit_id, :position, :user_id

    belongs_to :pop_unit
    belongs_to :user

    def for_grid_json(user_id)
        attr = attributes
        #binding.pry if pop_unit.nil?
        if pop_unit
            attr['pop_unit>(name|unit_aliases>unit_alias|en_name)'] = pop_unit.name
            #attr['pop_unit>pop_unit_aliases>unit_alias'] = pop_unit.name
            attr['pop_unit>id'] = pop_unit.id
            #binding.pry if pop_unit.city.nil?
            attr['pop_unit>city>name'] = pop_unit.city.name
            attr['pop_unit>city>id'] = pop_unit.city.id
            if pop_unit.city && pop_unit.city.prvc && pop_unit.city.prvc.area
                attr['pop_unit>city>prvc>area>name'] = pop_unit.city.prvc.area.name
                attr['pop_unit>city>prvc>area>id'] = pop_unit.city.prvc.area.id
            else
                attr['pop_unit>city>prvc>area>name'] = $etsc_empty_data
                attr['pop_unit>city>prvc>area>id'] = 0
            end
            #名称不显示在别称里
            pop_unit_aliases = pop_unit.unit_aliases
            pop_unit_aliases_name_array = []
            pop_unit_aliases.each do |pop_unit_alias|
                if pop_unit_alias.unit_alias != pop_unit.name
                    pop_unit_aliases_name_array << pop_unit_alias.unit_alias
                end
            end
            attr['pop_unit>unit_aliases>unit_alias'] = pop_unit_aliases_name_array.join("、")
        else
            attr['pop_unit>unit_aliases>unit_alias'] = $etsc_empty_data
            #attr['pop_unit>name'] = $etsc_empty_data
            attr['pop_unit>id'] = 0
            attr['pop_unit>city>name'] = $etsc_empty_data
            attr['pop_unit>city>id'] = 0
        end
        attr[:user_name] = user.name
        attr[:user_id] = user.id
        attr['editable'] = User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "公共联系人"
        if params[:id] != ""
            pop = Pop.find(params[:id])
            message = $etsc_update_ok
        else
            pop = Pop.new
            pop.user_id = user_id
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(pop_unit_id name en_name email mobile phone fax im department position addr
            postcode comment
        )
        fields_to_be_updated.each do |field|
            pop[field] = params[field]
        end
        pop.save

        return {:success => true, :message => "#{item}#{message}", :id => pop.id}
    end

end
