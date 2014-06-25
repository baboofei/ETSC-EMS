class CreateSupportersVendorUnits < ActiveRecord::Migration
    def change
        create_table :supporters_vendor_units, {:id => false} do |t|
            t.integer :user_id
            t.integer :vendor_unit_id
        end
    end
end
