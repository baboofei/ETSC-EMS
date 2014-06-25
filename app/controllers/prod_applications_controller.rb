class ProdApplicationsController < ApplicationController
    def prod_application_list
        prod_applications = ProdApplication.all
        #binding.pry
        respond_to do |format|
            format.json { render :json => { :prod_applications => prod_applications.map{|p| p.for_list_filter_json} } }
        end
    end
end
