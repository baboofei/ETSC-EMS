# encoding = utf-8
class TermsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为ComboTerms的store与角色关联的数据，所以用combo_terms
    def get_combo_terms
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        query = params[:query]
        terms = Term.get_available_data(target_store, user_id).query_by(query)

        respond_to do |format|
            format.json {
                render :json => {
                    :terms => terms.map{|p| p.for_combo_json},
                    :totalRecords => terms.size
                }
            }
        end
    end
end
