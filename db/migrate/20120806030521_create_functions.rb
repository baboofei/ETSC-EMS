class CreateFunctions < ActiveRecord::Migration
    def change
        create_table :functions do |t|
            t.integer :block_id #按现在的三块权限应该就没有这一项了，先预留吧
            t.string :name
            t.string :icon_class #20120223
            t.integer :parent_function_id #假如分树形就要用这个了
            t.string :controller #要加载的Ext controller
            t.string :ext_id #要打开的TAB卡的ID
            t.string :widget #要打开的TAB卡里的第一层组件
            t.string :signal #如果是报价就是“Q”，合同就是“C”之类

            t.timestamps
        end
    end
end
