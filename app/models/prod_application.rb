class ProdApplication < ActiveRecord::Base
    attr_accessible :description, :user_id

    has_many :customers_prod_applications
    has_many :customers, :through => :customers_prod_applications

    #列给客户列表的“涉及应用”表头过滤
    def for_list_filter_json
        self.attributes
    end
end
