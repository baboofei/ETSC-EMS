EIMV5::Application.routes.draw do
  get "personal_messages/get_grid_personal_messages"

  #get "quotes/get_grid_quotes"

  get "remind/get_grid_reminds"

  get "our_companies/our_company_list"

  get "products/get_combo_products"

  get "vendor_units/get_combo_vendor_units"

  get "customers_salecases/save_customers_salecases"

  get "salelogs/get_salelogs"

  get "salecases/get_grid_salecases"

  get "stores/store_privileges"

  #get "contract/index"

  #match '/login/login' => 'login#login'
  #match '/login/verify' => 'login#verify'
  
  #match '/users/function_tree/tree' => 'users#function_tree'
  #match '/users/etsc_print' => 'users#etsc_print'
  #match '/users/fake_for_salecase' => 'users#fake_for_salecase'
  #match '/users/fake_for_salelog' => 'users#fake_for_salelog'
  #match '/users/fake_for_mini_customer' => 'users#fake_for_mini_customer'
  #match '/users/fake_for_customer' => 'users#fake_for_customer'
  #match '/users/fake_for_business_contact' => 'users#fake_for_business_contact'
  #
  #match '/users/fake_for_salelog_process' => 'users#fake_for_salelog_process'
  #match '/users/fake_for_lead' => 'users#fake_for_lead'
  #match '/users/fake_for_application' => 'users#fake_for_application'
  #match '/users/fake_for_customer_unit_sort' => 'users#fake_for_customer_unit_sort'
  #match '/users/fake_for_salecase_cancel_reason' => 'users#fake_for_salecase_cancel_reason'
  #
  #match '/users/fake_for_customer_unit' => 'users#fake_for_customer_unit'
  #match '/users/fake_for_business_unit' => 'users#fake_for_business_unit'
  #match '/users/fake_for_vendor_unit' => 'users#fake_for_vendor_unit'
  #
  #match '/users/fake_for_city' => 'users#fake_for_city'
  #match '/users/fake_for_contract' => 'users#fake_for_contract'
  #match '/users/fake_for_contract_item' => 'users#fake_for_contract_item'
  #match '/users/fake_for_contract_history' => 'users#fake_for_contract_history'
  #match '/users/fake_for_contract_chart' => 'users#fake_for_contract_chart'
  #
  #match '/users/fake_for_contract_status' => 'users#fake_for_contract_status'
  #match '/users/fake_for_send_status' => 'users#fake_for_send_status'
  #match '/users/fake_for_check_and_accept_status' => 'users#fake_for_check_and_accept_status'
  #
  #match '/users/fake_for_contract_type' => 'users#fake_for_contract_type'
  #match '/users/fake_for_requirement_sort' => 'users#fake_for_requirement_sort'
  #
  #match '/users/fake_for_collection' => 'users#fake_for_collection'
  #match '/users/fake_for_receivable' => 'users#fake_for_receivable'
  #
  #match '/users/fake_for_currency' => 'users#fake_for_currency'
  #match '/users/fake_for_product' => 'users#fake_for_product'
  #
  #match '/users/fake_for_term' => 'users#fake_for_term'
  #match '/users/fake_for_pay_mode' => 'users#fake_for_pay_mode'
  #
  #match '/users/fake_for_quote' => 'users#fake_for_quote'
  #match '/users/fake_for_quote_item' => 'users#fake_for_quote_item'
  #
  #match '/users/fake_for_combo_our_company' => 'users#fake_for_combo_our_company'
  #match '/users/fake_for_combo_sale' => 'users#fake_for_combo_sale'
  #match '/users/fake_for_quote_type' => 'users#fake_for_quote_type'
  #match '/users/fake_for_quote_language' => 'users#fake_for_quote_language'
  #match '/users/fake_for_quote_format' => 'users#fake_for_quote_format'
  #
  #match '/users/fake_for_all_dict' => 'users#fake_for_all_dict'
  #match '/users/fake_jsonp' => 'users#fake_jsonp'

  #以下是真·路由
  match ':controller/:action/list.json'
  match 'calendars/rest_calendar/:id' => 'calendars#rest_calendar'
  match 'calendars/rest_calendar' => 'calendars#rest_calendar'
  match ':controller/:action'
  match 'application/download/:file_type/:file_name' => 'application#download'
  match 'login' => 'index#index'

  resources :users
  root :to => 'site#index'
end
