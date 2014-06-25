# encoding: utf-8
class PurchaseOrder < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :number

    has_many :contract_items
end
