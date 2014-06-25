class CreateStores < ActiveRecord::Migration
  def change
    create_table :stores do |t|
      t.string :name
      t.string :description
      t.boolean :is_hierarchy #是否按部门继承。经理看下级人员数据
      t.boolean :is_group_hierarchy #是否继承“父store”的分组。个案属于某个组，而其下的日志本身是没有分组属性的，选上这个可以继承个案的分组

      t.timestamps
    end
  end
end
