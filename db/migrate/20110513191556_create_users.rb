class CreateUsers < ActiveRecord::Migration
  def change
    
    create_table :users do |t|
      t.string :reg_name
      t.string :name
      t.string :en_name
      t.string :email
      t.string :hashed_password
      t.string :salt
      t.integer :department_id
      t.integer :status, :default => 1#1=正常, 2=冻结
      t.string :extension#分机号
      t.string :mobile
      t.string :qq
      t.string :msn
      t.string :etsc_email
      t.string :elements
      t.string :first_page#登录时显示的页面，如果用Desktop就没这个了
      t.timestamps
    end
    
  end
end
