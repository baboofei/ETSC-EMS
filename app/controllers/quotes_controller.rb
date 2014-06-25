# encoding: utf-8
class QuotesController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为Quotes的store与角色关联的数据，所以用quotes
    def get_quotes
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        quotes = Quote.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :quotes => quotes.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(target_store, user_id)},
                    :totalRecords => quotes.size
                }
            }
        end
    end

    #def save_quote
    #    result = Quote.create_or_update_with(params)
    #
    #    render :json => {:success => result[:success], :message => result[:message]}
    #end

    def process_workflow
        result = Quote.create_or_update_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end

    def get_combo_quotes
        query = params[:query]
        quotes = Quote.query_by(query)

        respond_to do |format|
            #binding.pry
            format.json {
                render :json => {
                    :quotes => quotes.map{|p| p.for_combo_json} << {'id' => 0, 'number' => "无报价"},
                    :totalRecords => quotes.size
                }
            }
        end
    end
end


