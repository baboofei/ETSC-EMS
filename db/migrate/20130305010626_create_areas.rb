class CreateAreas < ActiveRecord::Migration
    #区域。比如东北、华北、港澳台之类。
    #外国则直接和国名一样
    def change
        create_table :areas do |t|
            t.string :name
            t.string :en_name
            t.integer :country_id
            t.integer :user_id

            t.timestamps
        end
    end
end
