class CreateSerialRelationships < ActiveRecord::Migration
    def change
        create_table :serial_relationships do |t|
            t.integer :main_serial_id
            t.integer :related_serial_id

            t.timestamps
        end
    end
end
