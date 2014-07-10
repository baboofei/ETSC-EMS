class VipUnitsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridVipUnits的store与角色关联的数据，所以用grid_vip_units
    def get_grid_vip_units
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        vip_units = VipUnit.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :vip_units => vip_units.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => vip_units.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为VipUnits的store过滤出来的数据，所以用combo_vip_units
    def get_combo_vip_units
        query = params[:query]
        vip_units = VipUnit.query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :vip_units => vip_units.map{|p| p.for_combo_json},
                    :totalRecords => vip_units.size
                }
            }
        end
    end

    def save_vip_unit
        result = VipUnit.create_or_update_with(params, session[:user_id])
        #binding.pry
        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
