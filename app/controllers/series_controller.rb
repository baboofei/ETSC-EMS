class SeriesController < ApplicationController
    def get_series_for_site
        #binding.pry
        per_page = $products_per_page
        #offset = per_page * (params['page'].to_i - 1)
        #p filter
        output_hash = Series.for_site(per_page, params)
        #binding.pry
        render :json => {
            :products => output_hash[:products],
            :total_pages => output_hash[:total_pages],
            :current_page => params['page'].to_i == 0 ? "1" : params['page']
        }
    end
end

