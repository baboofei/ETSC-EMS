# encoding: utf-8
class Vendor < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :comment, :department, :email, :en_addr, :en_name, :fax, :im, :mobile, :name, :phone, :position, :postcode, :vendor_unit_id

    belongs_to :vendor_unit
    has_many :sold_admin_items, :class_name => 'AdminInventory', :foreign_key => 'vendor_id'

    def self.in_unit(vendor_unit_id)
        where("vendor_units.id = ?", "#{vendor_unit_id}").includes(:vendor_unit)
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "客户"
        if params[:id] != ""
            vendor = Vendor.find(params[:id])
            message = $etsc_update_ok
        else
            vendor = Vendor.new
            vendor.user_id = user_id
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(vendor_unit_id name en_name email mobile phone fax im department position addr
            postcode en_addr lead_id comment group_id
        )
        fields_to_be_updated.each do |field|
            vendor[field] = params[field]
        end
        vendor['group_id'] = nil if vendor['group_id'] == "0"
        vendor.save

        return {:success => true, :message => "#{item}#{message}", :id => vendor.id}
    end

    def for_grid_json
        attr = attributes
        #binding.pry
        attr['vendor_unit>id'] = vendor_unit.id
        attr['vendor_unit>(name|en_name|unit_aliases>unit_alias|short_code)'] = vendor_unit.name
        attr['editable'] = true
        attr
    end

    def for_combo_json
        attr = attributes
        attr
    end

    def self.create_mini_with(params, user_id)
        item = "供方联系人"
        vendor = Vendor.new
        message = $etsc_create_ok

        fields_to_be_updated = %w(vendor_unit_id name en_name phone mobile)
        fields_to_be_updated.each do |field|
            vendor[field] = params[field]
        end
        vendor.user_id = user_id
        vendor.save

        return {success: true, message: "#{item}#{message}"}
    end
end
