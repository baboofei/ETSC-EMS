class Prvc < ActiveRecord::Base
    attr_accessible :area_id, :name, :user_id
    has_many :cities
    belongs_to :area
end
