class CustomersSalecase < ActiveRecord::Base
    attr_accessible :customer_id, :salecase_id

    belongs_to :customer
    belongs_to :salecase

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.new_or_save_with(params)
        customer_salecase = CustomersSalecase.new
        customer_salecase.customer_id = params[:customer_id]
        customer_salecase.salecase_id = params[:salecase_id]
        customer_salecase.save
    end
end
