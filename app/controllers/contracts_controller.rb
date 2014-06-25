# encoding: utf-8
class ContractsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为Contracts的store与角色关联的数据，所以用contracts
    def get_contracts
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        contracts = Contract.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :contracts => contracts.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(target_store, user_id)},
                    :totalRecords => contracts.size
                }
            }
        end
    end

    def get_single_contracts
        #binding.pry
        contracts = Contract.where("number = ?", params['number'])

        respond_to do |format|
            format.json {
                render :json => {
                    :contracts => contracts[0].for_single_json,
                    :totalRecords => contracts.size
                }
            }
        end
    end

    def trans_to
        result = Contract.trans_to(params)
        render :json => result
    end

    def process_workflow
        is_local = judge_ip
        result = Contract.create_or_update_with(params, session[:user_id], is_local)
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def update_customer_info
        result = Contract.update_customer_info_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def update_business_info
        result = Contract.update_business_info_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def update_user_info
        result = Contract.update_user_info_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def update_contract_info
        is_local = judge_ip
        result = Contract.update_contract_info_with(params, session[:user_id], is_local)
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def update_financial_info
        result = Contract.update_financial_info_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def save_as
        result = Contract.save_as_new_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end
end
