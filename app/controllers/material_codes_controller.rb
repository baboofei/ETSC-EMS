# encoding = utf-8
class MaterialCodesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridMaterialCodes的store与角色关联的数据，所以用grid_material_codes
    def get_grid_material_codes
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        material_codes = MaterialCode.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
                                                  #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :material_codes => material_codes.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => material_codes.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为MaterialCodes的store与角色关联的数据，所以用material_codes
    def get_material_codes
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        material_codes = MaterialCode.get_available_data(target_store, user_id).query_by(query).order('name')

        respond_to do |format|
            format.json {
                render :json => {
                    :material_codes => material_codes.map{|p| p.for_combo_json},
                    :totalRecords => material_codes.size
                }
            }
        end
    end

    def save_material_code
        result = MaterialCode.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

    def ask_for_new_code
        result = MaterialCode.ask_for_new_code_with(params)
        render :json => result
    end
end
