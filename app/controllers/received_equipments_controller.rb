# encoding = utf-8
class ReceivedEquipmentsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridReceivedEquipments的store与角色关联的数据，所以用grid_received_equipments
    def get_grid_received_equipments
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        received_equipments = ReceivedEquipment.in_flow_sheet(params[:flow_sheet_id]).get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :received_equipments => received_equipments.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => received_equipments.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为ComboReceivedEquipment的store与角色关联的数据，所以用combo_business_unit
    def get_combo_received_equipments
        query = params[:query]
        received_equipments = ReceivedEquipment.query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :received_equipments => received_equipments.map{|p| p.for_combo_json},
                    :totalRecords => received_equipments.size
                }
            }
        end
    end

    def save_business_unit
        result = ReceivedEquipment.create_or_update_with(params, session[:user_id])
        #binding.pry
        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
