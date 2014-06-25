class CreateQuotes < ActiveRecord::Migration
    def change
        create_table :quotes do |t|
            t.integer :customer_unit_id
            t.integer :customer_id
            #TODO
            t.integer :salelog_id #这两个都可以去掉，改多态
            t.integer :salecase_id #我觉得用不上的字段，因为可以从sale_log_id追溯到
            t.string :number
            t.integer :currency_id
            t.decimal :total_discount, :precision => 12, :scale => 2
            t.integer :fif_currency_id
            t.decimal :fif, :precision => 12, :scale => 2
            t.decimal :vat, :precision => 12, :scale => 2
            t.decimal :other_cost, :precision => 12, :scale => 2
            t.decimal :total, :precision => 12, :scale => 2
            t.integer :sale_user_id #销售
            t.integer :business_user_id #商务
            t.integer :work_task_id
            t.integer :language
            t.text :request
            t.integer :quote_format #格式。标准/阶梯
            t.integer :our_company_id
            t.text :term #
            t.text :comment
            t.string :state #给状态机用字段
            t.integer :quote_type #类型。销售/维修/项目/
            t.integer :group_id #所属项目组
            t.text :pdf #PDF格式配置
            t.text :summary
            t.decimal :rmb, :precision => 12, :scale => 2
            t.decimal :final_price, :precision => 12, :scale => 2
            t.decimal :declaration_fee, :precision => 12, :scale => 2 #清关费
            t.decimal :max_custom_tax, :precision => 5, :scale => 2 #最大关税
            t.boolean :does_count_ctvat #是否计算关税/增值税
            t.decimal :x_discount, :precision => 5, :scale => 2 #

            t.references :quotable, :polymorphic => true

            t.timestamps
        end
    end
end
