# encoding: utf-8
class QuoteItemsController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为QuoteItems的store与角色关联的数据，所以用quote_items
    def get_quote_items
        #binding.pry
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        quote_items = QuoteItem.in_quote(params[:quote_id]).where("parent_id = 0").get_available_data(target_store, user_id).order('quote_items.id ASC')

        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    #:quote_items => quote_items.map{|p| p.for_tree_json},
                    #:totalRecords => quote_items.size
                    :text => ".",
                    :children => quote_items.map{|p| p.for_tree_json}
                }
            }
        end
    end
end
