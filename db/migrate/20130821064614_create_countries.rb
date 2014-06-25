class CreateCountries < ActiveRecord::Migration
    #国家
    def change
        create_table :countries do |t|
            t.string :name
            t.string :en_name
            t.integer :region_id
            t.integer :user_id

            t.timestamps
        end
    end
end
