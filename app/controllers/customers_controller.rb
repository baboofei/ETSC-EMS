# encoding: utf-8
class CustomersController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridCustomers的store与角色关联的数据，所以用grid_customers
    def get_grid_customers
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        #target_model = eval(controller_name.singularize.camelize)
        #研究一下能不能提取“Customer”这个model，可能用不上

        customers = Customer.valid.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :customers => customers.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => customers.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为MiniCustomers的store与角色关联的数据，所以用mini_customers
    def get_mini_customers
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #这里多一个过滤条件就是“归属于某销售个案”
        customers = Customer.valid.in_salecase(params[:salecase_id]).get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :mini_customers => customers.limit(limit).offset(start.to_i).map{|p| p.for_mini_grid_json},
                    :totalRecords => customers.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为ServiceMiniCustomers的store与角色关联的数据，所以用service_mini_customers
    def get_service_mini_customers
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #这里多一个过滤条件就是“归属于某销售个案”
        customers = Customer.valid.in_flow_sheet(params[:flow_sheet_id]).get_available_data(target_store, user_id).updated_sort_by(sort, user_id)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :service_mini_customers => customers.limit(limit).offset(start.to_i).map{|p| p.for_mini_grid_json},
                    :totalRecords => customers.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridContractMiniCustomers的store与角色关联的数据，所以用grid_contract_mini_customers
    def get_grid_contract_mini_customers
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #这里多一个过滤条件就是“归属于某合同”
        customers = Customer.valid.in_contract(params[:contract_id]).get_available_data(target_store, user_id).updated_sort_by(sort, user_id)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :grid_contract_mini_customers => customers.limit(limit).offset(start.to_i).map{|p| p.for_mini_grid_json},
                    :totalRecords => customers.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为Customers的store过滤出来的数据，所以用combo_customers
    def get_combo_customers
        #binding.pry
        #query = params[:query]
        customer_unit_id = params[:customer_unit_id]
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        customers = Customer.valid.get_available_data(target_store, user_id).in_unit(customer_unit_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :customers => customers.map{|p| p.for_combo_json},
                    :totalRecords => customers.size
                }
            }
        end
    end

    def save_customer
        #binding.pry
        user_id = session[:user_id]
        customer_result = Customer.create_or_update_with(params, user_id)

        unless params['inquire_type'].blank?
            #有需求的时候给该需求带上customer_id
            case params['inquire_type']
                when "MInquires"
                    m_inquire = MInquire.find(params['inquire_id'])
                    m_inquire.customer_id = customer_result[:id]
                    m_inquire.save
                when "PInquires"
                    p_inquire = PInquire.find(params['inquire_id'])
                    p_inquire.customer_id = customer_result[:id]
                    p_inquire.save
                else
            end

            #根据新增还是覆盖来增加一条日志
            salecase_params = {}
            if params['id'].blank?
                #binding.pry
                #新增客户和个案
                salecase_params[:start_at] = DateTime.now
                salecase_params[:comment] = "从需求自动创建，请修改"
                salecase_params[:priority] = 1
                salecase_params[:feasible] = 50
                salecase_params[:customer_id] = customer_result[:id]
                salecase_params[:customer_unit_id] = params['customer_unit_id']
                salecase_params[:detail] = params['detail'].gsub("\n", "<br/>")
                Salecase.create_or_update_with(salecase_params, user_id)['salecase_id']
            else
                #旧客户，判断有无个案id，以决定新日志加在何处
                if params['selected_salecase_id'].blank?
                    salecase_params[:start_at] = DateTime.now
                    salecase_params[:comment] = "从需求自动创建，请修改"
                    salecase_params[:priority] = 1
                    salecase_params[:feasible] = 50
                    salecase_params[:customer_id] = customer_result[:id]
                    salecase_params[:customer_unit_id] = params['customer_unit_id']
                    salecase_params[:detail] = params['detail'].gsub("\n", "<br/>")
                    Salecase.create_or_update_with(salecase_params, user_id)['salecase_id']
                else
                    #binding.pry
                    process = Dictionary.where("data_type = 'sales_processes' and value = ?", 28).first.display
                    salelog_params = {
                        :process => 28,
                        :contact_at => Time.now, #这里没办法了，只能存当前时间
                        :salecase_id => params[:selected_salecase_id],
                        :user_id => user_id,
                        #:comment => ,
                        :natural_language => "#{process}：#{params['detail'].gsub("\n", "<br/>")}"
                    }
                    Salelog.create_or_update_with(salelog_params)
                end
            end
        end

        render :json => {:success => customer_result[:success], :message => customer_result[:message], :id => customer_result[:id]}
    end

    def share_to
        Customer.update_sharing_with(params)
        render :json => {:success => true}
    end

    def trans_to
        Customer.trans_to(params)
        render :json => {:success => true}
    end

    #在销售个案里加客户
    def save_customers_salecases
        Customer.save_customers_in_salecase(params, session[:user_id])
        render :json => {:success => true}
    end

    #在销售个案里减客户
    def delete_customers_salecases
        Customer.delete_customers_in_salecases(params, session[:user_id])
        render :json => {:success => true}
    end

    #因为体现到ExtJS里，是要查名为GridPossibleCustomers的store的数据，所以用grid_possible_customers
    def get_grid_possible_customers
        user_id = session[:user_id]
        customers = Customer.valid.get_possible_customers(params)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :customers => customers.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => customers.size
                }
            }
        end
    end

    def load_inquire_info
        #binding.pry
        user_id = session[:user_id]
        model = params['source_controller'].singularize.constantize
        inquire = model.where("id = ?", params[:id])
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :customers => inquire.map{|p| p.for_grid_json(user_id)},
                    :inquire_type => params['source_controller'],
                    :inquire_id => params[:id],
                    :totalRecords => 1
                }
            }
        end
    end

    def set_obsolete
        result = Customer.set_obsolete(params, session[:user_id])
        render :json => {:success => true, :message => result[:message]}
    end
end