# encoding: utf-8
class ColorsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    def get_colors
        colors = Color.where("users.id is not null").includes(:used_by)

        respond_to do |format|
            format.json {
                render :json => {
                    :colors => colors.map{|p| p.for_combo_json},
                    :totalRecords => colors.size
                }
            }
        end

    end
end
