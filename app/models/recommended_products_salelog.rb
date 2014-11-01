class RecommendedProductsSalelog < ActiveRecord::Base
    attr_accessible :customer_requirement, :product_id, :salelog_id, :vendor_unit_id

    belongs_to :product
    belongs_to :salelog
    belongs_to :vendor_unit
end

