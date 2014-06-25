# encoding: utf-8
class SerialRelationship < ActiveRecord::Base
    attr_accessible :main_serial_id, :related_serial_id

    #has_many :related_serials, :class_name => 'Serial', :foreign_key => :superior
    #has_many :related_serials, :class_name => "Serial", :foreign_key => "superior"
    #belongs_to :main_serial, :class_name => "Serial", :foreign_key => "superior"
    belongs_to :main_serial, :class_name => "Serial"
    belongs_to :related_serial, :class_name => "Serial"
end
