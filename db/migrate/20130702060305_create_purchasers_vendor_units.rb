class CreatePurchasersVendorUnits < ActiveRecord::Migration
    def change
        create_table :purchasers_vendor_units, {:id => false} do |t|
            t.integer :user_id
            t.integer :vendor_unit_id
        end
    end
end
