class CreateSerialsSolutions < ActiveRecord::Migration
  def change
    create_table :serials_solutions do |t|
      t.integer :solution_id
      t.integer :serial_id
      t.timestamps
    end
  end
end
