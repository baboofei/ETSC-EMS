# encoding: utf-8
class CustomersSalecasesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def save_customers_salecases
        #binding.pry
        result = CustomersSalecase.create_or_update_with(params)

        render :json => {:success => result[:success], :message => result[:message]}
    end
end
