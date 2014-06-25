# encoding: utf-8
class FlowSheet < ActiveRecord::Base
    require "reusable"
    include Reusable
    attr_accessible :comment, :contract_id, :deal_requirement, :deliver_by, :description, :duration, :flow_sheet_type, :is_in_warranty, :number, :priority, :state, :support_user_id

    has_many :received_equipments
    has_many :service_logs

    #水单和用户多对多
    has_many :flow_sheets_users, :class_name => 'FlowSheetsUser', :foreign_key => 'flow_sheet_id'
    has_many :users, :through => :flow_sheets_users, :source => :user
    #水单和客户单位多对多
    has_many :customer_units_flow_sheets, :class_name => 'CustomerUnitsFlowSheet', :foreign_key => :flow_sheet_id
    has_many :customer_units, :through => :customer_units_flow_sheets, :source => :customer_unit
    #水单和客户多对多
    has_many :customers_flow_sheets, :class_name => 'CustomersFlowSheet', :foreign_key => :flow_sheet_id
    has_many :customers, :through => :customers_flow_sheets, :source => :customer

    belongs_to :contract

    state_machine :initial => :a_start do
        event :confirm_quit do
            transition [:a_start] => :e_red_package_done
        end
        event :check_equipment do
            transition [:a_start, :c_waiting_customer_send] => :b_dealing
        end
        event :wait_customer_respond do
            transition [:b_dealing] => :c_waiting_customer_respond
        end
        event :customer_respond do
            transition [:c_waiting_customer_respond] => :b_dealing
        end
        event :wait_spare do
            transition [:b_dealing] => :c_waiting_spare
        end
        event :spare_done do
            transition [:c_waiting_spare] => :b_dealing
        end
        event :dispute do
            transition [:b_dealing] => :d_failure
        end
        event :wait_customer_pay do
            transition [:b_dealing] => :c_waiting_customer_pay
        end
        event :customer_pay_done do
            transition [:c_waiting_customer_pay] => :b_dealing
        end
        event :package do
            transition [:b_dealing] => :e_green_package_done
        end
        event :return_factory do
            transition [:e_green_package_done] => :c_waiting_factory_support
        end
        event :receive do
            transition [:c_waiting_factory_support] => :b_dealing
        end
        event :deliver do
            transition [:e_green_package_done] => :f_green_done
        end
        event :wait_factory_support do
            transition [:b_dealing] => :c_waiting_factory_support
        end
        event :factory_support_done do
            transition [:c_waiting_factory_support] => :b_dealing
        end
    end

    def state_machine_with_id(id)
        case id
            when 1
                confirm_quit
                save
            when 2
                check_equipment
                save
            when 3
                wait_customer_respond
                save
            when 6
                customer_respond
                save
            when 7
                wait_spare
                save
            when 8
                spare_done
                save
            when 11
                dispute
                save
            when 12
                wait_customer_pay
                save
            when 13
                customer_pay_done
                save
            when 22
                wait_factory_support
                save
            when 23
                factory_support_done
                save
        end
    end

    def for_grid_json(user_id)
        attr = attributes
        #binding.pry if customer_unit.nil?
        attr['users>name'] = users.map(&:name).join("、")
        attr['users>id'] = users.map(&:id).join(",")
        attr['customer_units>(name|en_name|unit_aliases>unit_alias)'] = customer_units.map(&:name).join("、")
        attr['customer_units>id'] = customer_units.map(&:id).join("|")
        attr['customers>(name|en_name)'] = customers.map(&:name).join("、")
        attr['customers>id'] = customers.map(&:id).join("|")
        warranty = true
        if received_equipments.size == 0
            attr['is_in_warranty'] = nil
        else
            received_equipments.map(&:is_in_warranty).map{|p| warranty = p && warranty}
            attr['is_in_warranty'] = warranty ? "1" : "2"
        end
        attr['contract>number'] = contract.number if contract
        attr['contract>id'] = contract.id if contract
        #attr['group_name'] = (group && group.id != 0) ? group.whole_name : ""
        #attr['editable'] = User.find(user.id).get_group_mate_ids.include? user_id
        attr
    end

    def self.create_or_update_with(params, user_id)
        #TODO
        #其实这里不一定用得到，先写上吧
        item = "维修水单"
        #binding.pry
        unless params[:id].blank?
            flow_sheet = FlowSheet.find(params[:id])
            message = $etsc_update_ok
        else
            flow_sheet = FlowSheet.new
            #生成个案编号
            flow_sheet.number = self.gen_new_number_with_letter("S")
            message = $etsc_create_ok
        end
        fields_to_be_updated = %w(customer_unit_id customer_id flow_sheet_type description priority deal_requirement
            deliver_by comment
        )
        fields_to_be_updated.each do |field|
            flow_sheet[field] = params[field]
        end
        #binding.pry
        flow_sheet.save

        #如果是新增，则
        if params[:id].blank?
            #水单和客户单位关联
            customer_unit_flow_sheet = CustomerUnitsFlowSheet.new
            customer_unit_flow_sheet.customer_unit_id = params[:customer_unit_id]
            customer_unit_flow_sheet.flow_sheet_id = flow_sheet.id
            customer_unit_flow_sheet.save
            #水单和客户关联
            customer_flow_sheet = CustomersFlowSheet.new
            customer_flow_sheet.customer_id = params[:customer_id]
            customer_flow_sheet.flow_sheet_id = flow_sheet.id
            customer_flow_sheet.save
            #水单和用户关联
            flow_sheet_user = FlowSheetsUser.new
            flow_sheet_user.flow_sheet_id = flow_sheet.id
            flow_sheet_user.user_id = user_id
            flow_sheet_user.save

            #binding.pry
            #新建一条“水单开始”的日志
            process_id = 15
            process = Dictionary.where("data_type = 'flow_sheet_processes' and value = ?", process_id).first.display
            service_log_params = {
                :process_type => process_id,
                :start_at => params[:created_at],
                :flow_sheet_id => flow_sheet.id,
                :user_id => user_id,
                :natural_language => "#{process}：#{params[:description]}"
            }
            ServiceLog.create_or_update_with(service_log_params)
        else
            #如果是修改，看当前user是否已经和水单关联，没有则关联一下
            existed_relation = FlowSheetsUser.where("user_id = ? and flow_sheet_id = ?", user_id, params[:id])
            if existed_relation.size == 0
                flow_sheet_user = FlowSheetsUser.new
                flow_sheet_user.flow_sheet_id = params[:id]
                flow_sheet_user.user_id = user_id
                flow_sheet_user.save
            end
        end

        return {:success => true, :message => "#{item}#{message}", :flow_sheet_id => flow_sheet.id}
    end
end