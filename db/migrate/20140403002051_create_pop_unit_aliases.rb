class CreatePopUnitAliases < ActiveRecord::Migration
  def change
    create_table :pop_unit_aliases do |t|
      t.string :unit_alias
      t.integer :pop_unit_id
      t.integer :user_id

      t.timestamps
    end
  end
end
