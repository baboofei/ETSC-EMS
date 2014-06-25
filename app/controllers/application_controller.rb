# encoding: utf-8
class ApplicationController < ActionController::Base
    protect_from_forgery

    $etsc_empty_data = "<span style='color:red'>数据不全，请补齐！</span>"
    $etsc_duplicate_unit_name = "<span style='color:#F00;'>已经存在此单位名称，不能重复添加！</span>"
    $etsc_duplicate_pay_mode = "<span style='color:#F00;'>已经存在此付款方式，不能重复添加！</span>"
    $etsc_duplicate_material_code = "<span style='color:#F00;'>已经存在此编码，不能重复添加！</span>"
    $etsc_create_ok = "已经新增成功！"
    $etsc_update_ok = "已经修改成功！"
    $etsc_delete_ok = "已经删除成功！"

    def download
        #binding.pry
        file = "#{Rails.root}/public/#{params[:file_type]}/#{params[:file_name]}.#{params[:format]}"
        send_file(file,:disposition => "attachment")
    end
end
