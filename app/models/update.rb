# encoding: utf-8
class Update < ActiveRecord::Base
    attr_accessible :description, :function_id, :update_type, :version
    belongs_to :function
end
