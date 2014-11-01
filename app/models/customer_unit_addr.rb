# encoding: utf-8
class CustomerUnitAddr < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :city_id, :en_addr, :name, :postcode, :is_prime?, :unit_id, :user_id

    belongs_to :customer_unit, :class_name => 'CustomerUnit', :foreign_key => 'unit_id'
    belongs_to :city
    has_many :customers
end
