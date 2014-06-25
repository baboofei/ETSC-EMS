class CreateBusinessUnits < ActiveRecord::Migration
    def change
        create_table :business_units do |t|
            t.string :name
            t.string :en_name
            t.integer :city_id
            t.string :addr
            t.string :en_addr
            t.string :postcode
            t.string :site
            t.text :comment
            t.integer :user_id

            t.timestamps
        end
    end
end
