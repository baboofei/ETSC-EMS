# encoding: utf-8
class AdminInventory < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :buy_price, :buyer_user_id, :comment, :count_unit, :currency_id, :current_quantity, :financial_price,
                    :inventory_level, :inventory_type, :keep_at, :keeper_user_id, :model, :name, :number, :ownership, :project,
                    :rmb, :sn, :state, :vendor_id, :vendor_unit_id, :expire_at, :expire_warranty_at
    belongs_to :currency

    belongs_to :keeper, :class_name => 'User', :foreign_key => 'keeper_user_id'
    belongs_to :buyer, :class_name => 'User', :foreign_key => 'buyer_user_id'
    belongs_to :user, :class_name => 'User', :foreign_key => 'user_id'

    belongs_to :owned_by, :class_name => 'VendorUnit', :foreign_key => 'ownership'
    belongs_to :bought_from, :class_name => 'VendorUnit', :foreign_key => 'vendor_unit_id'
    belongs_to :bought_from_person, :class_name => 'Vendor', :foreign_key => 'vendor_id'

    belongs_to :material_code, :class_name => 'MaterialCode', :foreign_key => 'inventory_type'
    has_many :before_histories, :class_name => "AdminInventoryHistory", :foreign_key => "before_inventory_id"
    has_many :after_histories, :class_name => "AdminInventoryHistory", :foreign_key => "after_inventory_id"

    scope :reversible, where("state in ('a_for_stock', 'b_stocking', 'x_damaged', 'g_using', 'h_loaned')")
    scope :irreversible, where("state in ('y_scrapped', 'i_sold')")

    scope :for_stock, where(state: "a_for_stock")
    scope :auditing, where(state: "c_auditing")
    scope :for_out_stock, where("state in ('d_for_use', 'e_for_loan', 'f_for_sell')")
    scope :for_reject, where(state: "j_for_reject")

    scope :available, where("current_quantity > 0") #允许为0，但只显示数量大于0的

    def max_sn
        if self.sn
            self.sn.split(",").max
        else
            ""
        end
    end

    def max_number
        if self.number
            self.number.split("、").max
        else
            ""
        end
    end

    def self.with_sn(apply_for_sn)
        where("apply_for_sn like ?", "%#{apply_for_sn}")
    end
    state_machine :initial => :start do
        #开始            start
        #待入库          a_for_stock   [沙漏]
        #库存中          b_stocking    [箱子]
        #出库审批中      c_auditing    [写字]
        #待领用          d_for_use        ┓
        #待租借          e_for_loan      ┣[沙漏&箭头]
        #待售出          f_for_sell     ┃
        #待退货          j_for_reject  ┛
        #已损坏          x_damaged     [损坏箱子]
        #已报废          y_scrapped    [垃圾箱]
        #被领用          g_using       [虚框箱子&用户]
        #被租借          h_loaned      [虚框箱子]
        #被卖出          i_sold        [虚框箱子&美元符号]
        #已退货          k_rejected    [虚框箱子&箭头]
        event :buy_in do
            #采购买入，尚未入库
            transition [:start] => :a_for_stock
        end
        event :stock_in do
            #入库
            transition [:a_for_stock] => :b_stocking
        end
        event :apply_for_use_auditing do
            #申请出库（要审批）
            transition [:b_stocking] => :c_auditing
        end
        event :refuse do
            #驳回
            transition [:c_auditing] => :b_stocking
        end
        event :agree do
            #通过
            transition [:c_auditing] => :d_for_use
        end
        event :apply_for_use do
            #申请出库（不审批）
            transition [:b_stocking] => :d_for_use
        end
        event :stock_out_use do
            #办出库（领用）
            transition [:d_for_use] => :g_using
        end
        event :apply_for_loan do
            #申请租借
            transition [:b_stocking] => :e_for_loan
        end
        event :stock_out_loan do
            #办出库（租借）
            transition [:e_for_loan] => :h_loaned
        end
        event :apply_for_sell do
            #申请售出
            transition [:b_stocking, :h_loaned] => :f_for_sell
        end
        event :stock_out_sell do
            #办出库（出售）
            transition [:f_for_sell] => :i_sold
        end
        event :sell do
            #租借转售出
            transition [:h_loaned] => :i_sold
        end
        event :return do
            #领用、租借的归还
            transition [:g_using, :h_loaned] => :a_for_stock
        end
        event :damage do
            #报损
            transition [:b_stocking, :a_for_stock] => :x_damaged
        end
        event :fix do
            #修好
            transition [:x_damaged] => :b_stocking
        end
        event :scrap do
            #报废（库中/报损转）
            transition [:b_stocking, :x_damaged, :a_for_stock] => :y_scrapped
        end
        event :apply_for_reject do
            #申请退货
            transition [:b_stocking] => :j_for_reject
        end
        event :reject do
            #退货
            transition [:j_for_reject] => :k_rejected
        end

        #event :damage do
        #    #报损
        #    transition [:b_stocking] => :x_damaged
        #end
        #event :scrap do
        #    #报废
        #    transition [:b_stocking] => :y_scrapped
        #end
        #event :adopt do
        #    #领用
        #    transition [:b_stocking] => :g_using
        #end
        #event :loan do
        #    #借租给客户
        #    transition [:b_stocking] => :h_loaned
        #end
        #event :sell do
        #    #卖给客户
        #    transition [:b_stocking] => :i_sold
        #end
    end

    def for_grid_json(user_id)
        attr = attributes
        attr['buyer_user_name'] = buyer.name unless buyer.blank?
        attr['buyer>id'] = buyer.id unless buyer.blank?
        attr['keeper_user_name'] = keeper.name unless keeper.blank?
        attr['keeper>id'] = keeper.id unless keeper.blank?
        attr['user_name'] = user.name unless user.blank?
        if material_code
            attr['material_code>id'] = material_code.id
            attr['material_code>(name|code|description)'] = material_code.name
        end
        attr['currency_name'] = currency.name unless currency.blank?
        attr['bought_from>(name|en_name|unit_aliases>unit_alias)'] = bought_from.name unless bought_from.blank?
        attr['vendor_name'] = bought_from_person.name unless bought_from_person.blank?
        attr['ownership_name'] = owned_by.name unless owned_by.blank?
        attr
    end

    def for_out_stock_grid_json(user_id)
        attr = attributes
        attr['buyer_user_name'] = buyer.name unless buyer.blank?
        attr['currency_name'] = currency.name unless currency.blank?
        attr['vendor_unit_name'] = bought_from.name unless bought_from.blank?
        attr['vendor_name'] = bought_from_person.name unless bought_from_person.blank?
        attr['sn'] = AdminInventory.find(in_stock_source).sn
        attr['number'] = AdminInventory.find(in_stock_source).number
        attr
    end

    def for_return_grid_json(user_id)
        attr = attributes
        attr['buyer_user_name'] = buyer.name unless buyer.blank?
        attr['currency_name'] = currency.name unless currency.blank?
        attr['vendor_unit_name'] = bought_from.name unless bought_from.blank?
        attr['vendor_name'] = bought_from_person.name unless bought_from_person.blank?
        attr['sn'] = AdminInventory.find(out_stock_source).sn
        attr['number'] = AdminInventory.find(out_stock_source).number
        attr
    end

    def for_reject_grid_json(user_id)
        attr = attributes
        attr['buyer_user_name'] = buyer.name unless buyer.blank?
        attr['currency_name'] = currency.name unless currency.blank?
        attr['vendor_unit_name'] = bought_from.name unless bought_from.blank?
        attr['vendor_name'] = bought_from_person.name unless bought_from_person.blank?
        attr['sn'] = AdminInventory.find(in_stock_source).sn
        attr['number'] = AdminInventory.find(in_stock_source).number
        attr
    end

    def self.create_or_update_with(params, user_id, is_local)
        item = "物品"
        #if params[:id].blank?
        #    admin_item = AdminInventory.new
        #else
        #    admin_item = AdminInventory.find(params[:id])
        #end
        #binding.pry
        case params['event']
            when 'buy_in'
                message = "入库请求已提交给库管"

                grid_data_array = JSON.parse(params['grid_data'])
                apply_sn = (Time.now.to_f*1000).ceil
                grid_data_array.each do |grid_data|
                    admin_item = AdminInventory.new

                    fields_to_be_updated = %w(name model description current_quantity count_unit buy_price financial_price
                        currency_id rmb vendor_unit_id vendor_id comment expire_at expire_warranty_at
                    )
                    fields_to_be_updated.each do |field|
                        admin_item[field] = grid_data[field]
                    end
                    admin_item['buyer_user_id'] = grid_data['buyer>id']
                    #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                    admin_item.apply_for_sn = "#{params['event']}_#{grid_data['buyer>id']}_#{apply_sn}"
                    admin_item.user_id = user_id
                    admin_item.ownership = 42 #东隆
                    admin_item.buy_in
                    admin_item.save

                    #写入操作日志
                    #binding.pry
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => admin_item.id,
                        :user_id => user_id,
                        :act_type => params['event'],
                        :natural_language => "#{User.find(grid_data['buyer>id']).name}于#{Time.now.strftime("%Y-%m-%d")}购入了#{admin_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}，描述为#{admin_item.description}，单价为RMB#{"%.2f" % admin_item.rmb}。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end

                #给综管库管群发消息
                admin_keeper_ids = User.admin_keeper.map(&:id)
                admin_keeper_ids.each do |admin_keeper_id|
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些物品需要入库(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})，#{link_str}",
                        :receiver_user_id => admin_keeper_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end

                #打印入库单
                gen_stock_in_pdf(grid_data_array, is_local)

            when 'stock_in'
                message = "已经入库"
                admin_item = AdminInventory.find(params['id'])

                fields_to_be_updated = %w(inventory_type financial_type inventory_level keep_at current_quantity sn created_at comment)
                fields_to_be_updated.each do |field|
                    admin_item[field] = params[field]
                end
                admin_item['ownership'] = params['vendor_unit_id']
                admin_item['user_id'] = user_id
                admin_item['keeper>id'] = user_id

                if params['does_generate_number'] == 'on'
                    #根据数量循环生成编号
                    quantity = admin_item['current_quantity']
                    admin_item.number = AdminInventory.gen_new_number(quantity)
                end
                admin_item.apply_for_sn = nil
                admin_item.stock_in
                admin_item.save

                #写入操作日志
                keep_at = Dictionary.where("data_type = ? and value = ?", "stock_keep_at", admin_item.keep_at).first.display
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}给#{admin_item['current_quantity'].trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了入库，存放地点为#{keep_at}。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'apply_for_use'
                #binding.pry
                grid_data_array = JSON.parse(params['grid_data'])
                apply_sn = (Time.now.to_f*1000).ceil
                case params['project_option']
                    when 'office'
                        project_option = "办公"
                    when 'customer'
                        project_option = "送客户"
                    when 'project'
                        project_option = "公司项目#{params['project_number']}"
                    when 'tsd'
                        project_option = "TSD"
                    when 'development'
                        project_option = "研发"
                    when 'exhibition'
                        project_option = params['exhibition_name']
                    when 'other'
                        project_option = params['other_detail']
                end
                #判断够不够审批标准，走不同的流程
                auditing_target = "none"
                #大于副总审批金额的给副总批
                grid_data_array.each do |data|
                    #binding.pry
                    if data['rmb'] >= MaterialCode.where("id = ?", data['material_code>id'])[0].vp_audit_amount
                        auditing_target = "vp"
                        break
                    end
                end
                #小于副总审批金额时，经理本身领东西不用批
                if auditing_target == "none"
                    unless User.find(user_id).is_manager?
                        grid_data_array.each do |data|
                            if data['rmb'] >= MaterialCode.where("id = ?", data['material_code>id'])[0].manager_audit_amount
                                auditing_target = "manager"
                                break
                            end
                        end
                    end
                end

                #max_unit_price = grid_data_array.map{|p| p['rmb']}.max
                #manager_auditing_limit = 500#TODO 应该是200，测试方便
                #vp_auditing_limit = 1000
                #auditing_target = "none"
                #if user_id != 1 && user_id != 2
                #    if User.find(user_id).is_manager?
                #        if max_unit_price > vp_auditing_limit
                #            auditing_target = "vp"
                #        end
                #    else
                #        if max_unit_price > manager_auditing_limit
                #            if max_unit_price > vp_auditing_limit
                #                auditing_target = "vp"
                #            else
                #                auditing_target = "manager"
                #            end
                #        end
                #    end
                #end
                if auditing_target == "vp" || auditing_target == "manager"
                    message = "领用请求已发至审批者"
                    if auditing_target == "vp"
                        #目前副总只有一个
                        receiver = 2
                    else
                        receiver = User.find(user_id).get_direct_manager_id
                    end
                    grid_data_array.each do |grid_data|
                        admin_item = AdminInventory.find(grid_data['id'])
                        #对每一条物品，比较库存中的物品和领用申请的物品数量
                        apply_for_quantity = grid_data['current_quantity']
                        stock_quantity = admin_item['current_quantity']
                        if stock_quantity <= apply_for_quantity
                            #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                            demand_quantity  = stock_quantity
                        else
                            #分两条记录
                            demand_quantity = apply_for_quantity
                        end
                        split_item = admin_item.dup
                        remain_item = admin_item
                        #remain_item = admin_item
                        split_item['current_quantity'] = demand_quantity
                        remain_item['current_quantity'] = stock_quantity - demand_quantity
                        split_item['in_stock_source'] = admin_item.id #“库存源”
                        remain_item.save
                        #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                        split_item.apply_for_sn = "#{params['event']}_#{user_id}_#{apply_sn}"
                        #拆分的时候不带序列号，真正操作的时候再去溯源
                        split_item.sn = nil
                        split_item.number = nil
                        split_item.user_id = user_id
                        split_item.project = project_option
                        split_item.apply_for_use_auditing
                        split_item.save

                        #写入操作日志
                        item_history_params = {
                            :act_at => Time.now,
                            :before_inventory_id => admin_item.id,
                            :after_inventory_id => split_item.id,
                            :user_id => user_id,
                            :act_type => 'apply_for_use_auditing',
                            :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}申请领用#{apply_for_quantity}#{split_item.count_unit}#{split_item.name}。"
                        }
                        AdminInventoryHistory.create_with(item_history_params, user_id)
                    end
                    #发审批消息
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:apply_for_use_auditing_#{user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些物品领用需要审批(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})，用途为#{project_option}，#{link_str}",
                        :receiver_user_id => receiver,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                else
                    message = "领用请求已经提交"
                    receivers = User.admin_keeper.map(&:id)
                    grid_data_array.each do |grid_data|
                        admin_item = AdminInventory.find(grid_data['id'])
                        #对每一条物品，比较库存中的物品和领用申请人的物品数量
                        apply_for_quantity = grid_data['current_quantity']
                        stock_quantity = admin_item['current_quantity']
                        if stock_quantity <= apply_for_quantity
                            #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                            demand_quantity  = stock_quantity
                        else
                            #分两条记录
                            demand_quantity = apply_for_quantity
                        end
                        split_item = admin_item.dup
                        remain_item = admin_item
                        #remain_item = admin_item
                        split_item['current_quantity'] = demand_quantity
                        remain_item['current_quantity'] = stock_quantity - demand_quantity
                        split_item['in_stock_source'] = admin_item.id #“库存源”
                        remain_item.save
                        #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                        split_item.apply_for_sn = "#{params['event']}_#{user_id}_#{apply_sn}"
                        #拆分的时候不带序列号，真正操作的时候再去溯源
                        split_item.sn = nil
                        split_item.number = nil
                        split_item.user_id = user_id
                        split_item.project = project_option
                        split_item.apply_for_use
                        split_item.save

                        #写入操作日志
                        item_history_params = {
                            :act_at => Time.now,
                            :before_inventory_id => admin_item.id,
                            :after_inventory_id => split_item.id,
                            :user_id => user_id,
                            :act_type => params['event'],
                            :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}申请领用#{apply_for_quantity}#{admin_item.count_unit}#{admin_item.name}。"
                        }
                        AdminInventoryHistory.create_with(item_history_params, user_id)
                    end
                    #发申请领用消息
                    receivers.each do |receiver|
                        sn = (Time.now.to_f*1000).ceil
                        link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{user_id}_#{apply_sn}">点击查看</a>}
                        message_params = {
                            :content => "有一些物品需要领用(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})，用途为#{project_option}，#{link_str}",
                            :receiver_user_id => receiver,
                            :send_at => Time.now,
                            :sn => sn
                        }
                        PersonalMessage.create_or_update_with(message_params, user_id)
                    end
                end
            when 'agree'
                message = "审批通过，领用请求已经提交"
                receivers = User.admin_keeper.map(&:id)

                apply_sn = params['apply_for_sn'].split("_")[-1]
                apply_user_id = params['apply_for_sn'].split("_")[-2] #实际领用人
                admin_items = AdminInventory.where("apply_for_sn = ?", params['apply_for_sn'])
                admin_items.each do |admin_item|
                    admin_item.agree
                    admin_item.save

                    #写入操作日志
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => admin_item.id,
                        :user_id => user_id,
                        :act_type => params['event'],
                        :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}通过了领用#{admin_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}的审批。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end

                #发申请领用消息
                receivers.each do |receiver|
                    sn = (Time.now.to_f*1000).ceil
                    #binding.pry
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{apply_user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些物品需要领用(#{admin_items.map{|p| p['name']}.join("、").truncate(40)})，用途为#{admin_items[0]['project']}，审核已被批准，#{link_str}。",
                        :receiver_user_id => receiver,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
            when 'stock_out_use'
                message = "已经领用成功"
                admin_item = AdminInventory.find(params['id'])
                #stock_same_item = AdminInventory.where("name")
                admin_item.keep_at = 9 #被领用
                #binding.pry
                admin_item.keeper_user_id = admin_item.user_id
                admin_item.user_id = user_id
                admin_item.stock_out_use
                admin_item.apply_for_sn = nil

                source_item = AdminInventory.find(admin_item['in_stock_source'])
                #如果有“源头”，并且有序列号或者编号的时候，则要拆两种编号。算法是一样的
                #按现在的数据结构，必然有“源头”，所以不判断了
                split_two_numbers(admin_item, source_item, params)
                admin_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => 'stock_out_use',
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}为#{admin_item['current_quantity'].trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了领用。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'apply_for_loan'
                message = "租借请求已提交给库管"
                receivers = User.admin_keeper.map(&:id)

                grid_data_array = JSON.parse(params['grid_data'])
                apply_sn = (Time.now.to_f*1000).ceil
                grid_data_array.each do |grid_data|
                    admin_item = AdminInventory.find(grid_data['id'])
                    #对每一条物品，比较库存中的物品和领用人申请的物品数量
                    apply_for_quantity = grid_data['current_quantity']
                    stock_quantity = admin_item['current_quantity']
                    if stock_quantity <= apply_for_quantity
                        #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                        demand_quantity  = stock_quantity
                    else
                        #分两条记录
                        demand_quantity = apply_for_quantity
                    end
                    split_item = admin_item.dup
                    remain_item = admin_item
                    #remain_item = admin_item
                    split_item['current_quantity'] = demand_quantity
                    remain_item['current_quantity'] = stock_quantity - demand_quantity
                    split_item['in_stock_source'] = admin_item.id #“库存源”
                    remain_item.save
                    #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                    split_item.apply_for_sn = "#{params['event']}_#{user_id}_#{apply_sn}"
                    #拆分的时候不带序列号，真正操作的时候再去溯源
                    split_item.sn = nil
                    split_item.number = nil
                    split_item.project = "合同#{params['project']}"
                    split_item.user_id = user_id
                    split_item.apply_for_loan
                    split_item.save

                    #写入操作日志
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => split_item.id,
                        :user_id => user_id,
                        :act_type => 'apply_for_loan',
                        :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}申请租借#{apply_for_quantity}#{admin_item.count_unit}#{admin_item.name}。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end
                #发申请租借消息
                receivers.each do |receiver|
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些物品需要租借(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})，合同号为#{params['project']}，#{link_str}",
                        :receiver_user_id => receiver,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
            when 'stock_out_loan'
                message = "已经租借成功"
                admin_item = AdminInventory.find(params['id'])
                #stock_same_item = AdminInventory.where("name")
                admin_item.keep_at = 8 #被租借
                admin_item.keeper_user_id = admin_item.user_id
                admin_item.user_id = user_id
                admin_item.stock_out_loan
                admin_item.apply_for_sn = nil

                source_item = AdminInventory.find(admin_item['in_stock_source'])
                #如果有“源头”，并且有序列号或者编号的时候，则要拆两种编号。算法是一样的
                #按现在的数据结构，必然有“源头”，所以不判断了
                split_two_numbers(admin_item, source_item, params)
                admin_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => 'stock_out_loan',
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}为#{admin_item['current_quantity'].trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了租借。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'apply_for_sell'
                message = "出售请求已提交给库管"
                receivers = User.admin_keeper.map(&:id)

                grid_data_array = JSON.parse(params['grid_data'])
                apply_sn = (Time.now.to_f*1000).ceil
                grid_data_array.each do |grid_data|
                    admin_item = AdminInventory.find(grid_data['id'])
                    #对每一条物品，比较库存中的物品和领用申请人的物品数量
                    apply_for_quantity = grid_data['current_quantity']
                    stock_quantity = admin_item['current_quantity']
                    if stock_quantity <= apply_for_quantity
                        #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                        demand_quantity  = stock_quantity
                    else
                        #分两条记录
                        demand_quantity = apply_for_quantity
                    end
                    split_item = admin_item.dup
                    remain_item = admin_item
                    #remain_item = admin_item
                    split_item['current_quantity'] = demand_quantity
                    remain_item['current_quantity'] = stock_quantity - demand_quantity
                    split_item['in_stock_source'] = admin_item.id #“库存源”
                    remain_item.save
                    #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                    split_item.apply_for_sn = "#{params['event']}_#{user_id}_#{apply_sn}"
                    #拆分的时候不带序列号，真正操作的时候再去溯源
                    split_item.sn = nil
                    split_item.number = nil
                    split_item.project = "合同#{params['project']}"
                    split_item.user_id = user_id
                    split_item.apply_for_sell
                    split_item.save

                    #写入操作日志
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => split_item.id,
                        :user_id => user_id,
                        :act_type => 'apply_for_sell',
                        :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}申请出售#{apply_for_quantity}#{admin_item.count_unit}#{admin_item.name}。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end
                #发申请出售消息
                receivers.each do |receiver|
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些物品需要出售(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})，合同号为#{params['project']}，#{link_str}",
                        :receiver_user_id => receiver,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
            when 'stock_out_sell'
                message = "已经出售成功"
                admin_item = AdminInventory.find(params['id'])
                #stock_same_item = AdminInventory.where("name")
                admin_item.keep_at = 7 #被出售
                admin_item.keeper_user_id = admin_item.user_id
                admin_item.user_id = user_id
                admin_item.stock_out_sell
                admin_item.apply_for_sn = nil

                source_item = AdminInventory.find(admin_item['in_stock_source'])
                #如果有“源头”，并且有序列号或者编号的时候，则要拆两种编号。算法是一样的
                #按现在的数据结构，必然有“源头”，所以不判断了
                split_two_numbers(admin_item, source_item, params)
                admin_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => 'stock_out_sell',
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}为#{admin_item['current_quantity'].trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了出售。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'refuse'
                message = "审批驳回"
                apply_sn = params['apply_for_sn'].split("_")[-1]
                apply_user_id = params['apply_for_sn'].split("_")[-2] #实际领用人
                admin_items = AdminInventory.where("apply_for_sn = ?", params['apply_for_sn'])

                admin_items.each do |admin_item|
                    #溯源
                    source_item = AdminInventory.find(admin_item['in_stock_source'])
                    #按现在的数据结构，必然有“源头”，所以不判断了
                    #删掉本条，加源头的数量
                    source_item.current_quantity = source_item.current_quantity + admin_item.current_quantity
                    quantity = admin_item.current_quantity
                    source_item.save

                    AdminInventory.delete(admin_item)
                    admin_item = source_item
                    admin_item.save

                    #写入操作日志
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => admin_item.id,
                        :user_id => user_id,
                        :act_type => params['event'],
                        :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}驳回了领用#{quantity}#{admin_item.count_unit}#{admin_item.name}的审批。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end

                #发审批驳回消息
                sn = (Time.now.to_f*1000).ceil
                #binding.pry
                message_params = {
                    :content => "你领用#{admin_items.map{|p| p['name']}.join("、").truncate(40)}的审核已被驳回。",
                    :receiver_user_id => apply_user_id,
                    :send_at => Time.now,
                    :sn => sn
                }
                PersonalMessage.create_or_update_with(message_params, user_id)
            when 'return'
                #binding.pry
                message = "归还请求已提交给库管"
                receivers = User.admin_keeper.map(&:id)
                grid_data_array = JSON.parse(params['grid_data'])
                apply_sn = (Time.now.to_f*1000).ceil
                grid_data_array.each do |grid_data|
                    admin_item = AdminInventory.find(grid_data['id'])
                    #对每一条物品，比较借出中的物品和归还申请的物品数量
                    apply_for_quantity = grid_data['current_quantity']
                    out_stock_quantity = admin_item['current_quantity']
                    if out_stock_quantity <= apply_for_quantity
                        #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                        demand_quantity  = out_stock_quantity
                    else
                        #分两条记录
                        demand_quantity = apply_for_quantity
                    end
                    split_item = admin_item.dup
                    remain_item = admin_item
                    #remain_item = admin_item
                    split_item['current_quantity'] = demand_quantity
                    remain_item['current_quantity'] = out_stock_quantity - demand_quantity
                    split_item['out_stock_source'] = admin_item.id #“出库源”
                    split_item['project'] = params['project']
                    remain_item.save

                    #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                    split_item.apply_for_sn = "#{params['event']}_#{grid_data['buyer>id']}_#{apply_sn}"
                    #拆分的时候不带序列号，真正操作的时候再去溯源
                    split_item.sn = nil
                    split_item.number = nil
                    split_item.return
                    split_item.save

                    #写入操作日志
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => split_item.id,
                        :user_id => user_id,
                        :act_type => params['event'],
                        :natural_language => "#{User.find(grid_data['keeper>id']).name}于#{Time.now.strftime("%Y-%m-%d")}申请归还#{apply_for_quantity}#{admin_item.count_unit}#{admin_item.name}。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end
                #发申请归还消息
                receivers.each do |receiver|
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些归还的物品需要入库(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})#{params['project'].blank? ? "" : "，备注信息为#{params['project']}"}，#{link_str}",
                        :receiver_user_id => receiver,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
            when 'return_stock_in'
                message = "已经入库"

                admin_item = AdminInventory.find(params['id'])
                admin_item.keep_at = params['keep_at']
                admin_item.keeper_user_id = user_id
                admin_item.user_id = user_id
                admin_item.stock_in
                admin_item.apply_for_sn = nil

                out_stock_source_item = AdminInventory.find(admin_item['out_stock_source'])
                in_stock_source_item = AdminInventory.find(out_stock_source_item['in_stock_source'])
                #如果有“源头”，并且有序列号或者编号的时候，则要拆两种编号。算法是一样的
                #按现在的数据结构，如果是直接归还，则必然有“源头”
                #但还有一种情况，就是100件物品有两个人领用，一个领了10件一个领了20件，
                #然后归还的时候，10件的先还，放到另外一个仓库，成了一条新记录，
                #再20件的归还的时候也选的另外一个仓库，此时应该两条合并，但之前10件生成的记录并不是20条生成的记录的“源”，所以无法合并
                split_two_numbers(admin_item, out_stock_source_item, params)

                #再看拆出去的能不能合并
                combine_two_numbers(admin_item, in_stock_source_item, params)
                #admin_item.save

                #admin_item.stock_in
                #admin_item.save

                #写入操作日志
                #binding.pry
                keep_at = Dictionary.where("data_type = ? and value = ?", "stock_keep_at", params['keep_at']).first.display
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}给归还的#{admin_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了入库，存放地点为#{keep_at}。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_damage'
                message = "已经报损"

                damaged_quantity = params['outstock_count'].to_f

                admin_item = AdminInventory.find(params['id'])
                split_item = admin_item.dup
                remain_item = admin_item
                split_item['current_quantity'] = damaged_quantity
                remain_item['current_quantity'] = admin_item['current_quantity'] - damaged_quantity
                split_item['in_stock_source'] = admin_item.id
                remain_item.save

                #binding.pry
                split_two_numbers(split_item, admin_item, params)

                split_item.project = params['project']
                split_item.apply_for_sn = nil
                split_item.damage
                split_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => split_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}给#{split_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了报损。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_scrap'
                message = "已经报废"

                scrapped_quantity = params['outstock_count'].to_f

                admin_item = AdminInventory.find(params['id'])
                split_item = admin_item.dup
                remain_item = admin_item
                split_item['current_quantity'] = scrapped_quantity
                remain_item['current_quantity'] = admin_item['current_quantity'] - scrapped_quantity
                split_item['in_stock_source'] = admin_item.id
                remain_item.save

                split_two_numbers(split_item, admin_item, params)

                split_item.project = params['project']
                split_item.scrap
                split_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => split_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}给#{split_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了报废。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_exchange_unit'
                message = "单位已经成功换算"
                admin_item = AdminInventory.find(params['id'])
                old_quantity = admin_item.current_quantity
                old_unit = admin_item.count_unit
                old_rmb = admin_item.rmb
                admin_item.current_quantity = params['exchange_unit_new_count']
                admin_item.count_unit = params['exchange_unit_new_unit']
                admin_item.rmb = params['exchange_unit_new_rmb']
                admin_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}给#{admin_item.name}办理了单位转换，从#{old_quantity.trunk_decimal_part}#{old_unit}(单价RMB#{old_rmb})转换为#{admin_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}(单价RMB#{admin_item.rmb})。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_fix'
                message = "已经修好并重新入库"
                #binding.pry

                fixed_quantity = params['outstock_count'].to_f
                admin_item = AdminInventory.find(params['id'])
                damaged_quantity = admin_item.current_quantity

                if fixed_quantity <= damaged_quantity
                    #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                    demand_quantity = fixed_quantity
                else
                    #分两条记录
                    demand_quantity = damaged_quantity
                end
                split_item = admin_item.dup
                remain_item = admin_item

                split_item['current_quantity'] = demand_quantity
                remain_item['current_quantity'] = damaged_quantity - demand_quantity
                split_item['out_stock_source'] = admin_item.id #“出库源”
                split_item.fix

                out_stock_source_item = AdminInventory.find(split_item['out_stock_source'])
                in_stock_source_item = AdminInventory.find(out_stock_source_item['in_stock_source'])

                split_two_numbers(split_item, remain_item, params)
                split_item.save

                #再看拆出去的能不能合并
                combine_two_numbers(split_item, in_stock_source_item, params)

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => split_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}给#{split_item['current_quantity'].trunk_decimal_part}#{admin_item.count_unit}修好的#{admin_item.name}办理了入库。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_change_location'
                #binding.pry
                message = "的存放地点已经改变"
                
                changed_quantity = params['outstock_count'].to_f

                admin_item = AdminInventory.find(params['id'])
                split_item = admin_item.dup
                remain_item = admin_item
                split_item['current_quantity'] = changed_quantity
                remain_item['current_quantity'] = admin_item['current_quantity'] - changed_quantity
                #split_item['in_stock_source'] = admin_item.id
                remain_item.save

                split_two_numbers(split_item, admin_item, params)

                #binding.pry
                split_item.project = params['project']
                split_item.keep_at = params['keep_at']
                split_item.save

                #再看拆出去的能不能合并。
                #肯定没有“源”，所以直接写个nil了
                combine_two_numbers(split_item, nil, params)

                #写入操作日志
                keep_at = Dictionary.where("data_type = ? and value = ?", "stock_keep_at", params['keep_at']).first.display
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => split_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :project => params['project'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}把#{split_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}存放至#{keep_at}#{params['project'].blank? ? "" : "，原因为#{params['project']}"}。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_change_ownership'
                message = "的所有权已经改变"

                changed_quantity = params['outstock_count'].to_f

                admin_item = AdminInventory.find(params['id'])
                split_item = admin_item.dup
                remain_item = admin_item
                split_item['current_quantity'] = changed_quantity
                remain_item['current_quantity'] = admin_item['current_quantity'] - changed_quantity
                #split_item['in_stock_source'] = admin_item.id
                remain_item.save

                split_two_numbers(split_item, admin_item, params)

                #binding.pry
                split_item.project = params['project']
                split_item.ownership = params['vendor_unit_id']
                split_item.save

                #再看拆出去的能不能合并。
                #肯定没有“源”，所以直接写个nil了
                combine_two_numbers(split_item, nil, params)

                #写入操作日志
                #keep_at = Dictionary.where("data_type = ? and value = ?", "stock_keep_at", params['keep_at']).first.display
                vendor_unit_name = VendorUnit.find(params['vendor_unit_id']).name
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => split_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :project => params['project'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}变更了#{split_item.current_quantity.trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}的所有权，现在它们属于#{vendor_unit_name}#{params['project'].blank? ? "" : "，原因为#{params['project']}"}。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'save_modify'
                message = "的信息已经修改"

                admin_item = AdminInventory.find(params['id'])

                modify_detail_array = []
                fields_to_be_updated = %w(name model description inventory_level inventory_type sn)
                fields_to_be_updated.each do |field|
                    case field
                        when "name"
                            modify_detail_array << "品名从#{admin_item['name'].blank? ? "无" : admin_item['name']}修改为#{params['name'].blank? ? "无" : params['name']}" if admin_item['name'] != params['name']
                        when "model"
                            modify_detail_array << "型号从#{admin_item['model'].blank? ? "无" : admin_item['model']}修改为#{params['model'].blank? ? "无" : params['model']}" if admin_item['model'] != params['model']
                        when "description"
                            modify_detail_array << "描述从#{admin_item['description'].blank? ? "无" : admin_item['description']}修改为#{params['description'].blank? ? "无" : params['description']}" if admin_item['description'] != params['description']
                        when "inventory_level"
                            old_inventory_level = Dictionary.where("data_type = ? and value = ?", "stock_inventory_level", admin_item['inventory_level']).first.display
                            new_inventory_level = Dictionary.where("data_type = ? and value = ?", "stock_inventory_level", params['inventory_level']).first.display
                            modify_detail_array << "库存级别从#{old_inventory_level}修改为#{new_inventory_level}" if admin_item['inventory_level'].to_i != params['inventory_level'].to_i
                        when "inventory_type"
                            old_inventory_type = MaterialCode.where("id = ?", admin_item['inventory_type']).first.blank? ? "无" : MaterialCode.where("id = ?", admin_item['inventory_type']).first.name
                            new_inventory_type = MaterialCode.where("id = ?", params['inventory_type']).first.name
                            modify_detail_array << "类别从#{old_inventory_type}修改为#{new_inventory_type}" if admin_item['inventory_type'].to_i != params['inventory_type'].to_i
                        when "sn"
                            modify_detail_array << "序列号从#{admin_item['sn'].blank? ? "无" : admin_item['sn']}修改为#{params['sn'].blank? ? "无" : params['sn']}" if admin_item['sn'] != params['sn']
                    end
                    admin_item[field] = params[field]
                end
                admin_item['comment'] = params['comment']# += "。#{params['comment']}"
                admin_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => params['event'],
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}变更了物品信息，改动如下：#{modify_detail_array.join("、")}。改动理由为#{params['comment']}。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            when 'apply_for_reject'
                grid_data_array = JSON.parse(params['grid_data'])
                apply_sn = (Time.now.to_f*1000).ceil

                message = "退货请求已提交"
                receivers = User.admin_keeper.map(&:id)
                grid_data_array.each do |grid_data|
                    admin_item = AdminInventory.find(grid_data['id'])
                    #对每一条物品，比较库存中的物品和领用申请人的物品数量
                    apply_for_quantity = grid_data['current_quantity']
                    stock_quantity = admin_item['current_quantity']
                    if stock_quantity <= apply_for_quantity
                        #少于或等于则领全部，也是分两条记录，但其中一条数量为0
                        demand_quantity  = stock_quantity
                    else
                        #分两条记录
                        demand_quantity = apply_for_quantity
                    end
                    split_item = admin_item.dup
                    remain_item = admin_item
                    #remain_item = admin_item
                    split_item['current_quantity'] = demand_quantity
                    remain_item['current_quantity'] = stock_quantity - demand_quantity
                    split_item['in_stock_source'] = admin_item.id #“库存源”
                    remain_item.save
                    #用于标志批次的“序列号”格式：事件名称(入库/出库等)_申请用户id_流水号
                    split_item.apply_for_sn = "#{params['event']}_#{user_id}_#{apply_sn}"
                    #拆分的时候不带序列号，真正操作的时候再去溯源
                    split_item.sn = nil
                    split_item.number = nil
                    split_item.user_id = user_id
                    split_item.project = params['project']
                    split_item.apply_for_reject
                    split_item.save

                    #写入操作日志
                    item_history_params = {
                        :act_at => Time.now,
                        :before_inventory_id => admin_item.id,
                        :after_inventory_id => split_item.id,
                        :user_id => user_id,
                        :act_type => params['event'],
                        :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}申请办理#{apply_for_quantity}#{admin_item.count_unit}#{admin_item.name}的退货。"
                    }
                    AdminInventoryHistory.create_with(item_history_params, user_id)
                end
                #发申请退货消息
                receivers.each do |receiver|
                    sn = (Time.now.to_f*1000).ceil
                    link_str = %{<a href="#" class='innerAuditing' x="m_sn:#{sn}|controller:AdminInventories|item_sn:#{params['event']}_#{user_id}_#{apply_sn}">点击查看</a>}
                    message_params = {
                        :content => "有一些物品需要退货(#{grid_data_array.map{|p| p['name']}.join("、").truncate(40)})，理由为#{project_option}，#{link_str}",
                        :receiver_user_id => receiver,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end

                #打印退货单
                gen_reject_pdf(grid_data_array, is_local)

            when 'reject'
                message = "已经退货成功"
                admin_item = AdminInventory.find(params['id'])
                #stock_same_item = AdminInventory.where("name")
                admin_item.keep_at = 7 #被售出/被退货
                #binding.pry
                admin_item.keeper_user_id = admin_item.user_id
                admin_item.user_id = user_id
                admin_item.reject
                admin_item.apply_for_sn = nil

                source_item = AdminInventory.find(admin_item['in_stock_source'])
                #如果有“源头”，并且有序列号或者编号的时候，则要拆两种编号。算法是一样的
                #按现在的数据结构，必然有“源头”，所以不判断了
                split_two_numbers(admin_item, source_item, params)
                admin_item.save

                #写入操作日志
                item_history_params = {
                    :act_at => Time.now,
                    :before_inventory_id => admin_item.id,
                    :after_inventory_id => admin_item.id,
                    :user_id => user_id,
                    :act_type => 'reject',
                    :natural_language => "#{User.find(user_id).name}于#{Time.now.strftime("%Y-%m-%d")}为#{admin_item['current_quantity'].trunk_decimal_part}#{admin_item.count_unit}#{admin_item.name}办理了退货。"
                }
                AdminInventoryHistory.create_with(item_history_params, user_id)
            else
                #message = '已成功入库'

        end


        #binding.pry
        #fields_to_be_updated = %w(name model sn number inventory_type inventory_level keep_at current_quantity count_unit
        #    buy_price financial_price currency_id rmb status project keeper buyer ownership vendor_unit_id vendor_id comment
        #)
        #fields_to_be_updated.each do |field|
        #    admin_item[field] = params[field]
        #end
        #admin_item.user_id = user_id
        #admin_item.status = 1 #状态默认为“正常”
        #if params['does_generate_number'] == 'on'
        #    #如果选中了“自动生成资产编号”，则按数量生成一个串
        #    quantity = params['current_quantity']
        #    number_array = []
        #    1.upto(quantity) do
        #        number_array << AdminInventory.gen_new_number_with_letter("Z")
        #    end
        #    admin_item.number = number_array.join("、")
        #end
        #
        #admin_item.save

        return {success: true, message: "#{item}#{message}"}
    end

    #拆分序列号/物品编号的算法
    #原则上是在一长串序列号里找到相应的号删除，但要考虑到一个源头拆成多个领用的情况
    #params类似这样：
    #{"items"=>"0|1|2|4",
    # "store"=>"[{\"id\":0,\"name\":\"\\u8d44\\u4ea7\\u7f16\\u53f7\\uff1aZ1300007 \\u5e8f\\u5217\\u53f7\\uff1a01\"},{\"id\":1,\"name\":\"\\u8d44\\u4ea7\\u7f16\\u53f7\\uff1aZ1300005 \\u5e8f\\u5217\\u53f7\\uff1a02\"},{\"id\":2,\"name\":\"\\u8d44\\u4ea7\\u7f16\\u53f7\\uff1aZ1300006 \\u5e8f\\u5217\\u53f7\\uff1a03\"},{\"id\":3,\"name\":\"\\u8d44\\u4ea7\\u7f16\\u53f7\\uff1aZ1300008 \\u5e8f\\u5217\\u53f7\\uff1a04\"},{\"id\":4,\"name\":\"\\u8d44\\u4ea7\\u7f16\\u53f7\\uff1aZ1300009 \\u5e8f\\u5217\\u53f7\\uff1a05\"}]",
    # "event"=>"stock_out_use",
    # "id"=>"15",
    # "out_stock_type"=>"use",
    # "outstock_numbers"=>"4",
    # "created_at"=>"2013-05-07",
    # "controller"=>"admin_inventories",
    # "action"=>"save_admin_inventory"}
    def self.split_two_numbers(admin_item, source_item, params)
        full_store = JSON.parse(params['store'])
        full_store_sn_array = full_store.map{|p| p['name'].split("序列号：")[1]}
        full_store_number_array = full_store.map{|p| p['name'].split("序列号：")[0].gsub("资产编号：", "").gsub(" ", "")}

        deal_sn_array = []
        deal_number_array = []
        remain_sn_array = []
        remain_number_array = []
        out_stock_items = params['items'].split("|")

        full_store.each_with_index do |item, index|
            #binding.pry
            if out_stock_items.include? item['id'].to_s
                deal_sn_array << full_store_sn_array[index]
                deal_number_array << full_store_number_array[index]
            else
                remain_sn_array << full_store_sn_array[index]
                remain_number_array << full_store_number_array[index]
            end
        end

        admin_item.number = deal_number_array.uniq[0].blank? ? "" : deal_number_array.join("、")
        admin_item.sn = deal_sn_array.uniq[0].blank? ? "" : deal_sn_array.join(",")
        source_item.number = remain_number_array.uniq[0].blank? ? "" : remain_number_array.join("、")
        source_item.sn = remain_sn_array.uniq[0].blank? ? "" : remain_sn_array.join(",")
        source_item.save
    end

    #判断能否合并、能则合并的算法
    #params类似这样：
    #{"items"=>"0|1",
    # "store"=>"[{\"id\":7,\"data_type\":\"stock_keep_at\",\"display\":\"\\u603b\\u90e8\\u4e5d\\u697c\\u529e\\u516c\\u533a\",\"value\":\"1\",\"available\":true},{\"id\":8,\"data_type\":\"stock_keep_at\",\"display\":\"\\u603b\\u90e8\\u4e5d\\u697c\\u4ed3\\u5e93\",\"value\":\"2\",\"available\":true},{\"id\":9,\"data_type\":\"stock_keep_at\",\"display\":\"\\u603b\\u90e8\\u4e5d\\u697c\\u5b9e\\u9a8c\\u5ba4\",\"value\":\"3\",\"available\":true},{\"id\":10,\"data_type\":\"stock_keep_at\",\"display\":\"\\u603b\\u90e8\\u4e5d\\u697c\\u673a\\u623f\",\"value\":\"4\",\"available\":true},{\"id\":11,\"data_type\":\"stock_keep_at\",\"display\":\"\\u603b\\u90e8\\u5341\\u516d\\u697c\\u4ed3\\u5e93\",\"value\":\"5\",\"available\":true},{\"id\":15,\"data_type\":\"stock_keep_at\",\"display\":\"\\u7535\\u4fe1\\u6258\\u7ba1\\u673a\\u623f\",\"value\":\"6\",\"available\":true},{\"id\":16,\"data_type\":\"stock_keep_at\",\"display\":\"\\u88ab\\u552e\\u51fa\",\"value\":\"7\",\"available\":true},{\"id\":17,\"data_type\":\"stock_keep_at\",\"display\":\"\\u88ab\\u79df\\u501f\",\"value\":\"8\",\"available\":true},{\"id\":175,\"data_type\":\"stock_keep_at\",\"display\":\"\\u88ab\\u9886\\u7528\",\"value\":\"9\",\"available\":true}]",
    # "event"=>"return_stock_in",
    # "id"=>"31",
    # "keep_at"=>"5",
    # "outstock_numbers"=>"2",
    # "created_at"=>"2013-05-08",
    # "controller"=>"admin_inventories",
    # "action"=>"save_admin_inventory"}
    def self.combine_two_numbers(admin_item, source_item, params)
        if source_item
            compare_fields = %w(name model count_unit ownership expire_at)
            same = true
            compare_fields.each do |field|
                if admin_item[field] != source_item[field]
                    same = false
                    break
                end
            end
            same = false if params['keep_at'].to_i != source_item['keep_at']
        else
            same = false
        end
        #binding.pry
        if same
            #和“库存源”的信息都一样就合并
            merge_item(admin_item, source_item)
        else
            #就算不一样，也要再找一遍有没有其它可合并的记录来合并
            combinable_item = AdminInventory.where("name = ? and model = ? and keep_at = ? and count_unit = ? and ownership = ? and id <> ?",
                                                   admin_item['name'],
                                                   admin_item['model'],
                                                   params['keep_at'],
                                                   admin_item['count_unit'],
                                                   admin_item['ownership'],
                                                   admin_item['id']
            )
            if admin_item['expire_at'].blank?
                combinable_item = combinable_item.where("expire_at is null")
            else
                combinable_item = combinable_item.where("expire_at = ?", admin_item['expire_at'])
            end

            if !combinable_item[0].blank?
                #跟这条合并
                source_item = combinable_item[0]
                merge_item(admin_item, source_item)
            else
                admin_item['keep_at'] = params['keep_at']
                admin_item['in_stock_source'] = nil
                admin_item['out_stock_source'] = nil
                admin_item.save
            end
        end
    end

    def self.merge_item(admin_item, source_item)
        source_item['sn'] = (source_item['sn'].split(",") + admin_item['sn'].split(",")).join(",")
        source_item['number'] = (source_item['number'].split("、") + admin_item['number'].split("、")).join("、")
        merged_rmb = admin_item['rmb'] * admin_item['current_quantity'] + source_item['rmb'] * source_item['current_quantity']
        source_item['current_quantity'] += admin_item['current_quantity']
        source_item['rmb'] = merged_rmb / source_item['current_quantity']
        source_item.save
        AdminInventory.delete(admin_item)
    end

    #找出本物品的“源头”物品。
    #失效时间、名称、型号都一样且id不一样且状态是“库存中”的就算“库存源头”
    #状态是“领用中”的就算“领用源头”
    #状态是“租借中”的就算“租借源头”
    def get_source_item(status)
        case status
            when 'in_stock'
                state_str = 'b_stocking'
            when 'using'
                state_str = 'g_using'
            when 'loaned'
                state_str = 'h_loaned'
        end
        if expire_at.nil?
            source_item = AdminInventory.where("expire_at is null and name = ? and model = ? and id <> ? and state = ?", name, model, id, state_str)[0]
            #source_item = AdminInventory.where("expire_at is null and name = ? and model = ? and id <> ? and state = 'b_stocking'", name, model, id)[0]
            #source_item = AdminInventory.where(items[:expire_at])
        else
            source_item = AdminInventory.where("expire_at = ? and name = ? and model = ? and id <> ? and state = ?", expire_at, name, model, id, state_str)[0]
            #source_item = AdminInventory.where("expire_at = ? and name = ? and model = ? and id <> ? and state = 'b_stocking'", expire_at, name, model, id)[0]
        end
        return source_item
    end

    ##找出领用物品中，本物品的“源头”物品。
    ##失效时间、名称、型号都一样且id不一样且状态是“领用中”的就算“源头”
    #def get_using_source_item
    #    if expire_at.nil?
    #        source_item = AdminInventory.where("expire_at is null and name = ? and model = ? and id <> ? and state = 'g_using'", name, model, id)[0]
    #    else
    #        source_item = AdminInventory.where("expire_at = ? and name = ? and model = ? and id <> ? and state = 'g_using'", expire_at, name, model, id)[0]
    #    end
    #    return source_item
    #end

    #params data [{"id" => 0, "name" => "xxx", ...}, {"id" => 0, "name" => "xxx"}]
    def self.gen_stock_in_pdf(data, is_local)
        pdf_font = "#{Rails.root}/app/assets/fonts/yahei_mono.ttf"
        template_filename = "#{Rails.root}/public/stock_in/template.pdf"

        require "prawn"
        require "prawn/measurement_extensions"

        ##以下是生成模板PDF的方法，留着吧。
        #Prawn::Document.generate("#{Rails.root}/public/stock_in/template.pdf",
        #    :page_size => [241.mm, 140.mm],
        #    :margin => [10.mm, 25.mm]
        #) do
        #    font pdf_font, :size => 10
        #    text "入  库  单", :align => :center, :size => 10.mm
        #    table([["供应商：", ""], ["联系人：", "入库时间：    年  月  日"]],
        #          :column_widths => {0 => 130.mm, 1 => 60.mm},
        #          :cell_style => {:padding => [3, 0, 0, 0]},
        #          :position => :center
        #    ) do |t|
        #        t.cells.style do |cell|
        #            cell.borders -= [:left, :right, :top, :bottom]
        #        end
        #    end
        #
        #    bounding_box [0, 10.mm], :width => 191.mm do
        #        text "采购人：_________                    经办人：_________                    保管人：_________"
        #    end
        #end

        attachment_array = []
        vendor_unit_name_array = []
        data.group_by{|item| item["vendor_unit_id"]}.each do |vendor_unit_id, items|
            file_time_stamp = "#{Date.today.strftime("%Y-%m-%d")}-#{(Time.now.to_f*1000).to_i % 100000}"
            file_name = "#{Rails.root}/public/stock_in/#{file_time_stamp}.pdf"
            Prawn::Document.generate(file_name,
                :template => template_filename,
                :page_size => [241.mm, 140.mm],
                :margin => [35.mm, 25.mm, 20.mm]
            ) do |pdf|
                pdf.font pdf_font, :size => 8

                #以下是每当生成新页面都用模板的方法
                def pdf.start_new_page(options={})
                    opts = options.reverse_merge!({
                        :template => "#{Rails.root}/public/stock_in/template.pdf"
                    })
                    super(opts)
                end

                header = %w(编号 名称 型号 描述 数量 单位 备注)
                array = []
                #binding.pry
                items.each_with_index do |d, index|
                    inner_array = []
                    inner_array << index + 1
                    inner_array << d['name']
                    inner_array << d['model']
                    inner_array << d['description']
                    inner_array << (d['current_quantity'].to_i == d['current_quantity'] ? d['current_quantity'].to_i : d['current_quantity'])
                    inner_array << d['count_unit']
                    inner_array << d['comment']
                    array << inner_array
                end

                pdf.repeat(:all) do
                    pdf.float do
                        pdf.font pdf_font, :size => 9
                        pdf.bounding_box [16.mm, 98.5.mm], :width => 130.mm do
                            pdf.text VendorUnit.find(vendor_unit_id).name
                        end
                        pdf.bounding_box [16.mm, 93.mm], :width => 130.mm do
                            pdf.text Vendor.find(items[0]['vendor_id']).name
                        end
                        pdf.bounding_box [149.2.mm, 93.mm], :width => 60.mm do
                            pdf.text Date.today.strftime("%Y  %m  %d")
                        end
                    end
                end


                pdf.table([header] + array,
                          :header => true,
                          :column_widths => ([10.mm, 35.mm, 35.mm, 35.mm, 15.mm, 15.mm, 45.mm])
                ) do |t|
                    t.column(0).style :align => :right
                    t.column(4).style :align => :right
                    t.row(0).style :padding => [5, 0], :align => :center
                end
            end

            #attachments['free_book.pdf'] = File.read('path/to/file.pdf')
            #binding.pry
            #include UserMailer
            #UserMailer.stock_in_pdf_email("terrych@etsc-tech.com", "New mail test")
            #UserMailer.welcome_email(User.find(1), "", "", "")
            attachment_array << file_name
            vendor_unit_name_array << VendorUnit.find(vendor_unit_id).name
        end

        if is_local
            to_user = User.find(5)
        else
            to_user = User.find(data[0]["buyer>id"])
        end
        if vendor_unit_name_array.size > 3
            vendor_unit_name = vendor_unit_name_array[0..3].join("、") + "等"
        else
            vendor_unit_name = vendor_unit_name_array.join("、")
        end
        UserMailer.stock_in_pdf_email(to_user, "#{Date.today.strftime("%Y-%m-%d")}入库单_#{vendor_unit_name}", attachment_array).deliver
    end

    def self.gen_reject_pdf(data, is_local)
        pdf_font = "#{Rails.root}/app/assets/fonts/yahei_mono.ttf"
        template_filename = "#{Rails.root}/public/stock_in/reject/template.pdf"

        require "prawn"
        require "prawn/measurement_extensions"

        ##以下是生成模板PDF的方法，留着吧。
        #Prawn::Document.generate("#{Rails.root}/public/stock_in/reject/template.pdf",
        #    :page_size => [241.mm, 140.mm],
        #    :margin => [10.mm, 25.mm]
        #) do
        #    font pdf_font, :size => 10
        #    text "退  货  单", :align => :center, :size => 10.mm
        #    table([["供应商：", ""], ["联系人：", "入库时间：    年  月  日"]],
        #          :column_widths => {0 => 130.mm, 1 => 60.mm},
        #          :cell_style => {:padding => [3, 0, 0, 0]},
        #          :position => :center
        #    ) do |t|
        #        t.cells.style do |cell|
        #            cell.borders -= [:left, :right, :top, :bottom]
        #        end
        #    end
        #
        #    bounding_box [0, 10.mm], :width => 191.mm do
        #        text "采购人：_________                    经办人：_________                    保管人：_________"
        #    end
        #end

        attachment_array = []
        data.group_by{|item| item["vendor_unit_id"]}.each do |vendor_unit_id, items|
            file_time_stamp = "#{Date.today.strftime("%Y-%m-%d")}-#{(Time.now.to_f*1000).to_i % 100000}"
            file_name = "#{Rails.root}/public/stock_in/reject/#{file_time_stamp}.pdf"
            Prawn::Document.generate(file_name,
                :template => template_filename,
                :page_size => [241.mm, 140.mm],
                :margin => [35.mm, 25.mm, 20.mm]
            ) do |pdf|
                pdf.font pdf_font, :size => 8

                #以下是每当生成新页面都用模板的方法
                def pdf.start_new_page(options={})
                    opts = options.reverse_merge!({
                        :template => "#{Rails.root}/public/stock_in/template.pdf"
                    })
                    super(opts)
                end

                header = %w(编号 名称 型号 描述 数量 单位 操作时间 备注)
                array = []
                #binding.pry
                items.each_with_index do |d, index|
                    inner_array = []
                    inner_array << index + 1
                    inner_array << d['name']
                    inner_array << d['model']
                    inner_array << d['description']
                    inner_array << d['current_quantity'].to_i == d['current_quantity'] ? d['current_quantity'].to_i : d['current_quantity']
                    inner_array << d['count_unit']
                    inner_array << Date.today.strftime("%Y-%m-%d")
                    inner_array << d['comment']
                    array << inner_array
                end

                pdf.repeat(:all) do
                    pdf.float do
                        pdf.font pdf_font, :size => 9
                        pdf.bounding_box [16.mm, 98.5.mm], :width => 130.mm do
                            pdf.text VendorUnit.find(vendor_unit_id).name
                        end
                        pdf.bounding_box [16.mm, 93.mm], :width => 130.mm do
                            pdf.text Vendor.find(items[0]['vendor_id']).name
                        end
                        pdf.bounding_box [149.2.mm, 93.mm], :width => 60.mm do
                            pdf.text Date.today.strftime("%Y  %m  %d")
                        end
                    end
                end


                pdf.table([header] + array,
                          :header => true,
                          :column_widths => ([10.mm, 35.mm, 35.mm, 35.mm, 15.mm, 15.mm, 22.mm, 23.mm])
                ) do |t|
                    t.column(0).style :align => :right
                    t.column(4).style :align => :right
                    t.row(0).style :padding => [5, 0], :align => :center
                end
            end

            #attachments['free_book.pdf'] = File.read('path/to/file.pdf')
            #binding.pry
            #include UserMailer
            #UserMailer.stock_in_pdf_email("terrych@etsc-tech.com", "New mail test")
            #UserMailer.welcome_email(User.find(1), "", "", "")
            attachment_array << file_name
        end
        if is_local
            to_user = User.find(5)
        else
            to_user = User.find(data[0]["buyer>id"])
        end
        UserMailer.stock_in_pdf_email(to_user, "#{Date.today.strftime("%Y-%m-%d")}退货单", attachment_array).deliver
    end

    #创建新编号和报价等不一样，无法公用
    def self.gen_new_number(quantity)
        #binding.pry
        now_year = Time.now.strftime("%y")

        if self.where("number like ?", "%#{now_year}%").size == 0
            #如果没有今年的数据，则在此基础上加那么多个号
            max_number = 0
        else
            #如果有，取在最大的基础上加那么多个号
            max_number = self.where("number <> ''").map{|p| p.max_number}.max[3..-1].to_i
            #return max_number[0..2].to_s + "%05d" % (max_number[3..-1].to_i + 1)
        end
        number_array = []
        (max_number + 1).upto(max_number + quantity) do |i|
            number_array << "A#{now_year}#{"%05d" % i}"
        end
        return number_array.join("、")
    end

    def self.query_by_name(query)
        where("name like ?", "%#{query}%")
    end

    def self.query_by_model(query)
        where("model like ?", "%#{query}%")
    end

    def self.parse_xls_to_json(params, user_id)
        user_name = User.find(user_id).name

        name = "#{Rails.public_path}/import_admin_inventory.xls"
        #directory = "public"
        # create the file path
        #path = File.join(directory, name)
        # write the file
        File.open("#{name}", "wb") { |f| f.write(params[:xls_file].read) }

        require 'spreadsheet'
        file = Spreadsheet.open("#{name}")
        sheet = file.worksheet 0
        grid_data = []
        sheet.each_with_index do |row, index|
            if index > 0
                grid_data << {
                    :name => row[0],
                    :model => row[1],
                    :description => row[2],
                    :current_quantity => row[3],
                    :count_unit => row[4],
                    :buy_price => row[5].to_f,
                    :currency_name => 'RMB',
                    :currency_id => 11,
                    :rmb => row[5].to_f,
                    'buyer>id' => user_id,
                    :buyer_user_name => user_name,
                    :comment => row[8]
                }
            end
        end
        return {:success => true, :message => '导入成功', :grid_data => grid_data}
    end

    def for_name_combo_json
        attr = {}
        attr['name'] = attributes['name']
        attr
    end

    def for_model_combo_json
        attr = {}
        attr['name'] = attributes['model']
        attr
    end
end
