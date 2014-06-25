# encoding: utf-8
class PersonalMessagesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridPersonalMessages的store与角色关联的数据，所以用grid_personal_messages
    def get_grid_personal_messages
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        #binding.pry
        personal_messages = PersonalMessage.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :personal_messages => personal_messages.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => personal_messages.size
                }
            }
        end
    end

    def check_new_messages
        user_id = session[:user_id]
        personal_messages = PersonalMessage.get_new_messages(user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :totalRecords => personal_messages.size,
                    :first_content => (personal_messages.size > 0 ? personal_messages[0]['content'] : "")
                }
            }
        end
    end

    def mark_as_read
        PersonalMessage.mark_as_read(params)
        render :json => {:success => true}
    end

    def mark_as_unread
        PersonalMessage.mark_as_unread(params)
        render :json => {:success => true}
    end

    def mark_single_as_read
        PersonalMessage.mark_single_as_read(params)
        render :json => {:success => true}
    end
end
