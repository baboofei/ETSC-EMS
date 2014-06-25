# encoding: utf-8
class Remind < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :flag, :remind_at, :remind_text

    belongs_to :user
    scope :unread, where("flag = ?", 0)
    scope :at_time, where("remind_at < ?", Time.now.strftime("%Y-%m-%d 23:59:59"))

    def for_grid_json
        attributes
    end

    #成员组能看到的提醒的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        where("reminds.user_id in #{str}", *member_ids)
    end

    #设置为“已读”
    def self.mark_as_read(params)
        remind_array = params[:remind_ids].split("|")
        remind_array.each do |remind_id|
            remind = Remind.find(remind_id)
            remind.flag = true
            remind.save
        end
    end

    #单条设置为“已读”
    def self.mark_single_as_read(params)
        remind = Remind.find_by_sn(params['sn'])
        remind.flag = true
        remind.save
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    #提醒只能创建不能修改，所以不会有update的情况，但命名还是留着吧
    def self.create_or_update_with(params, user_id)
        item = "提醒"
        remind = Remind.new
        message = $etsc_create_ok

        fields_to_be_updated = %w(remind_at remind_text sn).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            remind[field] = params[field]
        end
        remind.user_id = user_id
        remind.save

        return {success: true, message: "#{item}#{message}"}
    end
end
