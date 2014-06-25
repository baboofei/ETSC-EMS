class CreateProducts < ActiveRecord::Migration
    def change
        create_table :products do |t|
            t.string :model
            t.string :name
            t.integer :producer_vendor_unit_id
            t.integer :seller_vendor_unit_id
            t.string :en_name
            t.string :reference
            t.text :simple_description_cn
            t.text :simple_description_en
            t.integer :currency_id
            t.decimal :custom_tax, :precision => 5, :scale => 2
            t.string :tax_number #税则号
            t.decimal :price_in_list, :precision => 12, :scale => 2
            t.decimal :price_from_vendor, :precision => 12, :scale => 2
            t.decimal :price_to_market, :precision => 12, :scale => 2
            t.decimal :price_in_site, :precision => 12, :scale => 2
            t.integer :serial_id
            t.integer :user_id

            t.timestamps
        end
    end
end
