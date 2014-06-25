class PopUnitsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridPopUnits的store与角色关联的数据，所以用grid_pop_units
    def get_grid_pop_units
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        pop_units = PopUnit.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :pop_units => pop_units.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => pop_units.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为PopUnits的store过滤出来的数据，所以用combo_pop_units
    def get_combo_pop_units
        query = params[:query]
        pop_units = PopUnit.query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :pop_units => pop_units.map{|p| p.for_combo_json},
                    :totalRecords => pop_units.size
                }
            }
        end
    end

    def save_pop_unit
        result = PopUnit.create_or_update_with(params, session[:user_id])
        #binding.pry
        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
