class CreateServiceLogs < ActiveRecord::Migration
    def change
        create_table :service_logs do |t|
            t.integer :flow_sheet_id
            t.date :start_at
            t.date :end_at
            t.integer :inner_id #顺序。不能完全按日期来，因为会有后补的。
            t.integer :user_id
            t.integer :process
            t.string :content #日志相关的描述，不同类型下对应不同的意义
            t.string :natural_language
            t.string :comment

            t.timestamps
        end
    end
end
