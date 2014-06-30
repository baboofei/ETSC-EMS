class BasicController < ApplicationController
  def terry_tree
    respond_to do |format|
      format.json {
        array = generate_tree(session[:user_id])
        render :text => array.to_json
      }
    end
  end

  def generate_tree(user_id)
    #生成左边树的列表对应的JSON

    if user_id
      #用户的角色的功能权限，则显示
      current_roles = User.find(user_id).role_ids
      permissions = Permission.where("unit_id" => current_roles).where("unit_type = 'Role'")
      #用户的部门的功能权限，则显示
      current_depts = User.find(user_id).department_ids
      permissions += Permission.where("unit_id" => current_depts).where("unit_type = 'Department'")
      #用户自己的功能权限
      permissions += Permission.where("unit_type = 'User' and unit_id = ?", user_id)
      permissions = permissions.uniq

      array = []
      url = request.url.split("/")[0..2].join("/")#"http://localhost:8080"，或者"http://localhost:8011"，也可能是"http://192.168.10.8"不带端口
      pure_url = url.gsub(/:\d+$/, "")#纯URL，如http://etsc.imwork.net
      # port_number = url.scan(/\d+/)[0] || "80"#端口，没有就取成80。备用
      # binding.pry
      for permission in permissions
        function = permission.function
        # url_action = function.url.gsub(/:\d+/, "")#/event_images这样的操作。备用
        #然后判断，如果冒号后面是8011，则后面先加url再加userid=xx，如果不是则后面只加数据库里取得的url
        new_url = pure_url + ((function.url =~ /^:8011/ || function.url =~ /^:3000/) ? (function.url + "?userid=" + session[:user_id].to_s) : function.url)
        array << {
          "text" => function.name,
          "leaf" => true,
          "href" => new_url,
          "iconCls" => function.icon_class,
          "id" => function.id
        }
      end
#      user = User.find(user_id)
#      roles = user.roles
#      block_ids =[]
#      for role in roles
#        for func in role.functions
#          block_ids << func.block_id
#        end
#      end
#      #      block_ids.uniq!#下面有最终的uniq，这里不用要了
#      blocks = block_ids.map{|p| Block.find(p)}
#      #TODO 这里应该要像下面这行一样写权限，但权限功能好像变得跟以前不一样了，写死再说
##      Block.where("users.id = ?", user_id).includes({:functions => {:roles => :users}}).size
##      for block in blocks
##        array << eval("{'text' => '"+block.name+"', 'leaf' => true, 'href' => '/"+block.controller_name+"', 'id' => "+block.id.to_s+"}")
##      end
#      array << eval("{'text' => '公用联系人管理', 'leaf' => true, 'href' => '/pops', 'id' => 48}")#TODO 这些应该也是写到循环里的，但先凑合这样用
#      array << eval("{'text' => '客户管理', 'leaf' => true, 'href' => '/customers', 'iconCls' => 'function_customer'}")
#      array << eval("{'text' => '客户单位管理', 'leaf' => true, 'href' => '/customer_units', 'iconCls' => 'function_customer_unit'}")
#      array << eval("{'text' => '产品管理', 'leaf' => true, 'href' => '/products', 'iconCls' => 'function_product'}")
#      array << eval("{'text' => '产品系列管理', 'leaf' => true, 'href' => '/serials', 'iconCls' => 'function_serial'}")
#      array << eval("{'text' => '产品附件管理', 'leaf' => true, 'href' => '/product_images', 'iconCls' => 'function_accessory'}")
#      array << eval("{'text' => '解决方案管理', 'leaf' => true, 'href' => '/solutions', 'id' => 59}")
#      array << eval("{'text' => '个案管理', 'leaf' => true, 'href' => '/sale_cases', 'id' => 52}")
#      array << eval("{'text' => '报价管理', 'leaf' => true, 'href' => '/quotes', 'iconCls' => 'function_quote'}")
#      array << eval("{'text' => '合同管理', 'leaf' => true, 'href' => '/contracts', 'id' => 56}")
#      array << eval("{'text' => '事宜管理', 'leaf' => true, 'href' => '/work_tasks', 'id' => 53}")
#      array << eval("{'text' => '消息管理', 'leaf' => true, 'href' => '/personal_messages', 'id' => 57}")
#      array << eval("{'text' => '网站新闻管理', 'leaf' => true, 'href' => '/events', 'iconCls' => 'function_event'}")
#      array << eval("{'text' => '网站新闻图片管理', 'leaf' => true, 'href' => '/event_images', 'iconCls' => 'function_event_image'}")
#      array << eval("{'text' => '进出口公司管理', 'leaf' => true, 'href' => '/business_units', 'id' => 63}")
#      array << eval("{'text' => '进出口联系人管理', 'leaf' => true, 'href' => '/business_contacts', 'id' => 64}")
#      array << eval("{'text' => '销售工作日志管理', 'leaf' => true, 'href' => 'http://192.168.10.8:8011/etsc/salecase/newindex.jsp?userid='+session[:user_id].to_s, 'id' => 51}")
    end
    return array#.uniq_by { |i| i["text"] }
  end
end
