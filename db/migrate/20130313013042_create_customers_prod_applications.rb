class CreateCustomersProdApplications < ActiveRecord::Migration
  def change
    create_table :customers_prod_applications, {:id => false} do |t|
      t.integer :customer_id
      t.integer :prod_application_id

      t.timestamps
    end
  end
end
