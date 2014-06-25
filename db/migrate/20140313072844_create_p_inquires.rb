class CreatePInquires < ActiveRecord::Migration
    def change
        create_table :p_inquires do |t|
            t.string :customer_unit_name
            t.string :name
            t.string :en_name
            t.string :email
            t.string :phone
            t.string :fax
            t.string :im
            t.string :mobile
            t.string :department
            t.string :position
            t.string :addr
            t.string :en_addr
            t.string :postcode
            t.string :comment
            t.integer :vendor_unit_id
            t.integer :user_id
            t.integer :customer_id #销售那边完善了信息就会有这一项
            t.string :detail, limit: 10000

            t.timestamps
        end
    end
end
