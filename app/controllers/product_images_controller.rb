class ProductImagesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /product_images
  # GET /product_images.xml
  def index
    @product_images = ProductImage.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @product_images }
    end
  end

  # GET /product_images/1
  # GET /product_images/1.xml
  def show
    @product_image = ProductImage.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @product_image }
    end
  end

  # GET /product_images/new
  # GET /product_images/new.xml
  def new
    @product_image = ProductImage.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @product_image }
    end
  end

  # GET /product_images/1/edit
  def edit
    @product_image = ProductImage.find(params[:id])

    @description = @product_image.description
  end

  # POST /product_images
  # POST /product_images.xml
  def create
    @product_image = ProductImage.new(params[:product_image])

    respond_to do |format|
      if @product_image.save
        format.html { redirect_to(@product_image, :notice => 'Product image was successfully created.') }
        format.xml  { render :xml => @product_image, :status => :created, :location => @product_image }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @product_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /product_images/1
  # PUT /product_images/1.xml
  def update
    @product_image = ProductImage.find(params[:id])

    respond_to do |format|
      if @product_image.update_attributes(params[:product_image])
        format.html { redirect_to(@product_image, :notice => 'Product image was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @product_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /product_images/1
  # DELETE /product_images/1.xml
  def destroy
    @product_image = ProductImage.find(params[:id])
    @product_image.destroy

    respond_to do |format|
      format.html { redirect_to(product_images_url) }
      format.xml  { head :ok }
    end
  end

  def normal_create
    @product_image = ProductImage.new(params[:submit])

    respond_to do |format|
      if @product_image.save
        format.html { redirect_to(:action => 'index') }
        format.xml  { render :xml => @product_image, :status => :created, :location => @product_image }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @product_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  def normal_update
    @product_image = ProductImage.find(params[:id])

    #判断有没有改动图片，同时把旧值存下来备用
    update_image_flag = true
    old_url = @product_image.url
    old_thumb_url = @product_image.thumbnail_url

    #    auto_change_to_blank
    #如果没有放新图片，则图片保持不变
    if params[:submit][:uploaded_picture].blank?
      update_image_flag = false
      params[:submit].delete(:uploaded_picture)
    end
    respond_to do |format|
      if @product_image.update_attributes(params[:submit])
        if update_image_flag
          #放了新图片，则删除旧图片
          File.delete("#{Rails.root}/public"+old_url)
          File.delete("#{Rails.root}/public"+old_thumb_url)
        end
        format.html { redirect_to :action => 'index' }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @product_image.errors, :status => :unprocessable_entity }
      end
    end
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
      #      if request.post?
      format.json {
        product_image_json = gen_product_image_paginate_json(params[:start].to_i,params[:limit],params[:sort],params[:dir],params[:keyword])
        render :text => product_image_json.to_json
      }
      #      elsif request.get?
      #        format.html
      #        format.json
      #      end
    end
  end

  def gen_product_image_paginate_json(start,limit,sort,dir,keyword)
    #生成产品图片列表的分页JSON
    product_image_json=[]
    if keyword.blank?
      #没有关键字，那就是全部
      product_images = ProductImage.find(:all, :limit => limit, :offset => start, :order => sort+" "+dir)
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
          fore_conditions_column << "product_images."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
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
      total_records = ProductImage.find(:all, :conditions => conditions, :include => [:product])
      product_images = ProductImage.find(:all,
        :order => "product_images."+sort+" "+dir,#这里也有重名字段问题，所以一定要写前面的表名
        :conditions => conditions,
        :limit => limit,
        :offset => start,
        :include => [:product])
    end
    for product_image in product_images
      product_image_json << {
        "url" => product_image.thumbnail_url,
        "description" => product_image.description,
        "product" => product_image.product.nil? ? "" : product_image.product.name_txt,
        "id" => product_image.id
      }
    end
    if keyword.blank?
      #没有关键字，总记录数取整个产品表
      {"totalRecords" => ProductImage.count.to_s, "root" => product_image_json}
    else
      #有关键字，总记录数取查找结果
      {"totalRecords" => total_records.size.to_s, "root" => product_image_json}
    end
  end

  def get_ini_value
    respond_to do |format|
      format.json {
        cur_product_image = ProductImage.find(params[:product_image_id])
        #        p cur_product_image
        image_url = cur_product_image.thumbnail_url#用缩略的吧，传输快一点
        product_id = cur_product_image.product.id
        model = cur_product_image.product.model
        vendor = cur_product_image.product.producer.name

        ini_array = eval("{"+
            "'image_url' => '"+ image_url.to_s+
            "', 'product_id' => '"+ product_id.to_s+
            "', 'model' => '"+ model.to_s+
            "', 'vendor' => '"+ vendor.to_s+
            "'}")
        #        p ini_array
        render :text => ini_array.to_json
      }
    end
  end

  def uniq_image
    #判断服务器端有无重名文件
    if ProductImage.find(:all).map{|p| p.url.split("/")[-1]}.include? params[:image_name]
      #有，报错，不能加这个
      render :text => {'result' => 'dup'}.to_json
    else
      render :text => {'result' => 'no_dup'}.to_json
    end
  end
end
