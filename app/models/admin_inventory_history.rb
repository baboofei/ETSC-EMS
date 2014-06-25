# encoding: utf-8
class AdminInventoryHistory < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :act_at, :act_type, :user_id, :before_inventory_id, :after_inventory_id, :natural_language
    belongs_to :before_admin_inventory, :class_name => "AdminInventory", :foreign_key => "before_inventory_id"
    belongs_to :after_admin_inventory, :class_name => "AdminInventory", :foreign_key => "after_inventory_id"

    def for_grid_json(user_id)
        attr = attributes
        attr
    end

    def self.create_with(params, user_id)
        item_history = AdminInventoryHistory.new

        fields_to_be_updated = %w(act_at before_inventory_id after_inventory_id user_id act_type project natural_language).map{|p| p.to_sym}
        fields_to_be_updated.each do |field|
            item_history[field] = params[field]
        end
        item_history.save

        return {success: true}
    end

    def self.export_excel(params, user_id)

        #binding.pry
        #data = where("admin_inventory_histories.user_id = 37").where(["admin_inventory_histories.act_type = ? or admin_inventory_histories.act_type = ?", "buy_in", "reject"])
        data = where("admin_inventory_histories.user_id = #{user_id}").where(["admin_inventory_histories.act_type = ? or admin_inventory_histories.act_type = ?", "buy_in", "reject"])
        unless params["start_at"].blank? && params["end_at"].blank?
            data = data.where(["admin_inventory_histories.created_at >= ? and admin_inventory_histories.created_at <= ?", "#{params["start_at"]}", "#{params["end_at"]}"])
        end

        unless params["vendor_unit_ids"].blank?
            vendor_unit_array = params["vendor_unit_ids"].split("|")
            vendor_unit_str = "(#{vendor_unit_array.map{"?"}.join(",")})"
            data = data.where(["vendor_units.id in #{(vendor_unit_str)}", *vendor_unit_array]).includes(:after_admin_inventory => :bought_from)
        end
        data = data.where(["material_codes.name like ? or admin_inventories.name like ? or admin_inventories.model like ? or admin_inventories.description like ?", "%#{params["keyword"]}%", "%#{params["keyword"]}%", "%#{params["keyword"]}%", "%#{params["keyword"]}%"]).includes(:after_admin_inventory => :material_code)
        unless (params["min_unit_price"].blank? || params["min_unit_price"].to_i == 0) && (params["max_unit_price"].blank? || params["max_unit_price"].to_i == 0)
            data = data.where(["admin_inventories.rmb >= ? and admin_inventories.rmb <= ?", "#{params["min_unit_price"]}", "#{params["max_unit_price"]}"])
        end
        require 'spreadsheet'
        file_time_stamp = "#{Date.today.strftime("%Y-%m-%d")}-#{(Time.now.to_f*1000).to_i % 100000}"
        file_name = "#{Rails.root}/public/stock_in/#{file_time_stamp}.xls"
        attachment_array = []

        book = Spreadsheet::Workbook.new
        sheet = book.create_worksheet

        #sheet.row(0).concat %w{Name Country Acknowlegement}
        #sheet[1,0] = 'Japan'
        #row = sheet.row(1)
        #row.push 'Creator of Ruby'
        #row.unshift 'Yukihiro Matsumoto'
        #sheet.row(2).replace [ 'Daniel J. Berger', 'U.S.A.',
        #                        'Author of original code for Spreadsheet::Excel' ]
        #sheet.row(3).push 'Charles Lowe', 'Author of the ruby-ole Library'
        #sheet.row(3).insert 1, 'Unknown'
        #sheet.update_row 4, 'Hannes Wyss', 'Switzerland', 'Author'

        sheet.row(0).concat %w(操作类型 名称 型号 描述 数量 单位 单价 RMB单价 供应商 入库时间 备注)
        #binding.pry
        1.upto(data.size) { |i|
            history = data[i - 1]
            item = history.after_admin_inventory

            act_type = history.act_type
            if item.blank?
                #防脏数据
                name = history.natural_language
                model = ""
                description = ""
                quantity = ""
                count_unit = ""
                buy_price = ""
                rmb = ""
                vendor_unit = ""
                comment = ""
            else
                name = item.name
                model = item.model
                description = item.description
                quantity = history.natural_language.split("，")[0].match(/.*(?:\d+-\d+-\d+).*?(\d+(?:\.\d+)?).*/)[1]
                count_unit = item.count_unit
                buy_price = item.buy_price
                rmb = item.rmb
                vendor_unit = item.bought_from.blank? ? "" : item.bought_from.name
                comment = item.comment
            end
            created_at = history.act_at.strftime("%Y-%m-%d")
            sheet.update_row i, *%W(#{act_type} #{name} #{model} #{description} #{quantity} #{count_unit} #{buy_price} #{rmb} #{vendor_unit} #{created_at} #{comment})
        }
        book.write file_name
        attachment_array << file_name

        to_user = User.find(user_id)
        UserMailer.purchase_list_xls_email(to_user, "采购清单", attachment_array).deliver

        return {success: true, message: "导出Excel成功并已发送至你的邮箱，请查收邮件！"}
    end
end
