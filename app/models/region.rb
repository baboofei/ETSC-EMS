class Region < ActiveRecord::Base
    attr_accessible :en_name, :name
    has_many :countries
end
