class EditableRolesStore < ActiveRecord::Base
    # attr_accessible :title, :body
    #belongs_to :store, :class_name => "Role", :foreign_key => :editable_role_id
    belongs_to :store
    belongs_to :editable_to, :class_name => 'Role', :foreign_key => :editable_role_id

end
