# encoding = utf-8
class Term < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :name

    def self.query_by(query)
        where("name like ?", "%#{query}%")
    end

    def for_combo_json
        attr = attributes
        attr
    end
end
