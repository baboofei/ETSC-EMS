# encoding: utf-8
class SalelogsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为Salelogs的store与角色关联的数据，所以用salelogs
    def get_salelogs
        #binding.pry
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        #这里多一个过滤条件就是“归属于某销售个案”
        salelogs = Salelog.in_salecase(params[:salecase_id]).get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :salelogs => salelogs.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => salelogs.size
                }
            }
        end
    end

    def add_salelog_from_form
        Salelog.add_salelog_from_form(params, session[:user_id])
        render :json => {:success => true}
    end
end
