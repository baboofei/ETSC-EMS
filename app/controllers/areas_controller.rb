# encoding: utf-8
class AreasController < ApplicationController
    def area_list
        areas = Area.where(true)

        respond_to do |format|
            format.json {
                render :json => {
                    :areas => areas.map{|p| p.for_list_json}
                }
            }
        end
    end
end
