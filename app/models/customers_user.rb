class CustomersUser < ActiveRecord::Base
    attr_accessible :customer_id, :user_id
    belongs_to :user, :class_name => 'User', :foreign_key => :user_id
    belongs_to :customer, :class_name => 'Customer', :foreign_key => :customer_id
end
