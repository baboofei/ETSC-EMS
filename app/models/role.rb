# encoding: utf-8
class Role < ActiveRecord::Base
    has_many :functions_roles
    has_many :functions, :through => :functions_roles

    has_many :roles_users
    has_many :users, :through => :roles_users

    #元素对角色可见不可用的多对多关系
    has_many :elements_disable_roles, :class_name => "ElementsDisableRole", :foreign_key => :disable_role_id
    has_many :disabled_elements, :through => :elements_disable_roles, :source => :element

    #元素对角色不可见的多对多关系
    has_many :elements_invisible_roles, :class_name => "ElementsInvisibleRole", :foreign_key => :invisible_role_id
    has_many :invisible_elements, :through => :elements_invisible_roles, :source => :element

    #数据对角色全部仅可见的多对多关系
    has_many :stores_visible_roles, :class_name => "StoresVisibleRole", :foreign_key => :visible_role_id
    has_many :visible_stores, :through => :stores_visible_roles, :source => :store

    #数据对角色全部可见又可改的多对多关系
    has_many :editable_roles_stores, :class_name => "EditableRolesStore", :foreign_key => :editable_role_id
    has_many :editable_stores, :through => :editable_roles_stores, :source => :store

    #数据对角色部分可见又可改的多对多关系
    has_many :partial_editable_roles_stores, :class_name => "PartialEditableRolesStore", :foreign_key => :partial_editable_role_id
    has_many :partial_editable_stores, :through => :partial_editable_roles_stores, :source => :store

    #哪些角色拥有此功能
    #params function
    scope :own_function, lambda { |function| where("functions.id = ?", function.id).includes(:functions) }

    #给下拉列表或者筛选用的JSON
    def for_list_json
        attributes
    end

    #TODO
    #4.0版的采用的“多态”解决方法，5.0版应该废弃掉
    #has_many :permissions, :as => :unit, :foreign_key => "unit_id"
end
