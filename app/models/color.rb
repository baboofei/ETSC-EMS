class Color < ActiveRecord::Base
    attr_accessible :name
    has_one :calendar

    #颜色和用户多对多
    has_many :colors_users, :class_name => 'ColorsUser', :foreign_key => :color_id
    has_many :used_by, :through => :colors_users, :source => :user

    def for_combo_json
        attr = attributes
        attr['title'] = used_by[0].name
        attr['color'] = id
        attr
    end
end
