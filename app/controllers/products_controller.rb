# encoding = utf-8
class ProductsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为ComboProducts的store与角色关联的数据，所以用combo_products
    def get_combo_products
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        products = Product.in_vendor_unit(params[:vendor_unit_id]).get_available_data(target_store, user_id).query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :products => products.map{|p| p.for_combo_json},
                    :totalRecords => products.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为GridProducts的store与角色关联的数据，所以用grid_products
    def get_grid_products
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        products = Product.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :products => products.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => products.size
                }
            }
        end
    end

    def save_product
        result = Product.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message]}
    end

    def save_as_new_product
        result = Product.create_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message]}
    end

    #快速新增产品
    def save_product_mini
        #binding.pry
        user_id = session[:user_id]
        result = Product.create_mini_with(params, user_id)

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end

    def for_site
        #per_page = $products_per_page
        #offset = per_page * (params['page'].to_i - 1)
        #@products = Series.order("id").offset(offset).limit(per_page)
        ##binding.pry
        ##products =
        #render :json => @products.to_json
    end
end
