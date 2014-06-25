# encoding: utf-8
class Receivable < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :amount, :contract_id, :expected_receive_at, :reason, :user_id

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
        item = "应收款项"
        #因为要存历史，所以每个都是新增
        #binding.pry
        receivable = Receivable.new
        fields_to_be_updated = %w(contract_id expected_receive_at amount)
        contract = Contract.find(params['contract_id'])
        #根据实际来的参数保存“合同历史”
        contract_history = ContractHistory.new
        contract_history.item = "receivable"

        if params[:id].blank?
            #表象上的“新增”
            message = $etsc_create_ok

            fields_to_be_updated.each do |field|
                receivable[field] = params[field]
            end
            receivable.user_id = user_id
            receivable.save

            contract_history.old_id = nil
            contract_history.new_id = receivable.id
            contract_history.natural_language = "新增了应收款项：应于#{params['expected_receive_at']}收取#{contract.currency.name}#{params['amount']}"
            contract_history.user_id = user_id
            contract_history.save
        else
            #表象上的“修改”
            message = $etsc_update_ok
            old_receivable = Receivable.find(params[:id])

            contract_history.old_id = params[:id]
            contract_history.new_id = receivable.id
            modify_detail_array = []
            fields_to_be_updated.each do |field|
                receivable[field] = params[field]
                case field
                    when "expected_receive_at"
                        modify_detail_array << "应收时间从#{old_receivable[field].blank? ? "无" : old_receivable[field].strftime("%Y-%m-%d")}修改为#{receivable[field].blank? ? "无" : receivable[field].strftime("%Y-%m-%d")}" if old_receivable[field].to_s != receivable[field].to_s
                    when "amount"
                        modify_detail_array << "应收金额从#{old_receivable[field].blank? ? "无" : old_receivable[field]}修改为#{receivable[field].blank? ? "无" : receivable[field]}" if old_receivable[field].to_s != receivable[field].to_s
                    else
                        # type code here
                end
            end
            receivable.user_id = user_id
            receivable.save

            contract_history.natural_language = "修改了应收款情况，改动如下：#{modify_detail_array.join("、")}。"
            contract_history.user_id = user_id
            contract_history.reason = params[:reason]
            contract_history.save

            #旧的做个标记
            old_receivable.is_history = true
            old_receivable.save
        end

        return {:success => true, :message => "#{item}#{message}", :id => receivable.id}
    end

    def self.delete_with(params, user_id)
        item = "应收款项"
        message = $etsc_delete_ok
        receivable = Receivable.find(params['receivable_id'])
        receivable.is_history = true
        receivable.save

        contract_history = ContractHistory.new
        contract_history.item = "receivable"
        contract_history.old_id = params['receivable_id']
        contract_history.reason = params['reason']
        contract_history.user_id = user_id
        contract_history.natural_language = "删除了应收款项(#{receivable.contract.currency.name}#{receivable.amount})"
        contract_history.save

        return {:success => true, :message => "#{item}#{message}"}
    end

    def self.create_with_time(contract, user_id, refs, time, before_or_after = "after")
        #binding.pry
        receivable = self.new
        if refs[4].match(/(.*)%/)
            #如果是百分比方式，则应收款用总价乘出来
            receivable['amount'] = contract.sum.to_f * (refs[4].match(/(.*)%/)[1]).to_f / 100.0
        else
            #如果是金额形式则直接写
            receivable['amount'] = (refs[4].match(/[A-Z]{3}(.*)/)[1]).to_f
        end
        receivable.contract_id = contract.id

        case refs[3]
            when "天"
                defer_days = refs[2].to_i
            when "周"
                defer_days = refs[2].to_i * 7
            when "月"
                defer_days = refs[2].to_i * 30
            else

        end
        if before_or_after == "before"
            receivable['expected_receive_at'] = time - defer_days.days
        else
            receivable['expected_receive_at'] = time + defer_days.days
        end
        receivable.save

        contract_history = ContractHistory.new
        contract_history.item = "receivable"
        contract_history.old_id = nil
        contract_history.new_id = receivable.id
        contract_history.natural_language = "新增了应收款项：应于#{time.strftime("%Y-%m-%d")}收取#{contract.currency.name}#{receivable['amount']}"
        contract_history.user_id = user_id
        contract_history.save
        return {:success => true, :message => "应收款时间已创建"}
    end
end
