class CreateBusinessUnitsSalecases < ActiveRecord::Migration
    def change
        create_table :business_units_salecases, {:id => false} do |t|
            t.integer :business_unit_id
            t.integer :salecase_id

            t.timestamps
        end
    end
end
