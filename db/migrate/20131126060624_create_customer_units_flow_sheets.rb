class CreateCustomerUnitsFlowSheets < ActiveRecord::Migration
  def change
    create_table :customer_units_flow_sheets, {:id => false} do |t|
      t.integer :customer_unit_id
      t.integer :flow_sheet_id

      t.timestamps
    end
  end
end
