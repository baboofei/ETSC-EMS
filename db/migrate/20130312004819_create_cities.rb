class CreateCities < ActiveRecord::Migration
    #城市
    def change
        create_table :cities do |t|
            t.string :name
            t.string :en_name
            t.integer :prvc_id
            t.integer :user_id

            t.timestamps
        end
    end
end
