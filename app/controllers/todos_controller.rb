# encoding: utf-8
class TodosController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #因为体现到ExtJS里，是要查名为GridTodos的store与角色关联的数据，所以用grid_todos
    def get_grid_todos
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        todos = Todo.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :todos => todos.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => todos.size
                }
            }
        end
    end

    def mark_as_read
        Todo.mark_as_read(params)
        render :json => {:success => true}
    end

    def mark_single_as_read
        Todo.mark_single_as_read(params)
        render :json => {:success => true}
    end

    def save_todo
        result = Todo.create_or_update_with(params, session[:user_id])
        render :json => {:success => result[:success], :message => result[:message]}
    end
end
