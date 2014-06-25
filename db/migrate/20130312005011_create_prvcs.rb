class CreatePrvcs < ActiveRecord::Migration
    #省/州/自治区，外国的也可以有
    def change
        create_table :prvcs do |t|
            t.string :name
            t.string :en_name
            t.integer :area_id
            t.integer :user_id

            t.timestamps
        end
    end
end
