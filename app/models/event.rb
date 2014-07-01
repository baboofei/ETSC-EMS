class Event < ActiveRecord::Base
  attr_accessible :category, :content, :title
end
