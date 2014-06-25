class Country < ActiveRecord::Base
    attr_accessible :en_name, :name, :region_id

    belongs_to :region
    has_many :areas
end
