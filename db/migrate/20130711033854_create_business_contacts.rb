class CreateBusinessContacts < ActiveRecord::Migration
    def change
        create_table :business_contacts do |t|
            t.integer :business_unit_id
            t.string :name
            t.string :en_name
            t.string :phone
            t.string :mobile
            t.string :fax
            t.string :email
            t.string :addr
            t.string :en_addr
            t.string :postcode
            t.string :im
            t.string :department
            t.string :position
            t.text :comment
            t.integer :user_id

            t.timestamps
        end
    end
end
