# encoding: utf-8
class AdminInventoriesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridAdminInventories的store与角色关联的数据，所以用grid_admin_inventories
    def get_grid_admin_inventories
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventories = AdminInventory.available.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventories => admin_inventories.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => admin_inventories.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridInStockQueryAdminInventories的store与角色关联的数据，所以用grid_in_stock_query_admin_inventories
    def get_grid_in_stock_query_admin_inventories
        user_id = session[:user_id]
        apply_for_sn = params[:admin_item_apply_for_sn]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventories = AdminInventory.get_available_data(target_store, user_id).with_sn(apply_for_sn).for_stock
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventories => admin_inventories.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => admin_inventories.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridAuditingQueryAdminInventories的store与角色关联的数据，所以用grid_auditing_query_admin_inventories
    def get_grid_auditing_query_admin_inventories
        user_id = session[:user_id]
        apply_for_sn = params[:admin_item_apply_for_sn]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventories = AdminInventory.get_available_data(target_store, user_id).with_sn(apply_for_sn).auditing
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventories => admin_inventories.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => admin_inventories.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridOutStockQueryAdminInventories的store与角色关联的数据，所以用grid_out_stock_query_admin_inventories
    def get_grid_out_stock_query_admin_inventories
        user_id = session[:user_id]
        apply_for_sn = params[:admin_item_apply_for_sn]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventories = AdminInventory.get_available_data(target_store, user_id).with_sn(apply_for_sn).for_out_stock
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventories => admin_inventories.map{|p| p.for_out_stock_grid_json(user_id)},
                    :totalRecords => admin_inventories.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridReturnQueryAdminInventories的store与角色关联的数据，所以用grid_return_query_admin_inventories
    def get_grid_return_query_admin_inventories
        user_id = session[:user_id]
        apply_for_sn = params[:admin_item_apply_for_sn]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventories = AdminInventory.get_available_data(target_store, user_id).with_sn(apply_for_sn).available.for_stock
                                                  #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventories => admin_inventories.map{|p| p.for_return_grid_json(user_id)},
                    :totalRecords => admin_inventories.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridRejectQueryAdminInventories的store与角色关联的数据，所以用grid_reject_query_admin_inventories
    def get_grid_reject_query_admin_inventories
        user_id = session[:user_id]
        apply_for_sn = params[:admin_item_apply_for_sn]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        admin_inventories = AdminInventory.get_available_data(target_store, user_id).with_sn(apply_for_sn).available.for_reject
                                                  #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventories => admin_inventories.map{|p| p.for_reject_grid_json(user_id)},
                    :totalRecords => admin_inventories.size
                }
            }
        end
    end

    def save_admin_inventory
        #binding.pry
        is_local = judge_ip
        result = AdminInventory.create_or_update_with(params, session[:user_id], is_local)

        render :json => {:success => result[:success], :message => result[:message]}
    end
    #
    #def pass_auditing
    #    result = AdminInventory.create_or_update_with(params, session[:user_id])
    #
    #    render :json => {:success => result[:success], :message => result[:message]}
    #end

    #ComboAdminInventoryNames
    def get_combo_admin_inventory_names
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        admin_inventory_names = AdminInventory.get_available_data(target_store, user_id).query_by_name(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventory_names => admin_inventory_names.map{|p| p.for_name_combo_json}.uniq,
                    :totalRecords => admin_inventory_names.size
                }
            }
        end
    end

    #ComboAdminInventoryNames
    def get_combo_admin_inventory_models
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        admin_inventory_models = AdminInventory.get_available_data(target_store, user_id).query_by_model(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :admin_inventory_models => admin_inventory_models.map{|p| p.for_model_combo_json}.uniq,
                    :totalRecords => admin_inventory_models.size
                }
            }
        end
    end

    def upload_xls
        #binding.pry
        user_id = session[:user_id]
        result = AdminInventory.parse_xls_to_json(params, user_id)

        #binding.pry
        render :text => result.to_json
    end
end
