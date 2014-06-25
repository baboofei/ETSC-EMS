class CreateCustomersSalecases < ActiveRecord::Migration
    def change
        create_table :customers_salecases, {:id => false} do |t|
            t.integer :customer_id
            t.integer :salecase_id
        end
    end
end
