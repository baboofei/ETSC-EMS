# encoding = utf-8
class Product < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :currency_id, :custom_tax, :en_name, :model, :name, :price_from_vendor, :price_in_list, :price_in_site, :price_to_market, :producer_vendor_unit_id, :reference, :seller_vendor_unit_id, :serial_id, :simple_description_cn, :simple_description_en, :tax_number, :user_id

    belongs_to :seller, :class_name => 'VendorUnit', :foreign_key => 'seller_vendor_unit_id'#销售厂家
    belongs_to :producer, :class_name => 'VendorUnit', :foreign_key => 'producer_vendor_unit_id'#生产厂家
    #belongs_to :serial
    
    #产品被推荐和销售日志的多对多
    has_many :recommended_products_salelogs, :class_name => 'RecommendedProductsSalelog', :foreign_key => 'product_id'
    has_many :be_recommended_in, :through => :recommended_products_salelogs, :source => :salelog

    has_many :quote_items
    has_many :contract_items

    belongs_to :currency

    has_many :received_equipments

    #虚拟属性
    def display_name
        if name.include? model
            name
        elsif model.include? name
            model
        else
            model + " " + name
        end
    end

    #不会用它来写入别的属性，就不写了……
    #def display_name=(string)
    #end

    def self.query_by(query)
        where("name like ? or model like ? or reference like ?", "%#{query}%", "%#{query}%", "%#{query}%")
    end

    def self.in_vendor_unit(vendor_unit_id)
        where("producer_vendor_unit_id = ? or seller_vendor_unit_id = ?", vendor_unit_id, vendor_unit_id)
    end

    def for_combo_json
        attr = attributes
        attr['model'] = "#{display_name}" + (attributes['reference'].blank? ? "" : " [#{attributes['reference']}]")
        attr
    end

    def for_grid_json(user_id)
        attr = attributes
        attr['producer>(name|short_name|short_code)'] = producer.name unless producer.nil?
        attr['producer>id'] = producer.id unless producer.nil?
        attr['seller>(name|short_name|short_code)'] = seller.name unless seller.nil?
        attr['seller>id'] = seller.id unless seller.nil?
        if currency.blank?
            attr['currency_name'] = $etsc_empty_data
        else
            attr['currency_name'] = currency.name
        end
        attr
    end

    def self.create_or_update_with(params, user_id)
        item = "产品"
        #binding.pry
        if !params[:id].blank?
            product = Product.find(params[:id])
            message = $etsc_update_ok
        else
            product = Product.new
            message = $etsc_create_ok
        end

        #binding.pry
        case params['save_only']
            when 'info'
                fields_to_be_updated = %w(name model producer_vendor_unit_id seller_vendor_unit_id reference serial_id )
            when 'price'
                fields_to_be_updated = %w(currency_id price_in_list price_from_vendor price_to_market price_in_site custom_tax tax_number)
            when 'description'
                fields_to_be_updated = %w(simple_description_cn simple_description_en comment)
        end
        fields_to_be_updated.each do |field|
            product[field] = params[field]
        end
        product.user_id = user_id
        product.save

        return {:success => true, :message => "#{item}#{message}"}
    end

    def self.create_with(params, user_id)
        item = "产品"
        #binding.pry
        product = Product.new
        message = $etsc_create_ok

        fields_to_be_updated = %w(name model producer_vendor_unit_id seller_vendor_unit_id reference serial_id
                    currency_id price_in_list price_from_vendor price_to_market price_in_site custom_tax tax_number
                    simple_description_cn simple_description_en comment)
        fields_to_be_updated.each do |field|
            product[field] = params[field]
        end
        product.user_id = user_id
        product.save

        return {success: true, message: "#{item}#{message}"}
    end

    def self.create_mini_with(params, user_id)
        item = "产品"
        product = Product.new
        message = $etsc_create_ok

        fields_to_be_updated = %w(name model simple_description_cn simple_description_en)
        fields_to_be_updated.each do |field|
            product[field] = params[field]
        end
        product.seller_vendor_unit_id = params['vendor_unit_id']
        product.producer_vendor_unit_id = params['vendor_unit_id']
        product.user_id = user_id
        #因为这里肯定不会有币种传过来，所以先给默认一个
        product.currency_id = VendorUnit.find(params['vendor_unit_id']).currency_id ||= 11
        product.save

        return {:success => true, :message => "#{item}#{message}", :id => product.id}
    end
end
