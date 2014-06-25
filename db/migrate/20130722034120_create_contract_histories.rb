class CreateContractHistories < ActiveRecord::Migration
    def change
        create_table :contract_histories do |t|
            t.string :item
            t.integer :old_id
            t.integer :new_id
            t.integer :user_id
            t.text :reason
            t.text :natural_language

            t.timestamps
        end
    end
end
