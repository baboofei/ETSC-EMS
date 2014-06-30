class SaleCasesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /sale_cases
  # GET /sale_cases.xml
  def index
    @sale_cases = SaleCase.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @sale_cases }
    end
  end

  # GET /sale_cases/1
  # GET /sale_cases/1.xml
  def show
    @sale_case = SaleCase.find(params[:id])

    show_all_logs_in(@sale_case)
#    respond_to do |format|
#      format.html # show.html.erb
#      format.xml  { render :xml => @sale_case }
#    end
  end

  # GET /sale_cases/new
  # GET /sale_cases/new.xml
  def new
    @sale_case = SaleCase.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @sale_case }
    end
  end

  # GET /sale_cases/1/edit
  def edit
    @sale_case = SaleCase.find(params[:id])
  end

  # POST /sale_cases
  # POST /sale_cases.xml
  def create
    @sale_case = SaleCase.new(params[:sale_case])

    respond_to do |format|
      if @sale_case.save
        format.html { redirect_to(@sale_case, :notice => 'Sale case was successfully created.') }
        format.xml  { render :xml => @sale_case, :status => :created, :location => @sale_case }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @sale_case.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /sale_cases/1
  # PUT /sale_cases/1.xml
  def update
    @sale_case = SaleCase.find(params[:id])

    respond_to do |format|
      if @sale_case.update_attributes(params[:sale_case])
        format.html { redirect_to(@sale_case, :notice => 'Sale case was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @sale_case.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /sale_cases/1
  # DELETE /sale_cases/1.xml
  def destroy
    @sale_case = SaleCase.find(params[:id])
    @sale_case.destroy

    respond_to do |format|
      format.html { redirect_to(sale_cases_url) }
      format.xml  { head :ok }
    end
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
      format.json {
        sale_case_json = gen_sale_case_paginate_json(params[:start].to_i,params[:limit],params[:sort],params[:dir],params[:keyword])
        render :text => sale_case_json.to_json
      }
    end
  end

  def gen_sale_case_paginate_json(start,limit,sort,dir,keyword)
    #生成产品列表的分页JSON
    sale_case_json=[]
    if keyword.blank?
      #没有关键字，那就是全部
      sale_cases = SaleCase.find(:all, :limit => limit, :offset => start, :order => sort+" "+dir)
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
      columns = %w(model simple_description_cn detail_description application_in_site parameter_in_site feature)
      fore_conditions_keyword = []#按关键字再循环后的数组
      back_conditions = []
      #先对关键字循环
      for keyword in keywords
        #再对字段循环
        fore_conditions_column = []#按字段循环后的数组
        for column in columns
          fore_conditions_column << "sale_case."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
          back_conditions << "%"+keyword+"%"
        end
        #以下是跨表字段，单独写
        fore_conditions_column << "vendor_units.name like ?"
        back_conditions << "%"+keyword+"%"
        fore_conditions_column << "vendor_units.en_name like ?"
        back_conditions << "%"+keyword+"%"

        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
        fore_conditions_keyword << fore_condition_column
      end
      fore_condition = fore_conditions_keyword.join(" "+joint+" ")
      conditions = fore_condition.to_a + back_conditions
      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
      total_records = SaleCase.find(:all, :conditions => conditions, :include => [:producer])
      sale_cases = SaleCase.find(:all,
        :order => "sale_cases."+sort+" "+dir,#这里也有重名字段问题，所以一定要写前面的表名
        :conditions => conditions,
        :limit => limit,
        :offset => start,
        :include => [:producer])
    end
    for sale_case in sale_cases
      sale_case_json << {
        "number" => sale_case.number,
        "start_time" => sale_case.start_time.nil? ? "不详(可能是导入的数据)" : sale_case.start_time.strftime("%Y-%m-%d %H:%M"),
        "end_time" => sale_case.end_time.nil? ? "尚未结束" : sale_case.end_time.strftime("%Y-%m-%d %H:%M"),
        "last_info" => SaleLogsController.new.process_detail(SaleLog.where("sale_case_id = ?", sale_case.id).order("contact_time").last),
        "result" => sale_case.result.nil? ? "进行中" : sale_case.result,
        "id" => sale_case.id
      }
    end
    if keyword.blank?
      #没有关键字，总记录数取整个产品表
      {"totalRecords" => SaleCase.count.to_s, "root" => sale_case_json}
    else
      #有关键字，总记录数取查找结果
      {"totalRecords" => total_records.size.to_s, "root" => sale_case_json}
    end
  end

  #查看某个案的历史信息，这是从sale_log那边传进来用的，params[:id]是sale_log的id
  def show_log
    @present_log = SaleLog.find_by_id(params[:id])
    @present_case = @present_log.sale_case
    show_all_logs_in @present_case
    @other_logs = @all_logs
#    @other_logs = SaleLog.find(:all, :conditions => ["sale_case_id = ?",@present_case.id])
  end

  def show_all_logs_in(sale_case)
    @all_logs = SaleLog.where("sale_case_id = ?", sale_case.id)
    latest_log = @all_logs.order("contact_time").last
    @last_customer = latest_log.customer
  end
end
