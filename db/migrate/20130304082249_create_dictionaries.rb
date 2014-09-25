class CreateDictionaries < ActiveRecord::Migration
  def change
    create_table :dictionaries do |t|
      t.string :data_type #字典类型
      t.string :display #显示值
      t.string :display_en #英文版用到的值
      t.string :value #储存值
      t.boolean :available, :null => false, :default => true #可用/不可用

      t.timestamps
    end
  end
end
