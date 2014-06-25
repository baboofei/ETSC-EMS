class CreateEditableRolesStores < ActiveRecord::Migration
    def change
        create_table :editable_roles_stores, {:id => false} do |t|
            t.integer :editable_role_id
            t.integer :store_id

            t.timestamps
        end
    end
end
