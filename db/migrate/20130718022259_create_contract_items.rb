class CreateContractItems < ActiveRecord::Migration
    def change
        create_table :contract_items do |t|
            t.integer :product_id
            t.integer :purchase_order_id #订单号，不归合同而归合同项
            t.string :serial_number
            t.integer :quantity
            t.integer :send_status
            t.date :expected_leave_factory_at
            t.date :appointed_leave_factory_at
            t.date :actually_leave_factory_at
            t.date :leave_etsc_at
            t.date :reach_customer_at
            t.date :check_and_accept_at
            t.integer :check_and_accept_status
            t.integer :warranty_term_id
            t.string :reason
            t.integer :contract_id
            t.integer :commodity_id
            t.integer :inner_id #内部id，因为要增增删删的，按id排会乱
            t.integer :user_id
            t.boolean :is_history

            t.timestamps
        end
    end
end
