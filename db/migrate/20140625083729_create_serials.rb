class CreateSerials < ActiveRecord::Migration
    def change
        create_table :serials do |t|
            t.string :brief #类似型号，不过是总称，比如“36xx”，所以没用“model”
            t.string :name
            t.integer :type_id #现在只有一层类别，做字典项
            t.text :description
            t.text :application_in_site
            t.text :parameter_in_site
            t.text :feature
            t.boolean :is_recommend
            t.boolean :is_display
            t.integer :user_id

            t.timestamps
        end
    end
end
