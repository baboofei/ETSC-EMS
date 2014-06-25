# encoding = utf-8
class MaterialCode < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :code, :name, :description, :manager_audit_amount, :vp_audit_amount

    has_many :admin_items, :class_name => 'AdminInventory', :foreign_key => 'inventory_type'

    def self.query_by(query)
        where("name like ? or code like ? or description like ?", "%#{query}%", "%#{query}%", "%#{query}%")
    end

    def for_grid_json
        attr = attributes
        attr
    end

    def for_combo_json
        attr = attributes
        attr['actually_name'] = "#{name}"
        attr['name'] = description.blank? ? ("#{name}[#{code}]") : ("#{name}[#{code}] [#{description}]")
        attr
    end

    def self.create_or_update_with(params, user_id)
        item = "物料编码"
        #binding.pry
        if !params[:id].blank?
            #修改时判断重名要看code和id
            #但如果是直接选出来的，name是一个整数，这时候必然不通过
            if ((params[:name].to_i != 0) && (params[:name].to_i == params[:name].to_f)) || (MaterialCode.where("code = ? and id != ?", params[:code], params[:id]).size > 0)
                return {:success => false, :message => $etsc_duplicate_material_code}
            else
                material_code = MaterialCode.find(params[:id])
                message = $etsc_update_ok
            end

            fields_to_be_updated = %w(name code description)
            fields_to_be_updated.each do |field|
                material_code[field] = params[field]
            end
        else
            #新增时判断重名只看code
            if MaterialCode.where("code = ?", params[:code]).size > 0
                return {:success => false, :message => $etsc_duplicate_material_code}
            else
                material_code = MaterialCode.new
                message = $etsc_create_ok
            end

            fields_to_be_updated = %w(code description)
            fields_to_be_updated.each do |field|
                material_code[field] = params[field]
            end

            #如果是直接选出来的，传过来的是个id，要查找此id对应的name
            if (params[:name].to_i != 0) && (params[:name].to_i == params[:name].to_f)
                #binding.pry
                material_code['name'] = MaterialCode.find(params[:name]).name
            else
                material_code['name'] = params[:name]
            end
        end

        #从字典表中找到对应的审批金额，跟着编码走
        #除了设备类，其余都算工具/材料类
        if params[:code].match(/^ZBDV/).blank?
            material_code.manager_audit_amount = Dictionary.where("data_type = ? and display = ?", "material_code_audit_amount", "工具/材料-经理审批")[0].value
            material_code.vp_audit_amount = Dictionary.where("data_type = ? and display = ?", "material_code_audit_amount", "工具/材料-副总审批")[0].value
        else
            material_code.manager_audit_amount = Dictionary.where("data_type = ? and display = ?", "material_code_audit_amount", "设备-经理审批")[0].value
            material_code.vp_audit_amount = Dictionary.where("data_type = ? and display = ?", "material_code_audit_amount", "设备-副总审批")[0].value
        end
        material_code.save

        return {:success => true, :message => "#{item}#{message}", :id => material_code.id}
    end

    def self.ask_for_new_code_with(params)
        #binding.pry
        #先砍掉最后一个“-XXXXX”去数据库里找
        name = params['name']
        type_of_material = name.split("-")[0..-2].join("-")
        founded_codes = MaterialCode.where("name like ?", "#{type_of_material}-%")
        if founded_codes.size > 0
            #找到了就取它的最大编号加1
            max_code_number = founded_codes.map{|p| p.code}.max
            new_code_number = "#{max_code_number[0..-5]}#{"%04d" % (max_code_number[-4..-1].to_i + 1)}"
        else
            #binding.pry
            #找不到就再去掉最后一个“-XXXXX”再找
            type_of_material = type_of_material.split("-")[0..-2].join("-")
            founded_codes = MaterialCode.where("name like ?", "#{type_of_material}-%")
            if founded_codes.size > 0
                #找到了就取第四级的最大编号加1，第五级变成0001
                max_code_number = founded_codes.map{|p| p.code[0..-5]}.max
                new_code_number = "#{founded_codes[0].code[0..-8]}#{"%03d" % (max_code_number[-3..-1].to_i + 1)}0001"
            else
                #再找不到就……我也不知道怎么办了，说明分类有严重问题，报个错吧
                new_code_number = "?????????????"
            end
        end
        #binding.pry
        return {:success => true, :new_code_number => new_code_number}
    end
end
