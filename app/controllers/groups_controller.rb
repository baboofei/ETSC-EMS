# coding: UTF-8
class GroupsController < ApplicationController
    #ExtJS里的ComboGroups的store
    def get_combo_groups
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        groups = Group.get_available_data(target_store, user_id).with_user(user_id)

        respond_to do |format|
            #binding.pry
            format.json {
                render :json => {
                    :groups => [{"id"=>0, "name"=>"不分组"}] + groups.map{|p| p.for_list_json},
                    :totalRecords => groups.size
                }
            }
        end
    end

end
