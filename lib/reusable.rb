# encoding: utf-8
module Reusable
    extend ActiveSupport::Concern

    included do
        # Add a "search" scope to the models
        # 别人的例子
        #def self.search (search)
        #    if search
        #        where('comment LIKE ?', "%#{search}%")
        #    else
        #        scoped
        #    end
        #end

        def self.get_available_data(store_name, user_id)
            #binding.pry
            store = Store.find_by_name(store_name)
            user = User.find(user_id)
            if store
                if (store.visible_to_roles & user.roles).size > 0
                    #全部可见并全部可改的角色，返回所有数据
                    return where(true)
                elsif (store.editable_to_roles & user.roles).size > 0
                    #全部可见并全部不可改的角色，返回所有数据
                    return where(true)
                elsif (store.partial_editable_to_roles & user.roles).size > 0
                    #部分可见部分可改的角色，判断是否继承
                    if store.is_hierarchy?
                        #继承的话返回所有“成员”的id数组
                        member_ids = user.get_all_member_ids
                    elsif store.is_group_hierarchy?
                        #继承“父store”的分组的话，用另外一个方法
                        #此勾跟上一条原则上不互斥，但实际使用中应该是最多选一个的
                        member_ids = user.get_all_member_ids_in_group
                    else
                        #非继承的话返回自己的id构成的数组
                        member_ids = [user_id]
                    end
                    #如果store有group_id的属性，则带上user_id属性，去查自己是否在该工作组
                    #否则不管
                    #if eval(store_name).column_names.include? "group_id"
                        return get_data_from_members(member_ids.flatten.uniq, user_id)
                    #else
                    #    return get_data_from_members(member_ids.flatten.uniq)
                    #end
                    #
                    ##再加上自己所属工作组成员的id数组，如果有工作组的话
                    #member_ids += user.get_group_mate_ids
                else
                    #未分配的角色，返回空集
                    return where("1=0")
                end
            else
                return where("1=0")
            end
        end

        #按页面传来的过滤条件取数据，含跨表
        def self.filter_by(filter)
            #binding.pry
            if filter
                filter_array = JSON.parse(filter)
                result = self
                filter_array.each { |i_filter|
                    #binding.pry
                    case i_filter['comparison']
                        when 'lt'
                            comparison = "<"
                        when 'gt'
                            comparison = ">"
                        when 'eq'
                            comparison = "="
                    end

                    filter_field_array = i_filter['field'].split("|")
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

                    case i_filter['type']
                        when 'string'
                            result = result.where("#{search_table}.#{search_field} like ?", "%#{i_filter['value']}%")
                        when 'list'
                            list_array = i_filter['value'].split(",")
                            result = result.where("#{search_table}.#{search_field} in (#{list_array.map{|p| "?"}.join(",")})", *list_array)
                        when 'numeric'
                            result = result.where("#{search_table}.#{search_field} #{comparison} #{i_filter['value']}")
                        when 'date'
                            result = result.where("#{search_table}.#{search_field} #{comparison} ?", i_filter['value'])
                    end
                }
            else
                result = self.where(true)
            end
            #binding.pry
            return result
        end

        def self.updated_filter_by(filter)
            if filter
                filter_array = JSON.parse(filter)
                result = self
                filter_array.each_with_index do |i_filter, index|
                    #binding.pry
                    case i_filter['comparison']
                        when 'lt'
                            comparison = "<"
                        when 'gt'
                            comparison = ">"
                        else
                            comparison = "="
                    end

                    #if i_filter['field'].split(">").size == 1
                    #    #无“>”符号，说明只查当前表
                    #    search_table = table_name.pluralize
                    #    search_field = i_filter['field']
                    #else
                    #    #有“>”符号，说明跨表了，这时要看有无“(|)”来分隔多字段
                    #    if i_filter['field'].split("(").size == 1
                    #        ##如果没有，就没有or的关系了，直接对这个链进行处理
                    #        ##binding.pry
                    #        #join_table_queue_array = i_filter['field'].split(">")
                    #        #where_table_array = []
                    #        #
                    #        #join_table_queue_array[0..-2].each_with_index do |reflection, index|
                    #        #    if index == 0
                    #        #        last_model = self
                    #        #    else
                    #        #        last_model = eval(join_table_queue_array[index - 1].camelize)
                    #        #    end
                    #        #    class_name = last_model.reflections[reflection.to_sym].class_name
                    #        #    if class_name.nil?
                    #        #        where_table_array << last_model.reflections[reflection.to_sym].plural_name
                    #        #    else
                    #        #        where_table_array << last_model.reflections[reflection.to_sym].class_name.underscore.pluralize
                    #        #    end
                    #        #end
                    #        #
                    #        #search_table = where_table_array[-1]
                    #        #search_field = join_table_queue_array[-1]
                    #        #join_table = join_table_queue_array[0..-2].to_link_table_hash
                    #        #result = result.includes(join_table)
                    #        #result = result.where("#{search_table}.#{search_field} like ?", "%#{i_filter['value']}%")
                    #    else
                    #        ##如果有，则展开之。同时说明这一项只可能是string型过滤
                    #        #field_split = i_filter['field'].split(">(")
                    #        #fixed_part = field_split[0]
                    #        #probably_part = field_split[1].split(")")[0]
                    #        #probably_part_array = probably_part.split("|")
                    #        #probably_condition_array = []
                    #        #probably_part_array.each do |probably|
                    #        #    #binding.pry
                    #        #    #includes/joins的是映射名，但where/order语句里是实际表的名称
                    #        #    #而直接写的是映射名（因为短点嘛），所以要处理一下
                    #        #    join_table_queue_array = "#{fixed_part}>#{probably}".split(">")
                    #        #    where_table_array = []
                    #        #
                    #        #    join_table_queue_array[0..-2].each_with_index do |reflection, index|
                    #        #        #比如映射是seller(Product里的)，对应的实际模型是VendorUnit，对应的表是vendor_units
                    #        #        #binding.pry
                    #        #        if index == 0
                    #        #            last_model = self
                    #        #        else
                    #        #            #binding.pry
                    #        #            last_model = eval(join_table_queue_array[index - 1].camelize)
                    #        #        end
                    #        #        class_name = last_model.reflections[reflection.to_sym].class_name
                    #        #        #macro = last_model.reflections[reflection.to_sym].macro
                    #        #        if class_name.nil?
                    #        #            where_table_array << last_model.reflections[reflection.to_sym].plural_name
                    #        #        else
                    #        #            where_table_array << last_model.reflections[reflection.to_sym].class_name.underscore.pluralize
                    #        #        end
                    #        #    end
                    #        #    search_table = where_table_array[-1] #.pluralize
                    #        #    search_field = join_table_queue_array[-1]
                    #        #    probably_condition_array << "#{search_table}.#{search_field} like ?"
                    #        #
                    #        #    join_table = join_table_queue_array[0..-2].to_link_table_hash
                    #        #    result = result.includes(join_table)
                    #        #    #p join_table
                    #        #end
                    #        #repeat_array = ["%#{i_filter['value']}%"] * probably_condition_array.length
                    #        #result = result.where(probably_condition_array.join(" or "), *repeat_array)
                    #    end
                    #end

                    #binding.pry

                    if i_filter['field'].include?("^")
                        #有“^”说明有多态，直接用joins写SQL
                        field_array = []
                        i_filter['field'].split(">(").each_with_index do |p, index|
                            #binding.pry
                            if index == 0
                                field_array << p.gsub("(", "[").gsub(")", "]").gsub("|", ",").gsub("^", "").split(",")
                            else
                                field_array << p.gsub(")", "").gsub("|", ",").gsub("^", "").split(",")
                            end
                        end
                        #binding.pry
                        field_array = field_array.cross_multi.map{|p| p.join(">")}#每一项交叉相乘并以“>”连接起来
                        #此时有四种情况：
                        #1.多态表>字段
                        #2.多态表>别的映射(多个)>字段
                        #3.别的映射(多个)>多态表>字段
                        #4.别的映射(多个)>多态表>别的映射(多个)>字段
                        where_array = []
                        field_array.each do |field|
                            #p "分析以下链式结构"
                            #p field
                            #每一项再拆成链式，依次joins
                            link_format = field.split(">")
                            first_table_name = link_format[0]
                            if link_format.size == 2
                                #长度为2，对应上面第1种情况
                                #查出会有哪些态
                                existed_morph = self.where(true).map{|p| p["#{first_table_name}_type"]}.uniq
                                #每一个和后面的“字段”搭配
                                existed_morph.each do |morph|
                                    result = result.joins("left join #{morph.underscore.pluralize} on
                                (#{name.underscore.pluralize}.#{first_table_name}_type = '#{morph}' and
                                #{name.underscore.pluralize}.#{first_table_name}_id = #{morph.underscore.pluralize}.id)")
                                #    p "已join上条件：#{("left join #{morph.underscore.pluralize} on
                                #(#{name.underscore.pluralize}.#{first_table_name}_type = '#{morph}' and
                                ##{name.underscore.pluralize}.#{first_table_name}_id = #{morph.underscore.pluralize}.id)")}"
                                    where_array << "#{morph.underscore.pluralize}.#{link_format[1]} like ?"
                                    #p  where_array
                                end
                            else
                                if self.reflections[first_table_name.to_sym] && self.reflections[first_table_name.to_sym].options[:polymorphic]
                                    #第一个遇到的是多态，对应上面第2种情况
                                    #查出会有哪些态
                                    existed_morph = self.where(true).map{|p| p["#{first_table_name}_type"].blank? ? nil : p["#{first_table_name}_type"]}.compact.uniq
                                    #where_array = []
                                    #每一个和后面的一串表，以及最后一项“字段”搭配
                                    existed_morph.each do |morph|
                                        class_0_name = morph
                                        table_0_name = class_0_name.underscore.pluralize
                                        result = result.joins("left join #{morph.underscore.pluralize} on
                                (#{name.underscore.pluralize}.#{first_table_name}_type = '#{morph}' and
                                #{name.underscore.pluralize}.#{first_table_name}_id = #{morph.underscore.pluralize}.id)")
                                        p "已join上条件：#{("left join #{morph.underscore.pluralize} on
                                (#{name.underscore.pluralize}.#{first_table_name}_type = '#{morph}' and
                                #{name.underscore.pluralize}.#{first_table_name}_id = #{morph.underscore.pluralize}.id)")}"
                                        #第2项也有点特殊，因为它的“前一项”就是多态的模型
                                        #binding.pry
                                        #有可能会搭配不上，比如
                                        #^quotable>(salecase|flow_sheet)>(name)
                                        #这个的quotable可能值是salelog和service_log，但salelog就没有flow_sheet
                                        #这种时候直接无视掉就好……
                                        unless morph.constantize.reflections[link_format[1].to_sym].blank?
                                            #binding.pry
                                            class_1_name = morph.constantize.reflections[link_format[1].to_sym].class_name
                                            table_1_name = class_1_name.underscore.pluralize
                                            #判断是如何join
                                            #比如vendor_unit>unit_aliases就是
                                            #       vendor_unit_aliases.vendor_unit_id = vendor_units.id
                                            #而salelog>salecase就是
                                            #       salelogs.salecase_id = salecases.id
                                            if class_1_name.constantize.column_names.include?("#{morph.underscore}_id")
                                                result = result.joins("left join #{table_1_name} on #{table_1_name}.#{morph.underscore}_id = #{table_0_name}.id")
                                                #p "多个#{class_1_name.underscore}对一个#{morph.underscore}"
                                                #p "已join上条件： #{("left join #{table_1_name} on #{table_1_name}.#{morph.underscore}_id = #{table_0_name}.id")}"
                                            elsif morph.constantize.column_names.include?("#{class_1_name.underscore}_id")
                                                result = result.joins("left join #{table_1_name} on #{table_0_name}.#{table_1_name.singularize}_id = #{table_1_name}.id")
                                                #p "一个#{class_1_name.underscore}对多个#{morph.underscore}"
                                                #p "已join上条件： #{("left join #{table_1_name} on #{table_0_name}.#{table_1_name.singularize}_id = #{table_1_name}.id")}"
                                            end
                                            #p "~~~~~~~~~"
                                            where_array << "#{table_1_name}.#{link_format[-1]} like ?"
                                            #p where_array
                                            #从第3项开始普适了，用“前一项”来join它自身，一直join到link_format的第-2项
                                            #可惜暂无实例测试
                                            #link_format[1..-2].each do |reflection|
                                            #    class_name = morph.constantize.reflections[:unit_aliases].class_name
                                            #    table_name = class_name.underscore.pluralize
                                            #    result = result.joins("left join #{table_name} on
                                            #    #{table_name}.vendor_unit_id = #{table_0_name}.id
                                            #")
                                            #end
                                        end
                                    end

                                    #binding.pry
                                else
                                    #第一个遇到的不是多态，对应上面第3第4种情况（暂时无实例）
                                end
                            end

                            ##若长度为n，则前面n-1项都是表名称，最后一项是第n-1项表的字段，所以只对前n-1项循环joins
                            #link_format[0..-2].each_with_index do |fake_table_name, index|
                            #    #先看此表名称对应的模型是不是多态
                            #    p "开始拆解链式结构"
                            #    p "遇到表#{fake_table_name.to_sym}"
                            #    p reflections[fake_table_name.to_sym]
                            #    p "~~~~~~~~~~~~~~~~"
                            #    if self.reflections[fake_table_name.to_sym] && self.reflections[fake_table_name.to_sym].options[:polymorphic]
                            #        p "是多态"
                            #        #是多态则查出会有哪些态
                            #        existed_morph = self.where(true).map{|p| p["#{fake_table_name}_type"]}.uniq
                            #        #然后对这些态循环
                            #        existed_morph.each do |morph|
                            #            if index == 0
                            #                left_model_name = name
                            #                right_model_name = morph
                            #            else
                            #                left_model_name = link_format[index - 1].camelize
                            #                right_model_name = morph
                            #            end
                            #            result = result.joins("left join #{right_model_name.underscore.pluralize} on (#{left_model_name.underscore.pluralize}.#{fake_table_name}_type = '#{right_model_name}' and #{left_model_name.underscore.pluralize}.#{fake_table_name}_id = #{right_model_name.underscore.pluralize}.id)")
                            #            p "已join上条件：#{("left join #{right_model_name.underscore.pluralize} on (#{left_model_name.underscore.pluralize}.#{fake_table_name}_type = '#{right_model_name}' and #{left_model_name.underscore.pluralize}.#{fake_table_name}_id = #{right_model_name.underscore.pluralize}.id)")}"
                            #            #binding.pry
                            #            #result.joins("left join vendor_units on (express_sheets.unit_receivable_type = 'VendorUnit' and express_sheets.unit_receivable_id = vendor_units.id)")
                            #        end
                            #    else
                            #        p "不是多态"
                            #        #不是多态，则用表名
                            #        if index == 0
                            #            left_table_name = name.pluralize
                            #            right_table_name = fake_table_name.pluralize
                            #        else
                            #            left_table_name = link_format[index - 1].pluralize
                            #            right_table_name = fake_table_name.pluralize
                            #        end
                            #        binding.pry
                            #        result = result.joins("left join #{right_table_name} on (#{left_table_name}.#{fake_table_name}_type = '#{right_table_name}' and #{left_table_name}.#{fake_table_name}_id = #{right_table_name}.id)")
                            #        p "已join上条件：#{("left join #{right_table_name} on (#{left_table_name}.#{fake_table_name}_type = '#{right_table_name}' and #{left_table_name}.#{fake_table_name}_id = #{right_table_name}.id)")}"
                            #    end
                            #end
                            #
                        end
                        repeat_array = ["%#{i_filter['value']}%"] * where_array.length
                        result = result.where(where_array.join(" or "), *repeat_array)
                        #binding.pry
                    else
                        #无多态
                        if i_filter['field'].split("|").size > 1
                            #有or的多字段查询
                            if i_filter['field'].split(">").size > 1
                                #有链式关联表时
                                #最复杂的那种结构
                                #要把形如“customer_unit>(name|unit_aliases>unit_alias|en_name)”的简写展开成几个条件的写法：
                                #customer_unit>name or customer_unit>unit_aliases>unit_alias or customer_unit>en_name
                                #同时说明这一项只可能是string型过滤，再在where里写
                                field_split = i_filter['field'].split(">(")
                                if field_split.size > 1
                                    fixed_part = field_split[0]
                                    probably_part = field_split[1].split(")")[0]
                                else
                                    fixed_part = ""
                                    probably_part = i_filter['field']
                                end
                                probably_part_array = probably_part.split("|")
                                #binding.pry
                                search_table_array = [] #来源存成数组，判断是源自同一张表还是多张表。下面那条注释的“表名”
                                search_model_array = [] #虽然是从表名变来的，但还是另存一下吧。下面那条注释的“模型名”
                                search_field_array = [] #要查的字段名。下面那条注释的“字段名”
                                collect_id_array = [] #溯源用的id也存成数组。下面那条注释的“要取的id”
                                include_table_hash = {}
                                #模型名.where("表名.字段名 条件").pluck(要取的id)

                                #a1 = CustomerUnit.where("customer_units.name like '%天%'").pluck :id
                                #a2 = CustomerUnitAlias.where("customer_unit_aliases.unit_alias like '%天%'").pluck :customer_unit_id
                                #a=(a1+a2).uniq
                                #question = a.map{"?"}.join(",")
                                probably_part_array.each do |probably|
                                    #includes/joins的是映射名，但where/order语句里是实际表的名称
                                    #而直接写的是映射名（因为短点嘛），所以要处理一下
                                    #但有可能会涉及到多对多的映射，变成表的时候数组长度会变化，所以后面尽量不要再用映射这个数组做事
                                    join_reflection_queue_array = "#{fixed_part.blank? ? "" : "#{fixed_part}>"}#{probably}".split(">")
                                    #join_table_queue_array是["customer_unit", "unit_alias", "unit_alias"]这样的形式
                                    #在这里就要处理成“正确”的表的形式，因为这里进来的是映射（比如第二项）
                                    join_table_queue_array = []
                                    join_reflection_queue_array[0..-2].each_with_index do |reflection, index|
                                        if index == 0
                                            #第0项从model取
                                            constantized_name = model_name.constantize.reflections[reflection.to_sym].class_name
                                            join_table_queue_array << constantized_name.underscore.pluralize
                                        else
                                            #binding.pry
                                            #后面每一项和已经加入到join_table_queue_array的前一项比
                                            constantized_name = join_table_queue_array[index - 1].camelize.singularize.constantize.reflections[reflection.to_sym].class_name
                                            join_table_queue_array << constantized_name.underscore.pluralize
                                        end
                                    end
                                    join_table_queue_array << join_reflection_queue_array[-1]
                                    #从这里出来之后就再也不用join_reflection_queue_array
                                    #p "#{join_reflection_queue_array} 已经变成了 #{join_table_queue_array}"
                                    where_table_array = []

                                    #Customer.where("customer_units.id in (#{question})", *a).includes(:customer_unit)
                                    #模型名.where("表名.字段名 条件").pluck(要取的id)
                                    case join_table_queue_array.size
                                        when 1
                                            #比如在CustomerUnit里查name，只有一个["name"]
                                            #p "长度是1"
                                            #p "model_name是#{model_name}"
                                            search_table_array << model_name.underscore.pluralize
                                            search_model_array << model_name
                                            search_field_array << join_table_queue_array[0]
                                            collect_id_array << "id"
                                        when 2
                                            #比如在CustomerUnit里查unit_alias，是这样的：["customer_unit_alias", "unit_alias"]
                                            #在Customer里查customer_unit的name，是这样的：["customer_unit", "name"]

                                            #p "join_table_queue_array 是 #{join_table_queue_array}，长度是2"
                                            #p "model_name是#{model_name}"
                                            #join_table_queue_array[0]可能是seller这样的映射，要转成真正的表
                                            #binding.pry
                                            if model_name.constantize.reflections[join_reflection_queue_array[0].to_sym].nil?
                                                constantized_name = model_name.constantize.reflections[join_reflection_queue_array[0].singularize.to_sym].class_name
                                            else
                                                constantized_name = model_name.constantize.reflections[join_reflection_queue_array[0].to_sym].class_name
                                            end
                                            #if constantized_name.nil?
                                            #    search_table_array << join_table_queue_array[0].pluralize
                                            #    search_model_array << join_table_queue_array[0].singularize.camelize
                                            #else
                                                search_table_array << constantized_name.underscore.pluralize
                                                search_model_array << constantized_name
                                            #end

                                            search_field_array << join_table_queue_array[1]
                                            include_table_hash = join_reflection_queue_array[0..-2].to_link_table_hash
                                            #模型中有某字段的单数形式的属性，则用id；否则用“表名单数_id”
                                            #比如Customer的属性里有customer_unit_id，即多customer对一customer_unit，则用id
                                            #CustomerUnit的属性里没有customer_unit_alias_id，即一customer_unit对多customer_unit_aliases，则用customer_unit_id
                                            #Salecase的属性里也没有customer_unit_id，但因为多对多，所以还是用id

                                            #binding.pry
                                            #p model_name
                                            #p join_table_queue_array
                                            #p join_table_queue_array[0]
                                            #p "XXXXXXXXXXXX"
                                            #p "collect_id_array 是 #{collect_id_array}"
                                            #p "model_name 是 #{model_name}"
                                            #p "join_table_queue_array 是 #{join_table_queue_array}"
                                            #p "table_name 是 #{table_name}"
                                            #binding.pry

                                            if (model_name.constantize.reflections[join_reflection_queue_array[0].pluralize.to_sym].blank?\
                                             && model_name.constantize.reflections[join_reflection_queue_array[0].singularize.to_sym].blank?)
                                                collect_id_array << "#{table_name.singularize}_id"
                                            else
                                                collect_id_array << "id"
                                            end

                                            #if model_name.constantize.column_names.include?("#{join_reflection_queue_array[0]}_id")
                                            #    collect_id_array << "id"
                                            #else
                                            #    collect_id_array << "#{table_name.singularize}_id"
                                            #end
                                            #p "运算完后 collect_id_array 是 #{collect_id_array}"
                                        #collect_id_array << "id"
                                        #collect_id_array << "#{table_name.singularize}_id"
                                        #collect_id_array << "#{join_table_queue_array[0].singularize}_id"
                                        else
                                            #其它情况，比如在Customer里查customer_unit的别称，长的：["customer_unit", "customer_unit_alias", "unit_alias"]
                                            #事实上不太可能大于3层（先看看吧）
                                            #binding.pry
                                            #p "join_table_queue_array 是 #{join_table_queue_array}，长度大于2"
                                            #p "model_name是#{model_name}"
                                            #p "collect_id_array 是 #{collect_id_array}"
                                            #p "join_reflection_queue_array 是 #{join_reflection_queue_array}"
                                            #p "table_name 是 #{table_name}"
                                            #binding.pry
                                            if (join_table_queue_array[-2].singularize.camelize.constantize.reflections[join_reflection_queue_array[-3].pluralize.to_sym].blank?\
                                             && join_table_queue_array[-2].singularize.camelize.constantize.reflections[join_reflection_queue_array[-3].singularize.to_sym].blank?)
                                                collect_id_array << "#{join_table_queue_array[-2].pluralize}.id"
                                            else
                                                collect_id_array << "#{join_table_queue_array[-2]}.#{join_table_queue_array[-3].singularize}_id"
                                            end

                                            search_table_array << join_table_queue_array[-2].pluralize
                                            search_model_array << join_table_queue_array[-2].singularize.camelize
                                            search_field_array << join_table_queue_array[-1]
                                            #collect_id_array << "#{join_reflection_queue_array[-3]}_id"
                                            include_table_hash = join_reflection_queue_array[0..-2].to_link_table_hash
                                            #p "运算完后 collect_id_array 是 #{collect_id_array}"
                                    end
                                end
                                #p search_table_array
                                #search_table_array.uniq!
                                #p search_table_array
                                #p search_model_array
                                #p search_field_array
                                #p collect_id_array
                                #p include_table_hash
                                #binding.pry
                                #来源是多张表的时候用“+”然后uniq效率高；来源是同一张表的时候用“or”或者“in”效率高
                                if search_table_array.uniq.size > 1
                                    #binding.pry
                                    id_array = []
                                    search_table_array.each_with_index do |search_table, index|
                                        #binding.pry
                                        search_model = search_model_array[index].constantize
                                        search_field = search_field_array[index]
                                        collect_id = collect_id_array[index]
                                        #模型名.where("表名.字段名 条件").pluck(要取的id)
                                        #p search_table_array
                                        #p search_model_array
                                        #p search_field_array
                                        #p collect_id_array
                                        #p include_table_hash
                                        #binding.pry
                                        #begin
                                        #    search_model.where("#{search_table}.#{search_field} like ?", "%#{i_filter['value']}%").pluck(collect_id.to_sym)
                                        #rescue ActiveRecord::StatementInvalid#: Mysql2::Error
                                        #    id_array += []
                                        #else
                                            id_array += search_model.where("#{search_table}.#{search_field} like ?", "%#{i_filter['value']}%").pluck(collect_id.to_sym)
                                        #end
                                    end
                                    id_array.uniq!
                                    if id_array.blank?
                                        #如果结果是空，则返回空
                                        result = result.where("1=2")
                                    else
                                        #否则才返回值
                                        question_array = id_array.map{"?"}.join(",")
                                        result = result.where("#{search_table_array[0].pluralize}.id in (#{question_array})", *id_array).includes(include_table_hash)

                                    end
                                else
                                    repeat_array = ["%#{i_filter['value']}%"] * probably_part_array.length
                                    result = result.where(probably_part_array.map{|p| "#{search_table_array[0].pluralize}.#{p} like ?"}.join(" or "), *repeat_array).includes(include_table_hash)
                                end
                            else
                                #无链式关联表，平级的or
                                probably_part_array = i_filter['field'].split("|")
                                repeat_array = ["%#{i_filter['value']}%"] * probably_part_array.length
                                result = result.where(probably_part_array.map{|p| "#{p} like ?"}.join(" or "), *repeat_array)
                            end
                        else
                            #没有or，只查单字段
                            #binding.pry
                            if i_filter['field'].split(">").size > 1
                                #有链式关联表，直接对这个链进行处理
                                join_table_queue_array = i_filter['field'].split(">")
                                where_table_array = []
                                #binding.pry

                                join_table_queue_array[0..-2].each_with_index do |reflection, index|
                                    if index == 0
                                        last_model = self
                                    else
                                        last_model = eval(join_table_queue_array[index - 1].singularize.camelize)
                                    end
                                    class_name = last_model.reflections[reflection.to_sym].class_name
                                    if class_name.nil?
                                        where_table_array << last_model.reflections[reflection.to_sym].plural_name
                                    else
                                        where_table_array << last_model.reflections[reflection.to_sym].class_name.underscore.pluralize
                                    end
                                end

                                search_table = where_table_array[-1]
                                search_field = join_table_queue_array[-1]
                                join_table = join_table_queue_array[0..-2].to_link_table_hash
                                result = result.includes(join_table)
                            else
                                #连链式关联都没有，直接查当前表
                                search_table = table_name.pluralize
                                search_field = i_filter['field']
                            end

                            case i_filter['type']
                                when 'string'
                                    result = result.where(["#{search_table}.#{search_field} like ?", "%#{i_filter['value']}%"])
                                when 'list'
                                    #判断是不是要去“特殊表”里查
                                    special_table = %w(users vendor_units)
                                    #binding.pry
                                    reflection = i_filter['field'].split(">")[-2]
                                    if special_table.include?(search_table)
                                        #binding.pry
                                        #如果在特殊表里，则用SQL写筛选
                                        table_alias_with_index = "tt#{index}"
                                        in_array = i_filter['value'].split(",")
                                        in_str = in_array.map{"?"}.join(",")

                                        #进来的参数是field，值类似“business>id”这样，用的是关联名，要得到它的foreign_key
                                        #但又有两种情况，一种是多对一，无through；一种是多对多，有through
                                        if !self.reflections[reflection.to_sym].source_reflection.blank?
                                            #多对多
                                            #期望的SQL是这样：
                                            ##################################################################################
                                            #SELECT
                                            #vendor_units.`name`
                                            #FROM
                                            #  vendor_units
                                            #LEFT OUTER JOIN purchasers_vendor_units ON vendor_units.id = purchasers_vendor_units.vendor_unit_id
                                            #LEFT OUTER JOIN users ON purchasers_vendor_units.user_id = users.id
                                            #WHERE
                                            #  users.id IN (2, 37)
                                            ##################################################################################
                                            #再加上“AS”防止重名
                                            through_table = self.reflections[reflection.to_sym].options[:through].to_s
                                            through_table_alias_with_index = "tth#{index}"
                                            through_field = self.reflections[reflection.to_sym].through_reflection.options[:foreign_key]
                                            original_field = self.reflections[reflection.to_sym].source_reflection.plural_name.singularize + "_id"

                                            join_condition = "LEFT OUTER JOIN #{through_table} AS #{through_table_alias_with_index} ON #{through_table_alias_with_index}.#{through_field} = #{table_name}.id "
                                            join_condition += "LEFT OUTER JOIN #{search_table} AS #{table_alias_with_index} ON #{through_table_alias_with_index}.#{original_field} = #{table_alias_with_index}.id"
                                            #foreign_key = self.reflections[reflection.to_sym].source_reflection.plural_name.singularize + "_id"
                                            #join_condition = "LEFT OUTER JOIN #{search_table} AS #{table_alias_with_index} ON #{table_alias_with_index}.id = #{table_name}.#{foreign_key}"
                                            #
                                            where_condition = "#{table_alias_with_index}.id in (#{in_str})"
                                        else
                                            #多对一
                                            if self.reflections[reflection.to_sym].options[:foreign_key].nil?
                                                #如果没有重新命名，则foreign_key是关联名 + "_id"
                                                foreign_key = reflection + "_id"
                                            else
                                                #如果关联重新命名过了，则就是foreign_key本身
                                                foreign_key = self.reflections[reflection.to_sym].options[:foreign_key]
                                            end
                                            join_condition = "LEFT OUTER JOIN #{search_table} AS #{table_alias_with_index} ON #{table_alias_with_index}.id = #{table_name}.#{foreign_key}"

                                            where_condition = "#{table_alias_with_index}.id in (#{in_str})"
                                        end
                                        result = result.joins(join_condition).where(where_condition, *in_array)
                                    else
                                        #不在，用ActiveRecord写
                                        list_array = i_filter['value'].split(",")
                                        result = result.where("#{search_table}.#{search_field} in (#{list_array.map { |p| "?" }.join(",")})", *list_array)
                                    end
                                when 'numeric'
                                    result = result.where("#{search_table}.#{search_field} #{comparison} #{i_filter['value']}")
                                when 'date'
                                    #binding.pry
                                    result = result.where(["#{search_table}.#{search_field} #{comparison} ?", "#{i_filter['value']}"])
                                else

                            end
                        end
                    end

                    #binding.pry

                    #eval(self.model_name).reflections["customer_unit"]

                    #if filter_field_array.size > 1
                    #    #要跨表时，includes/joins的是映射名，但where/order语句里是实际表的名称，所以要处理一下
                    #    #binding.pry
                    #    #映射在前，实际表在后，中间用“:”连接
                    #    #分成两个表
                    #    join_table_queue_array = []
                    #    where_table_array = []
                    #    filter_field_array[0..-2].each { |p|
                    #        if p.split(":").size > 1
                    #            #如果有冒号分隔，说明二者不一样
                    #            join_table_queue_array << p.split(":")[0]
                    #            where_table_array << p.split(":")[1]
                    #        else
                    #            join_table_queue_array << p
                    #            where_table_array << p
                    #        end
                    #    }
                    #
                    #    join_table = join_table_queue_array.to_link_table_hash
                    #    search_table = where_table_array[-1].pluralize
                    #    result = result.includes(join_table)
                    #else
                    #    search_table = table_name.pluralize
                    #end
                    ##最后一项表示字段
                    #search_field = filter_field_array[-1]
                    #binding.pry
                    ##
                    ##Quote.where("b_users.id = 2").joins("left outer join users as b_users on b_users.id = quotes.business_user_id").where("s_users.id = 38").joins("left outer join users as s_users on s_users.id = quotes.sale_user_id").size
                    ##

                    #case i_filter['type']
                    #    #when 'string'
                    #    #    result = result.where("#{search_table}.#{search_field} like ?", "%#{i_filter['value']}%")
                    #    when 'list'
                    #        list_array = i_filter['value'].split(",")
                    #        result = result.where("#{search_table}.#{search_field} in (#{list_array.map{|p| "?"}.join(",")})", *list_array)
                    #    when 'numeric'
                    #        result = result.where("#{search_table}.#{search_field} #{comparison} #{i_filter['value']}")
                    #    when 'date'
                    #        #binding.pry
                    #        result = result.where("#{search_table}.#{search_field} #{comparison} ?", "#{i_filter['value']}")
                    #    else
                    #
                    #end
                end
            else
                result = self.where(true)
            end
            #binding.pry
            return result
        end

        #按页面传来的排序方式远程排序，含跨表
        def self.updated_sort_by(sort, user_id)
            #binding.pry
            if sort
                sort_hash = JSON.parse(sort)[0] #不会有多重排序……
                if sort_hash['property'].include?("|")
                    #凡是要跨表或者要多态的就不排序了，排也没什么意义，能过滤就行了
                    result = self.where(true)
                else
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
                end
            else
                #没有sort的时候默认排序
                if table_name == "salecases"
                    #个案的默认排序是“最近联系时间”
                    #result = self.where(true).order("salelogs.contact_at DESC").includes(:salelogs)
                    result = self.where(true).order("salecases.updated_at DESC")
                elsif table_name == "personal_messages"
                    #消息的默认排序是：先自己的(主要是Admin)，再“未读”在前，其余的按id倒序
                    result = self.where(true).order("personal_messages.receiver_user_id <> #{user_id}").order("personal_messages.read_at is not null").order("personal_messages.id DESC")
                elsif table_name == "service_logs"
                    #维修日志的默认排序是“inner_id”
                    result = self.where(true).order("service_logs.inner_id DESC")
                else
                    #其它的是id
                    result = self.where(true).order("#{table_name.pluralize}.id DESC")
                end
            end
            return result
        end


        #创建新编号，至少报价、个案、合同可以用，所以公用出来
        def self.gen_new_number_with_letter(letter)
            #binding.pry
            #不按年份断开了，直接递增
            #now_year = Time.now.strftime("%y")
            if self.where("1 = 1").size == 0
                return "#{letter}1300001"
            else
                max_number = self.order("number").last.number
                return "#{letter}13#{"%05d" % (max_number[3..-1].to_i + 1)}"
            end


            #if self.where("number like ?", "%#{now_year}%").size == 0
            #    #如果没有今年的数据，则它就是001
            #    return letter + now_year + "00001"
            #else
            #    #如果有，取最大的加一
            #    max_number = self.order("number").last.number
            #    return max_number[0..2].to_s + "%05d" % (max_number[3..-1].to_i + 1)
            #end
        end
    end
end

