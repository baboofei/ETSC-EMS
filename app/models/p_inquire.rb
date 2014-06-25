# encoding: utf-8
class PInquire < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :comment, :customer_unit_name, :department, :email, :en_addr, :en_name, :fax, :im, :vendor_unit_id, :mobile, :name,
                    :phone, :position, :postcode, :user_id, :customer_id

    belongs_to :user
    belongs_to :customer
    belongs_to :vendor_unit

    def for_grid_json(user_id)
        attr = attributes
        #attr['vendor_unit_id'] = m_lead_id.blank? ? "1" : m_lead_id.to_s
        attr
    end

    def self.create_or_update_with(params, user_id)
        item = "客户"
        #binding.pry
        if !params[:id].blank?
            #修改时
            p_inquire = PInquire.find(params[:id])
            message = $etsc_update_ok
        else
            #新增时
            p_inquire = PInquire.new
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(name en_name customer_unit_name mobile phone fax im department position addr en_addr
            postcode email comment vendor_unit_id detail
        )
        fields_to_be_updated.each do |field|
            p_inquire[field] = params[field]
        end
        p_inquire.user_id = params[:transfer_to]
        p_inquire.save

        #发消息
        sn = (Time.now.to_f*1000).ceil
        link_str = %{<a href="#" class='innerAcceptCustomer' x="m_sn:#{sn}|controller:PInquires|id:#{p_inquire.id}">#{p_inquire.name.blank? ? "点击查看" : p_inquire.name}</a>}
        message_params = {
            :content => "转让给你一个客户：#{link_str}",
            :receiver_user_id => params[:transfer_to],
            :send_at => Time.now,
            :sn => sn
        }
        PersonalMessage.create_or_update_with(message_params, user_id)
        #binding.pry
        return {:success => true, :message => "#{item}#{message}", :id => p_inquire.id}
    end

    def self.trans_to(params, user_id)
        #对目标客户循环
        customer_array = params[:customer_ids].split("|")
        customer_array.each do |customer_id|
            customer = PInquire.find(customer_id)
            #转user
            update_customer = Customer.find(customer)
            update_customer.user_id = params[:trans_to]
            update_customer.save

            #customer.is_transferred = true
            customer.save

            #发消息
            sn = (Time.now.to_f*1000).ceil
            link_str = %{<a href="#" class='innerAcceptCustomer' x="m_sn:#{sn}|controller:PInquires|id:#{customer.id}">#{customer.name.blank? ? "点击查看" : customer.name}</a>}
            message_params = {
                :content => "转让给你一个客户：#{link_str}",
                :receiver_user_id => params[:trans_to],
                :send_at => Time.now,
                :sn => sn
            }
            PersonalMessage.create_or_update_with(message_params, user_id)
        end
    end

    def self.re_trans_to(params, user_id)
        item = "客户"
        message = $etsc_update_ok
        inquire = where("id = ?", params['inquire_id'])[0]
        inquire.user_id = params[:trans_to]
        inquire.save

        #发消息
        sn = (Time.now.to_f*1000).ceil
        link_str = %{<a href="#" class='innerAcceptCustomer' x="m_sn:#{sn}|controller:PInquires|id:#{inquire.id}">#{inquire.name.blank? ? "点击查看" : inquire.name}</a>}
        message_params = {
            :content => "转让给你一个客户：#{link_str}",
            :receiver_user_id => params[:trans_to],
            :send_at => Time.now,
            :sn => sn
        }
        PersonalMessage.create_or_update_with(message_params, user_id)
        #binding.pry
        return {:success => true, :message => "#{item}#{message}", :id => inquire.id}
    end
end
