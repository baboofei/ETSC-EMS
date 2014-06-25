class CreateSalelogs < ActiveRecord::Migration
  def change
    create_table :salelogs do |t|
      t.integer :process            #进展类别
      t.datetime :contact_at      #应该是实际联系时间。timestamps里的created_at是实际录入时间
      t.integer :salecase_id        #所属个案                       sale_case_id
      t.integer :user_id            #填写人
      t.text :comment               #备注
      #t.string :type #是什么？旧表全是空值
      t.datetime :remind_at         #提醒时间（“等待”时）            remindtime
      t.datetime :expected_sign_at  #预签合同时间                   contract_at
      t.integer :quote_id           #报价id                         quotation_id。也全是空值，貌似改成quote里带salelog_id了
      t.boolean :remind_flag        #已提醒否
      t.integer :wait_reason        #等待原因
      t.integer :complete_reason    #个案完结原因                    cancel_reason
      t.text :detail                #“其他”时的“详情”                note
      t.text :natural_language      #转成自然语言的结果，方便查看及发邮件
                                                                    #executetime
                                                                    #salse_log_mail_type

      t.timestamps
    end
  end
end
