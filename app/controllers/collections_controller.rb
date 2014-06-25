# encoding: utf-8
class CollectionsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为Collections的store与角色关联的数据，所以用collections
    def get_collections
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        collections = Collection.current.in_contract(params[:contract_id]).get_available_data(target_store, user_id).order('collections.received_at ASC')

        respond_to do |format|
            format.json {
                render :json => {
                    :collections => collections.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => collections.size
                }
            }
        end
    end

    def save_collection
        is_local = judge_ip
        result = Collection.create_or_update_with(params, session[:user_id], is_local)
        render :json => {:success => result[:success], :message => result[:message], :total_collection => result[:total_collection]}
    end

    def delete_collection
        result = Collection.delete_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message], :total_collection => result[:total_collection]}
    end
end
