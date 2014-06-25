# encoding: utf-8
class ContractItem < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :actually_leave_factory_at, :appointed_leave_factory_at, :check_and_accept_at, :check_and_accept_status,
                    :commodity_id, :contract_id, :expected_leave_factory_at, :leave_etsc_at, :product_id, :quantity,
                    :reach_customer_at, :reason, :send_status, :serial_number, :warranty_term_id, :user_id, :purchase_order_id, :is_history

    belongs_to :contract
    belongs_to :product
    belongs_to :warranty_term
    belongs_to :purchase_order

    def self.in_contract(contract_id)
        where("contract_id = ?", contract_id)
    end

    def self.current
        where("is_history != ? or is_history is null", true)
    end

    def for_grid_json(user_id)
        attr = attributes
        attr['purchase_order>number'] = purchase_order.blank? ? "" : purchase_order.number
        attr['product>model'] = product.model
        attr['vendor_unit_id'] = product.producer.id
        attr['vendor_unit_name'] = product.producer.name
        attr['warranty_term>name'] = warranty_term.blank? ? '' :warranty_term.name
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "合同项"
        fields_to_be_updated = %w(product_id serial_number quantity send_status check_and_accept_status expected_leave_factory_at
            appointed_leave_factory_at actually_leave_factory_at leave_etsc_at reach_customer_at contract_id warranty_term_id
        )
        #根据实际来的参数保存“合同历史”
        contract_history = ContractHistory.new
        contract_history.item = "contract_item"

        #如果质保条款是新写的，则增一个
        if WarrantyTerm.where("id = ?", params['warranty_term_id']).blank?
            warranty_term = WarrantyTerm.new
            warranty_term.name = params['warranty_term_id']
            warranty_term.save
            params['warranty_term_id'] = warranty_term.id
        end
        if params[:id].blank?
            #表象上的“新增”
            contract_item = ContractItem.new
            message = $etsc_create_ok

            fields_to_be_updated.each do |field|
                contract_item[field] = params[field]
            end
            contract_item.user_id = user_id
            #如果合同本身需要安装，则验收时间为工程师安装完毕填写日志的时间
            #但现在那边的模块还没做，所以先默认成到货后四周
            #TODO
            #如果不需要安装，则验收时间默认为到货后两周
            unless params['reach_customer_at'].blank?
                if contract_item.contract.does_need_install?
                    contract_item.check_and_accept_at = params['reach_customer_at'].to_date + 4.weeks
                else
                    contract_item.check_and_accept_at = params['reach_customer_at'].to_date + 2.weeks
                end
            end

            #排序号
            max_inner_id = ContractItem.current.where("contract_id = ?", contract_item.id).map{|i| i.inner_id.blank? ? 0 : i.inner_id}.max
            new_inner_id = max_inner_id.blank? ? 1 : max_inner_id + 1
            contract_item.inner_id = new_inner_id
            contract_item.save

            contract_history.old_id = nil
            contract_history.new_id = contract_item.id
            contract_history.natural_language = "新增了合同项(#{contract_item.product.model})"
            contract_history.user_id = user_id
            contract_history.save
        else
            #表象上的“修改”
            message = $etsc_update_ok
            old_contract_item = ContractItem.find(params[:id])
            contract_item = old_contract_item.dup
            contract_history.old_id = params[:id]

            contract_history.new_id = contract_item.id
            modify_detail_array = []
            fields_to_be_updated.each do |field|
                contract_item[field] = params[field]
                case field
                    when "product_id"
                        modify_detail_array << "产品型号从#{old_contract_item[field].blank? ? "无" : Product.find(old_contract_item[field]).model}修改为#{contract_item[field].blank? ? "无" : Product.find(contract_item[field]).model}" if old_contract_item[field] != contract_item[field]
                    when "serial_number"
                        modify_detail_array << "序列号从#{old_contract_item[field].blank? ? "无" : old_contract_item[field]}修改为#{contract_item[field].blank? ? "无" : contract_item[field]}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "quantity"
                        modify_detail_array << "数量从#{old_contract_item[field].blank? ? "无" : old_contract_item[field]}修改为#{contract_item[field].blank? ? "无" : contract_item[field]}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "send_status"
                        if old_contract_item[field].to_s != contract_item[field].to_s
                            modify_detail_array << "发货状态从#{old_contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, old_contract_item[field]).first.display}修改为#{contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, contract_item[field]).first.display}"
                            #签署后的改动才发消息
                            if %w(d_progressing e_complete f_cancelled).include?(contract_item.contract.state)
                                #发已发货的消息给：
                                #负责销售、销售经理、负责BA、BA经理、货运
                                #在发货状态为：国际运输、货代、ETSC香港、清关中、国内运输时再额外发送给会计、财务经理--20140312。
                                #又不要了，改为判断实际发货时间、离开东隆时间、验收时间--20140430
                                contract = contract_item.contract
                                target_ids = []
                                target_ids << contract.signer.id
                                target_ids << contract.signer.get_direct_manager_id
                                #if [5, 6, 7, 8, 10].include?(contract_item[field].to_i)
                                #    target_ids << User.accounting.map(&:id)
                                #    target_ids << Department.find(2).manager_id
                                #end
                                target_ids << contract.dealer.id
                                target_ids << contract.dealer.get_direct_manager_id
                                target_ids << Role.find(18).user_ids
                                target_ids = target_ids.flatten.uniq

                                #target_ids = [5] #测试用
                                target_ids.each do |target_id|
                                    #消息通知
                                    sn = (Time.now.to_f*1000).ceil
                                    message_params = {
                                        :content => "合同#{contract.number.to_eim_message_link(sn)}中的合同项发货状态已经改变为#{Dictionary.where("data_type = ? and value = ?", field, contract_item[field]).first.display}。",
                                        :receiver_user_id => target_id,
                                        :send_at => Time.now,
                                        :sn => sn
                                    }
                                    PersonalMessage.create_or_update_with(message_params, user_id)
                                end
                            end
                        end
                    when "check_and_accept_status"
                        modify_detail_array << "验收状态从#{old_contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, old_contract_item[field]).first.display}修改为#{contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, contract_item[field]).first.display}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "expected_leave_factory_at"
                        modify_detail_array << "预计发货时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "appointed_leave_factory_at"
                        modify_detail_array << "合约发货时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "actually_leave_factory_at"
                        if old_contract_item[field].to_s != contract_item[field].to_s
                            modify_detail_array << "实际发货时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}"
                            contract = contract_item.contract
                            target_ids = []
                            target_ids << User.accounting.map(&:id)
                            target_ids << Department.find(2).manager_id
                            target_ids = target_ids.flatten.uniq

                            #target_ids = [5] #测试用
                            target_ids.each do |target_id|
                                #消息通知
                                sn = (Time.now.to_f*1000).ceil
                                message_params = {
                                    :content => "合同#{contract.number.to_eim_message_link(sn)}中货品的实际发货时间已经改变为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}。",
                                    :receiver_user_id => target_id,
                                    :send_at => Time.now,
                                    :sn => sn
                                }
                                PersonalMessage.create_or_update_with(message_params, user_id)
                            end
                        end
                    when "leave_etsc_at"
                        if old_contract_item[field].to_s != contract_item[field].to_s
                            modify_detail_array << "离开东隆时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}"
                            contract = contract_item.contract
                            target_ids = []
                            target_ids << User.accounting.map(&:id)
                            target_ids << Department.find(2).manager_id
                            target_ids = target_ids.flatten.uniq

                            #target_ids = [5] #测试用
                            target_ids.each do |target_id|
                                #消息通知
                                sn = (Time.now.to_f*1000).ceil
                                message_params = {
                                    :content => "合同#{contract.number.to_eim_message_link(sn)}中货品的离开东隆时间已经改变为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}。",
                                    :receiver_user_id => target_id,
                                    :send_at => Time.now,
                                    :sn => sn
                                }
                                PersonalMessage.create_or_update_with(message_params, user_id)
                            end
                        end
                    when "reach_customer_at"
                        if old_contract_item[field].to_s != contract_item[field].to_s
                            modify_detail_array << "到达客户时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}"
                            #如果合同本身需要安装，则验收时间为工程师安装完毕填写日志的时间
                            #但现在那边的模块还没做，所以先默认成到货后四周
                            #TODO
                            #如果不需要安装，则验收时间默认为到货后两周
                            if contract_item.contract.does_need_install?
                                contract_item["check_and_accept_at"] = params['reach_customer_at'].to_date + 4.weeks unless params['reach_customer_at'].blank?
                            else
                                contract_item["check_and_accept_at"] = params['reach_customer_at'].to_date + 2.weeks unless params['reach_customer_at'].blank?
                            end
                            modify_detail_array << "客户验收时间从#{old_contract_item['check_and_accept_at'].blank? ? "无" : old_contract_item['check_and_accept_at'].strftime("%Y-%m-%d")}修改为#{contract_item['check_and_accept_at'].blank? ? "无" : contract_item['check_and_accept_at'].strftime("%Y-%m-%d")}"
                            contract = contract_item.contract
                            target_ids = []
                            target_ids << User.accounting.map(&:id)
                            target_ids << Department.find(2).manager_id
                            target_ids = target_ids.flatten.uniq

                            #target_ids = [5] #测试用
                            target_ids.each do |target_id|
                                #消息通知
                                sn = (Time.now.to_f*1000).ceil
                                message_params = {
                                    :content => "合同#{contract.number.to_eim_message_link(sn)}中货品的到达客户时间已经改变为#{contract_item['check_and_accept_at'].blank? ? "无" : contract_item['check_and_accept_at'].strftime("%Y-%m-%d")}。",
                                    :receiver_user_id => target_id,
                                    :send_at => Time.now,
                                    :sn => sn
                                }
                                PersonalMessage.create_or_update_with(message_params, user_id)
                            end
                        end
                    #when "check_and_accept_at"
                    #TODO
                    #如果到客户处30天内未发生“验收有问题”，则验收时间定为这个“收货第30天”；如果被TSD模块改成过“验收无问题”，则验收时间取修改的时间。
                    #    modify_detail_array << "客户验收时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "warranty_term_id"
                        modify_detail_array << "质保条款从#{old_contract_item[field].blank? ? "无" : WarrantyTerm.find(old_contract_item[field]).name}修改为#{contract_item[field].blank? ? "无" : WarrantyTerm.find(contract_item[field]).name}" if old_contract_item[field].to_s != contract_item[field].to_s
                    else
                        # type code here
                end
            end
            contract_item.user_id = user_id
            contract_item.save

            #binding.pry
            #如果提交的值里有“预计发货时间”，则判断一下是否全部都有
            #如果提交的值里有“离开东隆时间”，则判断一下是否全部都有
            #验收不在这里填，所以不会有“验收时间”……
            unless params['appointed_leave_factory_at'].blank? && params['leave_etsc_at'].blank?
                if modify_detail_array.to_s.include?("合约发货") || modify_detail_array.to_s.include?("到达客户")
                    contract = contract_item.contract
                    params[:contract_item_ids] = contract.contract_items.current.map(&:id).join("|")
                    validate_to_gen_receivables(params, user_id)
                end
            end

            contract_history.natural_language = "修改了合同项(#{contract_item.product.model})，改动如下：#{modify_detail_array.join("、")}。"
            contract_history.user_id = user_id
            contract_history.reason = params[:reason]
            contract_history.save

            #旧的做个标记
            old_contract_item.is_history = true
            old_contract_item.save
        end

        return {:success => true, :message => "#{item}#{message}", :id => contract_item.id}
    end

    def self.delete_with(params, user_id)
        item = "合同项"
        message = $etsc_delete_ok
        contract_item_id_array = params['contract_item_ids'].split("|")
        contract_item_id_array.each { |contract_item_id|
            contract_item = ContractItem.find(contract_item_id)
            contract_item.is_history = true
            contract_item.save

            contract_history = ContractHistory.new
            contract_history.item = "contract_item"
            contract_history.old_id = contract_item_id
            contract_history.reason = params['reason']
            contract_history.user_id = user_id
            contract_history.natural_language = "删除了合同项(#{contract_item.product.model})"
            contract_history.save
        }
        return {:success => true, :message => "#{item}#{message}"}
    end

    def self.divide_with(params, user_id)
        #binding.pry
        contract_item = ContractItem.find(params['id'])
        new_contract_item = contract_item.dup
        new_contract_item.quantity = contract_item.quantity - params['divide_quantity'].to_i
        contract_item.quantity = params['divide_quantity'].to_i
        new_contract_item.save
        contract_item.save

        contract_history = ContractHistory.new
        contract_history.item = "contract_item"
        contract_history.old_id = contract_item.id
        contract_history.new_id = new_contract_item.id
        #contract_history.reason = params['reason']
        contract_history.user_id = user_id
        contract_history.natural_language = "合同项(#{contract_item.product.model})分为两批发货，数量从#{contract_item.quantity + new_contract_item.quantity}变为#{contract_item.quantity}和#{new_contract_item.quantity}"
        contract_history.save

        return {:success => true, :message => "合同项拆分成功"}
    end

    def self.batch_edit_with(params, user_id)
        #binding.pry
        contract_item_id_array = params['select_ids'].split('|')

        if params['item'] == "divide_sending"
            #“批量分批发货”比较独特一些
            contract_item_id_array.each do |contract_item_id|
                contract_item = ContractItem.find(contract_item_id)
                new_contract_item = contract_item.dup
                new_contract_item.quantity = contract_item.quantity - params['value'].to_i
                contract_item.quantity = params['value'].to_i
                new_contract_item.save
                contract_item.save

                contract_history = ContractHistory.new
                contract_history.item = "contract_item"
                contract_history.old_id = contract_item.id
                contract_history.new_id = new_contract_item.id
                #contract_history.reason = params['reason']
                contract_history.user_id = user_id
                contract_history.natural_language = "合同项(#{contract_item.product.model})分为两批发货，数量从#{contract_item.quantity + new_contract_item.quantity}变为#{contract_item.quantity}和#{new_contract_item.quantity}"
                contract_history.save
            end
        else
            if params['item'] == 'warranty_term_id' && WarrantyTerm.where("id = ?", params['value']).blank?
                warranty_term = WarrantyTerm.new
                warranty_term.name = params['value']
                warranty_term.save
                params['value'] = warranty_term.id
            end
            contract_item_id_array.each do |contract_item_id|
                old_contract_item = ContractItem.find(contract_item_id)
                contract_item = old_contract_item.dup
                old_contract_item.is_history = true
                old_contract_item.save
                contract_item[params['item']] = params['value']
                contract_item.save

                contract_history = ContractHistory.new
                contract_history.new_id = contract_item.id
                contract_history.old_id = old_contract_item.id
                contract_history.item = "contract_item"
                contract_history.user_id = user_id
                contract_history.reason = params['reason']
                field = params['item']
                #binding.pry
                case field
                    when "quantity"
                        natural_language = "数量从#{old_contract_item[field].blank? ? "无" : old_contract_item[field]}修改为#{contract_item[field].blank? ? "无" : contract_item[field]}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "send_status"
                        natural_language = "发货状态从#{old_contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, old_contract_item[field]).first.display}修改为#{contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, contract_item[field]).first.display}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "check_and_accept_status"
                        natural_language = "验收状态从#{old_contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, old_contract_item[field]).first.display}修改为#{contract_item[field].blank? ? "无" : Dictionary.where("data_type = ? and value = ?", field, contract_item[field]).first.display}" if old_contract_item[field].to_s != contract_item[field].to_s
                    when "warranty_term_id"
                        natural_language = "质保条款从#{old_contract_item[field].blank? ? "无" : WarrantyTerm.find(old_contract_item[field]).name}修改为#{contract_item[field].blank? ? "无" : WarrantyTerm.find(contract_item[field]).name}" if old_contract_item[field].to_s != contract_item[field].to_s
                    else
                        # type code here
                end
                contract_history.natural_language = "修改了合同项((#{contract_item.product.model})，改动如下：#{natural_language}。"
                contract_history.save
            end
            #签署后的改动才发消息
            if %w(d_progressing e_complete f_cancelled).include?(ContractItem.find(contract_item_id_array[0]).contract.state)
                #发已发货的消息给：
                #负责销售、销售经理、负责BA、BA经理、货运
                #在发货状态为：国际运输、货代、ETSC香港、清关中、国内运输时再额外发送给会计、财务经理
                contract = ContractItem.find(contract_item_id_array[0]).contract
                target_ids = []
                target_ids << contract.signer.id
                target_ids << contract.signer.get_direct_manager_id
                if params['item'] == 'send_status' && [5, 6, 7, 8, 10].include?(params['value'].to_i)
                    target_ids << User.accounting.map(&:id)
                    target_ids << Department.find(2).manager_id
                end
                target_ids << contract.dealer.id
                target_ids << contract.dealer.get_direct_manager_id
                target_ids << Role.find(18).user_ids
                target_ids = target_ids.flatten.uniq

                #target_ids = [5] #测试用

                target_ids.each do |target_id|
                    #消息通知
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "合同#{contract.number.to_eim_message_link(sn)}中的合同项发货状态已经改变为#{Dictionary.where("data_type = ? and value = ?", "send_status", params['value']).first.display}。",
                        :receiver_user_id => target_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
            end
        end

        return {:success => true, :message => "合同项修改成功"}
    end

    def self.batch_edit_date_with(params, user_id)
        #binding.pry
        contract_item_id_array = params['select_ids'].split('|')
        contract_item_id_array.each do |contract_item_id|
            old_contract_item = ContractItem.find(contract_item_id)
            contract_item = old_contract_item.dup
            old_contract_item.is_history = true
            old_contract_item.save
            contract_item[params['item']] = params['date']
            contract_item.save

            contract_history = ContractHistory.new
            contract_history.new_id = contract_item.id
            contract_history.old_id = old_contract_item.id
            contract_history.item = "contract_item"
            contract_history.user_id = user_id
            contract_history.reason = params['reason']

            field = params['item']
            #binding.pry
            case field
                when "expected_leave_factory_at"
                    natural_language = "预计发货时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                when "appointed_leave_factory_at"
                    natural_language = "合约发货时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                when "actually_leave_factory_at"
                    natural_language = "实际发货时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                when "leave_etsc_at"
                    natural_language = "离开东隆时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                when "reach_customer_at"
                    natural_language = "到达客户时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                when "check_and_accept_at"
                    natural_language = "客户验收时间从#{old_contract_item[field].blank? ? "无" : old_contract_item[field].strftime("%Y-%m-%d")}修改为#{contract_item[field].blank? ? "无" : contract_item[field].strftime("%Y-%m-%d")}" if old_contract_item[field].to_s != contract_item[field].to_s
                else
                    # type code here
            end
            contract_history.natural_language = "修改了合同项((#{contract_item.product.model})，改动如下：#{natural_language}。"
            contract_history.save
        end
        if params['item'] == "appointed_leave_factory_at" || params['item'] == "leave_etsc_at" || params['item'] == "check_and_accept_at"
                params[:contract_item_ids] = params['select_ids']
                validate_to_gen_receivables(params, user_id)
        end
        return {:success => true, :message => "合同项修改成功"}
    end

    def self.update_serial_number_with(params, user_id)
        #binding.pry
        #因为要存历史，所以每个都是新增
        old_contract_item = ContractItem.find(params[:id])
        contract_item = old_contract_item.dup
        contract_item.serial_number = params['serial_number']
        contract_item.save

        old_contract_item.is_history = true
        old_contract_item.save

        #根据实际来的参数保存“合同历史”
        contract_history = ContractHistory.new
        contract_history.item = "contract_item"

        contract_history.old_id = params[:id]
        contract_history.new_id = contract_item.id
        modify_detail = "序列号从#{old_contract_item['serial_number'].blank? ? "无" : old_contract_item['serial_number']}修改为#{contract_item['serial_number'].blank? ? "无" : contract_item['serial_number']}"
        contract_item.user_id = user_id
        contract_item.save

        contract_history.natural_language = "修改了合同项(#{contract_item.product.model})，改动如下：#{modify_detail}。"
        contract_history.user_id = user_id
        contract_history.reason = params[:reason]
        contract_history.save

        #旧的做个标记
        old_contract_item.is_history = true
        old_contract_item.save

        return {:success => true, :message => "合同项修改成功"}
    end

    #判断是否应该生成应收货时间点
    #如果每项都有“预计发货时间”，则生成“发货前”的时间节点
    #如果每项都有“离开东隆时间”，则生成“发货后”的时间节点
    #如果每项都有“已验收时间”，则生成“验收后”的时间节点
    def self.validate_to_gen_receivables(params, user_id)
        contract_item_id_array = params[:contract_item_ids].split("|")
        str = "(#{contract_item_id_array.map{"?"}.join(",")})"
        contract_items = ContractItem.current.where("id in #{str}", *contract_item_id_array)
        #批量修改时，传过来的值已经不是current了，所以上面的会取到空值，此时再取一遍真实的
        contract_items = ContractItem.where("id in #{str}", *contract_item_id_array) if contract_items == []
        #binding.pry
        contract = contract_items[0].contract
        all_appointed = true
        all_leaved = true
        all_checked = true
        contract_items.each do |contract_item|
            all_appointed = false if contract_item['appointed_leave_factory_at'].blank?
            all_leaved = false if contract_item['leave_etsc_at'].blank?
            all_checked = false if contract_item['check_and_accept_at'].blank?
        end
        #binding.pry
        contract.gen_receivable_when_appoint(user_id) if all_appointed
        contract.gen_receivable_when_leave(user_id) if all_leaved
        contract.gen_receivable_when_check(user_id) if all_checked

        return {:success => true, :message => "应收款点新增成功"}
    end
end
