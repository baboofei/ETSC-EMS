class PurchasersVendorUnit < ActiveRecord::Base
    attr_accessible :user_id, :vendor_unit_id

    belongs_to :vendor_unit
    belongs_to :user
end
