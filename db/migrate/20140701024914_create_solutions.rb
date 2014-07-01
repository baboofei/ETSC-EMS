class CreateSolutions < ActiveRecord::Migration
  def change
    create_table :solutions do |t|
      t.string :title
      t.text :content
      t.text :url
      t.integer :category

      t.timestamps
    end
  end
end
