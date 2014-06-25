# encoding: utf-8
class VendorUnitsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridVendorUnits的store与角色关联的数据，所以用grid_vendor_units
    def get_grid_vendor_units
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        vendor_units = VendorUnit.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
                                                  #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :vendor_units => vendor_units.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => vendor_units.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为ComboVendorUnits的store与角色关联的数据，所以用combo_vendor_units
    def get_combo_vendor_units
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        vendor_units = VendorUnit.get_available_data(target_store, user_id).query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :vendor_units => vendor_units.map{|p| p.for_combo_json},
                    :totalRecords => vendor_units.size
                }
            }
        end
    end

    def get_full_combo_vendor_units
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        vendor_units = VendorUnit.get_available_data(target_store, user_id).query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :vendor_units => vendor_units.map{|p| p.for_full_combo_json},
                    :totalRecords => vendor_units.size
                }
            }
        end
    end

    #新增工厂
    def save_vendor_unit
        #binding.pry
        user_id = session[:user_id]
        result = VendorUnit.create_or_update_with(params, user_id)

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

    #快速新增工厂
    def save_vendor_unit_mini
        #binding.pry
        user_id = session[:user_id]
        result = VendorUnit.create_mini_with(params, user_id)

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
