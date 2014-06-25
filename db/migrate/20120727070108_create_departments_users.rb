class CreateDepartmentsUsers < ActiveRecord::Migration
  def change
    create_table :departments_users, {:id => false} do |t|
      t.integer :department_id
      t.integer :user_id

      t.timestamps
    end
  end
end
