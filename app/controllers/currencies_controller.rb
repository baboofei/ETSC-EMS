class CurrenciesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def currency_list
        currencies = Currency.where(true)

        respond_to do |format|
            format.json {
                render :json => {
                    :currencies => currencies.map{|p| p.for_list_json}
                }
            }
        end
    end

    def update_exchange_rate
        result = Currency.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message]}
    end
end
