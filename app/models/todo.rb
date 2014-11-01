# encoding: utf-8
class Todo < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :category, :description, :function_id, :state

    belongs_to :function

    def for_grid_json
        attr = attributes
        attr['function_name'] = function.name
        attr['category_name'] = Dictionary.where("data_type = 'update_type' and value = ?", category).first.display
        attr
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        item = "脑洞"
        if params[:id] != ""
            todo = Todo.find(params[:id])
            message = $etsc_update_ok
        else
            todo = Todo.new
            message = $etsc_create_ok
        end

        fields_to_be_updated = %w(category function_id state)
        fields_to_be_updated.each do |field|
            todo[field] = params[field]
        end
        todo['description'] = params['description'].gsub("\n", "<br/>")
        todo.save

        return {:success => true, :message => "#{item}#{message}", :id => todo.id}
    end

end
