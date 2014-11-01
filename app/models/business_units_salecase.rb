class BusinessUnitsSalecase < ActiveRecord::Base
    attr_accessible :business_unit_id, :salecase_id

    belongs_to :salecase
    belongs_to :business_unit

    def self.new_or_save_with(params)
        business_unit_salecase = BusinessUnitsSalecase.new
        business_unit_salecase.business_unit_id = params[:business_unit_id]
        business_unit_salecase.salecase_id = params[:salecase_id]
        business_unit_salecase.save
    end
end
