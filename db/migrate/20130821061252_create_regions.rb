class CreateRegions < ActiveRecord::Migration
    #最高的级别：地区。比如东南亚、日韩、北美、欧洲之类。
    #特例是：中国
    def change
        create_table :regions do |t|
            t.string :name
            t.string :en_name
            t.integer :user_id

            t.timestamps
        end
    end
end
