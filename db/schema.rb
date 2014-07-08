# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140704012855) do

  create_table "accessories", :force => true do |t|
    t.string   "url"
    t.string   "thumbnail_url"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "accessories_products", :id => false, :force => true do |t|
    t.integer  "accessory_id"
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "admin_inventories", :force => true do |t|
    t.string   "name"
    t.string   "model"
    t.text     "description"
    t.text     "sn"
    t.text     "number"
    t.integer  "financial_type"
    t.integer  "inventory_type"
    t.integer  "inventory_level"
    t.integer  "keep_at"
    t.decimal  "current_quantity", :precision => 10, :scale => 2
    t.string   "count_unit"
    t.decimal  "buy_price",        :precision => 12, :scale => 2
    t.decimal  "financial_price",  :precision => 12, :scale => 2
    t.integer  "currency_id"
    t.decimal  "rmb",              :precision => 12, :scale => 2
    t.string   "state"
    t.string   "project"
    t.integer  "keeper_user_id"
    t.integer  "buyer_user_id"
    t.integer  "ownership"
    t.integer  "vendor_unit_id"
    t.integer  "vendor_id"
    t.text     "comment"
    t.string   "apply_for_sn"
    t.integer  "in_stock_source"
    t.integer  "out_stock_source"
    t.datetime "expire_at"
    t.integer  "user_id"
    t.datetime "created_at",                                      :null => false
    t.datetime "updated_at",                                      :null => false
  end

  create_table "admin_inventory_histories", :force => true do |t|
    t.datetime "act_at"
    t.integer  "before_inventory_id"
    t.integer  "after_inventory_id"
    t.integer  "user_id"
    t.string   "act_type"
    t.string   "project"
    t.text     "natural_language"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "areas", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "country_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "blocks", :force => true do |t|
    t.string   "name"
    t.string   "controller_name"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "business_contacts", :force => true do |t|
    t.integer  "business_unit_id"
    t.string   "name"
    t.string   "en_name"
    t.string   "phone"
    t.string   "mobile"
    t.string   "fax"
    t.string   "email"
    t.string   "addr"
    t.string   "en_addr"
    t.string   "postcode"
    t.string   "im"
    t.string   "department"
    t.string   "position"
    t.text     "comment"
    t.integer  "user_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "business_contacts_salecases", :id => false, :force => true do |t|
    t.integer  "business_contact_id"
    t.integer  "salecase_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "business_unit_aliases", :force => true do |t|
    t.string   "unit_alias"
    t.integer  "business_unit_id"
    t.integer  "user_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "business_units", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "city_id"
    t.string   "addr"
    t.string   "en_addr"
    t.string   "postcode"
    t.string   "site"
    t.text     "comment"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "business_units_salecases", :id => false, :force => true do |t|
    t.integer  "business_unit_id"
    t.integer  "salecase_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "businesses_vendor_units", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "vendor_unit_id"
  end

  create_table "calendars", :force => true do |t|
    t.integer  "color_id"
    t.string   "title"
    t.datetime "start_at"
    t.datetime "end_at"
    t.text     "comment"
    t.decimal  "remind",     :precision => 10, :scale => 0
    t.boolean  "is_all_day"
    t.boolean  "is_private"
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
  end

  create_table "cities", :force => true do |t|
    t.string   "name"
    t.integer  "prvc_id"
    t.string   "en_name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "collections", :force => true do |t|
    t.date     "received_at"
    t.decimal  "amount",              :precision => 10, :scale => 2
    t.decimal  "compensation_amount", :precision => 10, :scale => 2
    t.integer  "contract_id"
    t.text     "reason"
    t.integer  "user_id"
    t.boolean  "is_history"
    t.datetime "created_at",                                         :null => false
    t.datetime "updated_at",                                         :null => false
  end

  create_table "colors", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "colors_users", :id => false, :force => true do |t|
    t.integer  "color_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "contract_histories", :force => true do |t|
    t.string   "item"
    t.integer  "old_id"
    t.integer  "new_id"
    t.integer  "user_id"
    t.text     "reason"
    t.text     "natural_language"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "contract_items", :force => true do |t|
    t.integer  "product_id"
    t.integer  "purchase_order_id"
    t.string   "serial_number"
    t.integer  "quantity"
    t.integer  "send_status"
    t.date     "appointed_leave_factory_at"
    t.date     "expected_leave_factory_at"
    t.date     "actually_leave_factory_at"
    t.date     "leave_etsc_at"
    t.date     "reach_customer_at"
    t.date     "check_and_accept_at"
    t.integer  "check_and_accept_status"
    t.integer  "warranty_term_id"
    t.string   "reason"
    t.integer  "contract_id"
    t.integer  "commodity_id"
    t.integer  "inner_id"
    t.integer  "user_id"
    t.boolean  "is_history"
    t.datetime "created_at",                 :null => false
    t.datetime "updated_at",                 :null => false
  end

  create_table "contracts", :force => true do |t|
    t.string   "number"
    t.string   "customer_number"
    t.string   "summary"
    t.integer  "signer_user_id"
    t.integer  "dealer_user_id"
    t.integer  "customer_unit_id"
    t.integer  "end_user_customer_id"
    t.integer  "buyer_customer_id"
    t.integer  "business_unit_id"
    t.integer  "business_contact_id"
    t.integer  "our_company_id"
    t.integer  "requirement_id"
    t.integer  "currency_id"
    t.string   "state"
    t.decimal  "sum",                  :precision => 10, :scale => 2
    t.decimal  "exchange_rate",        :precision => 7,  :scale => 2
    t.decimal  "rmb",                  :precision => 10, :scale => 2
    t.integer  "pay_mode_id"
    t.boolean  "does_need_install"
    t.boolean  "does_need_lc"
    t.datetime "receive_lc_at"
    t.string   "lc_number"
    t.integer  "invoice"
    t.decimal  "profit",               :precision => 10, :scale => 2
    t.decimal  "total_collection",     :precision => 10, :scale => 2
    t.text     "comment"
    t.integer  "quote_id"
    t.integer  "salelog_id"
    t.integer  "contract_type"
    t.integer  "group_id"
    t.datetime "signed_at"
    t.datetime "invoiced_at"
    t.integer  "contractable_id"
    t.string   "contractable_type"
    t.datetime "created_at",                                          :null => false
    t.datetime "updated_at",                                          :null => false
  end

  create_table "contracts_old_fields", :force => true do |t|
    t.integer  "customer_unit_id"
    t.integer  "end_user_customer_id"
    t.integer  "buyer_customer_id"
    t.integer  "business_unit_id"
    t.integer  "business_contact_id"
    t.integer  "signer_user_id"
    t.integer  "dealer_user_id"
    t.integer  "our_company_id"
    t.string   "etsc_number"
    t.string   "customer_number"
    t.string   "summary"
    t.integer  "requirement_sort"
    t.integer  "status"
    t.integer  "currency_id"
    t.decimal  "sum",                  :precision => 12, :scale => 2
    t.decimal  "exchange_rate",        :precision => 12, :scale => 2
    t.decimal  "rmb",                  :precision => 12, :scale => 2
    t.integer  "pay_mode_id"
    t.boolean  "does_need_install"
    t.datetime "received_lc_on"
    t.integer  "invoice"
    t.decimal  "profit",               :precision => 12, :scale => 2
    t.decimal  "total_collection",     :precision => 12, :scale => 2
    t.text     "reason"
    t.text     "remark"
    t.integer  "flow_status"
    t.integer  "quote_id"
    t.integer  "sale_log_id"
    t.integer  "work_task_id"
    t.integer  "contract_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "countries", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "region_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "currencies", :force => true do |t|
    t.string   "name"
    t.decimal  "exchange_rate", :precision => 12, :scale => 2
    t.datetime "created_at",                                   :null => false
    t.datetime "updated_at",                                   :null => false
  end

  create_table "customer_unit_aliases", :force => true do |t|
    t.string   "unit_alias"
    t.integer  "customer_unit_id"
    t.integer  "user_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "customer_units", :force => true do |t|
    t.string   "name"
    t.integer  "city_id"
    t.string   "addr"
    t.string   "postcode"
    t.string   "en_name"
    t.string   "en_addr"
    t.integer  "cu_sort"
    t.integer  "user_id"
    t.string   "site"
    t.integer  "credit_level", :default => 0
    t.text     "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "customer_units_flow_sheets", :id => false, :force => true do |t|
    t.integer  "customer_unit_id"
    t.integer  "flow_sheet_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "customer_units_salecases", :id => false, :force => true do |t|
    t.integer  "customer_unit_id"
    t.integer  "salecase_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "customers", :force => true do |t|
    t.integer  "customer_unit_id"
    t.string   "name"
    t.string   "en_name"
    t.string   "mobile"
    t.string   "phone"
    t.string   "fax"
    t.string   "email"
    t.string   "im"
    t.string   "department"
    t.string   "position"
    t.text     "comment"
    t.integer  "user_id"
    t.integer  "lead_id"
    t.string   "addr",             :limit => 100
    t.string   "postcode",         :limit => 20
    t.integer  "group_id"
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at"
    t.string   "en_addr",          :limit => 200
    t.integer  "is_obsolete",                     :default => 0
  end

  create_table "customers_flow_sheets", :id => false, :force => true do |t|
    t.integer  "customer_id"
    t.integer  "flow_sheet_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "customers_prod_applications", :id => false, :force => true do |t|
    t.integer  "customer_id"
    t.integer  "prod_application_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "customers_salecases", :id => false, :force => true do |t|
    t.integer  "customer_id"
    t.integer  "salecase_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "customers_users", :id => false, :force => true do |t|
    t.integer  "customer_id"
    t.integer  "user_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "departments", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "superior"
    t.integer  "manager_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "departments_managers", :id => false, :force => true do |t|
    t.integer  "department_id"
    t.integer  "user_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "departments_users", :id => false, :force => true do |t|
    t.integer  "department_id"
    t.integer  "user_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "dictionaries", :force => true do |t|
    t.string   "data_type"
    t.string   "display"
    t.string   "value"
    t.boolean  "available",  :default => true, :null => false
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
  end

  create_table "editable_roles_stores", :id => false, :force => true do |t|
    t.integer  "editable_role_id"
    t.integer  "store_id"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "elements", :force => true do |t|
    t.string   "element_id"
    t.integer  "function_id"
    t.string   "description"
    t.string   "default_value"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "elements_disable_roles", :id => false, :force => true do |t|
    t.integer  "element_id"
    t.integer  "disable_role_id"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "elements_functions", :id => false, :force => true do |t|
    t.integer  "element_id"
    t.integer  "function_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "elements_invisible_roles", :id => false, :force => true do |t|
    t.integer  "element_id"
    t.integer  "invisible_role_id"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  create_table "event_images_bak", :force => true do |t|
    t.integer  "event_id"
    t.string   "url"
    t.string   "thumbnail_url"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", :force => true do |t|
    t.string   "title"
    t.text     "content"
    t.integer  "category"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events_products_bak", :id => false, :force => true do |t|
    t.integer  "event_id"
    t.integer  "serial_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events_serials_bak", :id => false, :force => true do |t|
    t.integer  "event_id"
    t.integer  "serial_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "exhibitions", :force => true do |t|
    t.date    "start_on"
    t.date    "end_on"
    t.string  "name"
    t.string  "description"
    t.integer "city_id"
    t.string  "addr"
    t.string  "booth"
    t.string  "comment"
    t.integer "lead_id"
  end

  create_table "express_sheets", :force => true do |t|
    t.integer  "express_unit_id"
    t.string   "number"
    t.integer  "sender_user_id"
    t.string   "description"
    t.decimal  "cost",                   :precision => 10, :scale => 2
    t.integer  "currency_id"
    t.date     "send_at"
    t.string   "pdf_url"
    t.integer  "unit_receivable_id"
    t.string   "unit_receivable_type"
    t.integer  "person_receivable_id"
    t.string   "person_receivable_type"
    t.integer  "vestable_id"
    t.string   "vestable_type"
    t.string   "comment"
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
  end

  create_table "flow_sheets", :force => true do |t|
    t.string   "number"
    t.integer  "flow_sheet_type"
    t.decimal  "work_day",         :precision => 10, :scale => 0
    t.decimal  "waiting_day",      :precision => 10, :scale => 0
    t.string   "description"
    t.string   "state"
    t.integer  "priority"
    t.integer  "contract_id"
    t.string   "comment"
    t.integer  "deliver_by"
    t.integer  "deal_requirement"
    t.boolean  "is_in_warranty"
    t.datetime "created_at",                                      :null => false
    t.datetime "updated_at",                                      :null => false
  end

  create_table "flow_sheets_users", :id => false, :force => true do |t|
    t.integer  "flow_sheet_id"
    t.integer  "user_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "functions", :force => true do |t|
    t.integer  "block_id"
    t.string   "name"
    t.string   "description"
    t.string   "icon_class"
    t.integer  "parent_function_id"
    t.string   "controller"
    t.string   "ext_id"
    t.string   "widget"
    t.string   "signal"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "functions_roles", :id => false, :force => true do |t|
    t.integer  "function_id"
    t.integer  "role_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "groups", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "groups_users", :id => false, :force => true do |t|
    t.integer  "group_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "groups_vendor_units", :id => false, :force => true do |t|
    t.integer  "group_id"
    t.integer  "vendor_unit_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "m_inquires", :force => true do |t|
    t.string   "customer_unit_name"
    t.string   "name"
    t.string   "en_name"
    t.string   "email"
    t.string   "phone"
    t.string   "fax"
    t.string   "im"
    t.string   "mobile"
    t.string   "department"
    t.string   "position"
    t.string   "addr"
    t.string   "en_addr"
    t.string   "postcode"
    t.string   "comment"
    t.integer  "m_lead_id"
    t.integer  "user_id"
    t.integer  "customer_id"
    t.string   "detail",             :limit => 10000
    t.datetime "created_at",                          :null => false
    t.datetime "updated_at",                          :null => false
  end

  create_table "material_codes", :force => true do |t|
    t.string   "name"
    t.string   "code"
    t.string   "description",          :limit => 2000
    t.decimal  "manager_audit_amount",                 :precision => 10, :scale => 0
    t.decimal  "vp_audit_amount",                      :precision => 10, :scale => 0
    t.datetime "created_at",                                                          :null => false
    t.datetime "updated_at",                                                          :null => false
  end

  create_table "our_companies", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.string   "addr"
    t.string   "en_addr"
    t.string   "phone"
    t.string   "fax"
    t.string   "site"
    t.text     "bank_info"
    t.text     "vat_info"
    t.boolean  "use_for_contract"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "p_inquires", :force => true do |t|
    t.string   "customer_unit_name"
    t.string   "name"
    t.string   "en_name"
    t.string   "email"
    t.string   "phone"
    t.string   "fax"
    t.string   "im"
    t.string   "mobile"
    t.string   "department"
    t.string   "position"
    t.string   "addr"
    t.string   "en_addr"
    t.string   "postcode"
    t.string   "comment"
    t.integer  "vendor_unit_id"
    t.integer  "user_id"
    t.integer  "customer_id"
    t.string   "detail",             :limit => 10000
    t.datetime "created_at",                          :null => false
    t.datetime "updated_at",                          :null => false
  end

  create_table "partial_editable_roles_stores", :id => false, :force => true do |t|
    t.integer  "partial_editable_role_id"
    t.integer  "store_id"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

  create_table "pay_modes", :force => true do |t|
    t.string   "name"
    t.integer  "credit_level"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "permissions", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "personal_messages", :force => true do |t|
    t.integer  "sender_user_id"
    t.integer  "receiver_user_id"
    t.text     "content"
    t.string   "sn"
    t.datetime "send_at"
    t.datetime "read_at"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "pop_unit_aliases", :force => true do |t|
    t.string   "unit_alias"
    t.integer  "pop_unit_id"
    t.integer  "user_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "pop_units", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "city_id"
    t.string   "addr"
    t.string   "en_addr"
    t.string   "postcode"
    t.string   "site"
    t.string   "comment"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "pops", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "pop_unit_id"
    t.string   "mobile"
    t.string   "phone"
    t.string   "fax"
    t.string   "email"
    t.string   "im"
    t.string   "department"
    t.string   "position"
    t.string   "comment"
    t.integer  "user_id"
    t.string   "postcode"
    t.string   "addr"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "prod_applications", :force => true do |t|
    t.string   "description"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "products", :force => true do |t|
    t.integer  "producer_vendor_unit_id"
    t.integer  "seller_vendor_unit_id"
    t.string   "model"
    t.string   "name"
    t.string   "en_name"
    t.string   "reference"
    t.text     "simple_description_cn"
    t.text     "simple_description_en"
    t.integer  "currency_id",                                                         :default => 11
    t.decimal  "custom_tax",                           :precision => 12, :scale => 2
    t.string   "tax_number"
    t.decimal  "price_in_list",                        :precision => 12, :scale => 2
    t.decimal  "price_from_vendor",                    :precision => 12, :scale => 2
    t.decimal  "price_to_market",                      :precision => 12, :scale => 2
    t.decimal  "price_in_site",                        :precision => 12, :scale => 2
    t.integer  "serial_id"
    t.integer  "user_id"
    t.text     "comment"
    t.integer  "is_obsolete",             :limit => 1
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "prvcs", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "area_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "purchase_orders", :force => true do |t|
    t.string   "number"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "purchasers_vendor_units", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "vendor_unit_id"
  end

  create_table "purchases", :force => true do |t|
    t.string   "contract_project"
    t.string   "contract_number"
    t.date     "sign_at"
    t.string   "seller"
    t.string   "name"
    t.string   "model"
    t.decimal  "quantity",             :precision => 10, :scale => 2
    t.string   "unit"
    t.decimal  "first_quoted",         :precision => 12, :scale => 2
    t.integer  "quoted_currency_id",                                  :default => 11, :null => false
    t.decimal  "unit_price",           :precision => 12, :scale => 2
    t.decimal  "price",                :precision => 12, :scale => 2
    t.decimal  "discount",             :precision => 12, :scale => 2
    t.integer  "purchase_currency_id",                                :default => 11, :null => false
    t.string   "invoice"
    t.string   "pay_method"
    t.date     "expected_pay_at"
    t.string   "pay_status"
    t.string   "invoice_status"
    t.string   "warranty"
    t.date     "expected_deliver_at"
    t.date     "actually_deliver_at"
    t.string   "deliver_place"
    t.string   "vendor_unit"
    t.string   "end_user"
    t.string   "user"
    t.text     "description"
    t.text     "comment"
    t.integer  "user_id"
    t.datetime "created_at",                                                          :null => false
    t.datetime "updated_at",                                                          :null => false
  end

  create_table "quote_items", :force => true do |t|
    t.integer  "parent_id"
    t.string   "inner_id"
    t.string   "leaf"
    t.integer  "quote_id"
    t.integer  "vendor_unit_id"
    t.integer  "product_id"
    t.integer  "quantity"
    t.integer  "quantity_2"
    t.text     "description"
    t.integer  "price_source"
    t.decimal  "original_unit_price",    :precision => 12, :scale => 2
    t.integer  "original_currency_id"
    t.decimal  "times_1",                :precision => 5,  :scale => 2
    t.decimal  "divide_1",               :precision => 5,  :scale => 2
    t.decimal  "unit_price",             :precision => 12, :scale => 2
    t.decimal  "times_2",                :precision => 5,  :scale => 2
    t.decimal  "divide_2",               :precision => 5,  :scale => 2
    t.decimal  "discount",               :precision => 12, :scale => 2
    t.decimal  "discount_to",            :precision => 12, :scale => 2
    t.decimal  "total",                  :precision => 12, :scale => 2
    t.decimal  "system_price",           :precision => 12, :scale => 2
    t.decimal  "system_discount",        :precision => 12, :scale => 2
    t.decimal  "original_exchange_rate", :precision => 12, :scale => 2
    t.integer  "currency_id"
    t.decimal  "exchange_rate",          :precision => 12, :scale => 2
    t.string   "product_name"
    t.string   "product_model"
    t.decimal  "item_total_amount",      :precision => 12, :scale => 2
    t.integer  "item_total_currency_id"
    t.decimal  "custom_tax",             :precision => 12, :scale => 2
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
  end

  create_table "quotes", :force => true do |t|
    t.integer  "customer_unit_id"
    t.integer  "customer_id"
    t.integer  "salelog_id"
    t.integer  "salecase_id"
    t.string   "number"
    t.integer  "currency_id"
    t.decimal  "total_discount",   :precision => 12, :scale => 2
    t.integer  "fif_currency_id"
    t.decimal  "fif",              :precision => 12, :scale => 2
    t.decimal  "vat",              :precision => 12, :scale => 2
    t.decimal  "other_cost",       :precision => 12, :scale => 2
    t.decimal  "total",            :precision => 12, :scale => 2
    t.integer  "sale_user_id"
    t.integer  "business_user_id"
    t.integer  "work_task_id"
    t.integer  "language"
    t.text     "request"
    t.integer  "quote_format"
    t.integer  "our_company_id"
    t.text     "term"
    t.text     "comment"
    t.string   "state"
    t.integer  "quote_type"
    t.integer  "group_id"
    t.text     "pdf"
    t.text     "summary"
    t.decimal  "rmb",              :precision => 12, :scale => 2
    t.decimal  "final_price",      :precision => 12, :scale => 2
    t.decimal  "declaration_fee",  :precision => 12, :scale => 2
    t.decimal  "max_custom_tax",   :precision => 5,  :scale => 2
    t.boolean  "does_count_ctvat"
    t.decimal  "x_discount",       :precision => 5,  :scale => 2
    t.integer  "quotable_id"
    t.string   "quotable_type"
    t.datetime "created_at",                                      :null => false
    t.datetime "updated_at",                                      :null => false
  end

  create_table "real_exchange_rates", :force => true do |t|
    t.date    "date"
    t.decimal "eur",  :precision => 12, :scale => 2
    t.decimal "gbp",  :precision => 12, :scale => 2
    t.decimal "usd",  :precision => 12, :scale => 2
    t.decimal "cad",  :precision => 12, :scale => 2
    t.decimal "jpy",  :precision => 12, :scale => 2
    t.decimal "hkd",  :precision => 12, :scale => 2
    t.decimal "ntd",  :precision => 12, :scale => 2
  end

  create_table "receivables", :force => true do |t|
    t.date     "expected_receive_at"
    t.decimal  "amount",              :precision => 10, :scale => 2
    t.integer  "contract_id"
    t.text     "reason"
    t.integer  "user_id"
    t.boolean  "is_history"
    t.datetime "created_at",                                         :null => false
    t.datetime "updated_at",                                         :null => false
  end

  create_table "received_equipments", :force => true do |t|
    t.integer  "flow_sheet_id"
    t.integer  "product_id"
    t.string   "sn"
    t.string   "symptom"
    t.date     "accepted_at"
    t.boolean  "is_in_warranty"
    t.string   "collect_account_number"
    t.string   "state"
    t.string   "comment"
    t.datetime "created_at",             :null => false
    t.datetime "updated_at",             :null => false
  end

  create_table "recommended_products_salelogs", :force => true do |t|
    t.integer  "product_id"
    t.integer  "vendor_unit_id"
    t.integer  "salelog_id"
    t.string   "customer_requirement"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
  end

  create_table "regions", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "reminds", :force => true do |t|
    t.text     "remind_text"
    t.boolean  "flag",        :default => false
    t.datetime "remind_at"
    t.string   "sn"
    t.integer  "user_id"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "roles_users", :id => false, :force => true do |t|
    t.integer  "role_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "salecases", :force => true do |t|
    t.string   "number"
    t.datetime "start_at"
    t.datetime "end_at"
    t.integer  "user_id"
    t.text     "comment"
    t.integer  "status"
    t.integer  "priority"
    t.decimal  "feasible",    :precision => 10, :scale => 0
    t.datetime "remind_at"
    t.boolean  "remind_flag"
    t.integer  "group_id"
    t.datetime "created_at",                                 :null => false
    t.datetime "updated_at",                                 :null => false
  end

  create_table "salelogs", :force => true do |t|
    t.integer  "process"
    t.datetime "contact_at"
    t.integer  "salecase_id"
    t.integer  "user_id"
    t.text     "comment"
    t.datetime "remind_at"
    t.datetime "expected_sign_at"
    t.integer  "quote_id"
    t.boolean  "remind_flag"
    t.integer  "wait_reason"
    t.integer  "complete_reason"
    t.text     "detail"
    t.text     "natural_language"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "scheduled_mails", :force => true do |t|
    t.integer  "sender"
    t.integer  "receiver"
    t.date     "mailed_at"
    t.string   "mail_type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "serial_relationships", :force => true do |t|
    t.integer  "main_serial_id"
    t.integer  "related_serial_id"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  create_table "serials", :force => true do |t|
    t.string   "brief"
    t.string   "name"
    t.integer  "type_id"
    t.text     "description"
    t.text     "application_in_site"
    t.text     "parameter_in_site"
    t.text     "feature"
    t.boolean  "is_recommend"
    t.boolean  "is_display"
    t.integer  "user_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "serials_solutions", :force => true do |t|
    t.integer  "solution_id"
    t.integer  "serial_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "service_logs", :force => true do |t|
    t.integer  "flow_sheet_id"
    t.date     "start_at"
    t.date     "end_at"
    t.integer  "inner_id"
    t.integer  "user_id"
    t.integer  "process"
    t.string   "content"
    t.string   "natural_language"
    t.string   "comment"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "solutions", :force => true do |t|
    t.string   "title"
    t.text     "content"
    t.string   "url"
    t.integer  "category"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stores", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.boolean  "is_hierarchy"
    t.boolean  "is_group_hierarchy"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "stores_copy", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.boolean  "is_hierarchy"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "stores_visible_roles", :id => false, :force => true do |t|
    t.integer  "store_id"
    t.integer  "visible_role_id"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "supporters_vendor_units", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "vendor_unit_id"
  end

  create_table "updates", :force => true do |t|
    t.string    "version"
    t.integer   "update_type"
    t.integer   "function_id"
    t.text      "description"
    t.timestamp "created_at",  :null => false
    t.datetime  "updated_at",  :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "reg_name"
    t.string   "name"
    t.string   "en_name"
    t.string   "email"
    t.string   "hashed_password"
    t.string   "salt"
    t.integer  "department_id"
    t.integer  "status",          :default => 1
    t.string   "extension"
    t.string   "mobile"
    t.string   "qq"
    t.string   "msn"
    t.string   "etsc_email"
    t.string   "elements"
    t.string   "first_page"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

  create_table "vendor_unit_aliases", :force => true do |t|
    t.string   "unit_alias"
    t.integer  "vendor_unit_id"
    t.integer  "user_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "vendor_units", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.string   "short_name"
    t.string   "short_code"
    t.datetime "established_at"
    t.integer  "scale"
    t.string   "competitor"
    t.integer  "city_id"
    t.string   "addr"
    t.string   "postcode"
    t.string   "en_addr"
    t.string   "site"
    t.string   "phone"
    t.string   "fax"
    t.boolean  "is_partner"
    t.boolean  "is_producer"
    t.boolean  "is_seller"
    t.string   "logo_url"
    t.text     "intro"
    t.text     "en_intro"
    t.string   "major_product"
    t.text     "comment"
    t.integer  "currency_id"
    t.integer  "user_id"
    t.integer  "level"
    t.text     "bank_info"
    t.string   "lead_time"
    t.text     "term"
    t.string   "product_quality"
    t.string   "service_quality"
    t.string   "delivery_quality"
    t.string   "price_quality"
    t.integer  "parent_id"
    t.boolean  "does_inherit"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "vendor_units_copy", :force => true do |t|
    t.string   "name"
    t.string   "en_name"
    t.string   "short_name"
    t.string   "short_code"
    t.datetime "established_at"
    t.integer  "scale"
    t.string   "competitor"
    t.integer  "city_id"
    t.string   "addr"
    t.string   "postcode"
    t.string   "en_addr"
    t.string   "site"
    t.string   "phone"
    t.string   "fax"
    t.boolean  "is_partner"
    t.boolean  "is_producer"
    t.boolean  "is_seller"
    t.string   "logo_url"
    t.text     "intro"
    t.text     "en_intro"
    t.string   "major_product"
    t.text     "comment"
    t.integer  "currency_id"
    t.integer  "user_id"
    t.integer  "level"
    t.text     "bank_info"
    t.string   "lead_time"
    t.text     "term"
    t.string   "product_quality"
    t.string   "service_quality"
    t.string   "delivery_quality"
    t.integer  "parent_id"
    t.boolean  "does_inherit"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "vendors", :force => true do |t|
    t.integer  "vendor_unit_id"
    t.string   "name"
    t.string   "en_name"
    t.string   "department"
    t.string   "position"
    t.string   "phone"
    t.string   "mobile"
    t.string   "im"
    t.string   "fax"
    t.string   "email"
    t.string   "comment"
    t.string   "addr"
    t.string   "postcode"
    t.string   "en_addr"
    t.string   "user_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "warranty_terms", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
