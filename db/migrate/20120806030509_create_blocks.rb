class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.string :name
      t.string :controller_name
      
      t.timestamps
    end
  end
end
