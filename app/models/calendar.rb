# encoding: utf-8
class Calendar < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :color_id, :comment, :end_at, :is_all_day, :is_private?, :remind, :start_at, :title

    belongs_to :color

    def for_combo_json
        attr = attributes
        attr['start'] = start_at
        attr['end'] = end_at
        attr['cid'] = color_id
        attr['ad'] = is_all_day?
        attr
    end

    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "日程"
        if params[:id] != 0
            calendar = Calendar.find(params[:id])
            message = $etsc_update_ok
        else
            calendar = Calendar.new
            message = $etsc_create_ok
        end

        calendar["color_id"] = params["cid"]
        calendar["title"] = params["title"]
        calendar["start_at"] = params["start"]
        calendar["end_at"] = params["end"]
        calendar["comment"] = params["notes"]
        calendar["remind"] = params["rem"]
        calendar["is_all_day"] = params["ad"]
        calendar.save

        return {success: true, message: "#{item}#{message}", data: calendar.for_combo_json}
    end

    def self.delete_with(params, user_id)
        #calendar = Calendar.find(params[:id])
        Calendar.delete(params[:id])
        return {success: true, message: "日程已经成功删除！"}
    end
end
