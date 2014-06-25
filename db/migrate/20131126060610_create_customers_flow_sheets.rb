class CreateCustomersFlowSheets < ActiveRecord::Migration
  def change
    create_table :customers_flow_sheets, {:id => false} do |t|
      t.integer :customer_id
      t.integer :flow_sheet_id

      t.timestamps
    end
  end
end
