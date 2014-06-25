class CreateFunctionsRoles < ActiveRecord::Migration
  def change
    create_table :functions_roles, {:id => false} do |t|
      t.integer :function_id
      t.integer :role_id

      t.timestamps
    end
  end
end
