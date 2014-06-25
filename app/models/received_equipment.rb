# encoding: utf-8
#TSD服务水单下的收/发货清单
class ReceivedEquipment < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :accepted_at, :collect_account_number, :comment, :flow_sheet_id, :is_in_warranty, :is_packaged, :is_sent_back, :product_id, :sn, :symptom

    belongs_to :flow_sheet
    belongs_to :product

    def self.in_flow_sheet(flow_sheet_id)
        where("flow_sheet_id = ?", flow_sheet_id)
    end

    def for_grid_json
        attr = attributes
        #binding.pry if customer_unit.nil?
        attr['vendor_unit>name'] = product.producer.name
        attr['product>model'] = product.model
        #attr[]
        attr
    end

    def self.create_with(params)
        item = "货品"
        message = "已经成功添加"
        #binding.pry
        equipment = ReceivedEquipment.new
        fields_to_be_updated = %w(flow_sheet_id vendor_unit_id product_id sn symptom accepted_at collect_account_number
            is_in_warranty comment
        )
        fields_to_be_updated.each do |field|
            equipment[field] = params[field]
        end
        equipment.save
        return {success: true, message: "#{item}#{message}"}
    end
end


