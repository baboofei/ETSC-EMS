class BusinessContactsContract < ActiveRecord::Base
    attr_accessible :business_contact_id, :contract_id

    belongs_to :business_contact
    belongs_to :contract
end
