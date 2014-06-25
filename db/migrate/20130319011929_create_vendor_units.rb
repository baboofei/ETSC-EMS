class CreateVendorUnits < ActiveRecord::Migration
    def change
        create_table :vendor_units do |t|
            t.string :name
            t.string :en_name
            t.string :short_code
            t.datetime :established_at #创立时间
            t.integer :scale #企业人数
            t.string :competitor #竞争对手
            t.integer :city_id
            t.string :addr
            t.string :postcode
            t.string :en_addr
            t.string :site
            t.string :phone
            t.string :fax
            t.boolean :is_partner
            t.boolean :is_producer
            t.boolean :is_seller
            t.string :logo_url
            t.text :intro
            t.text :en_intro
            t.string :major_product
            t.text :comment
            t.integer :currency_id #默认币种，快速增产品的时候用
            t.integer :user_id
            t.integer :level
            t.text :bank_info
            t.string :lead_time #供货周期
            t.text :term #商务条款
            t.string :product_quality #产品质量
            t.string :service_quality #服务品质
            t.string :delivery_quality #发货速度
            t.string :price_quality #价格贵贱
            t.integer :parent_id
            t.boolean :does_inherit
            t.timestamps
        end
    end
end
