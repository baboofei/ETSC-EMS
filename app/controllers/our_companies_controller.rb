class OurCompaniesController < ApplicationController
    def our_company_list
        our_companies = OurCompany.available

        respond_to do |format|
            format.json {
                render :json => {
                    :our_companies => our_companies.map{|p| p.for_list_json}
                }
            }
        end
    end
end
