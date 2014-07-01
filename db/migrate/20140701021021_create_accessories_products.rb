class CreateAccessoriesProducts < ActiveRecord::Migration
  def change
    create_table :accessories_products do |t|
      t.integer :product_id
      t.integer :accessory_id

      t.timestamps
    end
  end
end
