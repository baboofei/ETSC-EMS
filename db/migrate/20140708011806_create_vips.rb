class CreateVips < ActiveRecord::Migration
    def change
        create_table :vips do |t|
            t.string :name
            t.string :en_name
            t.integer :vip_unit_id
            t.string :mobile
            t.string :phone
            t.string :fax
            t.string :email
            t.string :im
            t.string :department
            t.string :position
            t.string :comment
            t.integer :user_id
            t.string :postcode
            t.string :addr

            t.timestamps
        end
    end
end
