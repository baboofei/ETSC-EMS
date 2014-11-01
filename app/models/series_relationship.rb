class SeriesRelationship < ActiveRecord::Base
  attr_accessible :main_series_id, :related_series_id
end
