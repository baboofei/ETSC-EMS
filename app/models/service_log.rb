# encoding: utf-8
class ServiceLog < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :natural_language, :process, :content, :comment, :end_at, :start_at, :user_id, :inner_id, :flow_sheet_id

    belongs_to :flow_sheet
    has_one :quote, :as => :quotable

    def self.in_flow_sheet(flow_sheet_id)
        where("flow_sheet_id = ?", flow_sheet_id)
    end

    def for_grid_json
        attributes
    end

    def self.add_service_log(params, user_id)
        case params[:type]
            #TODO
            #这里虽然用了yield但还是很怪，这个操作名称和类型的关系应该有一个表来对应
            #dictionaries表加一个en_name之类的字段应该可以解决这个问题
            when "confirm_quit"
                process_type = 1
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.confirm_quit
                end
            when "check_equipment"
                process_type = 2
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.check_equipment
                end
            when "wait_customer_respond"
                process_type = 3
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.wait_customer_respond
                end
            when "change_parts"
                process_type = 4

                data_array = params['item_grid_data']
                params['content'] = JSON.parse(data_array).map{|data| "#{data['current_quantity']}#{data['count_unit']}#{data['name']}"}.join("、")
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    #flow_sheet.wait_customer_respond
                    admin_inventory_params = {
                        'event' => "apply_for_use",
                        'grid_data' => data_array,
                        'project_option' => 'tsd'
                    }
                    AdminInventory.create_or_update_with(admin_inventory_params, user_id, false)
                end
            when "change_detached_parts"
                process_type = 5
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    #flow_sheet.wait_customer_respond
                end
            when "customer_respond"
                process_type = 6
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.customer_respond
                end
            when "wait_spare"
                process_type = 7
                params['content'] = "需要#{params['quantity']}件#{params['name']}"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.wait_spare
                end
            when "spare_done"
                process_type = 8
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.spare_done
                end
            when "check_or_test"
                process_type = 9
                params['content'] = params['content'].to_s.gsub(/\n/, "<br/>")
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                end
            when "calibrate_or_debug"
                process_type = 10
                params['content'] = params['content'].to_s.gsub(/\n/, "<br/>")
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                end
            when "dispute"
                process_type = 11
                params['content'] = params['content'].to_s.gsub(/\n/, "<br/>")
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.dispute
                end
            when "wait_customer_pay"
                process_type = 12
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.wait_customer_pay
                end
            when "customer_pay_done"
                process_type = 13
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.customer_pay_done
                end
            when "add_equipment"
                #binding.pry
                process_type = 16

                params[:act_date] = params[:accepted_at]
                params['content'] = "#{VendorUnit.find(params['vendor_unit_id']).name}的#{Product.find(params['product_id']).display_name}，故障现象为#{params['symptom']}。"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    #binding.pry
                    received_equipment_params = {
                        :accepted_at => params['accepted_at'],
                        :collect_account_number => params['collect_account_number'],
                        :comment => params['comment'],
                        :flow_sheet_id => params['flow_sheet_id'],
                        :is_in_warranty => params['is_in_warranty'],
                        :product_id => params['product_id'],
                        :sn => params['sn'],
                        :symptom => params['symptom']
                    }
                    received_equipment = ReceivedEquipment.new(received_equipment_params)
                    received_equipment.save

                    flow_sheet.check_equipment
                end
            when "delete_equipment"
                #binding.pry
                process_type = 17
                params[:act_date] = Date.today.strftime("%Y-%m-%d")
                params['content'] = "#{ReceivedEquipment.find(params['equipment_ids'].split("|")[0]).product.display_name}等#{params['equipment_ids'].split("|").size}件货品"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    equipment_ids = params['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        ReceivedEquipment.delete_all(["id = ?", equipment_id])
                    end
                end
            when "package_equipment"
                process_type = 18
                params['content'] = "#{ReceivedEquipment.find(params['equipment_ids'].split("|")[0]).product.display_name}等#{params['equipment_ids'].split("|").size}件货品"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    equipment_ids = params['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_packaged}.uniq == [true]
                        flow_sheet.package
                        flow_sheet.save
                    end
                end
            when "return_equipment"
                process_type = 19
                params['content'] = "#{ReceivedEquipment.find(params['equipment_ids'].split("|")[0]).product.display_name}等#{params['equipment_ids'].split("|").size}件货品"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    equipment_ids = params['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = true
                        equipment.save
                    end
                    #都返厂了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.uniq == [true]
                        flow_sheet.return_factory
                        flow_sheet.save
                    end
                end
            when "receive_equipment"
                process_type = 20
                params['content'] = "#{ReceivedEquipment.find(params['equipment_ids'].split("|")[0]).product.display_name}等#{params['equipment_ids'].split("|").size}件货品"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    equipment_ids = params['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.save
                    end
                    #只要有一件返厂收货了，就改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.include?(true)
                        flow_sheet.receive
                        flow_sheet.save
                    end
                end
            when "deliver_equipment"
                process_type = 21
                params['content'] = "#{ReceivedEquipment.find(params['equipment_ids'].split("|")[0]).product.display_name}等#{params['equipment_ids'].split("|").size}件货品"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    equipment_ids = params['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.is_sent_back = true
                        equipment.save
                    end
                    #都发客户了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_sent_back}.uniq == [true]
                        flow_sheet.deliver
                        flow_sheet.save
                    end
                end
            when "wait_factory_support"
                process_type = 22
                params['content'] = "需要#{params['name']}，数量为#{params['quantity']}"
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.wait_factory_support
                end
            when "factory_support_done"
                process_type = 23
                dry_add_service_log(params, process_type, user_id) do |flow_sheet|
                    flow_sheet.factory_support_done
                end
        end
    end

    def self.dry_add_service_log(params, process_type, user_id)
        item = "维修日志"
        process = Dictionary.where("data_type = 'flow_sheet_processes' and value = ?", process_type).first.display

        insert_information = gen_log_insert_information(params[:flow_sheet_id], params[:act_date])
        #binding.pry
        if insert_information[:inner_id].nil?
            #查重复，列出来
            dup_logs = where("flow_sheet_id = ? and start_at = ?", params[:flow_sheet_id], params[:act_date]).order("inner_id")
            dup_logs_info = dup_logs.map do |p|
                attr = p.attributes
                attr["start_at"] = attr["start_at"].strftime("%Y-%m-%d") unless attr["start_at"].nil?
                attr["end_at"] = attr["end_at"].strftime("%Y-%m-%d") unless attr["end_at"].nil?
                #因为此处输出的字符串会被JS解析，所以要把公司名里出现的逗号给处理一下
                attr["content"] = attr["content"].to_s.gsub(/,/, "，")
                attr["natural_language"] = attr["natural_language"].to_s.gsub(/,/, "，")
                attr.reject { |k| k == "created_at" || k == "updated_at" }
            end

            service_log_params = {
                :process => process_type,
                :flow_sheet_id => params[:flow_sheet_id],
                :start_at => params[:act_date],
                :end_at => params[:act_date],
                :user_id => user_id,
                :content => params[:content],
                :comment => params[:comment],
                :natural_language => "#{process}：#{params[:content]}"
            }
            return {success: false, dup_log_list: dup_logs_info.to_s, to_be_inserted: service_log_params.to_s}
        else
            message = $etsc_create_ok
            service_log_params = {
                :process => process_type,
                :flow_sheet_id => params[:flow_sheet_id],
                :start_at => insert_information[:start_at],
                :end_at => insert_information[:end_at],
                :user_id => user_id,
                :content => params[:content],
                :comment => params[:comment],
                :inner_id => insert_information[:inner_id],
                :natural_language => "#{process}：#{params[:content]}"
            }
            service_log = ServiceLog.new(service_log_params)
            service_log.save

            flow_sheet = service_log.flow_sheet
            yield(flow_sheet)
            flow_sheet.save
            return {success: true, message: "#{item}#{message}"}
        end
    end

    def self.gen_log_insert_information(flow_sheet_id, act_date)
        init_start_at = nil
        init_end_at = nil

        all_logs = where("flow_sheet_id = ?", flow_sheet_id)
        all_logs_asc = all_logs.order("inner_id")
        all_logs_desc = all_logs.order("inner_id DESC")
        logs_contain_act_date_with_tail = all_logs_asc.where(["start_at <= ? and end_at is null", act_date])
        logs_contain_act_date_without_tail = all_logs_asc.where(["start_at <= ? and end_at >= ?", act_date, act_date])
        logs_match_edge = all_logs_asc.where(["start_at = ? or end_at = ?", act_date, act_date])

        #binding.pry
        if all_logs.size == 0
            #如果水单中本来之前就没有日志，直接返回1
            return {inner_id: 1, start_at: act_date, end_at: init_end_at}
        else
            if logs_match_edge.size >= 1
                #有落在边界上的，返回一个nil，生成提示
                return {inner_id: nil, start_at: init_start_at, end_at: init_end_at}
            #操作日期落在某条日志上，分情况，落到尾巴上与否。
            elsif logs_contain_act_date_with_tail.size == 1
                #如果操作日期落在最后带尾巴的一条日志上，则新增一条，带尾巴处理
                #2013-12-10到尾巴，操作时间2013-12-19，则变两条，一条2013-12-10到2013-12-19，另一条2013-12-19到尾巴
                log = logs_contain_act_date_with_tail[0]
                log['end_at'] = act_date
                log.save
                return {inner_id: (log.inner_id + 1), start_at: act_date, end_at: init_end_at}
            elsif logs_contain_act_date_without_tail.size == 1
                #如果操作日期落在不带尾巴的一条日志上，则新增一条，后面的依次inner_id加1
                #2013-12-10到2013-12-15，2013-12-15到2013-12-19，2013-12-19到尾巴，操作时间2013-12-11
                after_logs_desc = all_logs_desc.where(["end_at >= ? or end_at is null", act_date])
                min_inner_id = after_logs_desc.map(&:inner_id).min
                after_logs_desc[0..-2].each_with_index do |log, index|
                    #init_start_at = log['start_at']
                    #log['start_at'] = act_date
                    log.inner_id = log.inner_id + 1
                    log.save
                end
                log = after_logs_desc[-1]
                init_end_at = log['end_at']
                log['end_at'] = act_date
                log.save

                return {inner_id: min_inner_id + 1, start_at: act_date, end_at: init_end_at}
            elsif logs_contain_act_date_without_tail.size == 0 && logs_contain_act_date_with_tail.size == 0
                #操作日期不落在之前已有的时间段中，则只是新增一条
                #但新增的位置要看是比最小的小还是比最大的大
                if act_date > all_logs_asc[-1].start_at.strftime("%Y-%m-%d")
                    #如果比最后一条的start_at大，则返回当前最大inner_id加1
                    log = all_logs_asc[-1]
                    log.end_at = act_date
                    log.save
                    return {inner_id: (log.inner_id + 1), start_at: init_start_at, end_at:init_end_at}
                elsif act_date < all_logs_asc[0].start_at.strftime("%Y-%m-%d")
                    #binding.pry
                    #如果比第一条的start_at小，则返回1
                    #同时，把现有所有的inner_id都加1
                    all_logs_desc.each_with_index do |log, index|
                        init_end_at = all_logs_desc[-1].start_at
                        log.inner_id = log.inner_id + 1
                        log.save
                    end
                    return {inner_id: 1, start_at: act_date, end_at: init_end_at}
                end
            end
            #binding.pry
        end
    end

    def self.insert_service_log(params, user_id)
        data = JSON.parse(params["grid_data"])
        flow_sheet = nil
        to_be_inserted_log = nil
        data.each do |log|
            if log['id'] != 0
                flow_sheet = ServiceLog.where("id = ?", log['id'])[0].flow_sheet
            else
                to_be_inserted_log = log
            end
        end
        #binding.pry
        #JSON.parse(JSON.parse(params['service_log_cache'])['change_parts'])
        if params['service_log_cache'].blank?
            service_log_cache = {}
        else
            service_log_cache = JSON.parse(params['service_log_cache'])
        end
        #三种情况：
        #1.加在最前(列出日志的最前，找不到“上一条”，用“下一条”的inner_id减1得到“上一条”)
        #2.加在最后(全部日志的最后，最后一条没有end_at)
        #3.加在中间(列出日志的中间，“上一条”后面所有的inner_id全部加1，不管有没有“后面”)
        data.each_with_index do |log, index|
            if log['inner_id'] == 0 && index == 0
                #binding.pry
                next_log_inner_id = data[1]['inner_id']
                all_logs = where("flow_sheet_id = ?", flow_sheet.id)
                all_logs_desc = all_logs.order("inner_id DESC")
                after_logs_desc = all_logs_desc.where(["inner_id >= ?", next_log_inner_id])
                after_logs_desc.each do |after_log|
                    after_log.inner_id = after_log.inner_id + 1
                    after_log.save
                end

                service_log = ServiceLog.new(to_be_inserted_log)
                service_log.inner_id = next_log_inner_id
                service_log.user_id = user_id
                service_log.save

                flow_sheet = service_log.flow_sheet
                flow_sheet.state_machine_with_id(log['process'])

                if service_log_cache['change_parts']
                    admin_inventory_params = {
                        'event' => "apply_for_use",
                        'grid_data' => service_log_cache['change_parts'],
                        'project_option' => 'tsd'
                    }
                    AdminInventory.create_or_update_with(admin_inventory_params, user_id, false)
                elsif service_log_cache['add_equipment']
                    add_equipment_params = JSON.parse(service_log_cache['add_equipment'])
                    ReceivedEquipment.create_with(add_equipment_params)
                elsif service_log_cache['delete_equipment']
                    delete_equipment_param = JSON.parse(service_log_cache['delete_equipment'])
                    equipment_ids = delete_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        ReceivedEquipment.delete_all(["id = ?", equipment_id])
                    end
                elsif service_log_cache['package_equipment']
                    package_equipment_param = JSON.parse(service_log_cache['package_equipment'])
                    equipment_ids = package_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_packaged}.uniq == [true]
                        flow_sheet.package
                        flow_sheet.save
                    end
                elsif service_log_cache['return_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['return_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.uniq == [true]
                        flow_sheet.return
                        flow_sheet.save
                    end
                elsif service_log_cache['receive_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['receive_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.save
                    end
                    #只要有一件返厂收货了，就改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.include?(true)
                        flow_sheet.receive
                        flow_sheet.save
                    end
                elsif service_log_cache['deliver_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['deliver_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.is_sent_back = true
                        equipment.save
                    end
                    #都发客户了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_sent_back}.uniq == [true]
                        flow_sheet.deliver
                        flow_sheet.save
                    end
                end
                return {success: true, message: '新增日志成功！'}
            elsif index != 0 && data[index - 1]['end_at'].nil?
                #binding.pry
                prev_log = where("id = ?", data[index - 1]['id'])[0]
                prev_log['end_at'] = log['end_at']
                prev_log.save

                service_log = ServiceLog.new(to_be_inserted_log)
                service_log.end_at = nil
                service_log.inner_id = data[index - 1]['inner_id'] + 1
                service_log.user_id = user_id
                service_log.save

                flow_sheet = service_log.flow_sheet
                flow_sheet.state_machine_with_id(log['process'])
                if service_log_cache['change_parts']
                    admin_inventory_params = {
                        'event' => "apply_for_use",
                        'grid_data' => service_log_cache['change_parts'],
                        'project_option' => 'tsd'
                    }
                    AdminInventory.create_or_update_with(admin_inventory_params, user_id, false)
                elsif service_log_cache['add_equipment']
                    add_equipment_params = JSON.parse(service_log_cache['add_equipment'])
                    ReceivedEquipment.create_with(add_equipment_params)
                elsif service_log_cache['delete_equipment']
                    delete_equipment_param = JSON.parse(service_log_cache['delete_equipment'])
                    equipment_ids = delete_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        ReceivedEquipment.delete_all(["id = ?", equipment_id])
                    end
                elsif service_log_cache['package_equipment']
                    package_equipment_param = JSON.parse(service_log_cache['package_equipment'])
                    equipment_ids = package_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_packaged}.uniq == [true]
                        flow_sheet.package
                        flow_sheet.save
                    end
                elsif service_log_cache['return_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['return_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.uniq == [true]
                        flow_sheet.return
                        flow_sheet.save
                    end
                elsif service_log_cache['receive_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['receive_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.save
                    end
                    #只要有一件返厂收货了，就改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.include?(true)
                        flow_sheet.receive
                        flow_sheet.save
                    end
                elsif service_log_cache['deliver_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['deliver_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.is_sent_back = true
                        equipment.save
                    end
                    #都发客户了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_sent_back}.uniq == [true]
                        flow_sheet.deliver
                        flow_sheet.save
                    end
                end
                return {success: true, message: '新增日志成功！'}
            elsif log['inner_id'] == 0
            #    binding.pry
                prev_log = where("id = ?", data[index - 1]['id'])[0]
                init_end_at = prev_log['end_at']
                prev_log['end_at'] = log['end_at']
                prev_log.save

                prev_log_inner_id = data[index - 1]['inner_id']
                next_log_inner_id = prev_log_inner_id + 1
                all_logs = where("flow_sheet_id = ?", flow_sheet.id)
                all_logs_desc = all_logs.order("inner_id DESC")
                after_logs_desc = all_logs_desc.where(["inner_id >= ?", next_log_inner_id])
                after_logs_desc.each do |after_log|
                    after_log.inner_id = after_log.inner_id + 1
                    after_log.save
                end

                service_log = ServiceLog.new(to_be_inserted_log)
                service_log.inner_id = next_log_inner_id
                service_log.user_id = user_id
                service_log.end_at = init_end_at
                service_log.save

                flow_sheet = service_log.flow_sheet
                flow_sheet.state_machine_with_id(log['process'])

                if service_log_cache['change_parts']
                    admin_inventory_params = {
                        'event' => "apply_for_use",
                        'grid_data' => service_log_cache['change_parts'],
                        'project_option' => 'tsd'
                    }
                    AdminInventory.create_or_update_with(admin_inventory_params, user_id, false)
                elsif service_log_cache['add_equipment']
                    add_equipment_params = JSON.parse(service_log_cache['add_equipment'])
                    ReceivedEquipment.create_with(add_equipment_params)
                elsif service_log_cache['delete_equipment']
                    delete_equipment_param = JSON.parse(service_log_cache['delete_equipment'])
                    equipment_ids = delete_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        ReceivedEquipment.delete_all(["id = ?", equipment_id])
                    end
                elsif service_log_cache['package_equipment']
                    package_equipment_param = JSON.parse(service_log_cache['package_equipment'])
                    equipment_ids = package_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_packaged}.uniq == [true]
                        flow_sheet.package
                        flow_sheet.save
                    end
                elsif service_log_cache['return_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['return_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = true
                        equipment.save
                    end
                    #都包装完了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.uniq == [true]
                        flow_sheet.return
                        flow_sheet.save
                    end
                elsif service_log_cache['receive_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['receive_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.save
                    end
                    #只要有一件返厂收货了，就改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_return_factory}.include?(true)
                        flow_sheet.receive
                        flow_sheet.save
                    end
                elsif service_log_cache['deliver_equipment']
                    return_equipment_param = JSON.parse(service_log_cache['deliver_equipment'])
                    equipment_ids = return_equipment_param['equipment_ids'].split("|")
                    equipment_ids.each do |equipment_id|
                        equipment = ReceivedEquipment.find(equipment_id)
                        equipment.is_packaged = false
                        equipment.is_return_factory = false
                        equipment.is_sent_back = true
                        equipment.save
                    end
                    #都发客户了改水单本身的状态
                    if flow_sheet.received_equipments.map{|p| p.is_sent_back}.uniq == [true]
                        flow_sheet.deliver
                        flow_sheet.save
                    end
                end
                return {success: true, message: '新增日志成功！'}
            else
                #上面的不能合并出来写，因为这并不是所有的情况。（有的循环就直接过了）
            end
        end

    end

    def self.create_or_update_with(params)
        item = "维修日志"
        process_type = params[:process_type]
        message = $etsc_create_ok

        #binding.pry
        insert_information = gen_log_insert_information(params[:flow_sheet_id], params[:start_at])

        if insert_information[:inner_id].nil?
            #有重复的，则直接认为报价是当天的最后一条
            #又分两种情况，一是“当天”不是最后一天，一是“当天”是最后一天
            flow_sheet_id = params[:flow_sheet_id]
            all_logs = where("flow_sheet_id = ?", flow_sheet_id)
            all_logs_desc = all_logs.order("inner_id DESC")
            last_log = all_logs_desc[0]
            last_start_at = last_log['start_at'].strftime("%Y-%m-%d")
            if last_start_at == params[:start_at]
                #“当天”是最后一天
                last_log[:end_at] = params[:start_at]
                last_log.save
                service_log_params = {
                    :process => process_type,
                    :flow_sheet_id => params[:flow_sheet_id],
                    :start_at => params[:start_at],
                    :end_at => nil,
                    :user_id => params[:user_id],
                    :content => params[:content],
                    :comment => params[:comment],
                    :inner_id => last_log['inner_id'] + 1,
                    :natural_language => params[:natural_language]
                }
            else
                #“当天”不是最后一天
                after_logs_desc = all_logs_desc.where(["end_at > ? or end_at is null", params[:start_at]])
                after_logs_desc.each_with_index do |log, index|
                    if index == after_logs_desc.size - 1

                    else
                        log.inner_id += 1
                        log.save
                    end
                end
                service_log_params = {
                    :process => process_type,
                    :flow_sheet_id => params[:flow_sheet_id],
                    :start_at => params[:start_at],
                    :end_at => after_logs_desc[0][:start_at],
                    :user_id => params[:user_id],
                    :content => params[:content],
                    :comment => params[:comment],
                    :inner_id => after_logs_desc[-1].inner_id + 1,
                    :natural_language => params[:natural_language]
                }
            end

            service_log = ServiceLog.new(service_log_params)
            service_log.save
            return {success: true, message: "#{item}#{message}", service_log_id: service_log.id}
        else
            #没重复的，则以返回的参数新增一条
            service_log_params = {
                :process => process_type,
                :flow_sheet_id => params[:flow_sheet_id],
                :start_at => insert_information[:start_at],
                :end_at => insert_information[:end_at],
                :user_id => params[:user_id],
                :content => params[:content],
                :comment => params[:comment],
                :inner_id => insert_information[:inner_id],
                :natural_language => params[:natural_language]
            }
            service_log = ServiceLog.new(service_log_params)
            service_log.save
            return {success: true, message: "#{item}#{message}", service_log_id: service_log.id}
        end
    end
end
