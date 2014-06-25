class CitiesController < ApplicationController
    #因为体现到ExtJS里，是要查名为Cities的store的数据，所以用cities
    def get_cities
        query = params[:query]
        cities = City.query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :cities => cities.map{|p| p.for_combo_json},
                    :totalRecords => cities.size
                }
            }
        end
    end
end
