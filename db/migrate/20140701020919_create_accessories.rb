class CreateAccessories < ActiveRecord::Migration
  def change
    create_table :accessories do |t|
      t.text :url
      t.text :thumbnail_url
      t.text :description

      t.timestamps
    end
  end
end
