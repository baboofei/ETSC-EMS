# encoding: utf-8
class RemindsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridReminds的store与角色关联的数据，所以用grid_reminds
    def get_grid_reminds
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        reminds = Remind.at_time.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :reminds => reminds.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => reminds.size
                }
            }
        end
    end

    def mark_as_read
        Remind.mark_as_read(params)
        render :json => {:success => true}
    end

    def mark_single_as_read
        Remind.mark_single_as_read(params)
        render :json => {:success => true}
    end

    def save_remind
        remind_sn = (Time.now.to_f*1000).ceil
        if params["source"].blank?
            remind_situation = ""
        else
            remind_situation = "在个案#{params[:source].to_eim_remind_link(remind_sn)}中"
        end
        remind_params = {
            :remind_at => params[:remind_at],
            :remind_text => "你#{remind_situation}设置了提醒，内容为#{params[:remind_text]}，请注意跟进",
            :sn => remind_sn
        }

        result = Remind.create_or_update_with(remind_params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end
end
