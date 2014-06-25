# encoding: utf-8
class PersonalMessage < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :content, :read_at, :receiver_user_id, :send_at, :sender_user_id

    belongs_to :sender, :class_name => 'User', :foreign_key => 'sender_user_id'
    belongs_to :receiver, :class_name => 'User', :foreign_key => 'receiver_user_id'

    scope :unread, where("read_at is null")
    def self.send_by(user_id)
        where("sender_user_id = ?", user_id)
    end
    def self.target_is(user_id)
        where("receiver_user_id = ?", user_id)
    end

    def for_grid_json
        attr = attributes
        attr['flag'] = !(read_at.nil?)
        attr['sender>id'] = sender.id
        attr['sender>name'] = sender.name
        attr
    end

    #成员组能看到的消息的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        where("personal_messages.receiver_user_id in #{str}", *member_ids)
    end

    #设置为“已读”
    def self.mark_as_read(params)
        #binding.pry
        message_array = params[:personal_message_ids].split("|")
        message_array.each do |message_id|
            message = PersonalMessage.find(message_id)
            message.read_at = Time.now
            message.save
        end
    end

    #设置为“未读”
    def self.mark_as_unread(params)
        #binding.pry
        message_array = params[:personal_message_ids].split("|")
        message_array.each do |message_id|
            message = PersonalMessage.find(message_id)
            message.read_at = nil
            message.save
        end
    end

    #单条设置为“已读”
    def self.mark_single_as_read(params)
        #binding.pry
        message = PersonalMessage.find_by_sn(params['sn'])
        message.read_at = Time.now
        message.save
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "消息"
        #binding.pry
        if !params[:id].blank?
            personal_message = PersonalMessage.find(params[:id])
            message = $etsc_update_ok
        else
            personal_message = PersonalMessage.new
            message = $etsc_create_ok
        end
        #binding.pry
        fields_to_be_updated = %w(content receiver_user_id sn send_at).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            personal_message[field] = params[field]
        end
        personal_message.sender_user_id = user_id
        personal_message.save

        return {:success => true, :message => "#{item}#{message}", :personal_message_id => personal_message.id}
    end

    def self.get_new_messages(user_id)
        target_is(user_id).unread
    end
end
