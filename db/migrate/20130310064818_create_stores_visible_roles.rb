class CreateStoresVisibleRoles < ActiveRecord::Migration
    def change
        create_table :stores_visible_roles, {:id => false} do |t|
            t.integer :store_id
            t.integer :visible_role_id

            t.timestamps
        end
    end
end
