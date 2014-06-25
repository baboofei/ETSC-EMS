class AdminInventoryHistoriesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridAdminInventoryHistories的store与角色关联的数据，所以用grid_admin_inventory_histories
    def get_grid_admin_inventory_histories
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventory_histories = AdminInventoryHistory.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventory_histories => admin_inventory_histories.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => admin_inventory_histories.size
                }
            }
        end
    end

    def export_excel
        user_id = session[:user_id]
        result = AdminInventoryHistory.export_excel(params, user_id)

        render :json => {:success => result[:success], :message => result[:message]}
    end
end
