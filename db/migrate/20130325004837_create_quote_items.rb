class CreateQuoteItems < ActiveRecord::Migration
  def change
    create_table :quote_items do |t|
      t.integer :parent_id
      t.string :inner_id
      t.string :leaf
      t.integer :quote_id
      t.integer :vendor_unit_id #还有这个
      t.integer :product_id
      t.integer :quantity
      t.integer :quantity_2
      t.text :description
      t.integer :price_source
      t.decimal :original_unit_price, :precision => 12, :scale =>2
      t.integer :original_currency_id
      t.decimal :times_1, :precision => 5, :scale =>2
      t.decimal :divide_1, :precision => 5, :scale =>2
      t.decimal :unit_price, :precision => 12, :scale =>2
      t.decimal :times_2, :precision => 5, :scale =>2
      t.decimal :divide_2, :precision => 5, :scale =>2
      t.decimal :discount, :precision => 12, :scale =>2
      t.decimal :discount_to, :precision => 12, :scale =>2
      t.decimal :total, :precision => 12, :scale =>2
      t.decimal :system_price, :precision => 12, :scale =>2
      t.decimal :system_discount, :precision => 12, :scale =>2
      t.decimal :original_exchange_rate, :precision => 12, :scale =>2
      t.integer :currency_id
      t.decimal :exchange_rate, :precision => 12, :scale =>2
      t.string :product_name #这个要来干什么啊
      t.string :product_model #还有这个
      t.decimal :item_total_amount, :precision => 12, :scale =>2
      t.integer :item_total_currency_id
      t.decimal :custom_tax, :precision => 12, :scale =>2

      t.timestamps
    end
  end
end
