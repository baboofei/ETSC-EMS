#encoding: UTF-8
namespace :terry do
    desc '发邮件测试'
    task :mail_test => :environment do
        #DataImporter.import_teachers
        UserMailer.alert_email("aaa").deliver
        #puts "XXX"
    end

    desc '发送工作日志邮件'
    task :send_salelog_mail => :environment do
        sales = User.sale
        sales.each do |sale|
            #测试，发给Terry
            #manager_ids = [5]
            #正式，发给经理和自己。不发给同组成员了，但数据是取同组成员的
            manager_ids = sale.get_all_manager_ids
            #manager_ids += sale.get_group_mate_ids
            manager_ids += [sale.id]
            manager_ids += [1] #boss的好像有bug，以后再查吧……#TODO
            manager_ids.uniq!
            manager_ids.each do |manager_id|
                unless manager_id.blank?
                    exist_mail = ScheduledMail.where("sender = ? and receiver = ? and mailed_at = ? and mail_type = 'salelog'", sale.id, manager_id, Date.today.strftime("%Y-%m-%d"))
                    if exist_mail.blank?
                        manager = User.find(manager_id)
                        p "无对应邮件发送记录，发邮件：从#{sale.name}到#{manager.name} @ #{Time.now}"
                        #发邮件
                        UserMailer.salelog_email(sale, manager).deliver
                        #写数据库
                        scheduled_mail = ScheduledMail.new
                        scheduled_mail.sender = sale.id
                        scheduled_mail.receiver = manager_id
                        scheduled_mail['mailed_at'] = Date.today.strftime("%Y-%m-%d")
                        scheduled_mail.mail_type = 'salelog'
                        scheduled_mail.save
                    else
                        p "已有此记录，发送下一封 @ #{Time.now}"
                    end
                end
            end
        end
    end

    desc '发送商务工作情况月报'
    task :send_business_workload_mail => :environment do
        target_ids = [2, 4]
        target_ids.each do |target_id|
            exist_mail = ScheduledMail.where("receiver = ? and mailed_at = ? and mail_type = 'business_workload_monthly'", target_id, Date.today.strftime("%Y-%m-%d"))
            if exist_mail.blank?
                target = User.find(target_id)
                p "无对应邮件发送记录，发邮件：到#{target.name} @ #{Time.now}"
                #发邮件
                UserMailer.business_workload_email(target).deliver
                #写数据库
                scheduled_mail = ScheduledMail.new
                scheduled_mail.receiver = target_id
                scheduled_mail['mailed_at'] = Date.today.strftime("%Y-%m-%d")
                scheduled_mail.mail_type = 'business_workload_monthly'
                scheduled_mail.save
            else
                p "已有此记录，发送下一封 @ #{Time.now}"
            end
        end
    end

    desc '同步汇率'
    task :sync_exchange_rate => :environment do
        RealExchangeRate.spider
        p "汇率同步完成 @ #{Time.now}"
    end

    desc '发送销售合同统计月报'
    task :send_sales_contract_mail => :environment do
        exist_mail = ScheduledMail.where("receiver = 1 and mailed_at = ? and mail_type = 'sales_contract_monthly'", Date.today.strftime("%Y-%m-%d"))
        if exist_mail.blank?
            p "无对应邮件发送记录，发销售合同统计邮件 @ #{Time.now}"
            UserMailer.monthly_contract_report_email.deliver
            UserMailer.monthly_contract_report_nps_email.deliver
            UserMailer.monthly_contract_report_rps_email.deliver
            #写数据库
            scheduled_mail = ScheduledMail.new
            scheduled_mail.receiver = 1
            scheduled_mail.mailed_at = Date.today.strftime("%Y-%m-%d")
            scheduled_mail.mail_type = 'sales_contract_monthly'
            scheduled_mail.save
        else
            p "已有此记录，发送下一封 @ #{Time.now}"
        end
    end

    desc '发送每月催款邮件'
    task :send_urge_payment_mail => :environment do
        mail_type = "urge_payment_monthly"
        sales = User.sale
        sales.each do |sale|
            receiver_ids = []
            receiver_ids << sale.id
            receiver_ids << Role.find(12).users.map(&:id) if sale.belongs_to_departments.map(&:id).include? 4 #TSD的加上技术助理
            receiver_ids << User.where("u2.id = ?", sale.id).joins("LEFT JOIN groups_users AS gu1 ON users.id = gu1.user_id
LEFT JOIN groups ON gu1.group_id = groups.id
LEFT JOIN groups_users AS gu2 ON groups.id = gu2.group_id
LEFT JOIN users AS u2 ON gu2.user_id = u2.id").map(&:id) if sale.groups.to_s.match("NPS")
            receiver_ids << sale.get_direct_manager_id if sale.id != 2 #肖娜的算出来是老板，但不发给他
            receiver_ids << 2 #直接肖姐姐
            receiver_ids << User.includes(:roles).where("roles.id = 2").map(&:id)#财务
            receiver_ids.flatten!.uniq!
            exist_mail = ScheduledMail.where("sender = ? and mailed_at = ? and mail_type = ?", sale.id,  Date.today.strftime("%Y-%m-%d"), mail_type)
            if exist_mail.blank?
                p "无对应邮件发送记录，发催款邮件 @ #{Time.now}，发件人#{User.find(sale).name}，收件人#{receiver_ids.map{|p| User.find(p).name}}"
                UserMailer.urge_payment_email(sale, receiver_ids).deliver
                #写数据库
                scheduled_mail = ScheduledMail.new
                scheduled_mail.sender = sale.id
                scheduled_mail['mailed_at'] = Date.today.strftime("%Y-%m-%d")
                scheduled_mail.mail_type = mail_type
                scheduled_mail.save
            else
                p "已有此记录，发送下一封 @ #{Time.now}"
            end
        end

        exist_mail = ScheduledMail.where("sender = 5 and mailed_at = ? and mail_type = ?",  Date.today.strftime("%Y-%m-%d"), mail_type)
        gross_receiver_ids = []
        gross_receiver_ids << 2 #直接肖姐姐
        gross_receiver_ids << User.includes(:roles).where("roles.id = 2").map(&:id)#财务
        gross_receiver_ids.flatten!.uniq!
        if exist_mail.blank?
            p "无对应邮件发送记录，发催款邮件 @ #{Time.now}"
            UserMailer.urge_payment_gross_email(gross_receiver_ids).deliver
            #写数据库
            scheduled_mail = ScheduledMail.new
            scheduled_mail.sender = 5
            scheduled_mail['mailed_at'] = Date.today.strftime("%Y-%m-%d")
            scheduled_mail.mail_type = mail_type
            scheduled_mail.save
        else
            p "已有此记录，发送下一封 @ #{Time.now}"
        end
    end

    desc '发送维修进展邮件'
    task :send_service_log_mail => :environment do
        supporters = User.supporter
        supporters.each do |supporter|
            #正式，发给自己、经理、技术助理和肖娜
            target_ids = [supporter.id]
            target_ids << [supporter.get_all_manager_ids]
            target_ids << [User.supporter_assistant.map(&:id)]
            target_ids = target_ids.flatten.uniq
            #测试， 发给terry
            target_ids = [5]

            UserMailer.service_log_email(supporter, target_ids).deliver
        end

        sales = User.sale
        sales.each do |sale|
            UserMailer.service_log_to_sale_email(sale).deliver
        end
    end

    #TODO 以下几个可以弄一个namespace，但还未定名称
    desc '发送工厂两周内的需求反馈邮件'
    task :send_p_inquire_updating_mail => :environment do
        start_at = 3.weeks.ago.strftime("%Y-%m-%d")
        end_at = 1.weeks.ago.strftime("%Y-%m-%d")

        p_inquires = PInquire.where("created_at >= ? and created_at < ?", start_at, end_at)
        p_inquires.group_by(&:vendor_unit_id).each do |inquire|
            #测试， 发给terry
            target_ids = [5]
            #正式，发给对应工厂的采购
            vendor_unit_id = inquire[0]
            target_ids = VendorUnit.find(vendor_unit_id).purchasers.map(&:id)

            UserMailer.lead_updating_from_vendor_unit_email(inquire, target_ids).deliver
            p "#{VendorUnit.find(vendor_unit_id).name} 发送完毕"
        end
    end

    desc '发送市场两周内的需求反馈邮件'
    task :send_m_inquire_updating_mail => :environment do
        start_at = 3.weeks.ago.strftime("%Y-%m-%d")
        end_at = 1.weeks.ago.strftime("%Y-%m-%d")

        m_inquires = MInquire.where("created_at >= ? and created_at < ?", start_at, end_at)
        mail_inquires =[]
        m_inquires.each do |inquire|
            #binding.pry
            if inquire.customer.blank?
                #如果未处理，则以需求本身的user_id也就是首次被转让给的user_id为准
                mail_inquires << Hash[inquire.user_id => inquire]
            else
                #如果被处理成客户了，则以客户的user_id为准
                #但注意如果是被设置了组的客户，则给每个组员都要发一份
                if inquire.customer.group
                    inquire.customer.group.users.each do |user|
                        mail_inquires << Hash[user.id => inquire]
                    end
                else
                    mail_inquires << Hash[inquire.customer.user_id => inquire]
                end
            end
        end
        #binding.pry

        #再加上PInquire的
        p_inquires = PInquire.where("created_at >= ? and created_at < ?", start_at, end_at)
        p_inquires.each do |inquire|
            #binding.pry
            if inquire.customer.blank?
                #如果未处理，则以需求本身的user_id也就是首次被转让给的user_id为准
                mail_inquires << Hash[inquire.user_id => inquire]
            else
                #如果被处理成客户了，则以客户的user_id为准
                #但注意如果是被设置了组的客户，则给每个组员都要发一份
                if inquire.customer.group
                    inquire.customer.group.users.each do |user|
                        mail_inquires << Hash[inquire.user_id => inquire]
                    end
                else
                    mail_inquires << Hash[inquire.customer.user_id => inquire]
                end
            end
        end
        #binding.pry
        #mail_inquires.group
        #grouped_inquires = mail_inquires.group_by(&:keys)
        #size = mail_inquires.group_by(&:keys).map{|p| [p[0], p[1].size]}

        mail_inquires.group_by(&:keys).each do |inquire|
            #binding.pry
            target_ids = inquire[0]
            target_ids << User.find(inquire[0][0]).get_all_manager_ids
            target_ids.flatten!
            target_ids.uniq!
            target_ids.reject!(&:blank?)

            target_ids -= [1]#先不发给boss以免不必要的麻烦……
                             #binding.pry
            UserMailer.lead_updating_from_user_email(inquire[1].map { |p| p.values[0] }, target_ids, User.find(inquire[0][0])).deliver
            p "#{User.find(inquire[0][0]).name} 发送完毕"
        end
    end

    desc '发送推荐产品中含下列工厂产品的个案详情邮件'
    task :send_vendor_unit_be_recommended_status_mail => :environment do
        if Time.now.strftime("%U").to_i % 2 == 1
            vendor_unit_array = %w(COH PIC PRM)
            #start_at = "2010-01-01"#2.weeks.ago.strftime("%Y-%m-%d")
            end_at = 0.weeks.ago.strftime("%Y-%m-%d")

            vendor_unit_array.each do |vendor_unit_code|
                vendor_unit = VendorUnit.where("short_code = ?", vendor_unit_code)[0]

                salelogs = (Salelog.where("vendor_units.short_code = ?", vendor_unit_code)\
            .where("salelogs.created_at < ?", end_at)\
            .includes(:recommends => :producer) +
                    Salelog.where("vendor_units.short_code = ?", vendor_unit_code)\
            .where("salelogs.created_at < ?", end_at)\
            .includes(:recommend_factories))
                #去掉签过合同的，process == 27
                #去掉完结的，process == 15
                salelogs.uniq!.reject! do |now_salelog|
                    salelog_process = now_salelog.salecase.salelogs.map(&:process)
                    (salelog_process.include? 27) || (salelog_process.include? 15)
                end
                #测试， 发给terry
                target_ids = [5]
                #正式，发给对应工厂的采购
                target_ids = vendor_unit.purchasers.map(&:id)
                UserMailer.vendor_unit_be_recommended_status_email(vendor_unit, salelogs, target_ids).deliver
            end
        end
    end

    desc '发送报价项中含下列工厂产品但未签合同的报价详情邮件'
    task :send_quoted_vendor_unit_no_contract_mail => :environment do
        if Time.now.strftime("%U").to_i % 2 == 1
            vendor_unit_array = %w(COH PIC PRM)
            #start_at = "2010-01-01"#2.weeks.ago.strftime("%Y-%m-%d")
            end_at = 0.weeks.ago.strftime("%Y-%m-%d")

            vendor_unit_array.each do |vendor_unit_code|
                vendor_unit = VendorUnit.where("short_code = ?", vendor_unit_code)[0]

                #全部报过该工厂产品的个案
                salecases = Salecase.where("vendor_units.short_code = ?", vendor_unit_code)\
            .where("salelogs.created_at < ?", end_at)\
            .joins("LEFT JOIN salelogs ON salelogs.salecase_id = salecases.id")\
            .joins("LEFT JOIN quotes ON salelogs.id = quotes.quotable_type = 'Salelog' and quotes.quotable_id = salelogs.id")\
            .joins("LEFT JOIN quote_items ON quote_items.quote_id = quotes.id")\
            .joins("LEFT JOIN products ON quote_items.product_id = products.id")\
            .joins("LEFT JOIN vendor_units ON products.producer_vendor_unit_id = vendor_units.id")
                #p salecases.size
                salecases.uniq!

                #去掉签过合同的，process == 27
                #去掉完结的，process == 15
                salecases.reject! do |salecase|
                    salelog_process = salecase.salelogs.map(&:process)
                    (salelog_process.include? 27) || (salelog_process.include? 15)
                end
                #p salecases.size

                sorted_quote_number = salecases.map do |salecase|
                    salecase.salelogs.map do |salelog|
                        salelog.quote.blank? ? "" : salelog.quote.number
                    end.flatten.uniq.sort[-1]
                end
                #binding.pry
                quotes = sorted_quote_number.map { |quote_number| Quote.where("number = ?", quote_number)[0] }
                #p quotes
                #测试， 发给terry
                target_ids = [5]
                #正式，发给对应工厂的采购
                target_ids = vendor_unit.purchasers.map(&:id)
                UserMailer.quoted_vendor_unit_no_contract_email(vendor_unit, quotes, target_ids).deliver
            end
        end
    end

    desc '发送报价项中含下列工厂产品且已预签合同的报价详情邮件'
    task :send_quoted_vendor_unit_pre_contract_mail => :environment do
        #if Time.now.strftime("%U").to_i % 2 == 1
            vendor_unit_array = %w(COH PIC PRM ILX)
            #start_at = "2010-01-01"#2.weeks.ago.strftime("%Y-%m-%d")
            end_at = 0.weeks.ago.strftime("%Y-%m-%d")

            vendor_unit_array.each do |vendor_unit_code|
                vendor_unit = VendorUnit.where("short_code = ?", vendor_unit_code)[0]

                #全部报过该工厂产品的个案
                salecases = Salecase.where("vendor_units.short_code = ?", vendor_unit_code)\
                .where("salelogs.created_at < ?", end_at)\
                .joins("LEFT JOIN salelogs ON salelogs.salecase_id = salecases.id")\
                .joins("LEFT JOIN quotes ON salelogs.id = quotes.quotable_type = 'Salelog' and quotes.quotable_id = salelogs.id")\
                .joins("LEFT JOIN quote_items ON quote_items.quote_id = quotes.id")\
                .joins("LEFT JOIN products ON quote_items.product_id = products.id")\
                .joins("LEFT JOIN vendor_units ON products.producer_vendor_unit_id = vendor_units.id")
                #p salecases.size
                #binding.pry

                #选出有预签合同的，process == 10
                salecases.uniq!
                salecases.select! { |salecase| salecase.salelogs.map(&:process).include? 10 }
                #再剔除掉已经签了合同的，process == 27
                salecases.reject! { |salecase| salecase.salelogs.map(&:process).include? 27 }
                #p salecases.size
                #binding.pry

                sorted_quote_number = salecases.map do |salecase|
                    salecase.salelogs.map do |salelog|
                        salelog.quote.blank? ? "" : salelog.quote.number
                    end.flatten.uniq.sort[-1]
                end
                #binding.pry
                quotes = sorted_quote_number.map { |quote_number| Quote.where("number = ?", quote_number)[0] }
                #p quotes
                #测试， 发给terry
                target_ids = [5]
                #正式，发给对应工厂的采购
                target_ids = vendor_unit.purchasers.map(&:id)
                UserMailer.quoted_vendor_unit_pre_contract_email(vendor_unit, quotes, target_ids).deliver
            end
        #end
    end

    desc '发送合同项中含下列工厂产品且合同已签订但合同项尚未下单的合同详情邮件'
    task :send_contracted_vendor_unit_no_order_mail => :environment do
        if Time.now.strftime("%U").to_i % 2 == 1
            vendor_unit_array = %w(COH PIC PRM ILX)
            #start_at = "2010-01-01"#2.weeks.ago.strftime("%Y-%m-%d")
            end_at = 0.weeks.ago.strftime("%Y-%m-%d")

            vendor_unit_array.each do |vendor_unit_code|
                vendor_unit = VendorUnit.where("short_code = ?", vendor_unit_code)[0]

                contracts = Contract.where("vendor_units.short_code = ?", vendor_unit_code)\
            .where("contracts.signed_at < ?", end_at)\
            .where("contract_items.send_status = 2 and contract_items.is_history is null")\
            .includes(:contract_items => {:product => :producer})
                #p contracts.size

                #测试， 发给terry
                target_ids = [5]
                #正式，发给对应工厂的采购
                target_ids = vendor_unit.purchasers.map(&:id)
                UserMailer.contracted_vendor_unit_no_order_email(vendor_unit, contracts, target_ids).deliver
            end
        end
    end
    #疑似namespace处结束

    desc '某工厂产品价格调整时，发送涉及该工厂的已报价未合同、已报价已预签合同的个案列表；以及已合同合同项状态未下单的合同列表'
    task :send_products_updated_hint_through_vendor_unit_mail => :environment do
        vendor_unit_short_code_array = %w(PIC MPD)

        vendor_unit_short_code_array.each do |vendor_unit_code|
            vendor_unit = VendorUnit.where("short_code = ?", vendor_unit_code)[0]
            #个案
            #全部报过该工厂产品的个案
            salecases = Salecase.where("vendor_units.short_code = ?", vendor_unit_code)\
            .joins("LEFT JOIN salelogs ON salelogs.salecase_id = salecases.id")\
            .joins("LEFT JOIN quotes ON salelogs.id = quotes.quotable_type = 'Salelog' and quotes.quotable_id = salelogs.id")\
            .joins("LEFT JOIN quote_items ON quote_items.quote_id = quotes.id")\
            .joins("LEFT JOIN products ON quote_items.product_id = products.id")\
            .joins("LEFT JOIN vendor_units ON products.producer_vendor_unit_id = vendor_units.id")

            #去掉完结的，process == 15
            undone_salecases = salecases.uniq.reject do |salecase|
                salecase.salelogs.map(&:process).include? 15
            end

            #去掉签过合同的，process == 27
            unsigned_salecases = undone_salecases.reject do |salecase|
                salecase.salelogs.map(&:process).include? 27
            end

            #选出有预签合同的，process == 10
            pre_signed_salecases = unsigned_salecases.select do |salecase|
                salecase.salelogs.map(&:process).include? 10
            end

            #合同
            contracts = Contract.where("vendor_units.short_code = ?", vendor_unit_code)\
            .where("contract_items.send_status = 2 and contract_items.is_history is null")\
            .includes(:contract_items => {:product => :producer})

            #binding.pry
            #测试， 发给terry
            target_ids = [5]
            ##正式，发给对应工厂的采购
            #target_ids = vendor_unit.purchasers.map(&:id)
            UserMailer.products_updated_hint_through_vendor_unit_email(vendor_unit, unsigned_salecases, pre_signed_salecases, contracts, target_ids).deliver
        end
    end

    desc '发送每月新客户明细邮件'
    task :send_new_customer_detail_mail => :environment do
        sales = User.where("departments.id in (15, 16, 18, 22, 23)").includes(:belongs_to_departments)
        sales.each do |sale|
            #对每个销售，整理出其名下的新客户列表，包含组内的
            own_customers = Customer.last_month.where("users.id = ?", sale.id).includes(:user)
            group_customers = Customer.last_month.where("users.id = ?", sale.id).includes(:group => :users)
            customers = own_customers + group_customers

            target_ids = sale.get_all_manager_ids
            target_ids += [sale.id]
            target_ids.flatten!
            target_ids.uniq!
            target_ids.reject!(&:blank?)

            UserMailer.new_customer_detail_email(customers, target_ids, sale).deliver
            p "已发送"
            sleep 3
        end

        not_sales = User.where("true") - User.where("departments.id in (1, 15, 16, 18, 22, 23)").includes(:belongs_to_departments)
        not_sales.each do |not_sale|
            #对每个非销售，如果其名下有客户，则发邮件通知之
            own_customers = Customer.last_month.where("users.id = ?", not_sale.id).includes(:user)
            if own_customers.size > 0
                UserMailer.prompt_transfer_customer_email(own_customers, not_sale).deliver
                sleep 3
            end
        end
    end

    desc '查询系统中未处理的需求，并发邮件给terry。不用定时。'
    task :send_todo_inquire_to_terry => :environment do
        User.sale.each do |user|
            inquires = User.get_unassociated_customer_by(user.id)
            p user.name
            if inquires.size > 0
                UserMailer.unassociated_lead_email(user.id, inquires).deliver
                sleep 3
                p "已发"
            else
                p "空，不发"
            end
        end
    end
end

