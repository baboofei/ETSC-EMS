class CreateCollections < ActiveRecord::Migration
    def change
        create_table :collections do |t|
            t.date :received_at
            t.decimal :amount, :precision => 10, :scale => 2
            t.decimal :compensation_amount, :precision => 10, :scale => 2
            t.integer :contract_id
            t.text :reason
            t.integer :user_id
            t.boolean :is_history

            t.timestamps
        end
    end
end
