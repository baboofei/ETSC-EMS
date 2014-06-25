#encoding: UTF-8
class ElementsDisableRole < ActiveRecord::Base
  attr_accessible :disable_role_id, :element_id

  #元素对角色可见不可用的多对多关系
  belongs_to :element
  #等价于↓
  #belongs_to :element, :class_name => "Element", :foreign_key => :element_id
  belongs_to :disable_to, :class_name => "Role", :foreign_key => :disable_role_id
end
