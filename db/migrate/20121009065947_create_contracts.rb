class CreateContracts < ActiveRecord::Migration
    def change
        create_table :contracts do |t|
            t.string :number
            t.string :customer_number
            t.string :summary
            t.integer :signer_user_id
            t.integer :dealer_user_id
            t.integer :customer_unit_id
            t.integer :end_user_customer_id
            t.integer :buyer_customer_id
            t.integer :business_unit_id
            t.integer :business_contact_id
            t.integer :our_company_id
            t.integer :requirement_id
            t.integer :currency_id
            t.string :state #给状态机用字段
            t.decimal :sum, :precision => 10, :scale => 2
            t.decimal :exchange_rate, :precision => 7, :scale => 2
            t.decimal :rmb, :precision => 10, :scale => 2
            t.integer :pay_mode_id
            t.boolean :does_need_install
            t.boolean :does_need_lc
            t.datetime :receive_lc_at
            t.string :lc_number
            t.integer :invoice #开票状态
            t.decimal :profit, :precision => 10, :scale => 2
            t.decimal :total_collection, :precision => 10, :scale => 2
            t.text :comment
            t.integer :quote_id
            t.integer :salelog_id #TODO 用多态，这个可以干掉
            t.integer :contract_type
            t.integer :group_id
            t.datetime :signed_at #签署时间，和填写时间不一定一样
            t.datetime :invoiced_at #开票时间

            t.references :contractable, :polymorphic => true

            t.timestamps
        end
    end
end
