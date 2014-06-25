# encoding: utf-8
class ContractHistory < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :item, :natural_language, :new_id, :old_id

    belongs_to :user

    def self.in_contract(contract_id)
        contract_item_ids = ContractItem.where("contract_id = ?", contract_id).map(&:id)
        contract_item_str = "(#{contract_item_ids.map{"?"}.join(",")})"
        subsequent_condition_array = []
        if contract_item_ids.blank?
            contract_item_condition = "null"
        else
            contract_item_condition = "(item = ? and (new_id in #{contract_item_str} or old_id in #{contract_item_str}))"
            subsequent_condition_array << "contract_item"
            subsequent_condition_array << contract_item_ids * 2
        end
        collection_ids = Collection.where("contract_id = ?", contract_id).map(&:id)
        collection_str = "(#{collection_ids.map{"?"}.join(",")})"
        if collection_ids.blank?
            collection_condition = "null"
        else
            collection_condition = "(item = ? and (new_id in #{collection_str} or old_id in #{collection_str}))"
            subsequent_condition_array << "collection"
            subsequent_condition_array << collection_ids * 2
        end
        receivable_ids = Receivable.where("contract_id = ?", contract_id).map(&:id)
        receivable_str = "(#{receivable_ids.map{"?"}.join(",")})"
        if receivable_ids.blank?
            receivable_condition = "null"
        else
            receivable_condition = "(item = ? and (new_id in #{receivable_str} or old_id in #{receivable_str}))"
            subsequent_condition_array << "receivable"
            subsequent_condition_array << receivable_ids * 2
        end
        #binding.pry
        contract_condition = "(item = ? and (new_id = ? or old_id = ?))"
        subsequent_condition_array << "contract"
        subsequent_condition_array << [contract_id] * 2
        subsequent_condition_array.flatten!
        where("#{contract_item_condition} or #{collection_condition} or #{receivable_condition} or #{contract_condition}", *subsequent_condition_array)
        #where("#{contract_item_condition} or #{collection_condition} or #{receivable_condition}", *subsequent_condition_array)
    end

    def for_grid_json(user_id)
        attr = attributes
        attr['user>name'] = user.name
        attr
    end
end
