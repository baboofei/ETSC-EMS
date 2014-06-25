class CustomersProdApplication < ActiveRecord::Base
  attr_accessible :customer_id, :prod_application_id
  belongs_to :customer
  belongs_to :prod_application
end
