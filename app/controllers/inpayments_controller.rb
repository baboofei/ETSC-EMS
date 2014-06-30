class InpaymentsController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /inpayments
  # GET /inpayments.xml
  def index
    @inpayments = Inpayment.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @inpayments }
    end
  end

  # GET /inpayments/1
  # GET /inpayments/1.xml
  def show
    @inpayment = Inpayment.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @inpayment }
    end
  end

  # GET /inpayments/new
  # GET /inpayments/new.xml
  def new
    @inpayment = Inpayment.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @inpayment }
    end
  end

  # GET /inpayments/1/edit
  def edit
    @inpayment = Inpayment.find(params[:id])
  end

  # POST /inpayments
  # POST /inpayments.xml
  def create
    @inpayment = Inpayment.new(params[:inpayment])

    respond_to do |format|
      if @inpayment.save
        format.html { redirect_to(@inpayment, :notice => 'Inpayment was successfully created.') }
        format.xml  { render :xml => @inpayment, :status => :created, :location => @inpayment }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @inpayment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /inpayments/1
  # PUT /inpayments/1.xml
  def update
    @inpayment = Inpayment.find(params[:id])

    respond_to do |format|
      if @inpayment.update_attributes(params[:inpayment])
        format.html { redirect_to(@inpayment, :notice => 'Inpayment was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @inpayment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /inpayments/1
  # DELETE /inpayments/1.xml
  def destroy
    @inpayment = Inpayment.find(params[:id])
    @inpayment.destroy

    respond_to do |format|
      format.html { redirect_to(inpayments_url) }
      format.xml  { head :ok }
    end
  end

  #生成指定合同下付款点的列表JSON，不分页，也必然没有关键字
  def gen_inpayment_json(contract_id,sort="id",dir="DESC")
    #如果contract_id是0就不取，是其它就取对应的Contract。但测试的时候是0就随便取一个好了，比如1
    #TODO 这里要改如果是0时的情况
    contract_id = 1 if contract_id == "0"
    inpayment_json = []
    total_records = Inpayment.where("contract_id = ?", contract_id)
    inpayments = Inpayment.where("contract_id = ?", contract_id).order(sort + " " + dir)
    #多重排序是有可能的，但先不这么排吧
    #inpayments = Inpayment.where("contract_id = ? and contract_type = 'Contract'", contract_id).order(["expected_receive_on DESC", "actually_receive_on ASC"])
    for inpayment in inpayments
      inpayment_json << gen_etsc_inpayment_json(inpayment)
    end
    {"totalRecords" => total_records.size.to_s, "data" => inpayment_json}
  end

  def restful
    if request.get?
      #查
      respond_to do |format|
        format.json {
          if params[:sort].nil?
            #如果没有在表格里排序，则这里按“应收款时间”排序，也可以多重排序，看需求了
            inpayment_json = gen_inpayment_json(params["contract_id"], "expected_receive_on", "DESC")#,params[:sort],params[:dir])
          else
            #如果表格里有排序，会传过来类似"[{\"property\":\"mobile\",\"direction\":\"ASC\"}]"的参数
            sort_param_hash = JSON.parse(params[:sort])
            sort = sort_param_hash[0]["property"]
            dir = sort_param_hash[0]["direction"]
            inpayment_json = gen_inpayment_json(params["contract_id"],sort,dir)
          end
          render :text => inpayment_json.to_json
        }
      end
    elsif request.put?
      #改
      data = params["data"]
      #处理完毕，新增json、砍多余字段
      inpayment_json = []
      inpayment_id = data["id"]
      inpayment = Inpayment.find(inpayment_id)
      data.delete("id")
      #保存
      inpayment.update_attributes(data)
      data["id"] = inpayment_id
      inpayment_json << gen_etsc_inpayment_json(inpayment)
      render :text => {"success" => true, "message" => "已修改", "data" => inpayment_json}.to_json
    elsif request.post?
      #增
      data = params["data"]
      #如果每项都为空，则返回一个空值。刚点完“新增”的时候就是这种情况，必须留着这些判断
      all_blank = true
      data.each do |key,val|
        unless val.blank?
          all_blank = false
          break
        end
      end

      if all_blank
        render :text => {"success" => true, "message" => "空"}.to_json
      else
        #处理完毕，新增json、砍多余字段
        inpayment_json = []
        data.delete("compare")

        inpayment = Inpayment.new(data)
        inpayment.save
        data["id"] = inpayment.id
        inpayment_json << gen_etsc_inpayment_json(inpayment)
        render :text => {"success" => true, "message" => "已新建", "data" => inpayment_json}.to_json
      end
    end
  end

  #自定义生成所需字段的json，给“增”“改”“查”用
  def gen_etsc_inpayment_json(inpayment)
    {
      "expected_receive_on" => inpayment.expected_receive_on.blank? ? "" : inpayment.expected_receive_on.strftime("%Y年%m月%d日"),
      "expected_amount" => inpayment.expected_amount.to_s,
      "actually_receive_on" => inpayment.actually_receive_on.blank? ? "" : inpayment.actually_receive_on.strftime("%Y年%m月%d日"),
      "actually_amount" => inpayment.actually_amount.to_s,
      "compare" => inpayment.actually_receive_on.blank? ? "N/A" : (inpayment.actually_receive_on.to_datetime - inpayment.expected_receive_on.to_datetime).to_i.to_s,
      "id" => inpayment.id
    }
  end

end
