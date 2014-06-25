class CustomersFlowSheet < ActiveRecord::Base
    attr_accessible :customer_id, :flow_sheet_id
    belongs_to :customer
    belongs_to :flow_sheet
end
