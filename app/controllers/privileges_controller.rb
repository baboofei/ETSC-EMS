#encoding: UTF-8
class PrivilegesController < ApplicationController
    #protect_from_forgery :except => [:function_tree, :all_elements, :function_privileges, :element_privileges] #防止ExtJS提交过来的时候清session
    skip_before_filter :verify_authenticity_token

    #按用户生成左边的功能树
    def function_tree
        #这里有不明bug，怀疑是Firefox等浏览器保存session的问题，先这样试试吧
        if session[:user_id] == 0 || session[:user_id].blank?
            render :json => {:success => false}
        else
            user_id = session[:user_id]
            functions = Function.list_to(user_id)

            respond_to do |format|
                format.json { render :json => { :root => ".", :leaf => false, :children => functions.map{|p| p.for_tree_json} } }
            end
        end
    end

    #按用户生成全部需要额外处理的页面元素
    #“额外处理”包括“不可见”和“可见不可用”
    #最后会是一个类似这样的JSON
    #[
    #  {
    #    "invisible":[
    #      {
    #        "function_id":"aaa",
    #        "element_id":"xxx"
    #      },
    #      {
    #        "function_id":"aaa",
    #        "element_id":"yyy"
    #      }
    #    ]
    #  },
    #  {
    #    "disable":[
    #      {
    #        "function_id":"bbb",
    #        "element_id":"xxx1",
    #        "default_value": "abc"
    #      },
    #      {
    #        "function_id":"ccc",
    #        "element_id":"yyy2"
    #      }
    #    ]
    #  }
    #]
    def all_elements
        user_id = session[:user_id]

        all_privileged_elements = Element.get_all_privileges(user_id)
        ##先是“不可见”的
        #invisible_elements = Element.invisible_to(user_id)
        #invisible_json = invisible_elements.map{|p| {:function_id => p.function_id, :element_id => p.element_id}}
        #
        ##再是“可见不可用”的
        #disabled_elements = Element.disable_to(user_id)
        #disabled_json = disabled_elements.map{|p| {:function_id => p.function_id, :element_id => p.element_id, :default_value => p.default_value}}
        #
        respond_to do |format|
            format.json {
                obj = {
                    :elements => all_privileged_elements
                }
                render :json => obj.to_json
            }
        end
    end

    #def function_privileges
    #    #功能权限的REST
    #    if request.get?
    #        functions = Function.get_data(params)
    #
    #        respond_to do |format|
    #            format.json { render :json => { :function_privileges => functions.map{|p| p.for_privilege_json} } }
    #        end
    #    elsif request.post?
    #        #params[:role_ids] #"8|5|1"
    #        #找到提交过来的功能名称
    #        function = Function.find(params[:id])
    #        function_id = function.id
    #        #然后在功能|角色关联表中删除所有功能id为此id的数据
    #        FunctionsRole.delete_all("function_id = #{function_id}")
    #        #加上新的
    #        params[:role_ids].split("|").each do |role_id|
    #            functions_role = FunctionsRole.new
    #            functions_role.function_id = function_id
    #            functions_role.role_id = role_id
    #            functions_role.save
    #        end
    #        #binding.pry
    #        render :json => {:success => true, :message => "权限修改成功！"}.to_json
    #    end
    #end
    #

    #因为体现到ExtJS里，是要查名为GridElementPrivileges的store与角色关联的数据，所以用grid_element_privileges
    def get_grid_element_privileges
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        elements = Element.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)
        respond_to do |format|
            format.json {
                render :json => {
                    :element_privileges => elements.limit(limit).offset(start.to_i).map{|p| p.for_grid_json},
                    :totalRecords => elements.size
                }
            }
        end
    end

    def element_privileges
        #页面元素权限的REST
        if request.get?
            #
            #
            #elements = Element.get_data(params)
            #
            #respond_to do |format|
            #    format.json { render :json => { :element_privileges => elements.limit(limit).offset(start.to_i).map{|p| p.for_privilege_json} } }
            #end
        elsif request.post?
            #invisible_role_ids	5|6|12
            #disable_role_ids	1|2|3|4
            #element_id	test_privilege
            #找到提交过来的元素id
            element = Element.find_by_element_id(params[:element_id])
            element_id = element.id
            #然后在两个元素|角色关联表中删除所有元素id为此id的数据
            ElementsInvisibleRole.delete_all("element_id = #{element_id}")
            ElementsDisableRole.delete_all("element_id = #{element_id}")
            #加上新的
            params[:invisible_role_ids].split("|").each do |role_id|
                elements_invisible_role = ElementsInvisibleRole.new
                elements_invisible_role.element_id = element_id
                elements_invisible_role.invisible_role_id = role_id
                elements_invisible_role.save
            end
            params[:disable_role_ids].split("|").each do |role_id|
                elements_disable_role = ElementsDisableRole.new
                elements_disable_role.element_id = element_id
                elements_disable_role.disable_role_id = role_id
                elements_disable_role.save
            end
            #binding.pry
            element.update_attribute(:element_id, params[:element_id])
            #TODO 这个要考虑页面里是不是换combo
            #element.update_attribute(:function_id, params[:function_id])
            element.update_attribute(:description, params[:description])
            element.update_attribute(:default_value, params[:default_value])
            element.save
            render :json => {"success" => true, "message" => "权限修改成功！"}.to_json
        end
    end

    def data_privileges
        #数据权限的REST
        if request.get?
            stores = Store.get_data(params)

            respond_to do |format|
                format.json { render :json => { :data_privileges => stores.limit(limit).offset(start.to_i).map{|p| p.for_privilege_json} } }
            end
        elsif request.post?
            #invisible_role_ids	5|6|12
            #disable_role_ids	1|2|3|4
            #element_id	test_privilege
            #找到提交过来的元素id
            element = Element.find_by_element_id(params[:element_id])
            element_id = element.id
            #然后在两个元素|角色关联表中删除所有元素id为此id的数据
            ElementsInvisibleRole.delete_all("element_id = #{element_id}")
            ElementsDisableRole.delete_all("element_id = #{element_id}")
            #加上新的
            params[:invisible_role_ids].split("|").each do |role_id|
                elements_invisible_role = ElementsInvisibleRole.new
                elements_invisible_role.element_id = element_id
                elements_invisible_role.invisible_role_id = role_id
                elements_invisible_role.save
            end
            params[:disable_role_ids].split("|").each do |role_id|
                elements_disable_role = ElementsDisableRole.new
                elements_disable_role.element_id = element_id
                elements_disable_role.disable_role_id = role_id
                elements_disable_role.save
            end
            #binding.pry
            element.update_attribute(:element_id, params[:element_id])
            #TODO 这个要考虑页面里是不是换combo
            #element.update_attribute(:function_id, params[:function_id])
            element.update_attribute(:description, params[:description])
            element.update_attribute(:default_value, params[:default_value])
            element.save
            render :json => {"success" => true, "message" => "权限修改成功！"}.to_json
        end
    end
end
