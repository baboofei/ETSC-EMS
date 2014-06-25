class CreateExhibitions < ActiveRecord::Migration
    def change
        create_table :exhibitions do |t|
            t.date :start_on
            t.date :end_on
            t.string :name
            t.string :description
            t.integer :city_id
            t.string :addr
            t.string :booth
            t.string :comment
            t.integer :lead_id #作为lead时的id
        end
    end
end
