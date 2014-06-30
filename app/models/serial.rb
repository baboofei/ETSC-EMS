# encoding: utf-8
class Serial < ActiveRecord::Base
  attr_accessible :application_in_site, :brief, :description, :feature, :is_display, :is_recommend, :name,
                  :parameter_in_site, :type_id, :user_id

  has_many :products

  #下面是自引用+多对多的关联，对应的关联表是“SerialRelationship”
  has_many :serial_relationship, :class_name => 'SerialRelationship', :foreign_key => :main_serial_id
  has_many :related_serials, :through => :serial_relationship
  has_many :reverse_serial_relationships, :class_name => 'SerialRelationship', :foreign_key => :related_serial_id
  has_many :main_serials, :through => :reverse_serial_relationships

  def self.recent_20
    where("true").limit(20).order("id DESC")
  end
end
