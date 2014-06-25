class CreatePartialEditableRolesStores < ActiveRecord::Migration
  def change
    create_table :partial_editable_roles_stores, {:id => false} do |t|
      t.integer :partial_editable_role_id
      t.integer :store_id

      t.timestamps
    end
  end
end
