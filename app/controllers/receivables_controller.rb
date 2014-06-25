# encoding: utf-8
class ReceivablesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为Receivables的store与角色关联的数据，所以用receivables
    def get_receivables
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        receivables = Receivable.current.in_contract(params[:contract_id]).get_available_data(target_store, user_id).order('receivables.expected_receive_at ASC')

        respond_to do |format|
            format.json {
                render :json => {
                    :receivables => receivables.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => receivables.size
                }
            }
        end
    end

    def save_receivable
        result = Receivable.create_or_update_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def delete_receivable
        result = Receivable.delete_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end
end
