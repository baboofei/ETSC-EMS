class BusinessContactsSalecase < ActiveRecord::Base
    attr_accessible :business_contact_id, :salecase_id

    belongs_to :salecase
    belongs_to :business_contact

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.new_or_save_with(params)
        business_contact_salecase = BusinessContactsSalecase.new
        business_contact_salecase.business_contact_id = params[:business_contact_id]
        business_contact_salecase.salecase_id = params[:salecase_id]
        business_contact_salecase.save
    end
end
