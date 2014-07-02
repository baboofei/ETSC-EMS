class CreateReceivedEquipments < ActiveRecord::Migration
    def change
        create_table :received_equipments do |t|
            t.integer :flow_sheet_id
            t.integer :product_id
            t.string :sn
            t.string :symptom
            t.date :accepted_at
            t.boolean :is_in_warranty
            t.string :collect_account_number #到付单号

            t.string :state #给状态机用字段。所以以下三项就不要了
            #t.boolean :is_packaged
            #t.boolean :is_sent_back
            #t.boolean :is_return_factory
            t.string :comment

            t.timestamps
        end
    end
end
