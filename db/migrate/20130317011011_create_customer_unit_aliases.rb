class CreateCustomerUnitAliases < ActiveRecord::Migration
  def change
    create_table :customer_unit_aliases do |t|
      t.string :unit_alias
      t.integer :customer_unit_id
      t.integer :user_id

      t.timestamps
    end
  end
end
