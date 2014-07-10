# encoding: utf-8
class PopUnitAlias < ActiveRecord::Base
    attr_accessible :pop_unit_id, :unit_alias, :user_id

    belongs_to :pop_unit
    belongs_to :user

    def self.new_or_save_with(params, user_id)
        pop_unit_alias = PopUnitAlias.new
        fields_to_be_updated = %w(pop_unit_id unit_alias).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            pop_unit_alias[field] = params[field]
        end
        pop_unit_alias.user_id = user_id
        pop_unit_alias.save
    end

    def self.create_or_update_with(params, user_id)
        item = "公共单位别称"
        if !params[:id].blank?
            message = $etsc_update_ok
        else
            message = $etsc_create_ok
        end
        new_or_save_with(params, user_id)
        return {:success => true, :message => "#{item}#{message}"}
    end
end
