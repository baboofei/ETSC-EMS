# encoding = utf-8
class BusinessUnitsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridBusinessUnits的store与角色关联的数据，所以用grid_business_units
    def get_grid_business_units
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        business_units = BusinessUnit.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :business_units => business_units.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => business_units.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为ComboBusinessUnit的store与角色关联的数据，所以用combo_business_unit
    def get_combo_business_units
        query = params[:query]
        business_units = BusinessUnit.query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :business_units => business_units.map{|p| p.for_combo_json},
                    :totalRecords => business_units.size
                }
            }
        end
    end

    def save_business_unit
        result = BusinessUnit.create_or_update_with(params, session[:user_id])
        #binding.pry
        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
