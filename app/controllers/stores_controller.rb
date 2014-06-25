# encoding: UTF-8
class StoresController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为DataPrivileges的store与角色关联的数据，所以用data_privileges
    def get_data_privileges
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        stores = Store.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :data_privileges => stores.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => stores.size
                }
            }
        end
    end

    def store_privileges
        Store.update_with_params(params)

        render :json => {:success => true, :message => "权限修改成功！"}.to_json
    end
end
