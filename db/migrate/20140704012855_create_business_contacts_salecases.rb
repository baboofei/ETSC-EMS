class CreateBusinessContactsSalecases < ActiveRecord::Migration
  def change
    create_table :business_contacts_salecases, {:id => false} do |t|
      t.integer :business_contact_id
      t.integer :salecase_id

      t.timestamps
    end
  end
end
