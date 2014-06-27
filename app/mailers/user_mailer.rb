# encoding: UTF-8
#两种时间，一种是Date，一种是DateTime。前者<=的时候是含当天的，后者<=的时候是不含当天的
#所以决定前者用start_at和end_at，后者用from_time和to_time
#TODO 有些还没按这规则来
class UserMailer < ActionMailer::Base
    $obsoleted_user_ids = [47, 69] #离职的员工先这么写着吧，牵扯太多
    include ActionView::Helpers::SanitizeHelper
    #default :from => "hexawing@gmail.com",         #gmail邮箱，可用
    #default :from => "etsc@qq.com"         #公司QQ邮箱，可用
    #default :from => "1163726690@qq.com"         #商务QQ邮箱，可用
    #default :from => "hexawing@qq.com"         #私人QQ邮箱，可用
    default :from => %q("ETSC信息管理系统"<admin@etsc-tech.com>)   #263企业邮箱，可用
    #default :from => "hexawing@163.com"        #163私人邮箱，可用

    def welcome_email(user, sex, department, position)
        @new_user = user
        @sex = sex
        @department = department
        @position = position
        mail(:to => "all.list@etsc-tech.com",
             :subject => "欢迎新同事"
        )
    end

    def alert_email(alert_type)
        mail(:to => "[terrych@etsc-tech.com]",
            :subject => "系统异动--#{alert_type}!!!"
        )
    end

    def salelog_email(from_user, to_user)
        @salelogs = Salelog.last_week.by_user_or_group(from_user.id)
        mail(:to => to_user.etsc_email,
            :subject => "#{from_user.name}销售工作报告#{(Date.today - 7).strftime("%Y-%m-%d")}至#{Date.today.strftime("%Y-%m-%d")}"
        )
    end

    def stock_in_pdf_email(to_user, subject, file_array)
        file_array.each do |file|
            file_name = file.split("/")[-1]
            attachments[file_name] = File.read file
        end
        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => to_user.etsc_email,
            :subject => subject,
        )
    end

    def purchase_list_xls_email(to_user, subject, file_array)
        file_array.each do |file|
            file_name = file.split("/")[-1]
            attachments[file_name] = File.read file
        end
        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => to_user.etsc_email,
             :subject => subject,
        )
    end

    #签署合同时的邮件提醒
    def contract_sign_email(contract, to_user)
        @contract = contract
        vendor_units = VendorUnit.where("contracts.id = ? and contract_items.is_history is null", contract.id).includes(:products => {:contract_items => :contract})
        @vendor_unit_names = vendor_units.map(&:name).join("、")
        @contract_type = Dictionary.where("data_type = 'contract_type' and value = ?", contract.contract_type).first.display

        mail(:to => to_user.map{|p| User.find(p).etsc_email},
            :subject => "#{contract.number}-合同签署"
        )
    end

    #签署合同时如果需要安装的邮件提醒
    def contract_install_email(contract, to_user)
        @contract = contract
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
            :subject => "#{contract.number}-需要安装"
        )
    end

    #合同内容变更时的邮件提醒
    def contract_change_email(contract, to_user)
        @contract = contract
        @natural_language = ContractHistory.where("item = 'contract' and old_id = ?", contract.id).last.natural_language
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
                  :subject => "#{contract.number}-合同变更"
        )
    end

    #商务工作量月度统计
    def business_workload_email(to_user)
        from_time = "#{1.month.ago.year}-#{1.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        to_time = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")

        @all_quotes = Quote.where("created_at >= ? and created_at < ?", from_time, to_time)
        @quotes = Quote.where("created_at >= ? and created_at < ? and state = 'complete'", from_time, to_time)
        @contracts = Contract.where("created_at >= ? and created_at < ?", from_time, to_time)
        @businesses = User.business

        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => to_user.etsc_email,
             :subject => "#{1.month.ago.year}年#{1.month.ago.month}月商务工作统计表"
        )
    end

    #每月合同数据报表自动发送
    #一个总的，两个分的（NPS RPS）
    def monthly_contract_report_email
        from_time = "#{1.month.ago.year}-#{1.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        to_time = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        real_to_time = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")

        #from_time = "2013-01-01"
        #to_time = "2013-12-31"
        #to_user = User.where("name in ('王辉文', '肖娜', '俞婷', '刘洁', '赵程')")
        to_user = []
        to_user << User.find(1)
        to_user << User.find(2)
        to_user << User.where("roles.id = 2").includes(:roles)
        to_user << User.where("departments.id = 3").joins(:manage_departments)
        to_user.flatten!.uniq!
        #to_user = User.where("name in ('陈天睿')")

        @all_contracts = Contract.period_contracts(from_time, to_time)
        @year_contracts = Contract.period_contracts("#{0.month.ago.year}-01-01", to_time)
        #p @all_contracts.map(&:number).join("、")
        #p "~~~~~~~~~~"
        @sale_contracts = Contract.period_sale_contracts(from_time, to_time)
        @rps_contracts = @sale_contracts.where("departments.name = '常规产品销售部'").includes(:signer => :belongs_to_departments)
        @nps_contracts = @sale_contracts.where("departments.name like '新产品战略%'").includes(:signer => :belongs_to_departments)
        @distribute_contracts = @sale_contracts.where("users.id in (1, 2)").includes(:signer)
        @taiwan_contracts = @sale_contracts.where("departments.name = '台湾办事处'").includes(:signer => :belongs_to_departments)

        @tsd_contracts = @all_contracts.where("contracts.contract_type = 2")

        @rent_contracts = @all_contracts.where("contracts.contract_type = 3")

        @project_contracts = @all_contracts.where("contracts.contract_type = 4")

        @o_to_i_contracts = @all_contracts.where("contracts.requirement_id = 1")
        @o_to_o_contracts = @all_contracts.where("contracts.requirement_id = 2")
        @i_to_i_contracts = @all_contracts.where("contracts.requirement_id = 3")
        @i_to_o_contracts = @all_contracts.where("contracts.requirement_id = 4")

        @sales = User.sale
        @groups = Group.where(true)
        mail(:to => to_user.map(&:etsc_email),
             :subject => "合同统计(#{from_time}~#{real_to_time})"
        )
    end
    def monthly_contract_report_rps_email
        from_time = "#{1.month.ago.year}-#{1.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        to_time = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        real_to_time = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")
        #to_user = User.where("name in ('王辉文', '肖娜', '高袁满', '刘洁', '赵程')")
        to_user = []
        to_user << User.find(1)
        to_user << User.find(2)
        to_user << User.includes(:roles).where("roles.id = 2")#财务
        to_user << User.where("departments.id = 18").joins(:manage_departments)#RPS销售经理
        to_user.flatten!.uniq!
        #to_user = User.where("name in ('陈天睿')")

        @all_contracts = Contract.period_contracts(from_time, to_time)
        @sales = User.where("departments.id = 18 or parent.id = 18").joins("LEFT JOIN departments_users ON users.id = departments_users.user_id
        LEFT JOIN departments ON departments_users.department_id = departments.id
        LEFT JOIN departments AS parent ON departments.superior = parent.id")
        @groups = Group.where("name not like '%NPS%'")
        mail(:to => to_user.map(&:etsc_email),
             :subject => "RPS合同统计(#{from_time}~#{real_to_time})"
        )
    end
    def monthly_contract_report_nps_email
        from_time = "#{1.month.ago.year}-#{1.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        to_time = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        real_to_time = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")
        #to_user = User.where("name in ('王辉文', '肖娜', '刘洁', '赵程')")
        to_user = []
        to_user << User.find(1)
        to_user << User.find(2)
        to_user << User.includes(:roles).where("roles.id = 2")
        to_user.flatten!.uniq!
        #to_user = User.where("name in ('陈天睿')")

        @all_contracts = Contract.period_contracts(from_time, to_time)
        @sales = User.where("departments.id = 9 or parent.id = 9").joins("LEFT JOIN departments_users ON users.id = departments_users.user_id
        LEFT JOIN departments ON departments_users.department_id = departments.id
        LEFT JOIN departments AS parent ON departments.superior = parent.id")
        @groups = Group.where("name like '%NPS%'")
        mail(:to => to_user.map(&:etsc_email),
             :subject => "NPS合同统计(#{from_time}~#{real_to_time})"
        )
    end

    ###############################
    #
    #以下是临时
    #
    ###############################
    #每两周查一次PInquire，按工厂分邮件，发给对应的采购
    def lead_updating_from_vendor_unit_email(inquire, to_user)
        @vendor_unit = VendorUnit.find(inquire[0])
        @inquire_array = inquire[1]
        start_at = 3.weeks.ago.strftime("%Y-%m-%d")
        #end_at = 1.weeks.ago.strftime("%Y-%m-%d")
        real_end_at = (1.weeks.ago.strftime("%Y-%m-%d").to_date - 1).strftime("%Y-%m-%d")
        #mail(:to => "terrych@etsc-tech.com",#测试用
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{@vendor_unit.name} 需求反馈情况#{start_at}~#{real_end_at}"
        )
        sleep 3
    end

    #每两周查一次MInquire，按销售分邮件，发给销售和其经理
    def lead_updating_from_user_email(inquire, to_user, from_user)
        @to_user = to_user
        @inquire_array = inquire
        start_at = 3.weeks.ago.strftime("%Y-%m-%d")
        #end_at = 1.weeks.ago.strftime("%Y-%m-%d")
        real_end_at = (1.weeks.ago.strftime("%Y-%m-%d").to_date - 1).strftime("%Y-%m-%d")
        #mail(:to => "terrych@etsc-tech.com",#测试用
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
            :subject => "转给 #{from_user.name} 的需求反馈情况#{start_at}~#{real_end_at}"
        )
        sleep 3
    end

    #每两周查一次推荐过的产品，按工厂分邮件，发给对应的采购
    def vendor_unit_be_recommended_status_email(vendor_unit, salelogs, to_user)
        #start_at = 2.weeks.ago.strftime("%Y-%m-%d")
        end_at = 0.weeks.ago.strftime("%Y-%m-%d")
        @salelogs = salelogs
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{vendor_unit.name}产品推荐情况表(截至止#{end_at})"
        )
        sleep 3
    end

    #每两周查一次报过价的产品，按工厂分邮件，发给对应的采购
    def quoted_vendor_unit_no_contract_email(vendor_unit, quotes, to_user)
        #start_at = 2.weeks.ago.strftime("%Y-%m-%d")
        end_at = 0.weeks.ago.strftime("%Y-%m-%d")
        @quotes = quotes
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{vendor_unit.name}产品已报价未成案情况表(截至止#{end_at})"
        )
        sleep 3
    end
    #每两周查一次报过价的产品，按工厂分邮件，发给对应的采购
    def quoted_vendor_unit_pre_contract_email(vendor_unit, quotes, to_user)
        #start_at = 2.weeks.ago.strftime("%Y-%m-%d")
        end_at = 0.weeks.ago.strftime("%Y-%m-%d")
        @quotes = quotes
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{vendor_unit.name}产品已报价已预签合同情况表(截至止#{end_at})"
        )
        sleep 3
    end

    #每两周查一次签过合同的产品，按工厂分邮件，发给对应的采购
    def contracted_vendor_unit_no_order_email(vendor_unit, contracts, to_user)
        #start_at = 2.weeks.ago.strftime("%Y-%m-%d")
        end_at = 0.weeks.ago.strftime("%Y-%m-%d")
        @contracts = contracts
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{vendor_unit.name}产品已合同未下单情况表(截至止#{end_at})"
        )
        sleep 3
    end

    def unassociated_lead_email(user_id, inquires)
        @user = User.find(user_id)
        @inquires = inquires
        mail(:to => "terrych@etsc-tech.com",
        #mail(:to => "#{@user.etsc_email}",
            :subject => "#{@user.name}未转为客户的需求列表"
        )
        p "已发"
    end

    #每月发一次新客户联系明细
    def new_customer_detail_email(customers, receiver_ids, sale)
        receiver_ids = receiver_ids - $obsoleted_user_ids
        @customers = customers

        mail(:to => "terrych@etsc-tech.com",
             :subject => "#{sale.name} 上月新客户明细，应发至（#{receiver_ids.map{|p| User.find(p).name}.join("、")}）"
        )
    end
    #同时发一次催非销售转走客户的
    def prompt_transfer_customer_email(customers, not_sale)
        @customers = customers
        #mail(:to => not_sale.etsc_email,
        mail(:to => "terrych@etsc-tech.com",
            :subject => "请及时转让客户"
        )
    end

    #临时用
    #TODO
    def new_customer_report_email()
        @customers = Customer.last_month
        @recent_3_exhibitions = Exhibition.order("start_on DESC").limit(3)

        @lead_customers = Customer.last_month.where(["lead_id in (?, ?, ?)", 3, 4, 6])

        question_str = @recent_3_exhibitions.map{"?"}.join(",")
        recent_3_exhibition_lead_ids = @recent_3_exhibitions.map(&:lead_id)
        @lead_customers_exhibitions = Customer.last_month.where("lead_id in (#{question_str})", *recent_3_exhibition_lead_ids)

        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => "mandyr@etsc-tech.com",
             :subject => "各种月报"
        )
    end

    #临时用
    #TODO
    def exhibition_follow_up_email()
        exhibition_id = 104
        exhibition = Exhibition.where("lead_id = ?", exhibition_id)[0]
        @lead_customers_exhibitions = Customer.where("lead_id = ?", exhibition_id)

        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => "mandyr@etsc-tech.com",
             :subject => "#{exhibition.name}3个月跟进情况"
        )
    end

    #临时用
    #TODO
    def season_quote_email
        year = 2013
        season = 2
        from_time = "#{year}-#{season*3 - 2}-01"
        to_time = "#{year}-#{season*3 + 1}-01"
        @quotes = Quote.where("created_at >= ? and created_at < ? and state = ?", from_time, to_time, "complete")
        @businesses = User.where("roles.id = 5").includes(:roles)

        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => "anney@etsc-tech.com",
             :subject => "#{year}年第#{season}季度报价统计表"
        )
    end

    #临时用
    #TODO
    #商务处理合同数量
    def season_contract_email
        year = 2013
        season = 2
        from_time = "#{year}-#{season*3 - 2}-01"
        to_time = "#{year}-#{season*3 + 1}-01"
        @contracts = Contract.where("created_at >= ? and created_at < ?", from_time, to_time)
        @businesses = User.where("roles.id = 6").includes(:roles)

        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => "anney@etsc-tech.com",
             :subject => "#{year}年第#{season}季度合同统计表"
        )
    end

    #临时用
    #TODO
    def product_be_recommended_status_email
        @product_name_array = %w(MT FT LSM)

        product_count = @product_name_array.size
        product_str_in_sql = (["products.model like ?"] * product_count).join(" or ")
        @salelogs = Salelog.where("vendor_units.id = 97 and #{product_str_in_sql}", *@product_name_array.map{|p| "%#{p}%"}).includes(:recommends => :producer)

        mail(:to => "terrych@etsc-tech.com",
        #mail(:to => "anney@etsc-tech.com",
             :subject => "PQ产品推荐情况表"
        )
    end

    #临时用
    #TODO
    #备货
    def product_prepare_goods_email
        @product_name_array = %w(SPAD)

        product_count = @product_name_array.size
        product_str_in_sql = (["products.model like ?"] * product_count).join(" or ")
        @quotes = Quote.where("salecases.@end_at is null and #{product_str_in_sql}", *@product_name_array.map{|p| "%#{p}%"}).includes(:salelog => :salecase).includes(:quote_items => :product)

        mail(:to => "terrych@etsc-tech.com",
             #mail(:to => "anney@etsc-tech.com",
             :subject => "SPAD产品报价情况表(备货用)"
        )
    end

    #临时用
    #for何兰
    def no_contract_quotation_email
        @product_model_array = %w(PMT70icu PMT120icu)

        #product_count = @product_name_array.size
        #product_str_in_sql = (["products.model like ?"] * product_count).join(" or ")
        #@quotes = Quote.where("#{product_str_in_sql}", *@product_name_array.map{|p| "%#{p}%"}).includes(:quote_items => :product)

        mail(:to => "terrych@etsc-tech.com",
            :subject => "Primes产品有报价无合同情况表"
        )
    end

    #推广邮件测试
    def promotion_test_email(addr)
        mail(:to => "marian@etsc-tech.com",
        #mail(:to => addr,
            #:cc => ["terrych@etsc-tech.com", "61519373@qq.com", "martinl@etsc-tech.com"],
            :subject => "Base64"
        )
    end

    #年终用
    #TODO
    def untracked_customer_detail_email
        exclude_dept_array = %w(采购 财务 关务 进出口)
        #半年内客户未跟踪
        dept_count = exclude_dept_array.size
        customer_str_in_sql = (["customers.department not like ?"] * dept_count).join(" and ")
        #binding.pry
        #@customers = Customer.where("salecases.id != 0 ").where("salelogs.contact_at < ?", 6.month.ago).where("#{customer_str_in_sql}", *exclude_dept_array.map{|p| "%#{p}%"}).includes(:salecases => :salelogs)
        @customers = Customer.where("salecases.id != 0 ").where("#{customer_str_in_sql}", *exclude_dept_array.map{|p| "%#{p}%"}).includes(:salecases => :salelogs)\
        .select do |customer|
            last_salelog = Salelog.where("customers.id = ?", customer.id).includes(:salecase => :customers).order("salelogs.contact_at DESC").limit(1)
            last_salelog[0].contact_at < 6.month.ago
        end
        #binding.pry
        #@customers = []
        #salelogs = Salelog.where("salecases.created_at <= ?", 6.months.ago).includes(:salecase).order("salelogs.contact_at DESC").group_by(&:salecase_id).select{|k, v| v[0]['contact_at'] <= 6.months.ago}
        #salecases_id_array = salelogs.map{|k, v| v[0].salecase.id}
        #salecases_id_array.each do |salecase|
        #    customers = Salecase.find(salecase).customers
        #    customers.each { |customer|
        #        @customers << customer unless (/(#{exclude_dept_array.join("|")})/) =~ (customer.department)
        #    }
        #end
        mail(:to => "terrych@etsc-tech.com",
             :subject => "半年内未跟踪客户明细"
        )
    end

    #年终用
    #TODO
    def untracked_customer_tally_email
        exclude_dept_array = %w(采购 财务 关务 进出口)
        #半年内客户未跟踪
        dept_count = exclude_dept_array.size
        customer_str_in_sql = (["customers.department not like ?"] * dept_count).join(" and ")
        #binding.pry
        #@customers = Customer.where("salecases.id != 0").where("salelogs.contact_at < ?", 6.month.ago).where("#{customer_str_in_sql}", *exclude_dept_array.map{|p| "%#{p}%"}).includes(:salecases => :salelogs)
        @customers = Customer.where("salecases.id != 0 ").where("#{customer_str_in_sql}", *exclude_dept_array.map{|p| "%#{p}%"}).includes(:salecases => :salelogs)\
        .select do |customer|
            last_salelog = Salelog.where("customers.id = ?", customer.id).includes(:salecase => :customers).order("salelogs.contact_at DESC").limit(1)
            last_salelog[0].contact_at < 6.month.ago
        end

        mail(:to => "terrych@etsc-tech.com",
             :subject => "半年内未跟踪客户分析"
        )
    end

    #年终用
    #TODO
    def salecase_success_ratio_tally_email
        year = 1.year.ago.year
        #@finished_salecases = Salecase.where("created_at >= ?", "#{year}-01-01").where("created_at <= ?", "#{year}-12-31").where("status = 2")
        @cancel_reason_array = Dictionary.where("data_type = 'case_cancel_reason'").sort_by{|p| p.value.to_i}.map{|p| [p.value, p.display]}

        @start_at = "#{year}-01-01"
        @end_at = "#{year}-12-31"

        @sales = User.all_sale
        @groups = Group.where(true)
        @areas = Area.china

        #product_model_array = %w(MicroTime FluoTime LSM BeamMonitor FocusMonitor Stage)
        #product_count = product_model_array.size
        #product_str_in_sql = (["products.model like ?"] * product_count).join(" or ")
        #@products = Product.where("#{product_str_in_sql}", *product_model_array.map{|p| "%#{p}%"})

        products_through_recommend = Product.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at).includes(:be_recommended_in => :salecase)
        products_through_quote = Product.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at)\
        .joins("LEFT JOIN quote_items ON (quote_items.product_id = products.id) LEFT JOIN quotes ON (quote_items.quote_id = quotes.id) LEFT JOIN salelogs ON (salelogs.id = quotes.quotable_id and quotes.quotable_type = 'Salelog') LEFT JOIN salecases ON (salelogs.salecase_id = salecases.id)")
        @products = (products_through_recommend + products_through_quote).uniq

        vendor_units_through_recommend = VendorUnit.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at).includes(:be_recommended_in => :salecase)
        vendor_units_through_quote = VendorUnit.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at)\
        .joins("LEFT JOIN products ON (products.seller_vendor_unit_id = vendor_units.id) LEFT JOIN quote_items ON (quote_items.product_id = products.id) LEFT JOIN quotes ON (quote_items.quote_id = quotes.id) LEFT JOIN salelogs ON (salelogs.id = quotes.quotable_id and quotes.quotable_type = 'Salelog') LEFT JOIN salecases ON (salelogs.salecase_id = salecases.id)")
        @vendor_units = (vendor_units_through_recommend + vendor_units_through_quote).uniq

        mail(:to => "terrych@etsc-tech.com",
             :subject => "#{year}年销售个案成案率统计"
        )
    end

    def quote_success_ratio_tally_email
        year = 1.year.ago.year
        #@finished_salecases = Salecase.where("created_at >= ?", "#{year}-01-01").where("created_at <= ?", "#{year}-12-31").where("status = 2")
        @cancel_reason_array = Dictionary.where("data_type = 'case_cancel_reason'").sort_by{|p| p.value.to_i}.map{|p| [p.value, p.display]}

        @start_at = "#{year}-01-01"
        @end_at = "#{year}-12-31"

        @sales = User.all_sale
        @groups = Group.where(true)
        @areas = Area.china

        #product_model_array = %w(MicroTime FluoTime LSM BeamMonitor FocusMonitor Stage)
        #product_count = product_model_array.size
        #product_str_in_sql = (["products.model like ?"] * product_count).join(" or ")
        #@products = Product.where("#{product_str_in_sql}", *product_model_array.map{|p| "%#{p}%"})

        products_through_recommend = Product.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at).includes(:be_recommended_in => :salecase)
        products_through_quote = Product.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at)\
        .joins("LEFT JOIN quote_items ON (quote_items.product_id = products.id) LEFT JOIN quotes ON (quote_items.quote_id = quotes.id) LEFT JOIN salelogs ON (salelogs.id = quotes.quotable_id and quotes.quotable_type = 'Salelog') LEFT JOIN salecases ON (salelogs.salecase_id = salecases.id)")
        @products = (products_through_recommend + products_through_quote).uniq

        vendor_units_through_recommend = VendorUnit.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at).includes(:be_recommended_in => :salecase)
        vendor_units_through_quote = VendorUnit.where("salecases.created_at >= ? and salecases.created_at <= ?", @start_at, @end_at)\
        .joins("LEFT JOIN products ON (products.seller_vendor_unit_id = vendor_units.id) LEFT JOIN quote_items ON (quote_items.product_id = products.id) LEFT JOIN quotes ON (quote_items.quote_id = quotes.id) LEFT JOIN salelogs ON (salelogs.id = quotes.quotable_id and quotes.quotable_type = 'Salelog') LEFT JOIN salecases ON (salelogs.salecase_id = salecases.id)")
        @vendor_units = (vendor_units_through_recommend + vendor_units_through_quote).uniq

        mail(:to => "terrych@etsc-tech.com",
             :subject => "#{year}年报价成单率统计·最终版"
        )
    end

    #已报价未合同，及已合同合同项状态未下单的以下产品
    def products_need_update_email
        product_model_array = %w(PAM\ 102-M PAM\ 102-P PAM\ 102-T PMA\ Hybrid\ 40 PHR\ 800 PHR\ 800_CFD_1+2 PHR\ 800_CFD_3+4)
        product_count = product_model_array.size
        product_str_in_sql = (["products.model like ?"] * product_count).join(" or ")
        @quoted_products = Product.where("#{product_str_in_sql}", *product_model_array.map{|p| "%#{p}%"}).where("quotes.id != 0")\
        .joins("LEFT JOIN quote_items ON quote_items.product_id = products.id")\
        .joins("LEFT JOIN quotes ON quote_items.quote_id = quotes.id")\
        .joins("LEFT JOIN salelogs ON (salelogs.id = quotes.quotable_id and quotes.quotable_type = 'Salelog')")\
        .joins("LEFT JOIN salecases ON salelogs.salecase_id = salecases.id")\
        .joins("LEFT JOIN contracts ON contracts.quote_id = quotes.id")
        #quoted_products.map{|p| p.quote_items.map{|q| q.quote.number}.join(" ")}.join(" ").split(" ").uniq.join(" ")
        #=> "Q1300372 Q1300373 Q1300662 Q1300666 Q1300667 Q1300668 Q1300669 Q1300981 Q1300566 Q1300575 Q1300840 Q1300605 Q1300773 Q1301001"

        @contracted_products = Product.where("#{product_str_in_sql}", *product_model_array.map{|p| "%#{p}%"}).where("contracts.id != 0")\
        .joins("LEFT JOIN contract_items ON contract_items.product_id = products.id")\
        .joins("LEFT JOIN contracts ON contract_items.contract_id = contracts.id")
        #contracted_products.map{|p| p.contract_items.map{|q| q.contract.number}.join(" ")}.join(" ").split(" ").uniq.join(" ")
        #=> "C1100213 C1100105 C1100108 C1200120 C1200147 C1200237 C1200282 C1200350 C1100205 C1100267 C1300319 C1300372 C1100123 C1100016 C1200024"

        mail(:to => "terrych@etsc-tech.com",
             :subject => "有改动的产品"
        )
    end

    #发送涉及该工厂的已报价未合同、已报价已预签合同的个案列表；以及已合同合同项状态未下单的合同列表
    def products_updated_hint_through_vendor_unit_email(vendor_unit, unsigned_salecases, pre_signed_salecases, contracts, to_user)
        @unsigned_salecases = unsigned_salecases
        @pre_signed_salecases = pre_signed_salecases
        @contracts = contracts

        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{vendor_unit.name}产品改动情况表"
        )
        p "#{vendor_unit.name} 产品已发送"
        sleep 3
    end

    #催款邮件
    def urge_payment_email(sender, receiver_ids)
        receiver_ids = receiver_ids - $obsoleted_user_ids
        @start_at = "2013-01-01"
        @end_at = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")
        pre_end_at = ("#{1.month.from_now.year}-#{1.month.from_now.month}-01".to_date - 1).strftime("%Y-%m-%d")
        @compensation_days = (DateTime.parse(@end_at) - DateTime.parse(pre_end_at)).to_i

        @unpaid_contracts = Contract.includes(:receivables).where("(contracts.total_collection != contracts.sum or
         (contracts.total_collection is null and contracts.sum is not null) or (contracts.total_collection is
         not null and contracts.sum is null)) and contracts.state != 'f_cancelled'")\
        .where("receivables.expected_receive_at >= ? and receivables.expected_receive_at <= ? and
        receivables.is_history is null", @start_at, pre_end_at)\
        .where("contracts.signed_at >= ? and contracts.signed_at <= ?", @start_at, pre_end_at)\
        .where("contracts.signer_user_id = ?", sender.id)\
        .order("contracts.number")
        #发所有人的总表话，注释掉sender_id那一行

        if @unpaid_contracts.size > 0
            #mail(:to => "terrych@etsc-tech.com",
            mail(:to => receiver_ids.map{|p| User.find(p).etsc_email},
                :subject => "合同应收款项_截止至#{@end_at}_#{sender.name}"
            )
        else
            #mail(:to => "terrych@etsc-tech.com",
            mail(:to => receiver_ids.map{|p| User.find(p).etsc_email},
                 :subject => "合同应收款项_截止至#{@end_at}_#{sender.name}(无应收款项)"
            )
        end
    end
    def urge_payment_gross_email(receiver_ids)
        receiver_ids = receiver_ids - $obsoleted_user_ids
        @start_at = "2013-01-01"
        @end_at = ("#{0.month.ago.year}-#{0.month.ago.month}-01".to_date - 1).strftime("%Y-%m-%d")

        $urge_payment_big_array = 8.times.map{[0] * 6}
        $total_rmb = 0

        unpaid_contracts = Contract.includes(:receivables).where("(contracts.total_collection != contracts.sum or (contracts.total_collection is null and
        contracts.sum is not null) or (contracts.total_collection is not null and contracts.sum is null)) and
        contracts.state != 'f_cancelled'")\
        .where("receivables.expected_receive_at >= ? and receivables.expected_receive_at <= ? and receivables.is_history is null", @start_at, @end_at)\
        .where("contracts.signed_at >= ? and contracts.signed_at <= ?", @start_at, @end_at)

        @currencies = Currency.where("id > 10").order("id").map(&:name)

        unpaid_contracts.each do |contract|
            #binding.pry
            case contract.currency.name
                when @currencies[0]
                    set_place(contract, 0)
                when @currencies[1]
                    set_place(contract, 1)
                when @currencies[2]
                    set_place(contract, 2)
                when @currencies[3]
                    set_place(contract, 3)
                when @currencies[4]
                    set_place(contract, 4)
                when @currencies[5]
                    set_place(contract, 5)
                when @currencies[6]
                    set_place(contract, 6)
                when @currencies[7]
                    set_place(contract, 7)
            end
        end

        @array = $urge_payment_big_array

        #mail(:to => "terrych@etsc-tech.com",
        mail(:to => receiver_ids.map{|p| User.find(p).etsc_email},
             :subject => "合同应催收款项_截止至#{@end_at}"
        )
    end

    # @param [User] from_user
    # @param [Array] 接收者id组成的数组
    def service_log_email(from_user, to_user)
        start_at = "#{1.month.ago.year}-#{1.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        end_at = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")

        #@service_logs = ServiceLog.last_month.by_user_or_group(from_user.id)
        #@flow_sheets = FlowSheet.where("service_logs.end_at > ? and service_logs.end_at < ?", start_at, end_at)
        #.where("service_logs.user_id = ?", from_user).includes(:service_logs)
        @service_logs = ServiceLog.where("service_logs.end_at > ? and service_logs.end_at < ?", start_at, end_at)
        .where("service_logs.user_id = ?", from_user)
        mail(:to => to_user.map{|p| User.find(p).etsc_email},
             :subject => "#{0.days.ago.year}年#{1.months.ago.month}月维修进展情况_from#{User.find(from_user).name}"
        )
    end
    #这个是按需要知道的销售分的
    def service_log_to_sale_email(to_user)
        start_at = "#{1.month.ago.year}-#{1.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        end_at = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")

        #@service_logs = ServiceLog.last_month.by_user_or_group(from_user.id)
        #@flow_sheets = FlowSheet.where("service_logs.end_at > ? and service_logs.end_at < ?", start_at, end_at)
        #.where("service_logs.user_id = ?", from_user).includes(:service_logs)
        @service_logs = ServiceLog.where("service_logs.end_at > ? and service_logs.end_at < ?", start_at, end_at)
        .where("users.id = ?", to_user).includes(:flow_sheet => {:customers => :user})
        mail(:to => "terrych@etsc-tech.com",
            :subject => "#{0.days.ago.year}年#{1.months.ago.month}月维修进展情况_to#{User.find(to_user).name}"
        )
    end

    #商务要的审批过的上一季度合同详情
    def audited_contract_detail_email
        #默认发邮件时间为1 4 7 10月的5号吧，反正就是跨季度了
        from_time = "#{3.month.ago.year}-#{3.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        to_time = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")

        #因为没有“审批”这个属性，所以只能从消息里找
        period_contracts = Contract.where("signed_at >= ? and signed_at < ?", from_time, to_time)
        @all_contracts = []
        period_contracts.each do |contract|
            contract_number = contract.number
            message = PersonalMessage.where("content like ?", "%(#{contract_number})%")
            if message.size > 0
                @all_contracts << [contract, message[-1].receiver.name]
            end
        end

        mail(:to => "terrych@etsc-tech.com",
             :subject => "#{3.month.ago.year}年第#{(0.month.ago.month - 1) / 3}季度审批过的合同"
        )
    end

    #TSD出差总天数等统计
    def tsd_business_trip_email
        #默认发邮件时间为1 4 7 10月的5号吧，反正就是跨季度了
        @from_time = "#{3.month.ago.year}-#{3.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        @to_time = "#{0.month.ago.year}-#{0.month.ago.month}-01".to_date.strftime("%Y-%m-%d")
        #@users = User.includes(:roles).where("roles.id = 10 and users.id != 2")
        calendars_i_i = Calendar.where("start_at > ? and end_at <= ?", @from_time, @to_time)
        calendars_o_i = Calendar.where("start_at <= ? and end_at > ? and end_at <= ?", @from_time, @from_time, @to_time)
        calendars_i_o = Calendar.where("start_at > ? and start_at <= ? and end_at > ?", @from_time, @to_time, @to_time)
        calendars_o_o = Calendar.where("start_at <= ? and end_at > ?", @from_time, @to_time)

        @calendars = (calendars_i_i + calendars_o_i + calendars_i_o + calendars_o_o).sort_by {|c| c.start_at}
        #p @calendars.map{|p| [p.start_at.strftime("%Y-%m-%d"), p.end_at.strftime("%Y-%m-%d")]}

        mail(:to => "terrych@etsc-tech.com",
            :subject => "#{3.month.ago.year}年第#{(0.month.ago.month - 1) / 3}季度TSD出差情况明细"
        )
    end


    def function_instruction_email(user)
        #users = User.at_job
        #users = User.where("id = 2 or id = 5")
        #users.each do |user|
            @user = user
            @functions = Function.where("users.id = ?", user.id).includes(:roles => :users).order("functions.id")
            mail(:to => user['etsc_email'],
                 :subject => "你的EIM模块权限"
            )
        #    sleep 10
        #end
        #@functions =  Function.where("users.id = 1").includes(:roles => :users)
    end


    private
    # 决定数据放到大数组的哪一行
    # @param [Contract] contract
    # @param [Integer] line
    def set_place(contract, line)
        collections = contract.check_collection(@end_at)
        #这个也要循环，因为可能有多个应催款
        collections.each do |collection|
            add_to_big_array(collection, line)

            currency = line
            add_to_total_rmb(collection, currency)
        end
    end

    # 决定数据放到大数组的哪一列
    def add_to_big_array(collection, line)
        case collection[1]
            when 1..30
                #p "30 days"
                $urge_payment_big_array[line][0] += collection[0]
            when 31..60
                $urge_payment_big_array[line][1] += collection[0]
            when 61..90
                $urge_payment_big_array[line][2] += collection[0]
            when 91..120
                $urge_payment_big_array[line][3] += collection[0]
            when 121..360
                $urge_payment_big_array[line][4] += collection[0]
            when 361..99999
                $urge_payment_big_array[line][5] += collection[0]
        end
    end

    def add_to_total_rmb(collection, currency)
        if currency == 0
            $total_rmb += collection[0]
        else
            currency_name = Currency.find(currency + 11)['name']
            #按账龄前推，如果推至小于2013-07-27则用2013-07-27的(从那天开始爬数据的……)
            receivable_date = @end_at.to_date - collection[1]
            use_date = (receivable_date.strftime("%Y-%m-%d") < "2013-07-27" ? "2013-07-27" : receivable_date.strftime("%Y-%m-%d"))
            #p "用了#{use_date}的#{currency_name}汇率"
            real_exchange_rate = RealExchangeRate.where("date = ?", use_date)[0][currency_name.downcase].to_f
            #p "+了#{collection[0]}，汇率为#{real_exchange_rate}，折#{collection[0] * real_exchange_rate / 100}"
            $total_rmb += (collection[0] * real_exchange_rate / 100)
        end
    end
end

