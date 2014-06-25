class CreateVendors < ActiveRecord::Migration
  def change
    create_table :vendors do |t|
      t.integer :vendor_unit_id
      t.string :name
      t.string :en_name
      t.string :department
      t.string :position
      t.string :phone
      t.string :mobile
      t.string :im
      t.string :fax
      t.string :email
      t.string :comment
      t.string :addr
      t.string :postcode
      t.string :en_addr
      t.string :user_id

      t.timestamps
    end
  end
end
