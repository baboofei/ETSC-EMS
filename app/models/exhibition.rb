# encoding: utf-8
class Exhibition < ActiveRecord::Base
    attr_accessible :city_id, :comment, :description, :end_on, :lead_id, :name, :start_on

    belongs_to :city

    def for_list_json
        attr = attributes
        attr['display'] = attr['name']
        attr['value'] = attr['lead_id']
        attr
    end
end
