# encoding: utf-8
class Purchase < ActiveRecord::Base
    require "reusable"
    include Reusable
    attr_accessible :actually_deliver_at, :comment, :contract_number, :contract_project, :deliver_place, :description, :discount, :end_user, :expected_deliver_at, :expected_pay_at, :first_quoted, :invoice, :invoice_status, :model, :name, :pay_method, :pay_status, :price, :quantity, :seller, :sign_at, :unit_price, :user, :vendor_unit, :warranty

    def for_grid_json
        attr = attributes
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "采购信息"
        if params[:id] != ""
            purchase = Purchase.find(params[:id])
            message = $etsc_update_ok
        else
            purchase = Purchase.new
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(contract_project contract_number sign_at seller name model quantity unit first_quoted quoted_currency_id unit_price price discount purchase_currency_id invoice pay_method expected_pay_at pay_status invoice_status warranty expected_deliver_at actually_deliver_at deliver_place vendor_unit end_user user description comment)
        fields_to_be_updated.each do |field|
            purchase[field] = params[field]
        end
        #binding.pry
        purchase.user_id = user_id
        purchase.save

        return {success: true, message: "#{item}#{message}"}
    end
end
