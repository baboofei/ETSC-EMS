# encoding: UTF-8
class Store < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :description, :is_hierarchy, :is_group_hierarchy, :name

    #数据对角色全部仅可见的多对多关系
    has_many :stores_visible_roles, :class_name => 'StoresVisibleRole', :foreign_key => :store_id
    has_many :visible_to_roles, :through => :stores_visible_roles, :source => :visible_to

    #数据对角色全部可见又可改的多对多关系
    has_many :editable_roles_stores, :class_name => 'EditableRolesStore', :foreign_key => :store_id
    has_many :editable_to_roles, :through => :editable_roles_stores, :source => :editable_to

    #数据对角色部分可见又可改的多对多关系
    has_many :partial_editable_roles_stores, :class_name => 'PartialEditableRolesStore', :foreign_key => :store_id
    has_many :partial_editable_to_roles, :through => :partial_editable_roles_stores, :source => :partial_editable_to

    ##解析传递过来的参数
    ##params filters
    #def self.get_data(params)
    #    include_tables = []
    #    sort = table_name + ".id"
    #    if params[:filter]
    #        filter_json = JSON.parse(params[:filter])
    #        #对filter_json循环，每一项取field字段为字段名，value作为查询字，然后结果全部“and”
    #        # fore_condition_array对应的是前面带问号的部分，
    #        # back_condition_array对应的是后面各项
    #        fore_condition_array = []
    #        back_condition_array = []
    #        table = table_name
    #
    #        filter_json.each do |filter|
    #            keyword = filter["value"]
    #            field = filter["field"]
    #
    #            #各种特殊情况
    #            #“功能名称”栏，跨表
    #            if field == "function_name"
    #                table = "functions"
    #                field = "name"
    #            end
    #
    #            fore_condition_array << "#{table}.#{field} like ?"
    #            back_condition_array << "%#{keyword}%"
    #            table = table_name#加多重表后要重置
    #        end
    #        conditions = (fore_condition_array.join(" and ")).split("~~~") + back_condition_array#split("~~~")，一秒变数组
    #
    #        # 对应上面跨表的判断
    #        condition_str = conditions[0]
    #        if condition_str =~ /functions/
    #            include_tables << :function
    #        end
    #    else
    #        conditions = true
    #    end
    #    if params[:sort]
    #        sort_json = JSON.parse(params[:sort])[0]#目前只要单项排序，先这样用着
    #        if sort_json['property'] == 'function_name'
    #            sort_json['property'] = 'functions.name'
    #            include_tables << :function
    #        end
    #        sort = "#{sort_json['property']} #{sort_json['direction']}"
    #    end
    #
    #    #binding.pry
    #    return where(*conditions).includes(*include_tables).order(*sort)
    #end

    #按页面传来的过滤条件取数据，含跨表
    def self.filter_by(filter)
        #binding.pry
        if filter
            filter_array = JSON.parse(filter)
            result = self
            filter_array.each { |filter|
                #binding.pry
                case filter['comparison']
                    when 'lt'
                        comparison = "<"
                    when 'gt'
                        comparison = ">"
                    when 'eq'
                        comparison = "="
                end

                filter_field_array = filter['field'].split("|")
                if filter_field_array.size > 1
                    #要跨表时，includes/joins的是映射名，但where/order语句里是实际表的名称，所以要处理一下
                    #映射在前，实际表在后，中间用“:”连接
                    #分成两个表
                    join_table_array = []
                    where_table_array = []
                    filter_field_array[0..-2].each { |p|
                        if p.split(":").size > 1
                            #如果有冒号分隔，说明二者不一样
                            join_table_array << p.split(":")[0]
                            where_table_array << p.split(":")[1]
                        else
                            join_table_array << p
                            where_table_array << p
                        end
                    }

                    join_table = join_table_array.to_link_table_hash
                    search_table = where_table_array[-1].pluralize
                    result = result.includes(join_table)
                else
                    search_table = table_name.pluralize
                end
                #最后一项表示字段
                search_field = filter_field_array[-1]
                #binding.pry

                case filter['type']
                    when 'string'
                        result = result.where("#{search_table}.#{search_field} like ?", "%#{filter['value']}%")
                    when 'list'
                        #p filter['value']
                        list_array = filter['value'].split(",")
                        result = result.where("#{search_table}.#{search_field} in (#{filter['value']})", *list_array)
                    when 'numeric'
                        result = result.where("#{search_table}.#{search_field} #{comparison} #{filter['value']}")
                    when 'date'
                        result = result.where("#{search_table}.#{search_field} #{comparison} ?",  filter['value'])
                end
            }
        else
            result = self.where(true)
        end
        #binding.pry
        return result
    end

    #按页面传来的排序方式远程排序，含跨表
    def self.updated_sort_by(sort, user_id)
        if sort
            sort_array = JSON.parse(sort)
            result = self
            sort_array.each { |sort|
                sort_field_array = sort['property'].split("|")
                if sort_field_array.size > 1
                    #要跨表时，includes/joins的是映射名，但where/order语句里是实际表的名称，所以要处理一下
                    #映射在前，实际表在后，中间用“:”连接
                    #分成两个表
                    join_table_array = []
                    where_table_array = []
                    sort_field_array[0..-2].each { |p|
                        if p.split(":").size > 1
                            #如果有冒号分隔，说明二者不一样
                            join_table_array << p.split(":")[0]
                            where_table_array << p.split(":")[1]
                        else
                            join_table_array << p
                            where_table_array << p
                        end
                    }

                    join_table = join_table_array.to_link_table_hash
                    sort_table = where_table_array[-1].pluralize
                    result = result.includes(join_table)
                else
                    sort_table = table_name.pluralize
                end
                #最后一项表示字段
                sort_field = sort_field_array[-1]

                result = result.order("#{sort_table}.#{sort_field} #{sort['direction']}")
            }
        else
            #没有sort的时候默认排序
            result = self.where(true).order("#{table_name.pluralize}.id DESC")
        end
        return result
    end

    def self.get_available_data(store_name, user_id)
        store = Store.find_by_name(store_name)
        user = User.find(user_id)

        #因为是Store这个store，有点特殊，直接返回全部
        where(true)
    end

    def for_grid_json
        attr = attributes
        attr['visible_to_roles>visible_role_name'] = self.visible_to_roles.map(&:name).join("、")
        attr['visible_to_roles>visible_role_id'] = self.visible_to_roles.map(&:id).join("|")
        attr[:editable_to_names] = self.editable_to_roles.map(&:name).join("、")
        attr[:editable_to_ids] = self.editable_to_roles.map(&:id).join("|")
        attr[:partial_editable_to_names] = self.partial_editable_to_roles.map(&:name).join("、")
        attr[:partial_editable_to_ids] = self.partial_editable_to_roles.map(&:id).join("|")
        attr
        #binding.pry
    end

    #根据提交过来的参数更新表中数据
    def self.update_with_params(params)
        #binding.pry
        #因为Store很多，所以不打算做成combo，直接按输入的store名字来
        #先在stores表里查找传来的名字，找不到就新增一个
        store = Store.new unless (store = Store.find_by_name(params[:name]))
        #存，以得出id备用
        store.name = params[:name]
        store.description = params[:description]
        store.is_hierarchy = params[:is_hierarchy] == "on"
        store.is_group_hierarchy = params[:is_group_hierarchy] == "on"
        store.save

        store_id = store.id
        #然后在数据|角色关联表中删除所有store_id为此id的数据
        StoresVisibleRole.delete_all("store_id = #{store_id}")
        EditableRolesStore.delete_all("store_id = #{store_id}")
        PartialEditableRolesStore.delete_all("store_id = #{store_id}")

        #加上新的
        params[:visible_role_ids].split("|").each do |role_id|
            stores_visible_role = StoresVisibleRole.new
            stores_visible_role.store_id = store_id
            stores_visible_role.visible_role_id = role_id
            stores_visible_role.save
        end
        params[:editable_role_ids].split("|").each do |role_id|
            editable_roles_store = EditableRolesStore.new
            editable_roles_store.store_id = store_id
            editable_roles_store.editable_role_id = role_id
            editable_roles_store.save
        end
        params[:partial_editable_role_ids].split("|").each do |role_id|
            partial_editable_roles_store = PartialEditableRolesStore.new
            partial_editable_roles_store.store_id = store_id
            partial_editable_roles_store.partial_editable_role_id = role_id
            partial_editable_roles_store.save
        end
    end
end
