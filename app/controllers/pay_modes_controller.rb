# encoding = utf-8
class PayModesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为ComboPayModes的store与角色关联的数据，所以用combo_pay_modes
    def get_combo_pay_modes
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query].gsub(" ", "%")
        pay_modes = PayMode.get_available_data(target_store, user_id).query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :pay_modes => pay_modes.map{|p| p.for_combo_json},
                    :totalRecords => pay_modes.size
                }
            }
        end
    end

    def save_pay_mode
        result = PayMode.create_or_update_with(params, session[:user_id])
        #binding.pry
        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
