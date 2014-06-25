class CreateFlowSheetsUsers < ActiveRecord::Migration
    def change
        create_table :flow_sheets_users, {:id => false} do |t|
            t.integer :flow_sheet_id
            t.integer :user_id

            t.timestamps
        end
    end
end
