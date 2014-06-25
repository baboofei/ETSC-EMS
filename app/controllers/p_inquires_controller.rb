# encoding = utf-8
class PInquiresController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridPInquires的store与角色关联的数据，所以用grid_p_inquires
    def get_grid_p_inquires
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        p_inquires = PInquire.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
                                                  #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :p_inquires => p_inquires.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => p_inquires.size
                }
            }
        end
    end

    def save_p_inquire
        result = PInquire.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

    def trans_to
        user_id = session[:user_id]
        PInquire.trans_to(params, user_id)
        render :json => {:success => true, :message => "客户转让完成"}
    end

    def re_trans_to
        user_id = session[:user_id]
        PInquire.re_trans_to(params, user_id)
        render :json => {:success => true, :message => "客户转让完成"}
    end
end
