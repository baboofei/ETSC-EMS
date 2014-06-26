class EnSiteController < ApplicationController
  layout "en_site"
  def index
  end

  def about
  end

  def products
    @prod_b_type_names = ProdBType.all.map {|p|  p.en_name}

    0.upto(7) {|i|
      prod_m_type_names = ProdMType.where("prod_b_type_id = ? and en_name is not null", i+1).map{|p| p.en_name}
      eval("@prod_m_type_" + i.to_s + "_names = prod_m_type_names")
    }
  end

  def partners
    @partners = VendorUnit.where("is_partner = ? and short_code != ?", 1, "").order("name")
#    @partners = Partner.all
  end

  def projects
  end

end
