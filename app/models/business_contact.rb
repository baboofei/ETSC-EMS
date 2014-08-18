# encoding: utf-8
class BusinessContact < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :addr, :business_unit_id, :comment, :department, :email, :en_name, :fax, :im, :mobile, :name, :phone,
                    :en_addr, :postcode, :position, :user_id

    belongs_to :business_unit
    has_many :contracts

    belongs_to :user

    #个案和商务相关联系人多对多
    has_many :business_contacts_salecases
    has_many :salecases, :through => :business_contacts_salecases

    alias_method :business_contact_unit, :business_unit
    #alias_method :business_contact_unit_id, :business_unit_id

    def business_contact_unit_id=(business_unit_id)
        business_unit_id
    end
    def business_contact_unit_id
        business_unit_id
    end

    def self.in_unit(business_unit_id)
        where("business_unit_id = ?", "#{business_unit_id}")
    end

    def self.in_salecase(salecase_id)
        where("salecases.id = ?", salecase_id).includes(:salecases)
    end

    def self.query_by(query)
        where("name like ? or en_name like ?", "%#{query}%", "%#{query}%")
    end

    def for_combo_json
        attr = attributes
        attr
    end

    def for_grid_json(user_id)
        attr = attributes
        #binding.pry if business_unit.nil?
        if business_unit
            attr['business_unit>(name|en_name|unit_aliases>unit_alias)'] = business_unit.name
            #attr['business_unit>business_unit_aliases>unit_alias'] = business_unit.name
            attr['business_unit>id'] = business_unit.id
            #binding.pry if business_unit.city.nil?
            attr['business_unit>city>name'] = business_unit.city.name
            attr['business_unit>city>id'] = business_unit.city.id
            if business_unit.city && business_unit.city.prvc && business_unit.city.prvc.area
                attr['business_unit>city>prvc>area>name'] = business_unit.city.prvc.area.name
                attr['business_unit>city>prvc>area>id'] = business_unit.city.prvc.area.id
            else
                attr['business_unit>city>prvc>area>name'] = $etsc_empty_data
                attr['business_unit>city>prvc>area>id'] = 0
            end
            #名称不显示在别称里
            business_unit_aliases = business_unit.unit_aliases
            business_unit_aliases_name_array = []
            business_unit_aliases.each do |business_unit_alias|
                if business_unit_alias.unit_alias != business_unit.name
                    business_unit_aliases_name_array << business_unit_alias.unit_alias
                end
            end
            attr['business_unit>unit_aliases>unit_alias'] = business_unit_aliases_name_array.join("、")
        else
            attr['business_unit>(name|en_name|unit_aliases>unit_alias)'] = $etsc_empty_data
            #attr['business_unit>name'] = $etsc_empty_data
            attr['business_unit>id'] = 0
            attr['business_unit>city>name'] = $etsc_empty_data
            attr['business_unit>city>id'] = 0
        end
        attr[:user_name] = user.name
        attr[:user_id] = user.id
        attr['editable'] = true#User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    def for_mini_grid_json
        attr = attributes
        #binding.pry if customer_unit.nil?
        attr['business_unit>name'] = business_unit.name
        attr['business_unit>id'] = business_unit.id
        attr['email'] = email
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "商务相关联系人"
        if params[:id] != ""
            business_contact = BusinessContact.find(params[:id])
            message = $etsc_update_ok
        else
            business_contact = BusinessContact.new
            business_contact.user_id = user_id
            message = $etsc_create_ok
        end

        #binding.pry
        fields_to_be_updated = %w(business_unit_id name en_name email mobile phone fax im addr postcode en_addr comment)
        fields_to_be_updated.each do |field|
            business_contact[field] = params[field]
        end
        business_contact.save

        return {:success => true, :message => "#{item}#{message}", :id => business_contact.id}
    end

    #保存商务相关联系人|销售日志对应关系
    def self.save_business_contacts_in_salecase(params, user_id)
        #如果已经有对应关系则先删掉，避免重复
        BusinessContactsSalecase.delete_all(["business_contact_id = ? and salecase_id = ?", params[:business_contact_id], params[:salecase_id]])
        #再加
        business_contact_salecase_params = {
            :business_contact_id => params[:business_contact_id],
            :salecase_id => params[:salecase_id]
        }
        BusinessContactsSalecase.new_or_save_with(business_contact_salecase_params)

        #也处理一下客户单位的问题吧，虽然可能不应该放这个model里
        #先删
        BusinessUnitsSalecase.delete_all(["business_unit_id = ? and salecase_id = ?", params[:business_unit_id], params[:salecase_id]])
        #再加
        business_unit_salecase_params = {
            :business_unit_id => params[:business_unit_id],
            :salecase_id => params[:salecase_id]
        }
        BusinessUnitsSalecase.new_or_save_with(business_unit_salecase_params)

        #新建一条“增加联系人”的日志
        need_sign = !Salecase.find(params[:salecase_id]).group.nil?
        process = Dictionary.where("data_type = 'sales_processes' and value = ?", 19).first.display
        business_unit = BusinessUnit.find(params[:business_unit_id]).name
        business_contact = BusinessContact.find(params[:business_contact_id]).name
        #如果传来的日期是今天，则存当前时间
        #如果不是，说明填的是以前的日子，则存当日零点（判断不出时间啊……）
        contact_at = (Time.now.strftime("%Y-%m-%d") == params[:contact_at] ? Time.now : params[:contact_at])
        salelog_params = {
            :process => 19,
            :contact_at => contact_at,
            :salecase_id => params[:salecase_id],
            :user_id => user_id,
            :natural_language => "#{process}：#{business_unit}的#{business_contact}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
        }
        Salelog.create_or_update_with(salelog_params)
    end

    def self.delete_business_contacts_in_salecases(params, user_id)
        need_sign = !Salecase.find(params[:salecase_id]).group.nil?
        BusinessContactsSalecase.delete_all(["business_contact_id = ? and salecase_id = ?", params[:business_contact_id], params[:salecase_id]])
        #新建一条“删除联系人”的日志
        process = Dictionary.where("data_type = 'sales_processes' and value = ?", 23).first.display
        business_contact = BusinessContact.find(params[:business_contact_id])
        business_contact_name = business_contact.name
        business_unit = business_contact.business_unit
        business_unit_name = business_unit.name
        salelog_params = {
            :process => 23,
            :contact_at => Time.now, #这里没办法了，只能存当前时间
            :salecase_id => params[:salecase_id],
            :user_id => user_id,
            :natural_language => "#{process}：#{business_unit_name}的#{business_contact_name}#{need_sign ? "(by#{User.find(user_id).name})" : ""}"
        }
        Salelog.create_or_update_with(salelog_params)

        #如果删除后本个案中没有其它同单位的人，则删除个案/客户单位的关联
        case_business_contact_cus = BusinessUnit.where("salecases.id = 789").includes(:business_contacts => :salecases)
        case_cus = BusinessUnit.where("salecases.id = 789").includes(:salecases)
        diffs = case_cus - case_business_contact_cus
        diffs.each { |diff|
            BusinessUnitsSalecase.delete_all(["business_unit_id = ? and salecase_id = ?", diff.id, params[:salecase_id]])
        }
    end

end
