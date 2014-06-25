# encoding = utf-8
class PayMode < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :credit_level, :name

    has_many :contracts

    def self.query_by(query)
        where("name like ?", "%#{query}%")
    end

    def for_combo_json
        attr = attributes
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "付款方式"
        if !params[:id].blank?
            #修改时判断重名要看name和id
            if PayMode.where("name = ? and id != ?", params[:name], params[:id]).size > 0
                return {success: false, message: $etsc_duplicate_pay_mode}
            else
                pay_mode = PayMode.find(params[:id])
                message = $etsc_update_ok
            end
        else
            #新增时判断重名只看name
            #但如果name是数字还提交过来了，说明已经存在了，是从combo里选的
            if (params[:name].to_i != 0) or (PayMode.where("name = ?", params[:name]).size > 0)
                return {success: false, message: $etsc_duplicate_pay_mode}
            else
                pay_mode = PayMode.new
                message = $etsc_create_ok
            end
        end

        fields_to_be_updated = %w(name credit_level)
        fields_to_be_updated.each do |field|
            pay_mode[field] = params[field]
        end
        #binding.pry
        pay_mode.save
        return {:success => true, :message => "#{item}#{message}", :id => pay_mode.id}

    end
end
