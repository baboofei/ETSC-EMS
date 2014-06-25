# encoding: utf-8
class ExhibitionsController < ApplicationController

    def exhibition_list
        exhibitions = Exhibition.where(true).order("start_on DESC")

        respond_to do |format|
            format.json {
                render :json => {
                    :exhibitions => exhibitions.map{|p| p.for_list_json},
                    :totalRecords => exhibitions.size
                }
            }
        end
    end
end
