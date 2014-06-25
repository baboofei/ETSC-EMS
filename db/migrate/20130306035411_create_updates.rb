class CreateUpdates < ActiveRecord::Migration
  def change
    create_table :updates do |t|
      t.string :version
      t.integer :update_type
      t.integer :function_id
      t.text :description

      t.timestamps
    end
  end
end
