class AccessoriesProduct < ActiveRecord::Base
  attr_accessible :accessory_id, :product_id

  belongs_to :product
  belongs_to :accessory
end

