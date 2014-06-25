# encoding: utf-8
class WarrantyTerm < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :name

    has_many :contract_items

    def self.query_by(query)
        where("name like ?", "%#{query}%")
    end

    def for_combo_json
        attr = attributes
        attr
    end
end
