# encoding: utf-8
class Group < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :description, :name
    #用户和工作组多对多
    has_many :groups_users
    has_many :users, :through => :groups_users
    #销售厂家和工作组多对多
    has_many :groups_vendor_units
    has_many :vendor_units, :through => :groups_vendor_units

    has_many :salecases
    has_many :quotes
    has_many :contracts
    has_many :customers

    def self.with_user(user_id)
        where("users.id = ?", user_id).includes(:users)
    end

    def whole_name
        "#{name}[#{description}]"
    end

    #给下拉列表或者筛选用的JSON
    def for_list_json
        attr = attributes
        attr['name'] = whole_name
        attr
    end

    #成员组能看到的项目组的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        where("users.id in #{str}", *member_ids).includes(:users)
    end

end
