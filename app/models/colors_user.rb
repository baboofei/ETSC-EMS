class ColorsUser < ActiveRecord::Base
  # attr_accessible :title, :body
    belongs_to :color
    belongs_to :user
end
