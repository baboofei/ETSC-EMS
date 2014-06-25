# encoding: utf-8
class ServiceLogsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为ServiceLogs的store与角色关联的数据，所以用service_logs
    def get_service_logs
        #binding.pry
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        #这里多一个过滤条件就是“归属于某销售个案”
        service_logs = ServiceLog.in_flow_sheet(params[:flow_sheet_id]).get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :service_logs => service_logs.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => service_logs.size
                }
            }
        end
    end

    def add_service_log
        result = ServiceLog.add_service_log(params, session[:user_id])
        render :json => result
    end

    def insert_service_log
        result = ServiceLog.insert_service_log(params, session[:user_id])
        render :json => result
    end
end
