# encoding: utf-8
class BusinessUnitAlias < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :business_unit_id, :unit_alias, :user_id

    belongs_to :business_unit

    def self.new_or_save_with(params, user_id)
        business_unit_alias = BusinessUnitAlias.new
        fields_to_be_updated = %w(business_unit_id unit_alias).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            business_unit_alias[field] = params[field]
        end
        business_unit_alias.user_id = user_id
        business_unit_alias.save
    end

    def self.create_or_update_with(params, user_id)
        item = "进出口公司别称"
        if !params[:id].blank?
            message = $etsc_update_ok
        else
            message = $etsc_create_ok
        end
        new_or_save_with(params, user_id)
        return {:success => true, :message => "#{item}#{message}"}
    end
end
