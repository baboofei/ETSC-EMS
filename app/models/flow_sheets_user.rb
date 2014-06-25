class FlowSheetsUser < ActiveRecord::Base
    attr_accessible :flow_sheet_id, :user_id

    belongs_to :flow_sheet
    belongs_to :user
end
