class CreateAdminInventories < ActiveRecord::Migration
    def change
        create_table :admin_inventories do |t|
            t.string :name
            t.string :model
            t.text :description
            t.text :sn
            t.text :number
            t.integer :financial_type #财务分类：固定资产、库存商品什么的
            t.integer :inventory_type #库管分类：电器、家具什么的
            t.integer :inventory_level
            t.integer :keep_at
            t.decimal :current_quantity, :precision => 10, :scale => 2 #会有小数的情况，##.##升之类
            t.string :count_unit
            t.decimal :buy_price, :precision => 12, :scale => 2
            t.decimal :financial_price, :precision => 12, :scale => 2
            t.integer :currency_id
            t.decimal :rmb, :precision => 12, :scale => 2
            t.string :state #给状态机用字段
            t.string :project
            t.integer :keeper_user_id #保管人。最终负责的人
            t.integer :buyer_user_id #采购人。表单里选，非必填，因为不一定是采购的
            t.integer :ownership
            t.integer :vendor_unit_id
            t.integer :vendor_id
            t.text :comment
            t.string :apply_for_sn #申请（入库/领用等）时用的序号，用于筛选同一批次申请操作的物品
            t.integer :in_stock_source #库存物品分一部分领用或者租借时，分出那一部分的“库存源”物品
            t.integer :out_stock_source #领用或者租借的物品分一部分归还时，分出那一部分的“出库源”物品
            t.datetime :expire_at #失效日期
            t.datetime :expire_warranty_at #过保日期
            t.integer :user_id #经手人。填写表单的人，从session里取

            t.timestamps
        end
    end
end
