class CreateDepartments < ActiveRecord::Migration
    #部门和经理现在变成多对一，所以加上一个部门经理的属性
    #之前的经理表也先不删了，可以当成副经理用。副经理是多对多
    #--20130904
    #如果一个部门有下级部门，那么它就只有经理而没有成员，经理只是行政上的管理者
    #如果没有下级部门，那就既有经理又有成员
    #--20120727

    def change
        create_table :departments do |t|
            t.string :name #名称
            t.string :description #描述
            t.integer :superior #上级部门
            t.integer :manager_id #经理id

            t.timestamps
        end
    end
end
