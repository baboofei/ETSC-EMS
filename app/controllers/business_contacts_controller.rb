# encoding = utf-8
class BusinessContactsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridBusinessContacts的store与角色关联的数据，所以用grid_business_contacts
    def get_grid_business_contacts
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        #target_model = eval(controller_name.singularize.camelize)
        #研究一下能不能提取“BusinessContact”这个model，可能用不上
        #binding.pry

        business_contacts = BusinessContact.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :business_contacts => business_contacts.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(user_id)},
                    :totalRecords => business_contacts.size
                }
            }
        end
    end

    #因为体现到ExtJS里，是要查名为ComboBusinessUnit的store与角色关联的数据，所以用combo_business_unit
    def get_combo_business_contacts
        business_unit_id = params[:business_unit_id]
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        business_contacts = BusinessContact.get_available_data(target_store, user_id).in_unit(business_unit_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :business_contacts => business_contacts.map{|p| p.for_combo_json},
                    :totalRecords => business_contacts.size
                }
            }
        end
    end

    def save_business_contact
        #binding.pry
        result = BusinessContact.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message], :id => result[:id]}
    end
end
