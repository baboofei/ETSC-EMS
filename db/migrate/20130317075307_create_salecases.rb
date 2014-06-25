class CreateSalecases < ActiveRecord::Migration
  def change
    create_table :salecases do |t|
      t.string :number
      t.datetime :start_at #创建时间。timestamps里的created_at是实际录入时间
      t.datetime :end_at #结束时间。timestamps里的updated_at是最近联系时间
      t.integer :user_id
      t.text :comment
      t.integer :status#状态，字典表
      t.integer :priority, :null => false, :default => 1 #优先级，字典表。默认普通
      t.decimal :feasible #成案率
      t.datetime :remind_at #提醒时间
      t.boolean :remind_flag #已提醒否
      t.integer :group_id #所属项目组

      t.timestamps
    end
  end
end
