# encoding: utf-8
class RolesController < ApplicationController
    def role_list
        roles = Role.where(true)
        #binding.pry

        respond_to do |format|
            format.json {
                render :json => {
                    :roles => roles.map{|p| p.for_list_json},
                    :totalRecords => roles.size
                }
            }
        end
    end
end
