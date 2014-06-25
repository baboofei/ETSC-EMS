class CreateCustomerUnitsSalecases < ActiveRecord::Migration
  def change
    create_table :customer_units_salecases, {:id => false} do |t|
      t.integer :customer_unit_id
      t.integer :salecase_id

      t.timestamps
    end
  end
end
