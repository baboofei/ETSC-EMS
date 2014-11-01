class Series < ActiveRecord::Base
    attr_accessible :application_in_site, :brief, :description, :feature, :is_display, :is_recommend, :name, :parameter_in_site, :sort_by_application_id, :sort_by_function_id, :user_id
end
