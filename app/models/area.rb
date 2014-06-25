class Area < ActiveRecord::Base
    attr_accessible :name, :user_id
    belongs_to :country
    has_many :prvcs

    scope :china, where(country_id: 1)
    scope :mainland, where("country_id = 1 and en_name not like '%Hong Kong%'")

    def for_list_json
        attributes
    end
end
