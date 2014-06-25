class CreateElementsDisableRoles < ActiveRecord::Migration
    def change
        create_table :elements_disable_roles, {:id => false} do |t|
            t.integer :element_id
            t.integer :disable_role_id

            t.timestamps
        end
    end
end
