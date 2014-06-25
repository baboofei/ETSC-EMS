class CustomerUnitsSalecase < ActiveRecord::Base
    attr_accessible :customer_unit_id, :salecase_id

    belongs_to :salecase
    belongs_to :customer_unit

    def self.new_or_save_with(params)
        customer_unit_salecase = CustomerUnitsSalecase.new
        customer_unit_salecase.customer_unit_id = params[:customer_unit_id]
        customer_unit_salecase.salecase_id = params[:salecase_id]
        customer_unit_salecase.save
    end
end
