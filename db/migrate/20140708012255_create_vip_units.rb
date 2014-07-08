class CreateVipUnits < ActiveRecord::Migration
    def change
        create_table :vip_units do |t|
            t.string :name
            t.string :en_name
            t.integer :city_id
            t.string :addr
            t.string :en_addr
            t.string :postcode
            t.string :site
            t.string :comment
            t.integer :user_id

            t.timestamps
        end
    end
end
