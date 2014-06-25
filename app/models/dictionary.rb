class Dictionary < ActiveRecord::Base
    attr_accessible :available, :data_type, :value, :display
    scope :available, where(:available => 1)

    def for_list_json
        attributes
    end
end
