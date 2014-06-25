# encoding: utf-8
class RealExchangeRatesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def get_real_exchange_rates
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        real_exchange_rates = RealExchangeRate.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :real_exchange_rates => real_exchange_rates.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => real_exchange_rates.size
                }
            }
        end
    end
end
