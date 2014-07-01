class Accessory < ActiveRecord::Base
  attr_accessible :description, :thumbnail_url, :url

  #产品和附件多对多
  has_many :accessories_products
  has_many :products, :through => :accessories_products

end
