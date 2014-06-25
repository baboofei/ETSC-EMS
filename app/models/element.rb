#encoding: UTF-8
class Element < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :description, :element_id, :function_id, :default_value, :invisible_to_ids

    belongs_to :function

    #元素对角色可见不可用的多对多关系
    has_many :elements_disable_roles, :class_name => "ElementsDisableRole", :foreign_key => :element_id
    has_many :disable_to_roles, :through => :elements_disable_roles, :source => :disable_to

    #元素对角色不可见的多对多关系
    has_many :elements_invisible_roles, :class_name => "ElementsInvisibleRole", :foreign_key => :element_id
    has_many :invisible_to_roles, :through => :elements_invisible_roles, :source => :invisible_to

    #对某用户不可见
    scope :invisible_to, lambda {|user_id| where("users.id = ?", user_id).includes(:invisible_to_roles => :users)}
    #对某用户可见不可用
    scope :disable_to, lambda {|user_id| where("users.id = ?", user_id).includes(:disable_to_roles => :users)}

    #某元素对某用户可见与否
    def is_invisible_to_user?(user_id)
        !is_visible_to_user?(user_id)
    end
    def is_visible_to_user?(user_id)
        is_visible = false
        role_ids = User.find(user_id).roles.map(&:id)
        role_ids.each do |role_id|
            #不存在“不可见元素|角色”的数据，则是可见
            if ElementsInvisibleRole.where("element_id = ? and invisible_role_id = ?", self.id, role_id).size == 0
                is_visible = true
                break
            end
        end
        is_visible
    end

    #某元素对某用户可用与否
    def is_disable_to_user?(user_id)
        !is_enable_to_user?(user_id)
    end
    def is_enable_to_user?(user_id)
        is_enable = false
        role_ids = User.find(user_id).roles.map(&:id)
        role_ids.each do |role_id|
            #不存在“不可用元素|角色”的数据，则是可用
            if ElementsDisableRole.where("element_id = ? and disable_role_id = ?", self.id, role_id).size == 0
                is_enable = true
                break
            end
        end
        is_enable
    end

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
            table = table_name

            filter_json.each do |filter|
                keyword = filter["value"]
                field = filter["field"]

                #各种特殊情况
                #“功能名称”栏，跨表
                if field == "function_name"
                    table = "functions"
                    field = "name"
                end

                fore_condition_array << "#{table}.#{field} like ?"
                back_condition_array << "%#{keyword}%"
                table = table_name#加多重表后要重置
            end
            conditions = (fore_condition_array.join(" and ")).split("~~~") + back_condition_array#split("~~~")，一秒变数组

            # 对应上面跨表的判断
            condition_str = conditions[0]
            if condition_str =~ /functions/
                include_tables << :function
            end
        else
            conditions = true
        end
        if params[:sort]
            sort_json = JSON.parse(params[:sort])[0]#目前只要单项排序，先这样用着
            if sort_json['property'] == 'function_name'
                sort_json['property'] = 'functions.name'
                include_tables << :function
            end
            sort = "#{sort_json['property']} #{sort_json['direction']}"
        end
        return where(*conditions).includes(*include_tables).order(*sort)
    end

    def for_grid_json
        attr = attributes
        attr[:function_name] = self.function.name
        attr[:disable_to_names] = self.disable_to_roles.map(&:name).join("、")
        attr[:disable_to_ids] = self.disable_to_roles.map(&:id).join("|")
        attr[:invisible_to_names] = self.invisible_to_roles.map(&:name).join("、")
        attr[:invisible_to_ids] = self.invisible_to_roles.map(&:id).join("|")
        attr
    end

    def self.get_all_privileges(user_id)
        hash = {}
        Element.where(true).each do |el|
            hash_1 = {}
            hash_1[:hidden] = el.is_invisible_to_user?(user_id)
            hash_1[:disabled] = el.is_disable_to_user?(user_id)
            hash_1[:default] = el.default_value
            hash[el.element_id.to_sym] = hash_1
        end
        return hash
    end
end
