class CustomerUnitsFlowSheet < ActiveRecord::Base
    attr_accessible :customer_unit_id, :flow_sheet_id
    belongs_to :customer_unit
    belongs_to :flow_sheet
end
