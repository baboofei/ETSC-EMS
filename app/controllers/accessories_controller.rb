class AccessoriesController < ApplicationController
  before_filter :authorize, :time_zone_adjust, :except => [:download_file]
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /accessories
  # GET /accessories.xml
  def index
    @accessories = Accessory.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @accessories }
    end
  end

  # GET /accessories/1
  # GET /accessories/1.xml
  def show
    @accessory = Accessory.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @accessory }
    end
  end

  # GET /accessories/new
  # GET /accessories/new.xml
  def new
    @accessory = Accessory.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @accessory }
    end
  end

  # GET /accessories/1/edit
  def edit
    @accessory = Accessory.find(params[:id])
    @url = @accessory.url
    @file_name = @url.split("/")[-1]
  end

  # POST /accessories
  # POST /accessories.xml
  def create
    @accessory = Accessory.new(params[:accessory])

    respond_to do |format|
      if @accessory.save
        format.html { redirect_to(@accessory, :notice => 'Accessory was successfully created.') }
        format.xml  { render :xml => @accessory, :status => :created, :location => @accessory }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @accessory.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /accessories/1
  # PUT /accessories/1.xml
  def update
    @accessory = Accessory.find(params[:id])

    respond_to do |format|
      if @accessory.update_attributes(params[:accessory])
        format.html { redirect_to(@accessory, :notice => 'Accessory was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @accessory.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /accessories/1
  # DELETE /accessories/1.xml
  def destroy
    @accessory = Accessory.find(params[:id])
    @accessory.destroy

    respond_to do |format|
      format.html { redirect_to(accessories_url) }
      format.xml  { head :ok }
    end
  end

  def normal_create
    @accessory = Accessory.new(params[:submit])
    respond_to do |format|
      if @accessory.save
        #拆relate_product_id，并存到accessories_products列表中去
        for product_id in params[:submit][:relate_product_id].split("|")
          accessory_product = AccessoriesProduct.new
          accessory_product.accessory_id = @accessory.id
          accessory_product.product_id = product_id.to_i
          accessory_product.save
        end

        format.html { redirect_to :action => 'index' }
        format.xml  { render :xml => @accessory, :status => :created, :location => @accessory }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @accessory.errors, :status => :unprocessable_entity }
      end
    end
  end

  def normal_update
    @accessory = Accessory.find(params[:id])
    #判断有没有改动文档，同时把旧值存下来备用
    update_file_flag = true
    old_url = @accessory.url
    #如果没有放新文档，则文档保持不变
    if params[:submit][:uploaded_file].blank?
      update_file_flag = false
      params[:submit].delete(:uploaded_file)
    end

    respond_to do |format|
      if @accessory.update_attributes(params[:submit])
        if update_file_flag
          #放了新文档，则删除旧文档
          File.delete("#{Rails.root}/public"+old_url)
        end
        #对已经选过来的产品循环，在accessories_products表中先删除文档ID对应所有数据，然后再添加相应条数据
        AccessoriesProduct.delete_all(["accessory_id = ?", params[:id]])
        for product in params[:submit][:relate_product_id].split("|")
          new_accessories_product = AccessoriesProduct.new()
          new_accessories_product.accessory_id = @accessory.id
          new_accessories_product.product_id = product.to_i
          new_accessories_product.save
        end
        format.html { redirect_to(:action => 'index') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @accessory.errors, :status => :unprocessable_entity }
      end
    end
  end


  def download_file(dummy=nil)
    accessory = Accessory.find(params[:id])
    send_file("#{Rails.root}/public"+accessory.url, :disposition => "attachment")
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
      #      if request.post?
      format.json {
        accessory_json = gen_accessory_paginate_json(params[:start].to_i,params[:limit],params[:sort],params[:dir],params[:keyword])
        render :text => accessory_json.to_json
      }
      #      elsif request.get?
      #        format.html
      #        format.json
      #      end
    end
  end

  def gen_accessory_paginate_json(start,limit,keyword,sort="id",dir="DESC")
    #生成产品附件列表的分页JSON
    accessory_json=[]
    if keyword.blank?
      #没有关键字，那就是全部
      total_records = Accessory.all
      accessories = Accessory.limit(limit.to_i).offset(start.to_i).order(sort + " " + dir)
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
      columns = %w(description)
      fore_conditions_keyword = []#按关键字再循环后的数组
      back_conditions = []
      #先对关键字循环
      for i_keyword in keywords
        #再对字段循环
        fore_conditions_column = []#按字段循环后的数组
        for column in columns
          fore_conditions_column << "accessories."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
          back_conditions << "%"+i_keyword+"%"
        end
        #以下是跨表字段，单独写
        fore_conditions_column << "products.name like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "products.model like ?"
        back_conditions << "%"+i_keyword+"%"

        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
        fore_conditions_keyword << fore_condition_column
      end
      fore_condition = fore_conditions_keyword.join(" "+joint+" ")
      conditions = fore_condition.to_a + back_conditions
      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
      total_records = Accessory.where(*conditions).includes(:products)
      accessories = Accessory.where(*conditions).includes(:products).order("accessories."+sort+" "+dir).limit(limit).offset(start.to_i)
    end
    for accessory in accessories
      accessory_json << gen_etsc_accessory_json(accessory)
    end
    {"totalRecords" => total_records.size.to_s, "data" => accessory_json}
  end

  #自定义生成所需字段的json，给“增”“改”“查”用
  def gen_etsc_accessory_json(accessory)
    relate_products_ids = accessory.products.map{|p| p.id}.join("|")
    #    if accessory.products.size > 3
    #      relate_products_names = accessory.products[0..2].map{|p| p.name_txt+"<span style='color:gray;'>("+p.producer.name.to_s+")</span>"}.join("、") + "等"
    #    else
    relate_products_names = accessory.products.map{|p| p.name_txt + (p.producer.blank? ? "" : ("<span style='color:gray;'>("+p.producer.name.to_s+")</span>"))}.join("、")
    #    end
    {
      "url" => accessory.url,
      "thumbnail_url" => accessory.thumbnail_url.blank? ? "" : accessory.thumbnail_url,
      "description" => accessory.description,
      "products_names" => relate_products_names,#是名称还是型号呢……
      "products_ids" => relate_products_ids,
      "id" => accessory.id
    }
  end

  require 'find'#文件查找模块
  def findfiles(dir, name)
    list = []
    Find.find(dir) do |path|
      Find.prune if [".",".."].include? path
      case name
      when String
        list << path if File.basename(path) == name
      when Regexp
        list << path if File.basename(path) =~ name
      else
        raise ArgumentError
      end
    end
    list
  end

  def restful
    if request.get?
      #查
      respond_to do |format|
        format.json {
          if params[:sort].nil?
            #如果没有在表格里排序，则没有参数传回来，不管，就相当于用默认的ID降序排
            accessory_json = gen_accessory_paginate_json(params[:start],params[:limit],params[:keyword])#,params[:sort],params[:dir])
          else
            #如果表格里有排序，会传过来类似"[{\"property\":\"mobile\",\"direction\":\"ASC\"}]"的参数
            sort_param_hash = JSON.parse(params[:sort])
            sort = sort_param_hash[0]["property"]
            dir = sort_param_hash[0]["direction"]
            accessory_json = gen_accessory_paginate_json(params[:start],params[:limit],params[:keyword],sort,dir)
          end
          render :text => accessory_json.to_json
        }
      end
    elsif request.put?
      #改
      data = params["data"]
      #把旧的url存下来备用(定期删，免得一堆垃圾文件)
      accessory = Accessory.find(data["id"])
      old_url = accessory.url
      old_thumb_url = accessory.thumbnail_url
      #如果有url参数，说明改过了文件
      unless data["url"].blank?
        #如果是图片的话，在临时文件夹里找到后半截是此文件名的文件，然后拿最新的一个。不是图片则直接重新上传
        is_pic = data["url"].upcase =~ /.*?\.(JPG|JPEG|GIF|PNG)/
        #如果是图片文件，则在临时文件夹里找
        file_array = findfiles "#{Rails.root}/public/files/product/accessory", /_temp\d{10}_.*?#{data["url"].upcase}/
        pure_file_name_array = file_array.map{|file_name| file_name[/_temp\d{10}.*$/]}
        thumb_file_array = pure_file_name_array.map{|file_name| file_name.sub(/(_temp\d{10})/, '\1thumb')} if is_pic
        full_thumb_file_array = thumb_file_array.map{|file_name| "#{Rails.root}/public/files/product/accessory/"+file_name} if is_pic
        file_number_array = file_array.map{|file_name| file_name[/\d{10}/].to_i}
        if file_array.size > 1
          #说明有2个以上的文件，取最新，也就是temp后那个数字最大的
          recent_thumb_file = full_thumb_file_array[file_number_array.index file_number_array.max] if is_pic
          recent_file = file_array[file_number_array.index file_number_array.max]
        else
          #否则说明只有一个，就是它了
          #这里没考虑找不到的情况，反正图必然会先传一个临时
          recent_thumb_file = full_thumb_file_array[0] if is_pic
          recent_file = file_array[0]
        end
        #重命名一个原始文件一个thumb文件
        if is_pic
          split1 = recent_thumb_file.split("/")
          split2 = split1[-1].split(".")
          File.rename(recent_thumb_file, split1[0..-2].join("/") + "/" + split2[0..-2].join(".")[21..-1] + "_thumb." + split2[-1])
        end
        split1 = recent_file.split("/")
        split2 = split1[-1].split(".")
        File.rename(recent_file, split1[0..-2].join("/") + "/" + split2[0..-2].join(".")[16..-1] + "." + split2[-1])
        #同时把url参数加上路径保存起来备用
        data["thumbnail_url"] = "/files/product/accessory/" + data["url"].split(".")[0..-2].join(".").upcase + "_thumb." + data["url"].split(".")[-1].upcase if is_pic
        data["url"] = "/files/product/accessory/" + data["url"].upcase
        #删掉旧文件
        File.delete("#{Rails.root}/public"+old_url)
        File.delete("#{Rails.root}/public"+old_thumb_url)
      end
      #如果有products_ids，说明相关产品的表格内容变动过
      unless data["products_ids"].blank?
        #对已经选过来的产品循环，在accessories_products表中先删除文档ID对应所有数据，然后再添加相应条数据
        AccessoriesProduct.delete_all(["accessory_id = ?", data["id"]])
        for product in data["products_ids"].split("|")
          new_accessories_product = AccessoriesProduct.new()
          new_accessories_product.accessory_id = accessory.id
          new_accessories_product.product_id = product.to_i
          new_accessories_product.save
        end
      end
      #处理完毕，新增json、砍多余字段。这个在表里没有user_id的字段，饶它一命
      accessory_json = []
      data.delete("products_ids")
      #保存
      accessory.update_attributes(data)
      accessory_json << gen_etsc_accessory_json(accessory)

      render :text => {"success" => true, "message" => "已修改", "data" => accessory_json, "model" => accessory.description}.to_json
    elsif request.post?
      #增
      data = params["data"]
      #如果是图片的话，在临时文件夹里找到后半截是此文件名的文件，然后拿最新的一个。不是图片则直接重新上传
      is_pic = data["url"].upcase =~ /.*?\.(JPG|JPEG|GIF|PNG)/
      #如果是图片文件，则在临时文件夹里找
      file_array = findfiles "#{Rails.root}/public/files/product/accessory", /_temp\d{10}_.*?#{data["url"].upcase}/
      pure_file_name_array = file_array.map{|file_name| file_name[/_temp\d{10}.*$/]}
      thumb_file_array = pure_file_name_array.map{|file_name| file_name.sub(/(_temp\d{10})/, '\1thumb')} if is_pic
      full_thumb_file_array = thumb_file_array.map{|file_name| "#{Rails.root}/public/files/product/accessory/"+file_name} if is_pic
      file_number_array = file_array.map{|file_name| file_name[/\d{10}/].to_i}
      if file_array.size > 1
        #说明有2个以上的文件，取最新，也就是temp后那个数字最大的
        recent_thumb_file = full_thumb_file_array[file_number_array.index file_number_array.max] if is_pic
        recent_file = file_array[file_number_array.index file_number_array.max]
      else
        #否则说明只有一个，就是它了
        #这里没考虑找不到的情况，反正图必然会先传一个临时
        recent_thumb_file = full_thumb_file_array[0] if is_pic
        recent_file = file_array[0]
      end
      #重命名一个原始文件一个thumb文件
      if is_pic
        split1 = recent_thumb_file.split("/")
        split2 = split1[-1].split(".")
        File.rename(recent_thumb_file, split1[0..-2].join("/") + "/" + split2[0..-2].join(".")[21..-1] + "_thumb." + split2[-1])
      end
      split1 = recent_file.split("/")
      split2 = split1[-1].split(".")
      File.rename(recent_file, split1[0..-2].join("/") + "/" + split2[0..-2].join(".")[16..-1] + "." + split2[-1])
      #同时把url参数加上路径保存起来备用
      data["thumbnail_url"] = "/files/product/accessory/" + data["url"].split(".")[0..-2].join(".").upcase + "_thumb." + data["url"].split(".")[-1].upcase if is_pic
      data["url"] = "/files/product/accessory/" + data["url"].upcase
      #处理完毕，新增json、砍多余字段
      accessory_json = []
      data.delete("id")
      data.delete("products_names")
      products_ids = data["products_ids"]
      data.delete("products_ids")
      #保存
      accessory = Accessory.new(data)
      accessory.save
      id = accessory.id
      #对已经选过来的产品循环，在accessories_products表中先删除文档ID对应所有数据，然后再添加相应条数据
      AccessoriesProduct.delete_all(["accessory_id = ?", id])
      for product in products_ids.split("|")
        new_accessories_product = AccessoriesProduct.new()
        new_accessories_product.accessory_id = accessory.id
        new_accessories_product.product_id = product.to_i
        new_accessories_product.save
      end
      accessory_json << gen_etsc_accessory_json(accessory)

      render :text => {"success" => true, "message" => "已新增", "data" => accessory_json}.to_json
    end
  end

  #  检查一下数据库中有无同名(且同路径的)文件
  def validate_uniqueness_of_url
    #如果没写(并且能成功提交过来)，说明不更新，那么不检查
    #过来的应该是“三位工厂名称缩写+_(下划线)+三位文件字母代号+_(下划线)+产品型号+_(下划线)+编号.jpg[或者.pdf]”
    #    sort_str = params[:file_name][4,3]
    #    type_str = params[:file_name][8..-1]

    unless params[:file_name].blank?
      accessories = Accessory.where("url like ?", "%#{params[:file_name]}".upcase)
      if accessories.size > 0
        render :text => {"str" => "NO"}.to_json
      else
        render :text => {"str" => "OK"}.to_json
      end
    end
  end

  require 'mini_magick'
  #临时存一下图片，以提供预览。注意临时图片的型号统一变了大写
  def upload_for_temp
    #    p params[:new_url]
    file_name = Time.now.to_i.to_s + "_" + params[:new_url].original_filename.upcase
    #    thumb_file_name = Time.now.to_i.to_s + "thumb" + File.extname(params[:new_url].original_filename).upcase
    thumb_file_name = Time.now.to_i.to_s + "thumb" + "_" + params[:new_url].original_filename.upcase
    relative_path = "files/product/accessory/" + file_name
    thumb_relative_path = "files/product/accessory/_temp" + thumb_file_name
    full_path = Rails.root.to_s + "/public/files/product/accessory/_temp" + file_name
    thumb_full_path = Rails.root.to_s + "/public/files/product/accessory/_temp" + thumb_file_name

    File.open("#{full_path}","wb+") do |f|
      f.write(params[:new_url].read)
    end

    if file_name =~ /(JPG|JPEG|GIF|PNG)$/
      #说明是图，生成缩略图
      img = MiniMagick::Image.open("#{full_path}")
      #缩略图只缩小不剪切，限制在280x210的框里
      max_width,max_height = 280,210
      img.resize "#{max_width}x#{max_height}" if img[:width] > max_width || img[:height] > max_height
      img.write(thumb_full_path)
      render :text => {"success" => "OK", "receive_name" => thumb_relative_path}.to_json
    else
      #其它文件，直接给路径
      render :text => {"success" => "OK", "receive_name" => relative_path}.to_json
    end
  end
end
