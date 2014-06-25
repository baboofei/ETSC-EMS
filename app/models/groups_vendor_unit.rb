# encoding: utf-8
class GroupsVendorUnit < ActiveRecord::Base
    attr_accessible :group_id, :vendor_unit_id
    belongs_to :group
    belongs_to :vendor_unit
end
