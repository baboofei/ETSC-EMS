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

end
