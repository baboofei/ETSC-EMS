class CreateVendorUnitAliases < ActiveRecord::Migration
    def change
        create_table :vendor_unit_aliases do |t|
            t.string :unit_alias
            t.integer :vendor_unit_id
            t.integer :user_id

            t.timestamps
        end
    end
end
