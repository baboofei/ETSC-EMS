class CreateCustomers < ActiveRecord::Migration
    def change
        create_table :customers do |t|
            t.integer :customer_unit_addr_id
            t.string :name
            t.string :en_name
            t.string :mobile
            t.string :phone
            t.string :fax
            t.string :email
            t.string :im
            t.string :department
            t.string :position
            t.string :comment
            t.string :addr
            t.string :postcode
            t.integer :user_id
            t.integer :lead_id
            t.string :en_addr
            t.integer :group_id #所属项目组
            t.string :is_obsolete, :null => false, :default => 0 #是否无效客户，默认不是

            t.timestamps
        end
    end
end
