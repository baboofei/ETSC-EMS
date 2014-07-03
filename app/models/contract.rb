#!/bin/env ruby
# encoding: utf-8
# magic comment……解决汉字UTF8问题
class Contract < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :number, :customer_number, :summary, :signer_user_id, :dealer_user_id, :customer_unit_id,
                    :end_user_customer_id, :buyer_customer_id, :business_unit_id, :business_contact_id, :our_company_id,
                    :requirement_id, :currency_id, :state, :sum, :exchange_rate, :rmb, :pay_mode_id, :does_need_install,
                    :does_need_lc, :receive_lc_at, :lc_number, :invoice, :profit, :total_collection, :comment, :quote_id,
                    :salelog_id, :contract_type, :group_id, :signed_at, :invoiced_at

    belongs_to :dealer, :class_name => 'User', :foreign_key => 'dealer_user_id'
    belongs_to :signer, :class_name => 'User', :foreign_key => 'signer_user_id'

    belongs_to :customer_unit
    belongs_to :end_user, :class_name => 'Customer', :foreign_key => 'end_user_customer_id'
    belongs_to :buyer, :class_name => 'Customer', :foreign_key => 'buyer_customer_id'

    belongs_to :business_unit
    belongs_to :business_contact

    belongs_to :our_company
    belongs_to :pay_mode
    belongs_to :quote

    belongs_to :group

    has_many :contract_items
    has_many :receivables
    has_many :collections
    belongs_to :currency

    has_many :flow_sheets

    def self.period_contracts(from_time, to_time)
        where("contracts.signed_at >= ? and contracts.signed_at <= ? and (contracts.state = 'd_progressing' or contracts.state = 'e_complete')", from_time, to_time)
    end

    def self.period_sale_contracts(from_time, to_time)
        period_contracts(from_time, to_time).where("contracts.contract_type = 1")
    end

    def self.period_rps_contracts(from_time, to_time)
        period_sale_contracts(from_time, to_time).where("departments.name = '常规产品销售部'").includes(:signer => :belongs_to_departments)
    end
    def self.period_nps_contracts(from_time, to_time)
        period_sale_contracts(from_time, to_time).where("departments.name like '新产品战略%'").includes(:signer => :belongs_to_departments)
    end
    def self.period_distribute_contracts(from_time, to_time)
        period_sale_contracts(from_time, to_time).where("users.id in (1, 2)").includes(:signer)
    end
    def self.period_taiwan_contracts(from_time, to_time)
        period_sale_contracts(from_time, to_time).where("departments.name = '台湾办事处'").includes(:signer => :belongs_to_departments)
    end

    def self.period_tsd_contracts(from_time, to_time)
        period_contracts(from_time, to_time).where("contracts.contract_type = 2")
    end

    def self.period_rent_contracts(from_time, to_time)
        period_contracts(from_time, to_time).where("contracts.contract_type = 3")
    end

    def self.period_project_contracts(from_time, to_time)
        period_contracts(from_time, to_time).where("contracts.contract_type = 4")
    end

    state_machine :initial => :a_start do
        #初步设计了以下状态：
        #开始      a_start
        #待审批    b_auditing        [问号]
        #待签署    c_signing         [写字]
        #已签订    d_progressing     [沙漏]
        #已完成    e_complete        [对勾]
        #已取消    f_cancelled       [禁止标志]
        event :need_audit do
            #需要审批
            transition [:a_start, :c_signing] => :b_auditing
        end
        event :without_audit do
            #不需要审批
            transition [:a_start] => :c_signing
        end
        event :refuse do
            #驳回
            transition [:b_auditing] => :a_start
        end
        event :agree do
            #通过
            transition [:b_auditing] => :c_signing
        end
        event :sign do
            #签署
            transition [:c_signing] => :d_progressing
        end
        event :complete do
            #完成
            transition [:d_progressing] => :e_complete
        end
        event :cancel do
            #取消
            transition [:d_progressing] => :f_cancelled
        end
    end

    def for_grid_json(store_name, user_id)
        #检查editable状态。之前貌似都没有判断角色
        editable = false
        store = Store.find_by_name(store_name)
        user = User.find(user_id)
        #binding.pry
        if store
            if (store.visible_to_roles & user.roles).size > 0
                #全部可见并全部不可改的角色，直接为false
            elsif (store.editable_to_roles & user.roles).size > 0
                #全部可见并全部可改的角色，直接为true
                editable = true
            elsif (store.partial_editable_to_roles & user.roles).size > 0
                #部分可见部分可改的角色，判断是否为本人或者属于本人所在项目组
                #binding.pry
                #editable = (sale_user_id == user_id || (group && group.users.include?(user)))
                editable = false
            else
                #未分配的角色，返回空集
            end
        end

        attr = attributes
        attr['contract_items>purchase_order>number'] = PurchaseOrder.where("contracts.id = ?", id).includes(:contract_items => :contract).map(&:number).join("、")
        attr['signer_user_id'] = signer.id
        attr['signer>name'] = signer.name
        attr['dealer_user_id'] = dealer.id
        attr['dealer>name'] = dealer.name
        attr['customer_unit>(name|unit_aliases>unit_alias)'] = customer_unit.name
        attr['customer_unit>id'] = customer_unit.id
        attr['end_user>name'] = end_user.name
        attr['end_user>phone'] = end_user.phone
        attr['end_user>mobile'] = end_user.mobile
        attr['buyer>name'] = buyer.name
        attr['buyer>phone'] = buyer.phone
        attr['buyer>mobile'] = buyer.mobile
        attr['business_unit>name'] = business_unit.blank? ? '无' : business_unit.name
        attr['business_contact>name'] = business_contact.blank? ? '无' : business_contact.name
        attr['business_contact>phone'] = business_contact.blank? ? '无' : business_contact.phone
        attr['business_contact>mobile'] = business_contact.blank? ? '无' : business_contact.mobile
        attr['quote>number'] = quote.blank? ? '' : quote.number
        attr['pay_mode>name'] = pay_mode.blank? ? '' : pay_mode.name
        #attr['purchaser_order>number'] = purchase_order.name

        attr['editable'] = editable
        attr
    end

    def for_single_json
        attr = attributes
        attr['contract_items>purchase_order>number'] = PurchaseOrder.where("contracts.id = ?", id).includes(:contract_items => :contract).map(&:number).join("、")
        attr['signer_user_id'] = signer.id
        attr['signer>name'] = signer.name
        attr['dealer_user_id'] = dealer.id
        attr['dealer>name'] = dealer.name
        attr['customer_unit>(name|unit_aliases>unit_alias)'] = customer_unit.name
        attr['customer_unit>id'] = customer_unit.id
        attr['end_user>name'] = end_user.name
        attr['end_user>phone'] = end_user.phone
        attr['end_user>mobile'] = end_user.mobile
        attr['buyer>name'] = buyer.name
        attr['buyer>phone'] = buyer.phone
        attr['buyer>mobile'] = buyer.mobile
        attr['business_unit>name'] = business_unit.blank? ? '无' : business_unit.name
        attr['business_contact>name'] = business_contact.blank? ? '无' : business_contact.name
        attr['business_contact>phone'] = business_contact.blank? ? '无' : business_contact.phone
        attr['business_contact>mobile'] = business_contact.blank? ? '无' : business_contact.mobile
        attr['quote>number'] = quote.blank? ? '' : quote.number
        attr['pay_mode>name'] = pay_mode.blank? ? '' : pay_mode.name
        attr
    end

    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        #所有权是自己，或者组id包含了自己所在的组
        where("contracts.signer_user_id in #{str} or users.id = ?", *member_ids, user_id).includes(:group => :users)
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id, is_local)
        item = "合同"
        if params[:id].blank?
            contract = Contract.new
            message = $etsc_create_ok
        else
            contract = Contract.find(params[:id])
            message = $etsc_update_ok
        end

        case params['event']
            when 'create'
                #首次创建
                #binding.pry
                fields_to_be_updated = %w(customer_unit_id customer_number summary buyer_customer_id end_user_customer_id business_unit_id
                    business_contact_id our_company_id signer_user_id requirement_id contract_type pay_mode_id currency_id sum lc_number
                    comment quote_id group_id
                )
                fields_to_be_updated.each do |field|
                    contract[field] = params[field]
                end
                contract['currency_id'] = params['sum_currency_id'].blank? ? 11 : params['sum_currency_id']
                contract['sum'] = params['sum_amount']
                contract['does_need_install'] = params['does_need_install'] == 'on'
                contract['does_need_lc'] = params['does_need_lc'] == 'on'

                contract['dealer_user_id'] = user_id
                contract['number'] = gen_new_number_with_letter("C")
                unless params['sum_currency_id'].blank?
                    if params['sum_currency_id'] != "11"
                        #非人民币换算成人民币
                        currency_name = Currency.find(params['sum_currency_id']).name
                        current_exchange_rate = RealExchangeRate.where("date = ?", "#{Date.today.strftime("%Y-%m-%d")}")[0][currency_name.downcase]
                        contract.exchange_rate = current_exchange_rate.to_f
                        contract.rmb = params['sum_amount'].to_f * current_exchange_rate.to_f / 100
                    else
                        contract.exchange_rate = 100
                        contract.rmb = params['sum_amount']
                    end
                end

                #判断要不要审批
                customer_unit_level = CustomerUnit.find(params['customer_unit_id']).credit_level
                pay_mode = PayMode.find(params['pay_mode_id'])
                pay_mode_level = pay_mode.credit_level
                #客户是A级客户，则可以用ABCDE方式的付款；客户是C级客户，则只能用CDE方式
                if customer_unit_level <= pay_mode_level
                    #付款方式在信用等级内，不用审批
                    contract.without_audit

                else
                    #不在，要审批
                    contract.need_audit
                    #发消息给合同负责工程师的直属经理，提示审批
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:Contracts|item_sn:contract_audit_#{user_id}_#{contract.number}">点击查看</a>}
                    message_params = {
                        :content => "有一份合同需要审批(#{contract.number})，#{link_str}",
                        :receiver_user_id => contract.signer.get_direct_manager_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                #binding.pry
                contract.save
                #如果是有报价的，则其下的合同项也从报价项带过来
                if !params['quote_id'].blank?
                    quote = Quote.find(params['quote_id'])
                    quote_items = quote.quote_items
                    quote_items.each_with_index do |quote_item, index|
                        contract_item = ContractItem.new
                        contract_item.product_id = quote_item.product_id
                        contract_item.quantity = quote_item.quantity
                        contract_item.contract_id = contract.id
                        contract_item.send_status = 1
                        contract_item.check_and_accept_status = 1
                        contract_item.warranty_term_id = 2
                        contract_item.inner_id = index
                        contract_item.save
                    end
                    #contract.currency_id = quote.currency_id
                    #contract.sum = quote.total
                    contract.save
                end
                #刚新增时定不下来应收款点，所以不管

                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            when 'update'
                #判断要不要审批
                customer_unit_level = contract.customer_unit.credit_level
                pay_mode_level = contract.pay_mode.credit_level
                #客户是A级客户，则可以用ABCDE方式的付款；客户是C级客户，则只能用CDE方式
                if customer_unit_level <= pay_mode_level
                    #付款方式在信用等级内，不用审批
                    contract.without_audit
                    ##这里不动收款点，每个节点具体操作时现生成 20140124
                    ##有改动且不需审批时，直接改应收款点 201311xx
                    #contract.add_receivable
                    #contract.change_receivable_with(pay_mode.name)
                else
                    #不在，要审批
                    contract.need_audit
                    #发消息给合同负责工程师的直属经理，提示审批
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:Contracts|item_sn:contract_audit_#{user_id}_#{contract.number}">点击查看</a>}
                    message_params = {
                        :content => "有一份合同需要审批(#{contract.number})，#{link_str}",
                        :receiver_user_id => contract.signer.get_direct_manager_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                contract.save
                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            when 'audit_agree'
                contract.agree
                contract.save
                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            when 'audit_refuse'
                contract.refuse
                contract.save

                contract_history = ContractHistory.new
                contract_history.item = "contract"
                contract_history.old_id = contract.id
                contract_history.new_id = contract.id
                contract_history.reason = params['reason']
                contract_history.user_id = user_id
                contract_history.natural_language = "拒绝了合同审批，原因如下：#{params['reason']}。"
                contract_history.save
                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            when 'sign'
                contract.sign
                contract.signed_at = Time.now
                contract.save

                #签署合同
                if is_local
                    #在本机上调试时只发给Terry
                    target_ids = [5]
                else
                    target_ids = []
                    #负责BA、BA经理、货运、会计、出纳、财务经理、BOSS、副总，这些是公共的
                    target_ids << contract.dealer.id
                    target_ids << contract.dealer.get_direct_manager_id
                    target_ids << User.freighter.map(&:id)
                    target_ids << User.accounting.map(&:id)
                    target_ids << User.cashier.map(&:id)
                    target_ids << Department.find(2).manager_id
                    target_ids << 1
                    target_ids << 2
                    if [1, 3].include? contract['contract_type'].to_i
                        #合同类型是“销售合同”或者“租借/试用合同”时→负责工程师、负责经理，如果负责工程师是TSD的则加上技术助理
                        target_ids << contract.signer.id
                        target_ids << contract.signer.get_direct_manager_id
                        target_ids << User.supporter_assistant.map(&:id) if User.supporter.map(&:id).include? (contract.signer.id)
                    else
                        #合同类型是“服务合同”时→技术经理、技术助理
                        target_ids << Department.find(4).manager_id
                        target_ids << User.supporter_assistant.map(&:id)
                    end
                    target_ids = target_ids.flatten.uniq
                end

                target_ids.each do |target_id|
                    #消息通知
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "新合同已签署：#{contract.number.to_eim_message_link(sn)}",
                        :receiver_user_id => target_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)

                end
                #邮件通知
                UserMailer.contract_sign_email(contract, target_ids).deliver

                #加一条日志到对应的个案（如果有）里，并给该个案加上end_at时间
                #事实上个案永远不会真正地“结束”，所以end_at只用作标记“是否签合同”，后续还有维修什么的可能
                if !contract.quote.blank?
                    process = Dictionary.where("data_type = 'sales_processes' and value = ?", 27).first.display
                    salelog_params = {
                        :process => 27,
                        :contact_at => Time.now,
                        :salecase_id => contract.quote.quotable.salecase.id,
                        :user_id => contract.quote.quotable.salecase.user.id,
                        :comment => nil,
                        :natural_language => "#{process}：合同#{contract.number}已经签署"
                    }
                    salelog = Salelog.new(salelog_params)
                    salelog.save

                    salecase = salelog.salecase
                    salecase.end_at = Time.now
                    salecase.save
                end

                if contract.does_need_install?
                    if is_local
                        #在本机上调试时只发给Terry
                        target_ids = [5]
                    else
                        #发合同预定安装日期的消息给：
                        #负责销售、销售经理、技术助理、技术经理、负责BA
                        target_ids = []
                        target_ids << contract.signer.id
                        target_ids << contract.signer.get_direct_manager_id
                        target_ids << User.supporter_assistant.map(&:id)
                        target_ids << Department.find(4).manager_id
                        target_ids << contract.dealer.id
                        target_ids = target_ids.flatten.uniq

                    end
                    target_ids.each do |target_id|
                        #消息通知
                        sn = (Time.now.to_f*1000).ceil
                        message_params = {
                            :content => "合同中有产品需要安装：#{contract.number.to_eim_message_link(sn)}",
                            :receiver_user_id => target_id,
                            :send_at => Time.now,
                            :sn => sn
                        }
                        PersonalMessage.create_or_update_with(message_params, user_id)

                    end
                    #邮件通知
                    UserMailer.contract_install_email(contract, target_ids).deliver
                end
                contract.gen_receivable_when_sign(user_id)

                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            when 'complete'
                contract.complete
                contract.save
                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            when 'cancel'
                contract.cancel
                contract.save
                return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
            else
                p "zzz"
        end

    end

    def self.update_customer_info_with(params, user_id)
        contract = Contract.find(params['id'])
        contract_history = ContractHistory.new
        modify_detail_array = []

        item = "合同信息"
        message = $etsc_update_ok
        fields_to_be_updated = %w(customer_unit_id buyer_customer_id end_user_customer_id)
        fields_to_be_updated.each do |field|
            case field
                when "customer_unit_id"
                    modify_detail_array << "客户单位从#{contract.customer_unit.name}修改为#{CustomerUnit.find(params['customer_unit_id']).name}" if contract.customer_unit.id.to_s != params['customer_unit_id']
                when "buyer_customer_id"
                    modify_detail_array << "客户联系人从#{contract.buyer.name}修改为#{Customer.find(params['buyer_customer_id']).name}" if contract.buyer_customer_id.to_s != params['buyer_customer_id']
                when "end_user_customer_id"
                    modify_detail_array << "客户使用人从#{contract.end_user.name}修改为#{Customer.find(params['end_user_customer_id']).name}" if contract.end_user_customer_id.to_s != params['end_user_customer_id']
                else
                    # type code here
            end
            contract[field] = params[field]
        end
        contract.save

        contract_history.item = "contract"
        contract_history.old_id = contract.id
        contract_history.new_id = contract.id
        contract_history.user_id = user_id
        contract_history.natural_language = "修改了合同信息，改动如下：#{modify_detail_array.join("、")}。"
        contract_history.save

        return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
    end

    def self.update_business_info_with(params, user_id)
        contract = Contract.find(params['id'])
        contract_history = ContractHistory.new
        modify_detail_array = []

        item = "合同信息"
        message = $etsc_update_ok
        fields_to_be_updated = %w(business_unit_id business_contact_id)
        fields_to_be_updated.each do |field|
            case field
                when "business_unit_id"
                    modify_detail_array << "商务相关单位从#{contract.business_unit.blank? ? "无" : contract.business_unit.name}修改为#{params['business_unit_id'].blank? ? "无" : BusinessUnit.find(params['business_unit_id']).name}" if contract.business_unit_id.to_s != params['business_unit_id']
                    contract['business_unit_id'] = params['business_unit_id']
                when "business_contact_id"
                    if params['business_unit_id'].blank?
                        #如果传来的商务相关单位为空，则联系人也为空
                        modify_detail_array << "商务相关联系人从#{contract.business_contact.name}修改为无"
                        contract['business_contact_id'] = nil
                    else
                        #binding.pry
                        modify_detail_array << "商务相关联系人从#{contract.business_contact.blank? ? "无" : contract.business_contact.name}修改为#{BusinessContact.find(params['business_contact_id']).name}" if contract.business_contact_id.to_s != params['business_contact_id']
                        contract['business_contact_id'] = params['business_contact_id']
                    end
                else
                    # type code here
            end
        end
        contract.save

        contract_history.item = "contract"
        contract_history.old_id = contract.id
        contract_history.new_id = contract.id
        contract_history.user_id = user_id
        contract_history.natural_language = "修改了合同信息，改动如下：#{modify_detail_array.join("、")}。"
        contract_history.save

        return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
    end

    def self.update_user_info_with(params, user_id)
        contract = Contract.find(params['id'])
        contract_history = ContractHistory.new
        modify_detail_array = []

        item = "合同信息"
        message = $etsc_update_ok
        fields_to_be_updated = %w(our_company_id signer_user_id)
        fields_to_be_updated.each do |field|
            case field
                when "our_company_id"
                    modify_detail_array << "卖方公司从#{contract.our_company.name}修改为#{OurCompany.find(params['our_company_id']).name}" if contract.our_company_id.to_s != params['our_company_id']
                when "signer_user_id"
                    modify_detail_array << "销售工程师从#{contract.signer.name}修改为#{User.find(params['signer_user_id']).name}" if contract.signer_user_id.to_s != params['signer_user_id']
                else
                    # type code here
            end
            contract[field] = params[field]
        end
        contract.save

        contract_history.item = "contract"
        contract_history.old_id = contract.id
        contract_history.new_id = contract.id
        contract_history.user_id = user_id
        contract_history.natural_language = "修改了合同信息，改动如下：#{modify_detail_array.join("、")}。"
        contract_history.save

        return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
    end

    def self.update_contract_info_with(params, user_id, is_local)
        contract = Contract.find(params['id'])
        contract_history = ContractHistory.new
        modify_detail_array = []
        mail_modify_detail_array = []

        item = "合同信息"
        message = $etsc_update_ok
        fields_to_be_updated = %w(customer_number summary requirement_id contract_type exchange_rate rmb does_need_install
            does_need_lc lc_number pay_mode_id comment sum_currency_id sum_amount
        )
        #binding.pry
        fields_to_be_updated.each do |field|
            case field
                when "customer_number"
                    modify_detail_array << "客户合同号从#{contract[field].blank? ? "无" : contract[field]}修改为#{params[field].blank? ? "无" : params[field]}" if contract[field] != params[field]
                when "summary"
                    modify_detail_array << "合同摘要从#{contract[field].blank? ? "无" : contract[field]}修改为#{params[field].blank? ? "无" : params[field]}" if contract[field] != params[field]
                when "requirement_id"
                    modify_detail_array << "供求类别从#{contract[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", "requirement_sort", contract[field]).first.display}修改为#{params[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", "requirement_sort", params[field]).first.display}" if contract[field].to_s != params[field]
                when "contract_type"
                    modify_detail_array << "合同类别从#{contract[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, contract[field]).first.display}修改为#{params[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, params[field]).first.display}" if contract[field].to_s != params[field]
                when "sum_currency_id"
                    modify_detail_array << "合同币种从#{contract['currency_id'].blank? ? "无" : Currency.find(contract['currency_id']).name}修改为#{params[field].blank? ? "无" : Currency.find(params[field]).name}" if contract['currency_id'].to_s != params[field]
                    contract['currency_id'] = params[field]
                when "sum_amount"
                    modify_detail_array << "合同金额从#{contract['sum'].blank? ? "无" : contract['sum']}修改为#{params[field].blank? ? "无" : params[field]}" if contract['sum'].to_f != params[field].to_f
                    mail_modify_detail_array << "合同金额从#{contract['sum'].blank? ? "无" : contract['sum']}修改为#{params[field].blank? ? "无" : params[field]}" if contract['sum'].to_f != params[field].to_f
                    contract['sum'] = params[field]
                when "exchange_rate"
                    modify_detail_array << "汇率从#{contract[field].blank? ? "无" : contract[field]}修改为#{params[field].blank? ? "无" : params[field]}" if contract[field].to_f != params[field].to_f
                when "rmb"
                    modify_detail_array << "折合人民币从#{contract[field].blank? ? "无" : contract[field]}修改为#{params[field].blank? ? "无" : params[field]}" if contract[field].to_f != params[field].to_f
                when "does_need_install"
                    #binding.pry
                    if params[field] != "on"
                        #说明新值是“不需要安装”
                        modify_detail_array << "安装需求从需要安装修改为不需要安装" if (contract[field] or contract[field] == 1)
                    else
                        modify_detail_array << "安装需求从不需要安装修改为需要安装" if contract[field] != true and contract[field] != 1
                    end
                when "does_need_lc"
                    if params[field] != "on"
                        #说明新值是“不需要信用证”
                        modify_detail_array << "信用证情况从需要信用证修改为不需要信用证" if (contract[field] or contract[field] == 1)
                    else
                        modify_detail_array << "信用证情况从不需要信用证修改为需要信用证" if contract[field] != true and contract[field] != 1
                    end
                when "lc_number"
                    modify_detail_array << "信用证编号从从#{contract[field].blank? ? "无" : contract[field]}修改为#{params[field].blank? ? "无" : params[field]}" if contract[field].to_s != params[field].to_s
                when "pay_mode_id"
                    modify_detail_array << "付款方式从#{contract[field].blank? ? "无" : PayMode.find(contract[field]).name}修改为#{params[field].blank? ? "无" : PayMode.find(params[field]).name}" if contract[field].to_s != params[field]
                    mail_modify_detail_array << "付款方式从#{contract[field].blank? ? "无" : PayMode.find(contract[field]).name}修改为#{params[field].blank? ? "无" : PayMode.find(params[field]).name}" if contract[field].to_s != params[field]
                when "comment"
                    modify_detail_array << "备注从#{contract[field].blank? ? "无" : contract[field]}修改为#{params[field].blank? ? "无" : params[field]}" if contract[field] != params[field]
                else
                    # type code here
            end
            contract[field] = params[field]
        end
        #有真实的改动时才记录
        if modify_detail_array.size > 0
            #判断要不要审批
            customer_unit_level = contract.customer_unit.credit_level
            pay_mode_level = contract.pay_mode.credit_level
            #客户是A级客户，则可以用ABCDE方式的付款；客户是C级客户，则只能用CDE方式
            if customer_unit_level <= pay_mode_level or modify_detail_array.map{|p| p.include?("付款方式") ? 1 : 0}.sum == 0
                #付款方式在信用等级内，不用审批
                #或者改动中没有付款方式，也不审批
                contract.without_audit
                ##这里不动收款点，每个节点具体操作时现生成 20140124
                #contract.add_receivable
                ##contract.change_receivable_with(contract.pay_mode.name)
            else
                #不在，要审批
                #binding.pry
                contract.need_audit
                #发消息给合同负责工程师的直属经理，提示审批
                sn = (Time.now.to_f*1000).ceil
                link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:Contracts|item_sn:contract_audit_#{user_id}_#{contract.number}">点击查看</a>}
                message_params = {
                    :content => "有一份合同需要审批(#{contract.number})，#{link_str}",
                    :receiver_user_id => contract.signer.get_direct_manager_id,
                    :send_at => Time.now,
                    :sn => sn
                }
                PersonalMessage.create_or_update_with(message_params, user_id)
            end
            contract.save

            contract_history.item = "contract"
            contract_history.old_id = contract.id
            contract_history.new_id = contract.id
            contract_history.user_id = user_id
            contract_history.natural_language = "修改了合同信息，改动如下：#{modify_detail_array.join("、")}。"
            contract_history.save

            #签署后的改动才发消息
            if %w(d_progressing e_complete f_cancelled).include?(contract.state)
                if is_local
                    #在本机上调试时只发给Terry
                    target_ids = [5]
                else
                    #发已改变的消息给：
                    #负责销售、销售经理、会计、财务经理、负责BA、商务经理、副总
                    target_ids = []
                    #负责BA、BA经理、货运、会计、出纳、财务经理、副总，这些是公共的
                    target_ids << contract.dealer.id
                    target_ids << contract.dealer.get_direct_manager_id
                    target_ids << User.freighter.map(&:id)
                    target_ids << User.accounting.map(&:id)
                    target_ids << User.cashier.map(&:id)
                    target_ids << Department.find(2).manager_id
                    target_ids << 2
                    if [1, 3].include? contract['contract_type'].to_i
                        #合同类型是“销售合同”或者“租借/试用合同”时→负责工程师、负责经理，如果负责工程师是TSD的则加上技术助理
                        target_ids << contract.signer.id
                        target_ids << contract.signer.get_direct_manager_id
                        target_ids << User.supporter_assistant.map(&:id) if User.supporter.map(&:id).include? (contract.signer.id)
                    else
                        #合同类型是“服务合同”时→技术经理、技术助理
                        target_ids << Department.find(4).manager_id
                        target_ids << User.supporter_assistant.map(&:id)
                    end

                    target_ids = target_ids.flatten.uniq
                end

                target_ids.each do |target_id|
                    #消息通知
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "合同信息已经改变：#{contract.number.to_eim_message_link(sn)}",
                        :receiver_user_id => target_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
                #邮件通知
                UserMailer.contract_change_email(contract, target_ids).deliver if mail_modify_detail_array.size > 0
            end
        end

        return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
    end

    def self.update_financial_info_with(params, user_id)
        contract = Contract.find(params['id'])
        contract_history = ContractHistory.new
        modify_detail_array = []

        item = "合同收款信息"
        message = $etsc_update_ok
        fields_to_be_updated = %w(profit invoice invoiced_at)
        #binding.pry
        fields_to_be_updated.each do |field|
            case field
                when "profit"
                    modify_detail_array << "合同利润从#{contract[field].blank? ? "无" : "RMB#{contract[field]}"}修改为#{params[field].blank? ? "无" : "RMB#{params[field]}"}" if contract[field].to_f != params[field].to_f
                when "invoice"
                    modify_detail_array << "开票状态从#{contract[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", "invoice", contract[field]).first.display}修改为#{params[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", "invoice", params[field]).first.display}" if contract[field].to_s != params[field]
                when "invoiced_at"
                    modify_detail_array << "开票时间从#{contract[field].blank? ? "无" : contract[field].to_datetime.strftime("%Y-%m-%d")}修改为#{params[field].blank? ? "无" : params[field].to_datetime.strftime("%Y-%m-%d")}" if contract[field].to_s != params[field].to_s
                else
                    # type code here
            end
            contract[field] = params[field]
        end
        contract.save

        contract_history.item = "contract"
        contract_history.old_id = contract.id
        contract_history.new_id = contract.id
        contract_history.user_id = user_id
        contract_history.natural_language = "修改了合同信息，改动如下：#{modify_detail_array.join("、")}。"
        contract_history.save

        return {:success => true, :message => "#{item}#{message}", :contract_id => contract.id}
    end

    #转让合同给……
    def self.trans_to(params)
        #对目标合同循环
        contract_array = params[:contract_ids].split("|")
        contract_array.each do |contract|
            #转user
            update_contract = Contract.find(contract)
            update_contract.dealer_user_id = params[:trans_to]
            #update_contract.created_at =
            update_contract.save
        end
        return {:success => true, :message => "合同已经成功转让给#{User.find(params[:trans_to]).name}"}
    end

    def self.save_as_new_with(params, user_id)
        #binding.pry
        old_contract = Contract.find(params[:id])
        new_contract = old_contract.dup
        new_contract.number = gen_new_number_with_letter("C")
        new_contract.save
        old_contract_items = old_contract.contract_items
        old_contract_items.each do |contract_item|
            new_contract_item = contract_item.dup
            new_contract_item.contract_id = new_contract.id
            new_contract_item.serial_number = nil
            new_contract_item.purchase_order_id = nil
            new_contract_item.save
        end
        return {:success => true, :message => "已经成功保存为新合同"}
    end

    def change_receivable_with(pay_mode_name)
        reg = /(.*?)(\d+)([天|周|月])内付(\d+(?:\.\d+)?%|[A-Z]{3}\d+(?:\.\d+)?)\((电汇|信用证|现金)\)/
        pay_mode_name.split("，").each do |pay_point|
            refs = pay_point.match(reg)
            #binding.pry

            case refs[1]
                when "签合同后"
                    #看合同签了没
                    signed_at = self.signed_at
                    unless signed_at.blank?
                        receivable = Receivable.new

                        if refs[4].match(/(.*)%/)
                            #如果是百分比方式，则应收款用总价乘出来
                            receivable.amount = self.sum.to_f * (refs[4].match(/(.*)%/)[1]).to_f / 100.0
                        else
                            #如果是金额形式则直接写
                            receivable.amount = (refs[4].match(/[A-Z]{3}(.*)/)[1]).to_f
                        end
                        receivable.contract_id = self.id
                        case refs[3]
                            when "天"
                                defer_days = refs[2].to_i
                            when "周"
                                defer_days = refs[2].to_i * 7
                            when "月"
                                defer_days = refs[2].to_i * 30
                            else

                        end
                        receivable.expected_receive_at = signed_at + defer_days.days
                        receivable.save
                    end
                when "发货前"
                    #用“预计发货时间”来计算。
                    #取最大值，因为都预计好了才能收款。
                    #有空值说明估计不出，不管。
                    check_and_accept_array = ContractItem.in_contract(id).current.map(&:appointed_leave_factory_at)
                    latest_send_time = check_and_accept_array.map(&:to_s).max

                    unless ContractItem.in_contract(id).current.map(&:appointed_leave_factory_at).include?(nil)
                        receivable = Receivable.new

                        if refs[4].match(/(.*)%/)
                            #如果是百分比方式，则应收款用总价乘出来
                            receivable.amount = self.sum.to_f * (refs[4].match(/(.*)%/)[1]).to_f / 100.0
                        else
                            #如果是金额形式则直接写
                            receivable.amount = (refs[4].match(/[A-Z]{3}(.*)/)[1]).to_f
                        end
                        receivable.contract_id = self.id
                        case refs[3]
                            when "天"
                                defer_days = refs[2].to_i
                            when "周"
                                defer_days = refs[2].to_i * 7
                            when "月"
                                defer_days = refs[2].to_i * 30
                            else

                        end
                        receivable.expected_receive_at = latest_send_time.to_date + defer_days.days
                        receivable.save
                    end
                when "发货后"
                    #用“实际发货时间”来计算。
                    #取最大值，因为货都发完了才能收款。
                    #有空值说明还没发货，不管。
                    check_and_accept_array = ContractItem.in_contract(id).current.map(&:actually_leave_factory_at)
                    latest_send_time = check_and_accept_array.map(&:to_s).max

                    unless ContractItem.in_contract(id).current.map(&:actually_leave_factory_at).include?(nil)
                        receivable = Receivable.new

                        if refs[4].match(/(.*)%/)
                            #如果是百分比方式，则应收款用总价乘出来
                            receivable.amount = self.sum.to_f * (refs[4].match(/(.*)%/)[1]).to_f / 100.0
                        else
                            #如果是金额形式则直接写
                            receivable.amount = (refs[4].match(/[A-Z]{3}(.*)/)[1]).to_f
                        end
                        receivable.contract_id = self.id
                        case refs[3]
                            when "天"
                                defer_days = refs[2].to_i
                            when "周"
                                defer_days = refs[2].to_i * 7
                            when "月"
                                defer_days = refs[2].to_i * 30
                            else

                        end
                        receivable.expected_receive_at = latest_send_time.to_date + defer_days.days
                        receivable.save
                    end
                when "验收后"
                    #用“验收时间”来计算。
                    #取最大值，因为货都验收完了才能收款。
                    #有空值说明还没验收，不管。
                    check_and_accept_array = ContractItem.in_contract(id).current.map(&:check_and_accept_at)
                    latest_send_time = check_and_accept_array.map(&:to_s).max

                    unless ContractItem.in_contract(id).current.map(&:check_and_accept_at).include?(nil)
                        receivable = Receivable.new

                        if refs[4].match(/(.*)%/)
                            #如果是百分比方式，则应收款用总价乘出来
                            receivable.amount = self.sum.to_f * (refs[4].match(/(.*)%/)[1]).to_f / 100.0
                        else
                            #如果是金额形式则直接写
                            receivable.amount = (refs[4].match(/[A-Z]{3}(.*)/)[1]).to_f
                        end
                        receivable.contract_id = self.id
                        case refs[3]
                            when "天"
                                defer_days = refs[2].to_i
                            when "周"
                                defer_days = refs[2].to_i * 7
                            when "月"
                                defer_days = refs[2].to_i * 30
                            else

                        end
                        receivable.expected_receive_at = latest_send_time.to_date + defer_days.days
                        receivable.save
                    end
                else

            end
        end
    end

    def gen_receivable_when_sign(user_id)
        reg = /(.*?)(\d+)([天|周|月])内付(\d+(?:\.\d+)?%|[A-Z]{3}\d+(?:\.\d+)?)\((电汇|信用证|现金)\)/
        pay_mode_name = self.pay_mode.name
        #binding.pry
        pay_mode_name.split("，").each do |pay_point|
            refs = pay_point.match(reg)
            Receivable.create_with_time(self, user_id, refs, signed_at) if refs[1] == "答合同后"
        end
    end
    def gen_receivable_when_appoint(user_id)
        reg = /(.*?)(\d+)([天|周|月])内付(\d+(?:\.\d+)?%|[A-Z]{3}\d+(?:\.\d+)?)\((电汇|信用证|现金)\)/
        pay_mode_name = self.pay_mode.name
        #binding.pry
        pay_mode_name.split("，").each do |pay_point|
            refs = pay_point.match(reg)
            appointed_leave_factory_at = self.contract_items.current.map{|p| p['appointed_leave_factory_at']}.min
            Receivable.create_with_time(self, user_id, refs, appointed_leave_factory_at, "before") if refs[1] == "发货前"
        end
    end
    def gen_receivable_when_leave(user_id)
        reg = /(.*?)(\d+)([天|周|月])内付(\d+(?:\.\d+)?%|[A-Z]{3}\d+(?:\.\d+)?)\((电汇|信用证|现金)\)/
        pay_mode_name = self.pay_mode.name
        #binding.pry
        pay_mode_name.split("，").each do |pay_point|
            refs = pay_point.match(reg)
            leave_etsc_at = self.contract_items.current.map{|p| p['leave_etsc_at']}.max
            Receivable.create_with_time(self, user_id, refs, leave_etsc_at) if refs[1] == "发货后"
        end
    end
    def gen_receivable_when_check(user_id)
        reg = /(.*?)(\d+)([天|周|月])内付(\d+(?:\.\d+)?%|[A-Z]{3}\d+(?:\.\d+)?)\((电汇|信用证|现金)\)/
        pay_mode_name = self.pay_mode.name
        #binding.pry
        pay_mode_name.split("，").each do |pay_point|
            refs = pay_point.match(reg)
            check_and_accept_at = self.contract_items.current.map{|p| p['check_and_accept_at']}.max
            Receivable.create_with_time(self, user_id, refs, check_and_accept_at) if refs[1] == "验收后"
        end
    end

    def self.count_via_vendor_unit(start_at, end_at, vendor_unit_id)
        contracts = where("contracts.signed_at >= ? and contracts.signed_at <= ?", start_at, end_at).includes(:contract_items => {:product => :seller}).where("vendor_units.id = ?", vendor_unit_id)
        return contracts.map(&:number).size
    end

    def self.count_via_product(start_at, end_at, product_id)
        contracts = where("contracts.signed_at >= ? and contracts.signed_at <= ?", start_at, end_at).includes(:contract_items => :product).where("products.id = ?", product_id)
        return contracts.map(&:number).size
    end

    def self.count_via_user(start_at, end_at, user_or_group, id)
        if user_or_group == "user"
            return where("signed_at >= ? and signed_at <= ? and signer_user_id = ?", start_at, end_at, id).size
        else
            return 0#合同不分组
        end
    end

    def self.count_via_area(start_at, end_at, area_id)
        return where("contracts.signed_at >= ? and contracts.signed_at <= ? and areas.id = ?", start_at, end_at, area_id)\
        .includes(:customer_unit => {:city => {:prvc => :area}}).size
    end

    #查欠款数
    def check_collection(end_time)
        urge_payment = []
        collection_array = collections.select{|p| p['is_history'].blank?}.sort_by{|p| p['received_at']}.each_with_index.map{|p, i| [i, p['amount'].to_f + p['compensation_amount'].to_f, p['received_at']]}
        receivables.select{|p| p['is_history'].blank?}.sort_by{|p| p['expected_receive_at']}.each_with_index do |receivable, index|
            #p "第#{index + 1}笔应收"
            #p collection_array
            #p "*******"
            if collection_array == []
                #p "--没有可用的已收了"
                #p "--缺#{receivable['amount']}"
                urge_payment << [receivable['amount'].to_f, (end_time.to_date - receivable['expected_receive_at']).to_i]
            end
            if receivable['expected_receive_at'].strftime("%Y-%m-%d") <= end_time
                0.upto(collection_array.length - 1) do |collection_i|
                    #binding.pry
                    #p "--用前#{collection_i + 1}笔已收来比较"
                    sum_till_i = collection_array[0..collection_i].map{|p| p[1]}.sum
                    if sum_till_i - receivable['amount'] > 0
                        #p "--有节余，余#{sum_till_i - receivable['amount']}"
                        collection_to_be_added = [collection_i - 1, sum_till_i - receivable['amount'], receivables[collection_i - 1]['expected_receive_at']]

                        collection_array = [collection_to_be_added] + collection_array[(collection_i + 1)..-1]
                        #p collection_array
                        break
                        #binding.pry
                    elsif sum_till_i - receivable['amount'] == 0
                        #p "--正好"
                        collection_array = collection_array[(collection_i + 1)..-1]
                        #p collection_array
                        break
                    else
                        #p "--无节余，缺#{receivable['amount'] - sum_till_i}"
                        #p "--后面还有#{collection_array.length - 1 - collection_i}笔可参与计算的已收"
                        if collection_array.length - 1 - collection_i == 0
                            #如果没有可用的已收了，则此下一笔也无可用的。而且要催
                            collection_array = []
                            urge_payment << [(receivable['amount'] - sum_till_i), (end_time.to_date - receivable['expected_receive_at']).to_i]
                        end
                    end
                end
            end
        end
        return urge_payment
    end
end

