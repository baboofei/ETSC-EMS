class CreateUsersVips < ActiveRecord::Migration
    def change
        create_table :users_vips, {:id => false} do |t|
            t.integer :user_id
            t.integer :vip_id

            t.timestamps
        end
    end
end
