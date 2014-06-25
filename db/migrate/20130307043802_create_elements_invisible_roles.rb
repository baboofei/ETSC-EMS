class CreateElementsInvisibleRoles < ActiveRecord::Migration
  def change
    create_table :elements_invisible_roles, {:id => false} do |t|
      t.integer :element_id
      t.integer :invisible_role_id

      t.timestamps
    end
  end
end
