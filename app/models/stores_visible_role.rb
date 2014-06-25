# encoding: utf-8
class StoresVisibleRole < ActiveRecord::Base
    attr_accessible :store_id, :visible_role_id

    #数据对角色仅可见的多对多关系
    belongs_to :store
    belongs_to :visible_to, :class_name => 'Role', :foreign_key => :visible_role_id
end
