class ContractsCustomer < ActiveRecord::Base
    attr_accessible :contract_id, :customer_id

    belongs_to :contract
    belongs_to :customer
end
