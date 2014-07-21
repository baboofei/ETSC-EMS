# encoding: utf-8
class SalecasesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridSalecases的store与角色关联的数据，所以用grid_salecases
    def get_grid_salecases
        #binding.pry
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        salecases = Salecase.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :salecases => salecases.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => salecases.size
                }
            }
        end
    end

    def get_grid_possible_salecases
        user_id = session[:user_id]
        salecases = Salecase.get_possible_salecases(params, user_id)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :salecases => salecases.map{|p| p.for_grid_json(user_id)},
                    :totalRecords => salecases.size
                }
            }
        end
    end

    def get_combo_salecases
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        customer_id = params[:customer_id]
        salecases = Salecase.to_customer(customer_id).get_available_data(target_store, user_id)

        respond_to do |format|
            #binding.pry
            format.json {
                render :json => {
                    :salecases => salecases.map{|p| p.for_combo_json} << {'id' => 0, 'number' => "新增个案"},
                    :totalRecords => salecases.size
                }
            }
        end
    end

    def save_salecase
        result = Salecase.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message]}
    end

    def transfer_salecase
        #binding.pry
        result = Salecase.trans_to(params, session[:user_id])
        render :json => {:success => true, :message => result[:message]}
    end
end
