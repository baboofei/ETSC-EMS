class OurCompany < ActiveRecord::Base
    attr_accessible :addr, :bank_info, :en_addr, :en_name, :fax, :name, :phone, :site, :use_for_contract, :vat_info

    has_many :quotes
    has_many :contracts

    def self.available
        where("use_for_contract = 1")
    end

    def for_list_json
        attributes
    end
end
