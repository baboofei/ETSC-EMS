# encoding = utf-8
class Currency < ActiveRecord::Base
    attr_accessible :exchange_rate, :name
    has_many :quotes
    has_many :fif_by_quotes, :class_name => 'Quote', :foreign_key => 'fif_currency_id'

    has_many :original_quote_items, :class_name => 'QuoteItem', :foreign_key => 'original_currency_id'
    has_many :quote_items, :class_name => 'QuoteItem', :foreign_key => 'currency_id'

    has_many :vendor_units, :class_name => 'VendorUnit', :foreign_key => 'currency_id'
    has_many :products

    has_many :admin_inventories

    has_many :contracts

    has_many :express_sheets

    def for_list_json
        attributes
    end

    def self.create_or_update_with(params, user_id)
        item = "汇率"
        message = $etsc_update_ok
        currency = self.find(params['currency_id'])
        currency.exchange_rate = params['exchange_rate']
        currency.save
        return {success: true, message: "#{item}#{message}"}
    end

end
