class PartialEditableRolesStore < ActiveRecord::Base
    attr_accessible :partial_editable_role_id, :store_id

    belongs_to :store
    belongs_to :partial_editable_to, :class_name => 'Role', :foreign_key => :partial_editable_role_id
end
