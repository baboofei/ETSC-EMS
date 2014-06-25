class CreateCustomersUsers < ActiveRecord::Migration
    def change
        create_table :customers_users, {:id => false} do |t|
            t.integer :customer_id
            t.integer :user_id

            t.timestamps
        end
    end
end
