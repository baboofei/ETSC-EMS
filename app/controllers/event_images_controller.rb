class EventImagesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /event_images
  # GET /event_images.xml
  def index
    @event_images = EventImage.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @event_images }
    end
  end

  # GET /event_images/1
  # GET /event_images/1.xml
  def show
    @event_image = EventImage.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @event_image }
    end
  end

  # GET /event_images/new
  # GET /event_images/new.xml
  def new
    @event_image = EventImage.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @event_image }
    end
  end

  # GET /event_images/1/edit
  def edit
    @event_image = EventImage.find(params[:id])
    @description = @event_image.description
  end

  # POST /event_images
  # POST /event_images.xml
  def create
    @event_image = EventImage.new(params[:event_image])

    respond_to do |format|
      if @event_image.save
        format.html { redirect_to(@event_image, :notice => 'Event image was successfully created.') }
        format.xml  { render :xml => @event_image, :status => :created, :location => @event_image }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /event_images/1
  # PUT /event_images/1.xml
  def update
    @event_image = EventImage.find(params[:id])

    respond_to do |format|
      if @event_image.update_attributes(params[:event_image])
        format.html { redirect_to(@event_image, :notice => 'Event image was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /event_images/1
  # DELETE /event_images/1.xml
  def destroy
    @event_image = EventImage.find(params[:id])
    @event_image.destroy

    respond_to do |format|
      format.html { redirect_to(event_images_url) }
      format.xml  { head :ok }
    end
  end

  def normal_create
    @event_image = EventImage.new(params[:submit])

    respond_to do |format|
      if @event_image.save
        format.html { redirect_to(:action => 'index') }
        format.xml  { render :xml => @event_image, :status => :created, :location => @event_image }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  def normal_update
    @event_image = EventImage.find(params[:id])

    #判断有没有改动图片，同时把旧值存下来备用
    update_image_flag = true
    old_url = @event_image.url
    old_thumb_url = @event_image.thumbnail_url

    #    auto_change_to_blank
    #如果没有放新图片，则图片保持不变
    if params[:submit][:uploaded_picture].blank?
      update_image_flag = false
      params[:submit].delete(:uploaded_picture)
    end
    respond_to do |format|
      if @event_image.update_attributes(params[:submit])
        if update_image_flag
          #放了新图片，则删除旧图片
          File.delete("#{Rails.root}/public"+old_url)
          File.delete("#{Rails.root}/public"+old_thumb_url)
        end
        format.html { redirect_to :action => 'index' }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
      #      if request.post?
      format.json {
        event_image_json = gen_event_image_paginate_json(params[:start].to_i,params[:limit],params[:sort],params[:dir],params[:keyword])
        render :text => event_image_json.to_json
      }
      #      elsif request.get?
      #        format.html
      #        format.json
      #      end
    end
  end

#  def gen_event_image_paginate_json(start,limit,sort,dir,keyword)
#    #生成新闻图片列表的分页JSON
#    event_image_json=[]
#    if keyword.blank?
#      #没有关键字，那就是全部
#      event_images = EventImage.find(:all, :limit => limit, :offset => start, :order => sort+" "+dir)
#    else
#      #先把关键字按空格切分，全角半角都算，取前五个
#      keywords = keyword.split("　").join(" ").split(" ")[0..4]
#      #如果关键字中有一个“+”，则按and来计算，否则就算or
#      if keywords.index("+")
#        joint = "and"
#        keywords = keywords-["+"]
#      else
#        joint = "or"
#      end
#      #参与查找的字段
#      columns = %w(description)
#      fore_conditions_keyword = []#按关键字再循环后的数组
#      back_conditions = []
#      #先对关键字循环
#      for i_keyword in keywords
#        #再对字段循环
#        fore_conditions_column = []#按字段循环后的数组
#        for column in columns
#          fore_conditions_column << "event_images."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
#          back_conditions << "%"+i_keyword+"%"
#        end
#        #以下是跨表字段，单独写
#        fore_conditions_column << "events.name like ?"
#        back_conditions << "%"+i_keyword+"%"
#        fore_conditions_column << "events.model like ?"
#        back_conditions << "%"+i_keyword+"%"
#
#        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
#        fore_conditions_keyword << fore_condition_column
#      end
#      fore_condition = fore_conditions_keyword.join(" "+joint+" ")
#      conditions = fore_condition.to_a + back_conditions
#      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
#      total_records = EventImage.find(:all, :conditions => conditions, :include => [:event])
#      event_images = EventImage.find(:all,
#        :order => "event_images."+sort+" "+dir,#这里也有重名字段问题，所以一定要写前面的表名
#        :conditions => conditions,
#        :limit => limit,
#        :offset => start,
#        :include => [:event])
#    end
#    for event_image in event_images
#      event_image_json << {
#        "url" => event_image.thumbnail_url,
#        "description" => event_image.description,
#        "title" => event_image.event.nil? ? "" : event_image.event.title,
#        "id" => event_image.id
#      }
#    end
#    if keyword.blank?
#      #没有关键字，总记录数取整个产品表
#      {"totalRecords" => EventImage.count.to_s, "root" => event_image_json}
#    else
#      #有关键字，总记录数取查找结果
#      {"totalRecords" => total_records.size.to_s, "root" => event_image_json}
#    end
#  end
#
  def get_ini_value
    respond_to do |format|
      format.json {
        cur_event_image = EventImage.find(params[:event_image_id])
        #        p cur_event_image
        image_url = cur_event_image.thumbnail_url#用缩略的吧，传输快一点
        event_id = cur_event_image.event.id
        title = cur_event_image.event.title

        ini_array = eval("{"+
            "'image_url' => '"+ image_url.to_s+
            "', 'event_id' => '"+ event_id.to_s+
            "', 'title' => '"+ title.to_s+
            "'}")
        #        p ini_array
        render :text => ini_array.to_json
      }
    end
  end

  def uniq_image
    #判断服务器端有无重名文件
    if EventImage.find(:all).map{|p| p.url.split("/")[-1]}.include? params[:image_name]
      #有，报错，不能加这个
      render :text => {'result' => 'dup'}.to_json
    else
      render :text => {'result' => 'no_dup'}.to_json
    end
  end


  def gen_event_image_paginate_json(start,limit,keyword,sort="id",dir="DESC")
    #生成产品附件列表的分页JSON
    event_image_json=[]
    if keyword.blank?
      #没有关键字，那就是全部
      total_records = EventImage.all
      event_images = EventImage.limit(limit.to_i).offset(start.to_i).order(sort + " " + dir)
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
          fore_conditions_column << "event_images."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
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
      total_records = EventImage.where(*conditions).includes(:products)
      event_images = EventImage.where(*conditions).includes(:products).order("event_images."+sort+" "+dir).limit(limit).offset(start.to_i)
    end
    for event_image in event_images
      event_image_json << gen_etsc_event_image_json(event_image)
    end
    {"totalRecords" => total_records.size.to_s, "data" => event_image_json}
  end

  #自定义生成所需字段的json，给“增”“改”“查”用
  def gen_etsc_event_image_json(event_image)
    {
      "url" => event_image.url,
      "thumbnail_url" => event_image.thumbnail_url.blank? ? "" : event_image.thumbnail_url,
      "description" => event_image.description,
      "event_title" => event_image.event.title,
      "event_id" => event_image.event.id,
      "id" => event_image.id
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
            event_image_json = gen_event_image_paginate_json(params[:start],params[:limit],params[:keyword])#,params[:sort],params[:dir])
          else
            #如果表格里有排序，会传过来类似"[{\"property\":\"mobile\",\"direction\":\"ASC\"}]"的参数
            sort_param_hash = JSON.parse(params[:sort])
            sort = sort_param_hash[0]["property"]
            dir = sort_param_hash[0]["direction"]
            event_image_json = gen_event_image_paginate_json(params[:start],params[:limit],params[:keyword],sort,dir)
          end
          render :text => event_image_json.to_json
        }
      end
    elsif request.put?
      #改
      data = params["data"]
      #把旧的url存下来备用(定期删，免得一堆垃圾文件)
      event_image = EventImage.find(data["id"])
      old_url = event_image.url
      old_thumb_url = event_image.thumbnail_url
      #如果有url参数，说明改过了文件
      unless data["url"].blank?
        #如果是图片的话，在临时文件夹里找到后半截是此文件名的文件，然后拿最新的一个。不是图片则直接重新上传
        is_pic = data["url"].upcase =~ /.*?\.(JPG|JPEG|GIF|PNG)/
        #如果是图片文件，则在临时文件夹里找
        file_array = findfiles "#{Rails.root}/public/images/news", /_temp\d{10}_.*?#{data["url"].upcase}/
        pure_file_name_array = file_array.map{|file_name| file_name[/_temp\d{10}.*$/]}
        thumb_file_array = pure_file_name_array.map{|file_name| file_name.sub(/(_temp\d{10})/, '\1thumb')} if is_pic
        full_thumb_file_array = thumb_file_array.map{|file_name| "#{Rails.root}/public/images/news/"+file_name} if is_pic
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
#        p "!!!!!!!!!!!"
#        p recent_thumb_file
#        p split1[0..-2]
#        p split2[0..-2].join(".")[16..-1]
#        p split1[0..-2].join("/") + "/" + split2[0..-2].join(".")[16..-1] + "." + split2[-1]
        File.rename(recent_file, split1[0..-2].join("/") + "/" + split2[0..-2].join(".")[16..-1] + "." + split2[-1])
        #同时把url参数加上路径保存起来备用
        data["thumbnail_url"] = "/images/news/" + data["url"].split(".")[0..-2].join(".").upcase + "_thumb." + data["url"].split(".")[-1].upcase if is_pic
        data["url"] = "/images/news/" + data["url"].upcase
        #删掉旧文件
        File.delete("#{Rails.root}/public"+old_url)
        File.delete("#{Rails.root}/public"+old_thumb_url)
      end
      #如果有products_ids，说明相关产品的表格内容变动过
      unless data["products_ids"].blank?
        #对已经选过来的产品循环，在event_images_products表中先删除文档ID对应所有数据，然后再添加相应条数据
        AccessoriesProduct.delete_all(["event_image_id = ?", data["id"]])
        for product in data["products_ids"].split("|")
          new_event_images_product = AccessoriesProduct.new()
          new_event_images_product.event_image_id = event_image.id
          new_event_images_product.product_id = product.to_i
          new_event_images_product.save
        end
      end
      #处理完毕，新增json、砍多余字段。这个在表里没有user_id的字段，饶它一命
      event_image_json = []
      data.delete("products_ids")
      #保存
      event_image.update_attributes(data)
      event_image_json << gen_etsc_event_image_json(event_image)

      render :text => {"success" => true, "message" => "已修改", "data" => event_image_json, "model" => event_image.description}.to_json
    elsif request.post?
      #增
      data = params["data"]
      #如果是图片的话，在临时文件夹里找到后半截是此文件名的文件，然后拿最新的一个。不是图片则直接重新上传
      is_pic = data["url"].upcase =~ /.*?\.(JPG|JPEG|GIF|PNG)/
      #如果是图片文件，则在临时文件夹里找
      file_array = findfiles "#{Rails.root}/public/images/news", /_temp\d{10}_.*?#{data["url"].upcase}/
      pure_file_name_array = file_array.map{|file_name| file_name[/_temp\d{10}.*$/]}
      thumb_file_array = pure_file_name_array.map{|file_name| file_name.sub(/(_temp\d{10})/, '\1thumb')} if is_pic
      full_thumb_file_array = thumb_file_array.map{|file_name| "#{Rails.root}/public/images/news/"+file_name} if is_pic
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
      data["thumbnail_url"] = "/images/news/" + data["url"].split(".")[0..-2].join(".").upcase + "_thumb." + data["url"].split(".")[-1].upcase if is_pic
      data["url"] = "/images/news/" + data["url"].upcase
      #处理完毕，新增json、砍多余字段
      event_image_json = []
      data.delete("id")
      data.delete("event_title")
      #保存
      event_image = EventImage.new(data)
      event_image.save
      id = event_image.id
      event_image_json << gen_etsc_event_image_json(event_image)

      render :text => {"success" => true, "message" => "已新增", "data" => event_image_json}.to_json
    end
  end

  #  检查一下数据库中有无同名(且同路径的)文件
  def validate_uniqueness_of_url
    #如果没写(并且能成功提交过来)，说明不更新，那么不检查
    unless params[:file_name].blank?
      event_images = EventImage.where("url like ?", "%#{params[:file_name]}".upcase)
      if event_images.size > 0
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
    relative_path = "images/news/" + file_name
    thumb_relative_path = "images/news/_temp" + thumb_file_name
    full_path = Rails.root.to_s + "/public/images/news/_temp" + file_name
    thumb_full_path = Rails.root.to_s + "/public/images/news/_temp" + thumb_file_name

#    File.open("D:/EIMV4/EIMV4/public/images/news/_temp.JPG","wb+") do |f|
    File.open("#{full_path}","wb+") do |f|
      f.write(params[:new_url].read)
    end

    #生成缩略图
    img = MiniMagick::Image.open("#{full_path}")
    #缩略图只缩小不剪切，限制在280x210的框里
    max_width,max_height = 280,210
    img.resize "#{max_width}x#{max_height}" if img[:width] > max_width || img[:height] > max_height
    img.write(thumb_full_path)
    render :text => {"success" => "OK", "receive_name" => thumb_relative_path}.to_json
  end
end
