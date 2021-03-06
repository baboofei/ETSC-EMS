class PopsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridPops的store与角色关联的数据，所以用grid_pops
    def get_grid_pops
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        pops = Pop.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :pops => pops.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => pops.size
                }
            }
        end
    end

    def save_pop
        #binding.pry
        result = Pop.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

end
