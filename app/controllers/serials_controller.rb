class SerialsController < ApplicationController
  include ActionView::Helpers::TextHelper
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"

  #保存指定产品系列的关键字
  def save_keywords(serial_id, keywords)
    #先把此产品对应的产品关键字关联全删光
    KeywordsSerial.delete_all(["serial_id = ?", serial_id])
    keyword_array = keywords.multi_split
    #每一个查一下数据库里是否已经有
    for keyword in keyword_array
      if k = Keyword.find_by_keyword(keyword)
        #如果找到有相同的则取出此关键字的id备用
        k_id = k.id
      else
        #如果没有相同的就new一个关键字，同样取出其id备用
        k = Keyword.new(:keyword => keyword)
        k.save
        k_id = k.id
      end
      #在KeywordsSerial表里分别保存二者的id
      keyword_serial = KeywordsSerial.new
      keyword_serial.keyword_id = k_id
      keyword_serial.serial_id = serial_id
      keyword_serial.save
    end
  end

  #保存指定产品系列的包含产品，注意一个产品只能属于一个系列
  def save_product_ids(serial_id, products_ids)
    product_id_array = (products_ids.blank? ? [] : products_ids.split("|"))
    for product_id in product_id_array
      Product.find(product_id).update_attribute("serial_id", serial_id)
    end
  end

  #保存指定系列和相关系列间的从属关系
  def save_serial_ids(serial_id, serials_ids)
    serial_id_array = (serials_ids.blank? ? [] : serials_ids.split("|"))
    SerialRelationship.delete_all(["main_serial_id = ?", serial_id])
    for related_serial_id in serial_id_array
      serial_relationship = SerialRelationship.new("main_serial_id" => serial_id, "related_serial_id" => related_serial_id)
      serial_relationship.save
    end
  end

  def gen_serial_paginate_json(start,limit,keyword,sort="id",dir="DESC")
    #生成产品系列列表的分页JSON
    serial_json = []
    if keyword.blank?
      #没有关键字，那就是全部
      total_records = Serial.all
      serials = Serial.limit(limit.to_i).offset(start.to_i).order(sort + " " + dir)
    else
      #先把关键字按空格切分，全角半角都算，取前五个
      keywords = keyword.split("　").join(" ").split(" ")[0..4]
      #如果关键字中有一个“+”，则按and来计算，否则就算or
      if keywords.index("+")
        joint = "and"
        keywords = keywords-["+"]
      else
        joint = "or"
      end
      #参与查找的字段
      columns = %w(name brief description application_in_site parameter_in_site feature)
      fore_conditions_keyword = []#按关键字再循环后的数组
      back_conditions = []
      #先对关键字循环
      for i_keyword in keywords
        #再对字段循环
        fore_conditions_column = []#按字段循环后的数组
        for column in columns
          fore_conditions_column << "serials."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
          back_conditions << "%"+i_keyword+"%"
        end
        #以下是跨表字段，单独写
        fore_conditions_column << "products.name like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "products.model like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "products.simple_description_cn like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "products.simple_description_en like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "vendor_units.name like ?"
        back_conditions << "%"+i_keyword+"%"

        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
        fore_conditions_keyword << fore_condition_column
      end
      fore_condition = fore_conditions_keyword.join(" "+joint+" ")
      conditions = fore_condition.to_a + back_conditions
      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
      #      total_records = Serial.find(:all, :conditions => conditions, :include => [:producer])
      #      serials = Serial.find(:all,
      #        :order => "serials."+sort+" "+dir,#这里也有重名字段问题，所以一定要写前面的表名
      #        :conditions => conditions,
      #        :limit => limit,
      #        :offset => start,
      #        :include => [:producer])
      total_records = Serial.where(*conditions).includes(:products, :products => :producer)
      serials = Serial.where(*conditions).includes(:products, :products => :producer).order("serials."+sort+" "+dir).limit(limit).offset(start.to_i)
    end
    for serial in serials
      #      p serial.producer
      serial_json << gen_etsc_serial_json(serial)
    end
    {"totalRecords" => total_records.size.to_s, "data" => serial_json}
  end

  #所有大类中类小类的级别关系，并生成JSON供combotree用
  def show_prod_type_tree
    respond_to do |format|
      format.json {
        prod_type_tree = gen_prod_type_tree()
        render :text => prod_type_tree.to_json
      }
    end
  end

  def gen_prod_type_tree(dummy = nil)
    #生成产品三级列表对应的JSON
    b_array = []#用于列大类数据
    b_types = ProdBType.find(:all)
    #大类中循环
    for b_type in b_types
      m_array = []#针对每个，弄一个数组存中类数据
      m_types = b_type.prod_m_types
      #中类中循环
      for m_type in m_types
        m_is_leaf = m_type.prod_s_types.blank?#如果中类无小类，那么中类本身就是一叶子
        unless m_is_leaf
          #如果不是叶子，也就是有小类
          s_array = []#针对每个，弄一个数组存小类数据
          s_types = m_type.prod_s_types
          #小类中循环
          for s_type in s_types
            s_array << eval("{'text' => '"+s_type.name+
                "', 'id' => '"+pre_add_zero(b_type.id,3)+pre_add_zero(m_type.id,3)+pre_add_zero(s_type.id,3)+#都补满三位然后加一起，形如020 002 005
              "', 'leaf' => true}")
          end
          children = (s_array.blank?)?nil:s_array#如果小类还是为空，也就是没加进数据去，说明无children，否则就取小类数据为children
        end
        m_array << eval("{'text' => '"+m_type.name+
            "', 'id' => '"+pre_add_zero(b_type.id,3)+pre_add_zero(m_type.id,3)+#都补满三位然后加一起，形如020 002
          "', 'leaf' => m_is_leaf, 'children' => children}")
      end
      b_array << eval("{'text' => '"+b_type.name+
          "', 'id' => '"+b_type.id.to_s+
          "', 'leaf' => false, 'children' => m_array}")#大类一定会有叶子，children一定取得到
    end
    return b_array
  end

  def show_product_by_type_tree
    #响应由产品类型树找产品事件
    respond_to do |format|
      format.json {
        product_tree = gen_product_tree_by_type(params[:node_id])
        render :text => product_tree.to_json
      }
    end
  end

  def gen_product_tree_by_type(node_id)
    #因为是异步树，所以要针对传过来的不同id值做不同的事
    if node_id == "000"
      #传过来的是000，说明是根，于是返回一个大类的数组
      b_array = []
      b_types = ProdBType.find(:all)
      #对大类每个类别循环
      for b_type in b_types
        b_array << eval("{'text' => '"+b_type.name+
            "', 'id' => '"+pre_add_zero(b_type.id,3)+
            "', 'leaf' => false}")
      end
      return b_array
    elsif node_id.size == 3
      #传过来的是三位数，说明是大类，于是返回此大类下的中类数组
      b_type = ProdBType.find(node_id.to_i)
      m_array = []
      m_types = b_type.prod_m_types
      #对中类每个类别循环
      for m_type in m_types
        m_array << eval("{'text' => '"+m_type.name+
            "', 'id' => '"+pre_add_zero(b_type.id,3)+pre_add_zero(m_type.id,3)+
            "', 'leaf' => false}")
      end
      return m_array
    elsif node_id.size == 6
      #传过来是六位数，说明是中类，于是返回此中类下的小类+产品共同组成的数组
      #先是中类下的小类
      b_type = ProdBType.find(node_id[0..2].to_i)
      m_type = ProdMType.find(node_id[3..5].to_i)
      s_array = []
      s_types = m_type.prod_s_types
      #对小类每个类别循环
      for s_type in s_types
        s_array << eval("{'text' => '"+s_type.name+
            "', 'id' => '"+pre_add_zero(b_type.id,3)+pre_add_zero(m_type.id,3)+pre_add_zero(s_type.id,3)+
            "', 'leaf' => false}")
      end
      #再是中类下的产品
      products = Product.find(:all, :conditions => ["prod_m_type_id = ? and prod_s_type_id is null", m_type])
      #对每个产品循环
      for product in products
        s_array << eval("{'text' => '"+product.model+"("+product.name+")"+
            "', 'id' => '"+pre_add_zero(b_type.id,3)+pre_add_zero(m_type.id,3)+pre_add_zero(product.id,7)+
            "', 'leaf' => true}")
      end
      return s_array
    elsif node_id.size == 9
      #传过来是九位数，说明是小类，于是返回此小类下产品组成的数组
      b_type = ProdBType.find(node_id[0..2].to_i)
      m_type = ProdMType.find(node_id[3..5].to_i)
      s_type = ProdSType.find(node_id[6..8].to_i)
      s_array = []
      products = Product.find(:all, :conditions => ["prod_s_type_id = ?", s_type])
      #对每个产品循环
      for product in products
        s_array << eval("{'text' => '"+product.model+"("+product.name+")"+
            "', 'id' => '"+pre_add_zero(b_type.id,3)+pre_add_zero(m_type.id,3)+pre_add_zero(s_type.id,3)+pre_add_zero(product.id,7)+
            "', 'leaf' => true}")
      end
      return s_array
    end
  end

  def show_product_by_vendor_unit_tree
    #响应由工厂找产品事件
    respond_to do |format|
      format.json {
        product_tree = gen_product_tree_by_vendor_unit(params[:node_id])
        render :text => product_tree.to_json
      }
    end
  end

  def gen_product_tree_by_vendor_unit(node_id)
    #因为是异步树，所以要针对传过来的不同id值做不同的事
    if node_id == "000"
      #传过来的是000，说明是根，于是返回一个区域的数组(z means clime)
      z_array = []
      climes = Clime.find(:all)
      #对区域列表中每个区域循环
      for clime in climes
        z_array << eval("{'text' => '"+clime.name+
            "', 'id' => '"+pre_add_zero(clime.id,3)+
            "', 'leaf' => false}")
      end
      return z_array
    elsif node_id.size == 3
      #传过来的是三位数，说明是区域，于是返回此区域下的国家数组(c means country)
      clime = Clime.find(node_id.to_i)
      c_array = []
      countries = clime.countries
      #对国家列表中每个国家循环
      for country in countries
        c_array << eval("{'text' => '"+country.name+
            "', 'id' => '"+pre_add_zero(clime.id,3)+pre_add_zero(country.id,3)+
            "', 'leaf' => false}")
      end
      return c_array
    elsif node_id.size == 6
      #传过来是六位数，说明是国家，于是返回此国家下的工厂数组(f means factory)
      clime = Clime.find(node_id[0..2].to_i)
      country = Country.find(node_id[3..5].to_i)
      f_array = []
      factories = country.vendor_units
      #对小类每个类别循环
      for factory in factories
        f_array << eval("{'text' => '"+factory.name+(factory.short_name.blank? ? "" : "("+factory.short_name+")")+
            "', 'id' => '"+pre_add_zero(clime.id,3)+pre_add_zero(country.id,3)+pre_add_zero(factory.id,3)+
            "', 'leaf' => false}")
      end
      return f_array
    elsif node_id.size == 9
      #传过来是九位数，说明是工厂，于是返回此工厂下产品组成的数组
      clime = Clime.find(node_id[0..2].to_i)
      country = Country.find(node_id[3..5].to_i)
      factory = VendorUnit.find(node_id[6..8].to_i)
      f_array = []
      products = Product.find(:all, :conditions => ["producer_vendor_unit_id = ?", factory])
      #对每个产品循环
      for product in products
        f_array << eval("{'text' => '"+product.model+"("+product.name+")"+
            "', 'id' => '"+pre_add_zero(clime.id,3)+pre_add_zero(country.id,3)+pre_add_zero(factory.id,3)+pre_add_zero(product.id,7)+
            "', 'leaf' => true}")
      end
      return f_array
    end
  end

  def show_vendor_unit_tree
    #按地区列出销售商树
    respond_to do |format|
      format.json {
        vendor_unit_tree = gen_vendor_unit_tree_json()
        render :text => vendor_unit_tree.to_json
      }
    end
  end

  def gen_vendor_unit_tree_json(dummy=nil)
    #生成地区→国家→产品销售商三级列表
    z_array = []#用于列地区数据
    climes = Clime.find(:all)
    #在地区中循环
    for clime in climes
      c_array = []#针对每个地区，弄一个数组存其中的国家
      countries = clime.countries
      #在国家中循环
      for country in countries
        v_array = []#针对每个国家，弄一个数组存其中的厂家
        vendor_units = country.vendor_units
        #在厂家中循环
        for vendor_unit in vendor_units
          v_array << eval("{'text' => '"+vendor_unit.name+(vendor_unit.short_name.blank? ? "" : "("+vendor_unit.short_name+")")+
              "', 'id' => '"+vendor_unit.id.to_s+
              "', 'leaf' => true}")
        end
        c_array << eval("{'text' => '"+country.name+
            "', 'leaf' => false, 'children' => v_array}")
      end
      z_array << eval("{'text' => '"+clime.name+
          "', 'leaf' => false, 'children' => c_array}")
    end
    return z_array
  end

  #从JS传的产品id反向获取该产品的币种
  def get_product_currency
    product = Product.find(params[:id].to_i)
    type_name = product.currency.name
    type_id = product.currency.id
    price = product.price_to_market
    param = product.simple_description_cn
    custom_tax = product.custom_tax
    respond_to do |format|
      format.json {
        string_a = {'currency' => type_name, 'price' => price, 'param' => param, 'currency_id' => type_id, 'custom_tax' => custom_tax}
        render :text => string_a.to_json
      }
    end
  end

  #按所传参数查询系列名称，并生成JSON
  def get_name_q
    respond_to do |format|
      format.json {
        serial = gen_name_q(params[:query])
        render :text => serial
      }
    end
  end

  def gen_name_q(query)
    output_array = []
    output_serials = Serial.where("name like ? or brief like ?", "%#{query}%", "%#{query}%")
    for serial in output_serials
      output_array << {
        "serial" => serial.name,
        "id" => serial.id
      }
    end
    return output_array.to_json
  end

  #生成包含关键字的所有产品型号的JSON，以供输入时下拉提示
  def get_model_q
    respond_to do |format|
      format.json {
        model = gen_model_q(params[:query])
        render :text => model
      }
    end
  end

  def gen_model_q(query)
#    query = "" if query.blank?#
    model_array = []
#    products = Serial.where("model like ?", "%"+query.split("(")[0]+"%")#解析时不带工厂名
    products = Serial.where("model like ? or name like ?", "%#{query}%", "%#{query}%")
#    products = Serial.where("id < 5")
    for product in products
      producer_name = product.producer ? product.producer.name : ""
      model_array << {
        "model" => product.name_txt+"("+producer_name+")",
        "id" => product.id
      }
    end
    return model_array.to_json
  end

  def restful
    if request.get?
      #查
      respond_to do |format|
        format.json {
          if params[:sort].nil?
            #如果没有在表格里排序，则没有参数传回来，不管，就相当于用默认的ID降序排
            serial_json = gen_serial_paginate_json(params[:start],params[:limit],params[:keyword])#,params[:sort],params[:dir])
          else
            #如果表格里有排序，会传过来类似"[{\"property\":\"mobile\",\"direction\":\"ASC\"}]"的参数
            sort_param_hash = JSON.parse(params[:sort])
            sort = sort_param_hash[0]["property"]
            dir = sort_param_hash[0]["direction"]
            serial_json = gen_serial_paginate_json(params[:start],params[:limit],params[:keyword],sort,dir)
          end
          render :text => serial_json.to_json
        }
      end
    elsif request.put?
      #改
      data = params["data"]

      #如果有final_type_name，则将其解析成中类和小类
      #先在小类中找名字
      s_type = ProdSType.where("name = ?", data["final_type_name"])
      if s_type.size > 0
        data["prod_s_type_id"] = s_type[0].id
        #有小类，按小类所属中类写中类
        data["prod_m_type_id"] = s_type[0].prod_m_type_id
      else
        #没有小类，直接找中类
        m_type = ProdMType.where("name = ?", data["final_type_name"])
        if m_type.size > 0
          data["prod_m_type_id"] = m_type[0].id
        end
      end
      data.delete("final_type_name")

      #如果有关键字，那么进行关键字的处理
      unless data["keywords"].blank?
        save_keywords(data["id"], data["keywords"])
        data.delete("keywords")
      end

      #如果is_recommend是true，那么is_in_site也是true；如果is_in_site是false，那么is_recommend也是false
      data["is_recommend"] = false if (data["is_in_site"] == false && data["is_recommend"].blank?)
      data["is_in_site"] = true if (data["is_recommend"] == true && data["is_in_site"].blank?)

      save_product_ids(data["id"], data["products_ids"])
      save_serial_ids(data["id"], data["serials_ids"])

      #处理完毕，新增json、砍多余字段
      serial_json = []
      serial_id = data["id"]
      serial = Serial.find(serial_id)
      data.delete("id")
      data.delete("products_ids")
      data.delete("serials_ids")
      data["user_id"] = session[:user_id]
      #保存
      serial.update_attributes(data)
      data["id"] = serial_id
      serial_json << gen_etsc_serial_json(serial)
      render :text => {"success" => true, "message" => "已修改", "data" => serial_json}.to_json
    elsif request.post?
      #增
      data = params["data"]
      serial_json = []

      #如果有final_type_name，则将其解析成中类和小类
      #先在小类中找名字
      s_type = ProdSType.where("name = ?", data["final_type_name"])
      if s_type.size > 0
        data["prod_s_type_id"] = s_type[0].id
        #有小类，按小类所属中类写中类
        data["prod_m_type_id"] = s_type[0].prod_m_type_id
      else
        #没有小类，直接找中类
        m_type = ProdMType.where("name = ?", data["final_type_name"])
        if m_type.size > 0
          data["prod_m_type_id"] = m_type[0].id
        end
      end
      data.delete("final_type_name")
      data.delete("prod_m_type")
      data.delete("prod_s_type")

      #新增的话，关键字要缓一步处理，因为系列本身不保存的话得不到serial_id
      temp_keyword = data["keywords"]
      data.delete("keywords")
      temp_products_ids = data["products_ids"]
      temp_serials_ids = data["serials_ids"]
      data.delete("products_names")
      data.delete("products_ids")
      data.delete("serials_names")
      data.delete("serials_ids")

      #如果is_recommend是true，那么is_in_site也是true；如果is_in_site是false，那么is_recommend也是false
      data["is_recommend"] = false if (data["is_in_site"] == false && data["is_recommend"].blank?)
      data["is_in_site"] = true if (data["is_recommend"] == true && data["is_in_site"].blank?)

      data["user_id"] = session[:user_id]

      serial = Serial.new(data)
      serial.save
      data["id"] = serial.id

      #这时候再存关键字
      save_keywords(data["id"], temp_keyword) unless temp_keyword.blank?
      save_product_ids(data["id"], temp_products_ids)
      save_serial_ids(data["id"], temp_serials_ids)

      serial_json << gen_etsc_serial_json(serial)
      render :text => {"success" => true, "message" => "已新建", "data" => serial_json}.to_json
    end
  end

  #自定义生成所需字段的json，给“增”“改”“查”用
  def gen_etsc_serial_json(serial)
    including_products_names = serial.products.map{|p| p.name_txt + (p.producer.blank? ? "" : ("<span style='color:gray;'>("+p.producer.name.to_s+")</span>"))}.join("、")
    related_serials_names = serial.related_serials.map{|p| p.name_txt}.join("、")
    {
      "name" => serial.name,
      "brief" => serial.brief,
      "prod_m_type_id" => serial.prod_m_type_id,
      "prod_s_type_id" => serial.prod_s_type_id,
      "final_type_name" => serial.final_type_name,
      "description" => serial.description,
      "application_in_site" => serial.application_in_site,
      "parameter_in_site" => serial.parameter_in_site,
      "feature" => serial.feature,
      "keywords" => serial.keywords.map{|p| p.keyword}.join("、"),
      "is_recommend" => serial.is_recommend?,
      "is_in_site" => serial.is_in_site?,
      "products_ids" => serial.products.map{|p| p.id}.join("|"),
      "products_names" => including_products_names,
      "serials_ids" => serial.related_serials.map{|p| p.id}.join("|"),
      "serials_names" => related_serials_names,
      "id" => serial.id
    }
  end

  #判断传过来的型号在同厂家中有没有，如果没有则通过。如果是修改，则通过的同时顺便修改掉数据库
  def validate_uniqueness_of_name
    name = params["name"]
    #校验型号
    if params["serial_id"].blank?
      #没传这个值，说明是新增，直接查数据库，没有就是没有
      serial = Serial.where("name = ?", name)
    else
      #传了这个值，说明是修改，这时候要查数据库同时还要看是不是本系列(传过来的有id)
      serial = Serial.where("name = ? and id != ?", name, params["serial_id"])
    end

    if serial.size == 0
      #如果校验通过，返回OK，同时看是新增还是修改，如果是修改还要同时改数据库时的值
      if params["serial_id"].blank?
        #没传这个值，说明是新增
        render :text => {"str" => "OK"}.to_json
      else
        #传了这个值，说明是修改，改数据库再传值
        serial = Serial.find(params["serial_id"].to_i)
        serial.name = params["name"]
        serial.save
        render :text => {"str" => "OK", "name" => serial.name.blank? ? serial.brief : serial.name}.to_json
      end
    else
      #没通过，返回NO
      render :text => {"str" => "NO"}.to_json
    end
  end
end
