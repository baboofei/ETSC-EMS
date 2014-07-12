#encoding: UTF-8
class FunctionsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def get_function_privileges
        functions = Function.get_data(params)

        respond_to do |format|
            format.json {
                render :json => {
                    :function_privileges => functions.map{|p| p.for_grid_json},
                    :totalRecords => functions.size
                }
            }
        end
    end

    def function_privileges
        Function.update_with_params(params)

        render :json => {:success => true, :message => "权限修改成功！"}.to_json
    end

    def get_combo_functions
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        functions = Function.get_available_data(target_store, user_id)#.with_user(user_id)

        respond_to do |format|
            #binding.pry
            format.json {
                render :json => {
                    :functions => functions.map{|p| p.for_list_json},
                    :totalRecords => functions.size
                }
            }
        end
    end
end
