class PrvcsController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /prvcs
  # GET /prvcs.xml
  def index
    @prvcs = Prvc.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @prvcs }
    end
  end

  # GET /prvcs/1
  # GET /prvcs/1.xml
  def show
    @prvc = Prvc.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @prvc }
    end
  end

  # GET /prvcs/new
  # GET /prvcs/new.xml
  def new
    @prvc = Prvc.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @prvc }
    end
  end

  # GET /prvcs/1/edit
  def edit
    @prvc = Prvc.find(params[:id])
  end

  # POST /prvcs
  # POST /prvcs.xml
  def create
    @prvc = Prvc.new(params[:prvc])

    respond_to do |format|
      if @prvc.save
        format.html { redirect_to(@prvc, :notice => 'Prvc was successfully created.') }
        format.xml  { render :xml => @prvc, :status => :created, :location => @prvc }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @prvc.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /prvcs/1
  # PUT /prvcs/1.xml
  def update
    @prvc = Prvc.find(params[:id])

    respond_to do |format|
      if @prvc.update_attributes(params[:prvc])
        format.html { redirect_to(@prvc, :notice => 'Prvc was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @prvc.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /prvcs/1
  # DELETE /prvcs/1.xml
  def destroy
    @prvc = Prvc.find(params[:id])
    @prvc.destroy

    respond_to do |format|
      format.html { redirect_to(prvcs_url) }
      format.xml  { head :ok }
    end
  end

  #获取省份信息以生成下拉列表
  def get_prvc
    respond_to do |format|
      format.json {
        prvc_list = gen_prvc(params[:area_id])
        render :text => prvc_list.to_json
      }
    end
  end

  def gen_prvc(area_id)
    prvc_array = []
#    prvcs = Prvc.find(:all, :conditions => ["area_id = ?", area_id])
    prvcs = Prvc.where("area_id = ?", area_id)
    for prvc in prvcs
      prvc_array << eval("{'id' => '"+prvc.id.to_s+#这个to_s要注意
        "', 'text' => '"+prvc.name+"'}")
    end
    return prvc_array
  end

  #验证输入的省份/自治区/直辖市/州是否重复
  def check_prvc_input
    respond_to do |format|
      format.json {
        #传过来的输入值
        prvc = params[:name]
        if prvc.blank?
          #空值，则提示错误
          render :text => {'str' => '你啥都没输入哎！'}.to_json
        else
          tar_prvc = Prvc.find_by_name(prvc)
          if tar_prvc.blank?
            #找不到此值，则以此为名new一个
            new_prvc = Prvc.new(:name => prvc, :area_id => params[:area_id], :user_id => session[:user_id])
            if new_prvc.save
              #保存成功
              render :text => {'str' => '已成功添加名为 '+prvc+' 的省份/自治区/直辖市/州！'}.to_json
            else
              #保存失败
              render :text => {'str' => '数据库那边好像出问题了……找管理员看看吧'}.to_json
            end
          else
            #已有此值，则提示已经存在
            render :text => {'str' => '你所输入的值已经存在！其所属的区域/国家为：'+ tar_prvc.area.name}.to_json
          end
        end
      }
    end
  end

end
