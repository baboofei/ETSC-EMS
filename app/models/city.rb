class City < ActiveRecord::Base
    attr_accessible :en_name, :name, :prvc_id

    has_many :customer_units
    has_many :vendor_units
    has_many :pop_units
    has_many :exhibitions
    has_many :business_units

    belongs_to :prvc

    def self.query_by(query)
        where("name like ? or en_name like ?", "%#{query}%", "%#{query}%")
    end

    def for_combo_json
        attributes
    end
end
