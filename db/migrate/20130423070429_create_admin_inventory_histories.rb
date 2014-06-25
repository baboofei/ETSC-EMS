class CreateAdminInventoryHistories < ActiveRecord::Migration
  def change
    create_table :admin_inventory_histories do |t|
      t.datetime :act_at
      t.integer :before_inventory_id
      t.integer :after_inventory_id
      t.integer :user_id
      t.string :act_type
      t.string :project #原因
      t.text :natural_language

      t.timestamps
    end
  end
end
