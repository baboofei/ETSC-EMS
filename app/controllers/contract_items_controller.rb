# encoding: utf-8
class ContractItemsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为ContractItems的store与角色关联的数据，所以用contract_items
    def get_contract_items
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        contract_items = ContractItem.current.in_contract(params[:contract_id]).get_available_data(target_store, user_id).order('contract_items.inner_id ASC')

        respond_to do |format|
            format.json {
                render :json => {
                    :contract_items => contract_items.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => contract_items.size
                }
            }
        end
    end

    def save_contract_item
        result = ContractItem.create_or_update_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def delete_contract_item
        result = ContractItem.delete_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def divide_contract_item
        result = ContractItem.divide_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def batch_edit_contract_item
        result = ContractItem.batch_edit_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def batch_edit_contract_item_date
        result = ContractItem.batch_edit_date_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def update_serial_number
        result = ContractItem.update_serial_number_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def validate_to_gen_receivables
        result = ContractItem.validate_to_gen_receivables(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end
end
