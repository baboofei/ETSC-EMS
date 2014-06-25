#encoding: UTF-8
class Function < ActiveRecord::Base
    #attr_writer :visible_to_names, :visible_to_ids

    has_many :functions_roles
    has_many :roles, :through => :functions_roles

    has_many :elements

    #某用户拥有的功能列表
    #params user_id
    scope :list_to, lambda { |user_id| where("users.id = ?", user_id).includes(:roles => :users).order("functions.id") }

    #解析传递过来的参数
    #params params
    def self.get_data(params)
        include_tables = []
        sort = table_name + ".id"
        if params[:filter]
            filter_json = JSON.parse(params[:filter])
            #对filter_json循环，每一项取field字段为字段名，value作为查询字，然后结果全部“and”
            # fore_condition_array对应的是前面带问号的部分，
            # back_condition_array对应的是后面各项
            fore_condition_array = []
            back_condition_array = []
            table = table_name#"functions"#默认表，Rails太贴心了

            filter_json.each do |filter|
                keyword = filter["value"]
                field = filter["field"]

                fore_condition_array << "#{table}.#{field} like ?"
                back_condition_array << "%#{keyword}%"
                table = table_name#加多重表后要重置
            end
            conditions = (fore_condition_array.join(" and ")).split("~~~") + back_condition_array#split("~~~")，一秒变数组
        else
            conditions = true
        end
        if params[:sort]
            sort_json = JSON.parse(params[:sort])[0]#目前只要单项排序，先这样用着
            sort = "#{sort_json['property']} #{sort_json['direction']}"
        end
        return where(*conditions).includes(*include_tables).order(*sort)
    end

    def for_tree_json
        attr = attributes
        attr[:text] = self[:name]
        attr[:leaf] = self[:parent_function_id].nil?
        attr[:iconCls] = self[:icon_class]
        attr
    end

    def for_grid_json
        attr = attributes
        attr[:visible_to_names] = self.roles.map(&:name).join("、")
        attr[:visible_to_ids] = self.roles.map(&:id).join("|")
        attr
        #binding.pry
    end

    #根据提交过来的参数更新表中数据
    def self.update_with_params(params)
        #然后在功能|角色关联表中删除所有功能id为params[:id]的数据
        FunctionsRole.delete_all("function_id = #{params[:id]}")
        #加上新的
        params[:role_ids].split("|").each do |role_id|
            functions_role = FunctionsRole.new
            functions_role.function_id = params[:id]
            functions_role.role_id = role_id
            functions_role.save
        end
    end
end
