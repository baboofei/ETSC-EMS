class CreateFlowSheets < ActiveRecord::Migration
    def change
        create_table :flow_sheets do |t|
            t.string :number
            t.integer :flow_sheet_type #类别：维修、安装、测试、维护、校准、检测
            t.decimal :work_day #有效工作日
            t.decimal :waiting_day #等待工作日。这两项均已排除法定节假日
            t.string :description #如“华为 3908 上电冒烟”，自己看得懂
            t.string :state
            t.integer :priority
            t.integer :contract_id
            t.string :comment
            t.integer :deliver_by #发货依据：收款发货、款前发货。先不要其它，字典表随时补
            t.integer :deal_requirement #处理要求：先查验、先处理
            t.boolean :is_in_warranty #由每一件商品的质保决定，但每次计算会影响速度，还是单写一个字段吧

            #t.integer :user_id #只是标记一下创建者，真正的技术工程师和水单是多对多
            #t.string :collect_account_number #到付单号→收货表格里

            t.timestamps
        end
    end
end
