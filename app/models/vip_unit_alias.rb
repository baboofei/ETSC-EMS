# encoding: utf-8
class VipUnitAlias < ActiveRecord::Base
    attr_accessible :unit_alias, :user_id, :vip_unit_id

    belongs_to :vip
    belongs_to :user

    def self.new_or_save_with(params, user_id)
        vip_unit_alias = VipUnitAlias.new
        fields_to_be_updated = %w(vip_unit_id unit_alias).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            vip_unit_alias[field] = params[field]
        end
        vip_unit_alias.user_id = user_id
        vip_unit_alias.save
    end

    def self.create_or_update_with(params, user_id)
        item = "VIP单位别称"
        if !params[:id].blank?
            message = $etsc_update_ok
        else
            message = $etsc_create_ok
        end
        new_or_save_with(params, user_id)
        return {:success => true, :message => "#{item}#{message}"}
    end
end
