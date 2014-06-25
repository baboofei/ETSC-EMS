# encoding: utf-8
class VendorUnit < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :city_id, :comment, :en_addr, :en_intro, :en_name, :fax, :intro, :is_partner, :is_producer, :is_seller, :logo_url, :name, :phone, :postcode, :short_code, :short_name, :site, :user_id
    scope :partner, where(:is_partner => true)
    scope :seller, where(:is_seller => true)
    scope :producer, where(:is_producer => true)

    belongs_to :city

    #has_many :vendor_unit_aliases
    has_many :unit_aliases, :class_name => "VendorUnitAlias", :foreign_key => "vendor_unit_id"

    has_many :vendors
    has_many :goods, :class_name => 'Product', :foreign_key => 'seller_vendor_unit_id'#改了语义词，销售的商品
    has_many :products, :class_name => 'Product', :foreign_key => 'producer_vendor_unit_id'#改了语义词，生产的商品
    #工厂被推荐和销售日志的多对多
    has_many :recommended_vendor_units_salelogs, :class_name => 'RecommendedProductsSalelog', :foreign_key => 'vendor_unit_id'
    has_many :be_recommended_in, :through => :recommended_vendor_units_salelogs, :source => :salelog

    has_many :quote_items
    belongs_to :default_currency_id, :class_name => 'Currency', :foreign_key => 'currency_id'

    has_many :owned_admin_items, :class_name => 'AdminInventory', :foreign_key => 'ownership'
    has_many :sold_admin_items, :class_name => 'AdminInventory', :foreign_key => 'vendor_unit_id'

    #工厂和采购多对多
    has_many :purchasers_vendor_units, :class_name => 'PurchasersVendorUnit', :foreign_key => 'vendor_unit_id'
    has_many :purchasers, :through => :purchasers_vendor_units, :source => :user
    #工厂和商务多对多
    has_many :businesses_vendor_units, :class_name => 'BusinessesVendorUnit', :foreign_key => 'vendor_unit_id'
    has_many :businesses, :through => :businesses_vendor_units, :source => :user
    #工厂和技术多对多
    has_many :supporters_vendor_units, :class_name => 'SupportersVendorUnit', :foreign_key => 'vendor_unit_id'
    has_many :supporters, :through => :supporters_vendor_units, :source => :user

    #工厂和“父工厂”一对多
    has_many :children, :class_name => 'VendorUnit', :foreign_key => :parent_id
    belongs_to :parent, :class_name => 'VendorUnit', :foreign_key => :parent_id

    #销售厂家和工作组多对多
    has_many :groups_vendor_units
    has_many :groups, :through => :groups_vendor_units

    #快递单多态
    has_one :express_sheet, :as => :unit_receivable

    has_many :p_inquires

    def self.query_by(query)
        where("vendor_units.name like ? or vendor_units.en_name like ? or vendor_units.short_code like ? or vendor_unit_aliases.unit_alias like ?", "%#{query}%", "%#{query}%", "%#{query}%", "%#{query}%").includes(:unit_aliases)
    end

    def for_grid_json
        attr = attributes
        attr['name|en_name|unit_aliases>unit_alias|short_code'] = attributes['name']
        attr['unit_aliases>unit_alias'] = unit_aliases.map(&:unit_alias).join("、")
        attr['parent_name'] = parent.blank? ? "" : parent.name
        attr['city>name'] = city.blank? ? "" : city.name
        attr['purchasers>id'] = purchasers.map(&:id).join('|')
        attr['purchasers>name'] = purchasers.map(&:name).join('、')
        attr['businesses>id'] = businesses.map(&:id).join('|')
        attr['businesses>name'] = businesses.map(&:name).join('、')
        attr['supporters>id'] = supporters.map(&:id).join('|')
        attr['supporters>name'] = supporters.map(&:name).join('、')
        #名称不显示在别称里
        vendor_unit_aliases_id_array = []
        vendor_unit_aliases_name_array = []
        unit_aliases.each do |vendor_unit_alias|
            if vendor_unit_alias.unit_alias != name
                vendor_unit_aliases_id_array << vendor_unit_alias.id
                vendor_unit_aliases_name_array << vendor_unit_alias.unit_alias
            end
        end
        attr['unit_aliases>id'] = vendor_unit_aliases_id_array.join('|')
        attr['unit_aliases>unit_alias'] = vendor_unit_aliases_name_array.join('、')
        attr
    end

    def for_combo_json
        attr = attributes
        attr['name'] = attributes['en_name'].blank? ? attributes['name'] : "#{attributes['en_name']}(#{attributes['name']})"
        attr
    end

    def for_full_combo_json
        attr = attributes
        attr['name'] = attributes['en_name'].blank? ? attributes['name'] : "#{attributes['en_name']}(#{attributes['name']})"
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "供应商单位"
        if params[:id].blank?
            #新增时判断重名只看name
            if VendorUnit.where("name = ?", params['name|en_name|unit_aliases>unit_alias|short_code']).size > 0
                return {success: false, :message => $etsc_duplicate_unit_name}
            else
                vendor_unit = VendorUnit.new
                message = $etsc_create_ok
            end
        else
            #修改时判断重名要看name和id
            if VendorUnit.where("name = ? and id != ?", params['name|en_name|unit_aliases>unit_alias|short_code'], params[:id]).size > 0
                return {:success => false, :message => $etsc_duplicate_unit_name}
            else
                vendor_unit = VendorUnit.find(params[:id])
                message = $etsc_update_ok
            end
        end

        fields_to_be_updated = %w(en_name short_code parent_id city_id postcode addr en_addr intro en_intro bank_info
            established_at scale competitor phone fax postcode site major_product lead_time term product_quality
            service_quality currency_id delivery_quality level comment
        )
        fields_to_be_updated.each do |field|
            vendor_unit[field] = params[field]
        end
        #binding.pry
        vendor_unit.user_id = user_id
        vendor_unit.name = params['name|en_name|unit_aliases>unit_alias|short_code']
        vendor_unit.does_inherit = (params['does_inherit'] == "on")

        vendor_unit.is_partner = (params['is_partner'] == "on")
        vendor_unit.is_producer = (params['is_producer'] == "on")
        vendor_unit.is_seller = (params['is_seller'] == "on")
        vendor_unit.save

        #每新增一个，就“分”给NPS的几个组
        GroupsVendorUnit.delete_all("vendor_unit_id = #{vendor_unit.id}")
        Group.where("name like 'NPS%'").each do |group|
            groups_vendor_unit = GroupsVendorUnit.new
            groups_vendor_unit.group_id = group.id
            groups_vendor_unit.vendor_unit_id = vendor_unit.id
            groups_vendor_unit.save
        end

        #几个负责人单独存
        if params[:id] != ""
            SupportersVendorUnit.delete_all("vendor_unit_id = #{params[:id]}")
            PurchasersVendorUnit.delete_all("vendor_unit_id = #{params[:id]}")
            BusinessesVendorUnit.delete_all("vendor_unit_id = #{params[:id]}")
            vendor_unit_id = params[:id].to_i
        else
            vendor_unit_id = vendor_unit.id
        end
        supporter_array = params['supporter_ids'].split("|")
        supporter_array.each do |supporter|
            supporters_vendor_unit = SupportersVendorUnit.new
            supporters_vendor_unit.user_id = supporter
            supporters_vendor_unit.vendor_unit_id = vendor_unit_id
            supporters_vendor_unit.save
        end
        purchaser_array = params['purchaser_ids'].split("|")
        purchaser_array.each do |purchaser|
            purchasers_vendor_unit = PurchasersVendorUnit.new
            purchasers_vendor_unit.user_id = purchaser
            purchasers_vendor_unit.vendor_unit_id = vendor_unit_id
            purchasers_vendor_unit.save
        end
        business_array = params['business_ids'].split("|")
        business_array.each do |business|
            businesses_vendor_unit = BusinessesVendorUnit.new
            businesses_vendor_unit.user_id = business
            businesses_vendor_unit.vendor_unit_id = vendor_unit_id
            businesses_vendor_unit.save
        end

        #别称单独存
        if params[:id] != ""
            VendorUnitAlias.delete_all("vendor_unit_id = #{params[:id]}")
            vendor_unit_id = params[:id].to_i
        else
            venodr_unit_id = vendor_unit.id
        end
        #本名也作为别称的一条存起来
        alias_array = params['unit_aliases>unit_alias'].multi_split << params['name|en_name|unit_aliases>unit_alias|short_code']
        alias_array.each do |unit_alias|
            vendor_unit_alias_params = {
                :vendor_unit_id => vendor_unit_id,
                :unit_alias => unit_alias
            }
            VendorUnitAlias.create_or_update_with(vendor_unit_alias_params, user_id)
        end

        return {:success => true, :message => "#{item}#{message}", :id => vendor_unit.id}

    end

    def self.create_mini_with(params, user_id)
        item = "供应商单位"
        vendor_unit = VendorUnit.new
        message = $etsc_create_ok

        fields_to_be_updated = %w(name comment)
        fields_to_be_updated.each do |field|
            vendor_unit[field] = params[field]
        end
        vendor_unit.user_id = user_id
        #因为这里肯定不会有城市传过来，所以先给默认一个
        vendor_unit.city_id = 999
        #币种也默认成人民币
        vendor_unit.currency_id = 11
        vendor_unit.save

        #每新增一个，就“分”给NPS的几个组
        GroupsVendorUnit.delete_all("vendor_unit_id = #{vendor_unit.id}")
        Group.where("name like 'NPS%'").each do |group|
            groups_vendor_unit = GroupsVendorUnit.new
            groups_vendor_unit.group_id = group.id
            groups_vendor_unit.vendor_unit_id = vendor_unit.id
            groups_vendor_unit.save
        end

        return {:success => true, :message => "#{item}#{message}", :id => vendor_unit.id}
    end
end