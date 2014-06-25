# coding: UTF-8
class VendorsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridVendors的store与角色关联的数据，所以用grid_vendors
    def get_grid_vendors
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        vendors = Vendor.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
                                                  #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :vendors => vendors.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => vendors.size
                }
            }
        end
    end

    #选供方联系人的下拉菜单
    def get_combo_vendors
        #binding.pry
        vendor_unit_id = params[:vendor_unit_id]
        vendors = Vendor.in_unit(vendor_unit_id)

        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :vendors => vendors.map{|p| p.for_combo_json},
                    :totalRecords => vendors.size
                }
            }
        end
    end

    def save_vendor
        #binding.pry
        result = Vendor.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

    #快速新增联系人
    def save_vendor_mini
        #binding.pry
        user_id = session[:user_id]
        result = Vendor.create_mini_with(params, user_id)

        render :json => {:success => result[:success], :message => result[:message]}
    end
end
