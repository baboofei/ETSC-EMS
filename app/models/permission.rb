#TODO
#4.0版的采用的“多态”解决方法，5.0版应该废弃掉

class Permission < ActiveRecord::Base
  set_table_name "functions_permission"
  belongs_to :unit, :polymorphic => true

  belongs_to :function
end 