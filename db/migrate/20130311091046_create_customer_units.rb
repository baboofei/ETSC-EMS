class CreateCustomerUnits < ActiveRecord::Migration
    def change
        create_table :customer_units do |t|
            t.string :name
            t.string :en_name
            t.string :cu_sort
            #TODO 这里有点怪，应该cu_sort也是integer才对
            t.integer :user_id
            t.string :site
            t.integer :credit_level
            t.text :comment

            #t.integer :city_id
            #t.string :addr
            #t.string :postcode
            #t.string :en_addr
            #这四项因为单位和地址一对多而移至customer_unit_addrs表
            t.timestamps
        end
    end
end
