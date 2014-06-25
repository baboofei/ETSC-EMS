class CreateBusinessUnitAliases < ActiveRecord::Migration
    def change
        create_table :business_unit_aliases do |t|
            t.string :unit_alias
            t.integer :business_unit_id
            t.integer :user_id

            t.timestamps
        end
    end
end
