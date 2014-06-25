#encoding: UTF-8
class ElementsInvisibleRole < ActiveRecord::Base
    attr_accessible :element_id, :invisible_role_id

    #元素对角色不可见的多对多关系
    belongs_to :element
    belongs_to :invisible_to, :class_name => "Role", :foreign_key => :invisible_role_id
end
