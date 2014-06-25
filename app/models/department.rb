class Department < ActiveRecord::Base
    #用户和部门多对多
    has_many :departments_users, :class_name => 'DepartmentsUser', :foreign_key => :department_id
    has_many :members, :through => :departments_users, :source => :user

    ##部门和经理多对多
    #has_many :departments_managers, :class_name => 'DepartmentsManager', :foreign_key => :department_id
    #has_many :managers, :through => :departments_managers, :source => :user

    #部门和经理多对一
    belongs_to :manager, :class_name => "User", :foreign_key => :manager_id

    #部门和部门自关联
    has_many :children, :class_name => 'Department', :foreign_key => :superior
    belongs_to :parent, :class_name => 'Department', :foreign_key => :superior
end
