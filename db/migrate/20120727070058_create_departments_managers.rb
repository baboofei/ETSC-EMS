class CreateDepartmentsManagers < ActiveRecord::Migration
  def change
    create_table :departments_managers, {:id => false} do |t|
      t.integer :department_id
      t.integer :user_id
      
      t.timestamps
    end
  end
end
