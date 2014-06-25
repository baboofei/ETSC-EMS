# encoding: utf-8
class ContractHistoriesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为ContractHistories的store与角色关联的数据，所以用contract_histories
    def get_contract_histories
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        contract_histories = ContractHistory.in_contract(params[:contract_id]).get_available_data(target_store, user_id).order('contract_histories.id DESC')

        respond_to do |format|
            format.json {
                render :json => {
                    :contract_histories => contract_histories.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => contract_histories.size
                }
            }
        end
    end

    def save_contract_history
        result = ContractHistory.create_or_update_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end
end
