# encoding: utf-8
class CalendarsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def get_calendars
        calendars = Calendar.where(true)
        #binding.pry
        #request.method，REST
        respond_to do |format|
            format.json {
                render :json => {
                    :calendars => calendars.map{|p| p.for_combo_json},
                    #:calendars => calendars.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(target_store, user_id)},
                    :totalRecords => calendars.size
                }
            }
        end
    end

    def rest_calendar
        #binding.pry
        if request.get?
            #根据当前传来的视图开始时间和结束时间来筛选
            #尾巴落在视图内的
            #头落在视图内的
            #头尾都不在，但头小于视图开始时间且尾大于视图结束时间的
            calendars = Calendar.where("(start_at > ? and start_at < ?) or (end_at > ? and end_at < ?) or (start_at < ? and end_at > ?)", params['startDate'], params['endDate'], params['startDate'], params['endDate'], params['startDate'], params['endDate'])
            render :json => {
                :calendars => calendars.map { |p| p.for_combo_json },
                :totalRecords => calendars.size
            }
        elsif request.post?
            #新增
            #binding.pry
            result = Calendar.create_or_update_with(params, session[:user_id])

            render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
        elsif request.put?
            #修改
            result = Calendar.create_or_update_with(params, session[:user_id])

            render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
        elsif request.delete?
            #删除
            result = Calendar.delete_with(params, session[:user_id])
            render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
        end
    end
end
