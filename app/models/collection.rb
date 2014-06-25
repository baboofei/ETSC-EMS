# encoding: utf-8
class Collection < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :amount, :contract_id, :reason, :received_at, :user_id

    belongs_to :contract

    def self.in_contract(contract_id)
        where("contract_id = ?", contract_id)
    end

    def self.current
        where("is_history != ? or is_history is null", true)
    end

    def for_grid_json(user_id)
        attr = attributes
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "实收款项"
        #因为要存历史，所以每个都是新增
        #binding.pry
        collection = Collection.new
        fields_to_be_updated = %w(contract_id received_at amount compensation_amount)
        contract = Contract.find(params['contract_id'])
        #根据实际来的参数保存“合同历史”
        contract_history = ContractHistory.new
        contract_history.item = "collection"

        if params[:id].blank?
            #表象上的“新增”
            message = $etsc_create_ok

            fields_to_be_updated.each do |field|
                collection[field] = params[field]
            end
            collection.user_id = user_id
            collection.save

            contract.total_collection = contract.total_collection.to_f
            contract.total_collection += (params['amount'].to_f + params['compensation_amount'].to_f)
            contract.save

            contract_history.old_id = nil
            contract_history.new_id = collection.id
            contract_history.natural_language = "新增了实收款项：于#{params['received_at']}收到#{contract.currency.name}#{params['amount']}#{params['compensation_amount'].blank? ? "" : "和补偿金额#{contract.currency.name}#{params['compensation_amount']}"}。"
            contract_history.user_id = user_id
            contract_history.save

            #签署后的改动才发消息
            if %w(d_progressing e_complete f_cancelled).include?(contract.state)
                #发已收到款项的消息给：
                target_ids = []
                #负责BA、BA经理、货运、会计、出纳、财务经理，这些是公共的
                target_ids << contract.dealer.id
                target_ids << contract.dealer.get_direct_manager_id
                target_ids << User.freighter.map(&:id)
                target_ids << User.accounting.map(&:id)
                target_ids << User.cashier.map(&:id)
                target_ids << Department.find(2).manager_id
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

                #target_ids = [5] #测试用
                target_ids.each do |target_id|
                    #消息通知
                    sn = (Time.now.to_f*1000).ceil
                    message_params = {
                        :content => "合同已收到新款项：#{contract.number.to_eim_message_link(sn)}",
                        :receiver_user_id => target_id,
                        :send_at => Time.now,
                        :sn => sn
                    }
                    PersonalMessage.create_or_update_with(message_params, user_id)
                end
            end
        else
            #表象上的“修改”
            message = $etsc_update_ok
            old_collection = Collection.find(params[:id])

            contract_history.old_id = params[:id]
            contract_history.new_id = collection.id
            modify_detail_array = []
            fields_to_be_updated.each do |field|
                collection[field] = params[field]
                case field
                    when "received_at"
                        modify_detail_array << "实收时间从#{old_collection[field].blank? ? "无" : old_collection[field].strftime("%Y-%m-%d")}修改为#{collection[field].blank? ? "无" : collection[field].strftime("%Y-%m-%d")}" if old_collection[field].to_s != collection[field].to_s
                    when "amount"
                        modify_detail_array << "实收金额从#{old_collection[field].blank? ? "无" : old_collection[field]}修改为#{collection[field].blank? ? "无" : collection[field]}" if old_collection[field].to_s != collection[field].to_s
                    when "compensation_amount"
                        modify_detail_array << "补偿金额从#{old_collection[field].blank? ? "无" : old_collection[field]}修改为#{collection[field].blank? ? "无" : collection[field]}" if old_collection[field].to_s != collection[field].to_s
                    else
                        # type code here

                end
            end
            collection.user_id = user_id
            collection.save

            contract.total_collection = contract.total_collection.to_f
            contract.total_collection -= (old_collection['amount'].to_f + old_collection['compensation_amount'].to_f)
            contract.total_collection += (params['amount'].to_f + params['compensation_amount'].to_f)
            contract.save

            contract_history.natural_language = "修改了实收款情况，改动如下：#{modify_detail_array.join("、")}。"
            contract_history.user_id = user_id
            contract_history.reason = params[:reason]
            contract_history.save

            #旧的做个标记
            old_collection.is_history = true
            old_collection.save
        end

        return {:success => true, :message => "#{item}#{message}", :id => collection.id, :total_collection => contract.total_collection}
    end

    def self.delete_with(params, user_id)
        item = "实收款项"
        message = $etsc_delete_ok
        collection = Collection.find(params['collection_id'])
        contract = collection.contract
        collection.is_history = true
        collection.save

        contract.total_collection = contract.total_collection.to_f
        contract.total_collection -= (collection['amount'].to_f + collection['compensation_amount'].to_f)
        #contract.total_collection += (params['amount'].to_f + params['compensation_amount'].to_f)
        contract.save

        contract_history = ContractHistory.new
        contract_history.item = "collection"
        contract_history.old_id = params['collection_id']
        contract_history.reason = params['reason']
        contract_history.user_id = user_id
        contract_history.natural_language = "删除了实收款项(#{collection.contract.currency.name}#{collection.amount})"
        contract_history.save

        return {:success => true, :message => "#{item}#{message}", :total_collection => contract.total_collection}
    end
end

