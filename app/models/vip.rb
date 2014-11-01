# encoding: utf-8
class Vip < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :comment, :department, :email, :en_name, :fax, :im, :mobile, :name, :phone, :position, :postcode, :user_id, :vip_unit_id

    belongs_to :vip_unit
    belongs_to :user

    def for_grid_json(user_id)
        attr = attributes
        #binding.pry if vip_unit.nil?
        if vip_unit
            attr['vip_unit>(name|unit_aliases>unit_alias|en_name)'] = vip_unit.name
            #attr['vip_unit>vip_unit_aliases>unit_alias'] = vip_unit.name
            attr['vip_unit>id'] = vip_unit.id
            #binding.pry if vip_unit.city.nil?
            attr['vip_unit>city>name'] = vip_unit.city.name
            attr['vip_unit>city>id'] = vip_unit.city.id
            if vip_unit.city && vip_unit.city.prvc && vip_unit.city.prvc.area
                attr['vip_unit>city>prvc>area>name'] = vip_unit.city.prvc.area.name
                attr['vip_unit>city>prvc>area>id'] = vip_unit.city.prvc.area.id
            else
                attr['vip_unit>city>prvc>area>name'] = $etsc_empty_data
                attr['vip_unit>city>prvc>area>id'] = 0
            end
            #名称不显示在别称里
            vip_unit_aliases = vip_unit.unit_aliases
            vip_unit_aliases_name_array = []
            vip_unit_aliases.each do |vip_unit_alias|
                if vip_unit_alias.unit_alias != vip_unit.name
                    vip_unit_aliases_name_array << vip_unit_alias.unit_alias
                end
            end
            attr['vip_unit>unit_aliases>unit_alias'] = vip_unit_aliases_name_array.join("、")
        else
            attr['vip_unit>unit_aliases>unit_alias'] = $etsc_empty_data
            #attr['vip_unit>name'] = $etsc_empty_data
            attr['vip_unit>id'] = 0
            attr['vip_unit>city>name'] = $etsc_empty_data
            attr['vip_unit>city>id'] = 0
        end
        attr[:user_name] = user.name
        attr[:user_id] = user.id
        attr['editable'] = User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "VIP联系人"
        if params[:id] != ""
            vip = Vip.find(params[:id])
            message = $etsc_update_ok
        else
            vip = Vip.new
            vip.user_id = user_id
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(vip_unit_id name en_name email mobile phone fax im department position addr
            postcode comment
        )
        fields_to_be_updated.each do |field|
            vip[field] = params[field]
        end
        vip.save

        return {:success => true, :message => "#{item}#{message}", :id => vip.id}
    end

end