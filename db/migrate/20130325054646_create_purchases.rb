class CreatePurchases < ActiveRecord::Migration
    def change
        create_table :purchases do |t|
            t.string :contract_project
            t.string :contract_number
            t.date :sign_at
            t.string :seller
            t.string :name
            t.string :model
            t.decimal :quantity, :precision => 10, :scale => 2
            t.string :unit
            t.decimal :first_quoted, :precision => 12, :scale => 2
            t.integer :quoted_currency_id, :null => false, :default => 11 #默认RMB
            t.decimal :unit_price, :precision => 12, :scale => 2
            t.decimal :price, :precision => 12, :scale => 2
            t.decimal :discount, :precision => 12, :scale => 2
            t.integer :purchase_currency_id, :null => false, :default => 11
            t.string :invoice
            t.string :pay_method
            t.date :expected_pay_at
            t.string :pay_status
            t.string :invoice_status
            t.string :warranty
            t.date :expected_deliver_at
            t.date :actually_deliver_at
            t.string :deliver_place
            t.string :vendor_unit
            t.string :end_user
            t.string :user
            t.text :description
            t.text :comment
            t.integer :user_id

            t.timestamps
        end
    end
end
