class CreateElements < ActiveRecord::Migration
  def change
    create_table :elements do |t|
      t.string :element_id
      t.integer :function_id
      t.string :description
      t.string :default_value

      t.timestamps
    end
  end
end
