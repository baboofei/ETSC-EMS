# encoding: utf-8
class QuoteItem < ActiveRecord::Base
    require "reusable"
    include Reusable
    attr_accessible :currency_id, :custom_tax, :description, :discount, :discount_to, :divide_1, :divide_2, :exchange_rate, :inner_id, :item_total_amount, :item_total_currency_id, :leaf, :original_currency_id, :original_exchange_rate, :original_unit_price, :parent_id, :price_source, :product_id, :product_model, :product_name, :quantity, :quantity_2, :quote_id, :system_discount, :system_price, :times_1, :times_2, :total, :unit_price, :vendor_unit_id

    belongs_to :quote
    belongs_to :vendor_unit
    belongs_to :original_currency, :class_name => 'Currency', :foreign_key => 'original_currency_id'
    belongs_to :currency, :class_name => 'Currency', :foreign_key => 'currency_id'
    belongs_to :product

    def self.in_quote(quote_id)
        where("quote_id = ?", quote_id)
    end

    def for_grid_json
        attr = attributes
        attr['vendor_unit_id'] = vendor_unit.id
        attr['vendor_unit_name'] = vendor_unit.name
        attr['original_currency_name'] = original_currency.name if original_currency
        attr['currency_name'] = currency.name if currency
        attr['leaf'] = (leaf == "1")
        attr
    end

    def for_tree_json
        #binding.pry
        #因为进到这里来的都是parent_id是0的，所以在这里递归找叶子
        attr = attributes
        attr['vendor_unit_id'] = vendor_unit.id
        attr['vendor_unit_name'] = vendor_unit.name
        attr['original_currency_name'] = original_currency.name if original_currency
        attr['currency_name'] = currency.name if currency
        #binding.pry

        if leaf == "1"
            attr['leaf'] = true
        else
            attr['leaf'] = false
            children_array = []
            same_quote_items = QuoteItem.where("quote_id = ?", quote_id).all
            same_quote_items.each do |quote_item|
                if quote_item.inner_id.include?("-") && (quote_item.inner_id.gsub(/-\d+$/, "") == inner_id)
                    children_array << quote_item.for_tree_json
                end
            end
            attr['children'] = children_array
        end
        attr
    end


# @param [String] tree_string 树的结构
# @param [String] quote_id 报价ID
    def self.create_with_tree_string(tree_string, quote_id)
        #先把相关Quote下的项全删掉
        QuoteItem.delete_all(["quote_id = ?", quote_id])
        #再看有多少新来的，加回去
        #binding.pry
        quote_item_array = JSON.parse(tree_string)
        #binding.pry
        if quote_item_array.size > 0
            quote_item_array.each do |quote_item|
                QuoteItem.create_with(quote_item, quote_id)
            end
        end
    end

    def self.create_with(params, quote_id)
        item = "报价项"
        quote_item = QuoteItem.new
        message = $etsc_create_ok

        fields_to_be_updated = %w(inner_id description product_id product_model product_name vendor_unit_id quantity
            quantity_2 original_unit_price original_currency_id original_exchange_rate times_1 divide_1 currency_id
            exchange_rate unit_price discount discount_to custom_tax total leaf times_2 divide_2 system_price
            system_discount item_total_amount item_total_currency_id parent_id
        )
        fields_to_be_updated.each do |field|
            quote_item[field] = params[field]
        end
        quote_item.quote_id = quote_id
        quote_item.save
        return {success: true, message: "#{item}#{message}"}
    end

    def self.get_no_contract_quotes_with(product_model)
        start_time = "2014-01-01"
        end_time = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")
        possible_quotes = where("products.model like ?", "%#{product_model}%").includes(:product)
        .where("contracts.quote_id is null").includes(:quote => :contracts)
        #.where("quotes.created_at > ? and quotes.created_at < ?", start_time, end_time)

        return possible_quotes
    end

end
