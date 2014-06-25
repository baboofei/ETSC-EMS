class CreatePayModes < ActiveRecord::Migration
    def change
        create_table :pay_modes do |t|
            t.string :name
            t.integer :credit_level

            t.timestamps
        end
    end
end
