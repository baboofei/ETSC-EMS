# encoding = utf-8
class MInquiresController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridMInquires的store与角色关联的数据，所以用grid_m_inquires
    def get_grid_m_inquires
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        m_inquires = MInquire.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
                                                  #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :m_inquires => m_inquires.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => m_inquires.size
                }
            }
        end
    end

    def save_m_inquire
        result = MInquire.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

    def re_trans_to
        user_id = session[:user_id]
        MInquire.re_trans_to(params, user_id)
        render :json => {:success => true, :message => "客户转让完成"}
    end
end
