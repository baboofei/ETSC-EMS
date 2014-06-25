class CreateScheduledMails < ActiveRecord::Migration
  def change
    create_table :scheduled_mails do |t|
      t.integer :sender
      t.integer :receiver
      t.date :mailed_at
      t.string :mail_type #比如“工作日志”、“季度财务报表”等

      t.timestamps
    end
  end
end
