class CreateExpressSheets < ActiveRecord::Migration
    def change
        create_table :express_sheets do |t|
            t.integer :express_unit_id
            t.string :number
            t.integer :sender_user_id
            t.string :description
            t.decimal :cost, :precision => 10, :scale => 2
            t.integer :currency_id
            t.date :send_at
            t.string :pdf_url

            t.references :unit_receivable, :polymorphic => true #收件单位的多态
            t.references :person_receivable, :polymorphic => true #收件人的多态

            t.string :description
            t.references :vestable, :polymorphic => true #所属项的多态

            t.string :comment

            t.timestamps
        end
    end
end
