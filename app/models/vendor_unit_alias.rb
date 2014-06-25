# encoding: utf-8
class VendorUnitAlias < ActiveRecord::Base
    attr_accessible :unit_alias, :user_id, :vendor_unit_id

    belongs_to :vendor_unit

    def self.new_or_save_with(params, user_id)
        vendor_unit_alias = VendorUnitAlias.new
        fields_to_be_updated = %w(vendor_unit_id unit_alias).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            vendor_unit_alias[field] = params[field]
        end
        vendor_unit_alias.user_id = user_id
        vendor_unit_alias.save
    end

    def self.create_or_update_with(params, user_id)
        item = "供应商单位别称"
        if !params[:id].blank?
            message = $etsc_update_ok
        else
            message = $etsc_create_ok
        end
        new_or_save_with(params, user_id)
        return {:success => true, :message => "#{item}#{message}"}
    end
end
