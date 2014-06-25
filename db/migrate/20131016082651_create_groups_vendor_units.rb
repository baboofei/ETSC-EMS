class CreateGroupsVendorUnits < ActiveRecord::Migration
    def change
        create_table :groups_vendor_units, {:id => false} do |t|
            t.integer :group_id
            t.integer :vendor_unit_id

            t.timestamps
        end
    end
end
