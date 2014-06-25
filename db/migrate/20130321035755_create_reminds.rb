class CreateReminds < ActiveRecord::Migration
    def change
        create_table :reminds do |t|
            t.text :remind_text #提醒内容
            t.boolean :flag, :default => false #已提醒否
            t.datetime :remind_at #设定时间
            t.string :sn #内部编号，用于定点设置已读
            t.integer :user_id

            t.timestamps
        end
    end
end
