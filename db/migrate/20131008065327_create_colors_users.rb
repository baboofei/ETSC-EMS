class CreateColorsUsers < ActiveRecord::Migration
    def change
        create_table :colors_users, {:id => false} do |t|
            t.integer :color_id
            t.integer :user_id

            t.timestamps
        end
    end
end
