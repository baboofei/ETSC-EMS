class SaleLogsController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /sale_logs
  # GET /sale_logs.xml
  def index
    @sale_logs = SaleLog.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @sale_logs }
    end
  end

  # GET /sale_logs/1
  # GET /sale_logs/1.xml
  def show
    @sale_log = SaleLog.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @sale_log }
    end
  end

  # GET /sale_logs/new
  # GET /sale_logs/new.xml
  def new
    @sale_log = SaleLog.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @sale_log }
    end
  end

  # GET /sale_logs/1/edit
  def edit
    @sale_log = SaleLog.find(params[:id])
  end

  # POST /sale_logs
  # POST /sale_logs.xml
  def create
    @sale_log = SaleLog.new(params[:sale_log])

    respond_to do |format|
      if @sale_log.save
        format.html { redirect_to(@sale_log, :notice => 'Sale log was successfully created.') }
        format.xml  { render :xml => @sale_log, :status => :created, :location => @sale_log }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @sale_log.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /sale_logs/1
  # PUT /sale_logs/1.xml
  def update
    @sale_log = SaleLog.find(params[:id])

    respond_to do |format|
      if @sale_log.update_attributes(params[:sale_log])
        format.html { redirect_to(@sale_log, :notice => 'Sale log was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @sale_log.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /sale_logs/1
  # DELETE /sale_logs/1.xml
  def destroy
    @sale_log = SaleLog.find(params[:id])
    @sale_log.destroy

    respond_to do |format|
      format.html { redirect_to(sale_logs_url) }
      format.xml  { head :ok }
    end
  end

  def normal_create
#    render :text => params.inspect
    #先看选的哪一选项，再针对不同情况校验
    case params[:submit][:process]
    when "1"
      #判断是否为新增的个案，然后在对应个案中新增一条日志并保存
      check_and_get_sale_log
      #再往“推荐产品和日志关联表”中循环新增数据
      for product_id in params[:submit][:process1][:recommended_product_id].split("|")
        recommend_product_sale_log = RecommendProductsSaleLog.new
        recommend_product_sale_log.product_id = product_id.to_i
        recommend_product_sale_log.sale_log_id = @sale_log.id
        recommend_product_sale_log.save
      end
      do_create
    when "2"
      #判断是否为新增的个案，然后在对应个案中新增一条日志并保存
      check_and_get_sale_log
      #再存一下注释
      @sale_log.comment = params[:need_product_description]
      do_create
    when "7"
      #判断是否为新增的个案，然后在对应个案中新增一条日志并保存
      check_and_get_sale_log
    when "8"
      #判断是否为新增的个案，然后在对应个案中新增一条日志并保存
      check_and_get_sale_log
#      p params
      #new一件事宜
      task = WorkTask.new
      task.sender_user_id = session[:user_id]
      task.reciever_role_id = 6#商务
      task.task_type = 3#产品预签合同
      task.sent_on = DateTime.now
      task.deadline = DateTime.strptime(params[:c8_deadline], "%Y年%m月%d日")+(17.0/24)#只好在这里加到17点……
      task.save
      #再new一个合同，把提交来的“根据报价”里能带入的的数据都带入其中
      quote = SellQuote.find(params[:c8_basis_quote_hidden].to_i)
      contract = Contract.new
      contract.customer_unit = quote.customer_unit
      contract.equiper = quote.customer
      contract.buyer = quote.customer
      contract.signer = quote.sponsor
      contract.dealer = quote.dealer
      contract.our_company = quote.our_company
      contract.remark = params[:c8_remark]
      contract.sell_quote_id = quote.id
      contract.sale_log_id = @sale_log.id
      contract.work_task_id = task.id
      contract.flow_status = 1#初始的时候是1，见application.rb
      contract.save
      #合同项的信息为报价的报价项带过来
      for quote_block in quote.sell_quote_blocks
        for quote_item in quote_block.sell_quote_items
          contract_item = ContractItem.new
          contract_item.product = quote_item.product
          contract_item.product_quantity = quote_item.product_quantity
          contract_item.sell_contract_id = contract.id
          contract_item.save
        end
      end
      do_create
    when "15"
      #判断是否为新增的个案，然后在对应个案中新增一条日志并保存
      check_and_get_sale_log
      #再存一下注释
      @sale_log.comment = params[:sale_log_comment]
      do_create
    end
################################
#    #先看选的哪一选项，再针对不同情况校验
#    case params[:sale_log][:process]
#    when "1"
#      #选择了“给客户推荐产品”。判断有没有选择具体的产品
#      if params[:sale_log][:selected_recommend_product].nil?
#        #没选具体产品，报错
#        alert_and_redirect("请选择要推荐给客户的产品！")
#      else
#        #选了具体产品，校验通过，于是先保存
#        check_and_get_sale_log
#        #再往“推荐产品和日志关联表”中循环新增数据
#        for product_id in params[:sale_log][:selected_recommend_product]
#          recommend_product_sale_log = RecommendProductsSaleLog.new
#          recommend_product_sale_log.product_id = product_id.to_i
#          recommend_product_sale_log.sale_log_id = @sale_log.id
#          recommend_product_sale_log.save
#        end
#        do_create
#      end
#    when "2"
#      #选择了“对方需求产品”，再判断有没有输入需求的内容
#      if params[:sale_log][:ask_for_product]==""
#        #没输入需求的内容，报错
#        alert_and_redirect("请输入对方需求的产品要求！")
#      else
#        #选了具体产品，校验通过，于是先保存
#        check_and_get_sale_log
#        #再把内容存入注释项
#        @sale_log.comment = params[:sale_log][:ask_for_product]
#        do_create
#      end
#    when "7"
#      #选择了“产品做报价”。判断有没有选择具体的产品
#      if params[:sale_log][:selected_to_be_quoted_product].nil?
#        #没选具体产品，报错
#        alert_and_redirect("请选择要做报价的产品！")
#      else
#        #选了具体产品，校验通过，于是先保存
#        check_and_get_sale_log
#        #再往“报价产品和日志关联表”中循环新增数据
#        for product_id in params[:sale_log][:selected_to_be_quoted_product]
#          sale_log_to_be_quoted_product = SaleLogsToBeQuotedProduct.new
#          sale_log_to_be_quoted_product.product_id = product_id.to_i
#          sale_log_to_be_quoted_product.sale_log_id = @sale_log.id
#          sale_log_to_be_quoted_product.save
#        end
#        #往事宜列表中存入一条数据
#        task = WorkTask.new
#        task.sender_user_id = session[:user_id]
#        task.reciever_role_id = Role.find_by_name("商务")
#        task.content = "做一个报价，详情请看"
#        do_create
#      end
#    end
  end

  def do_create
    respond_to do |format|
      if @sale_log.save
#        format.html { redirect_to(@sale_log, :notice => 'SaleLog was successfully created.') }#不知道怎么玩的，不敢贸然改，先留着Terry20110221
        format.html {redirect_to :controller => 'sale_logs', :action => 'index'}
        format.xml  { render :xml => @sale_log, :status => :created, :location => @sale_log }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @sale_log.errors, :status => :unprocessable_entity }
      end
    end
  end

  #查看某个案的历史信息#TODO 测试转移之，不应该放这里嘛
#  def show_case
#    @present_log = SaleLog.find_by_id(params[:id])
#    @present_case = @present_log.sale_case
#    @other_logs = SaleLog.find(:all, :conditions => ["sale_case_id = ?",@present_case.id])
#  end

  #用AJAX选择不同进展后带的选项
  def load_process_status
    @process=params[:process]
    render(:layout => false)
  end

  #判断是否为新增的个案，然后在对应个案中新增一条日志并保存
  def check_and_get_sale_log
    if params[:submit][:sale_case_id]=="0"
      #说明是新个案，往个案表里加一条数据
      sale_case=SaleCase.new
      sale_case.number = SaleCase.next_number
      sale_case.start_time = DateTime.now
      sale_case.save
    else
      #说明是旧个案，只是加日志，所以从params里读出sale_case_id
      sale_case = SaleCase.find(params[:submit][:sale_case_id])
    end
    #再往销售日志表里新增一条数据
    @sale_log = SaleLog.new()
    #联系时间为当前时间
    @sale_log.contact_time = DateTime.now
    @sale_log.user_id = session[:user_id]
    @sale_log.customer_id = params[:submit][:customer_id]
    @sale_log.process = params[:submit][:process]#$PROCESSES_OF_SALE_LOG中定义
    @sale_log.sale_case_id = sale_case.id
    @sale_log.save
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
#      if request.post?
        format.json {
          sale_log_json = gen_sale_log_paginate_json(params[:start],params[:limit],params[:sort],params[:dir],params[:keyword])
          render :text => sale_log_json.to_json
        }
#      elsif request.get?
#        format.json
#      end
    end
  end

  def gen_sale_log_paginate_json(start,limit,sort,dir,keyword)
    #生成销售工作日志列表的分页JSON(但此页面生成的应该是个案的列表，点进去之后才是详情)
    u = User.find(session[:user_id])
    role_condition = []
    #根据角色不同来决定过滤条件
    if session[:user_id] == 1 or u.role_ids.include?(9)
      #如果是BOSS或者Admin，则看全部
      role_condition = "true"
    elsif u.role_ids.include?(1) and u.role_ids.include?(2)
      #如果是销售部门经理，则看“同部门所有人的”
      all_subordinates = User.find(session[:user_id]).department.user_ids
      for subordinate in all_subordinates
        role_condition << "sale_logs.user_id = #{subordinate}"
      end
      role_condition = role_condition.join(" or ")
    elsif u.role_ids.include?(2)
      #如果是销售，看自己的
      role_condition = "sale_logs.user_id = #{session[:user_id]}"
    else
      #别的人没有可看的
      role_condition = "false"
    end
#    role_condition += "and sale_logs.user_id"
    sale_case_json = []
    if keyword.blank?
      #没有关键字，直接用上面的过滤条件
      total_records = SaleCase.find(:all,
        :conditions => role_condition,
        :include => [:sale_logs]
      )
      sale_cases = SaleCase.find(:all,
        :limit => limit,
        :offset => start,
        :order => "sale_logs.contact_time "+dir,
        :conditions => role_condition,
        :include => [:sale_logs]
      )
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
      columns = %w()
      fore_conditions_keyword = []#按关键字再循环后的数组
      back_conditions = []
      #先对关键字循环
      for i_keyword in keywords
        #再对字段循环
        fore_conditions_column = []#按字段循环后的数组
        for column in columns
          fore_conditions_column << "sale_cases."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
          back_conditions << "%"+i_keyword+"%"
        end
        #以下是跨表字段，单独写
        fore_conditions_column << "customer_units.name like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "customers.name like ?"
        back_conditions << "%"+i_keyword+"%"

        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
        fore_conditions_keyword << fore_condition_column
      end
      fore_condition = fore_conditions_keyword.join(" "+joint+" ")
      conditions = fore_condition.to_a + back_conditions
      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
      total_records = SaleCase.find(:all,
        :conditions => conditions,
        :include => [{:sale_logs => {:customer => :customer_unit}}]
      )
      sale_cases = SaleCase.find(:all,
        :order => "sale_logs.contact_time "+dir,
        :conditions => conditions,
        :limit => limit,
        :offset => start,
        :include => [{:sale_logs => {:customer => :customer_unit}}]
      )
    end
    for sale_case in sale_cases
      sale_log = SaleLog.find(:first, :order => "contact_time DESC", :conditions => ["sale_case_id = ?",sale_case.id])#联系时间最近的一条日志
      sale_case_json << {"customer_name" => sale_log.customer.name,
        "customer_unit_name" => sale_log.customer.customer_unit.name,
        "process" => process_detail(sale_log),
        "contact_time" => sale_log.contact_time.strftime("%Y-%m-%d %H:%M"),
        "id" => sale_log.id,
        "hidden_customer_id" => sale_log.customer.id,#传参数，貌似也只能这样传了
        "hidden_sale_case_id" => sale_log.sale_case.id
      }
    end
#    if keyword.blank?
#      #没有关键字，总记录数取整个产品表
#      {"totalRecords" => SaleCase.count.to_s, "root" => sale_case_json}
#    else
      #有关键字，总记录数取查找结果
      {"totalRecords" => total_records.size.to_s, "root" => sale_case_json}
#    end
  end

  #生成币种下拉列表
  def get_currency
    respond_to do |format|
      format.json {
        currency_json = gen_currency
        render :text => currency_json.to_json
      }
    end
  end

  def gen_currency
    currency_array = []
    currencies = Currency.find(:all)
    for currency in currencies
      currency_array << eval("{'id' => '"+currency.id.to_s+#这个to_s要注意
        "', 'type_name' => '"+currency.name+"'}")
    end
    return currency_array
  end

  #根据sale_log生成对应的进展详情
  def process_detail(sale_log)
    pre = sale_log.process_txt
#    p sale_log.process
    case sale_log.process
    when 1
      suf = sale_log.recommended_products.map{|p| p.model}.join("、")
    when 2
      suf = sale_log.comment
    when 7
      sell_quote = sale_log.sell_quote
      if sell_quote
        if sell_quote.flow_status != 1
          #因为刚生成的时候编号就有了，还是要判断flow_status
          #说明商务处理完成了，返回报价编号
          suf = sell_quote.quote_number
        else
          #说明商务还没弄完，返回自定义提示
          suf = "但还在商务的待办事宜中"
        end
      else
        suf = ""
      end
    when 8
      sell_contract = sale_log.sell_contract
      if sell_contract
        if sell_contract.flow_status == 1
          #说明还在第一步，商务那边没弄完，返回自定义提示
          suf = "但还在商务的待办事宜中"
        elsif sell_contract.flow_status == 2
          #说明商务已经定下了一部分，先把号弄上，再看合同本身的状态
          suf = sell_contract.etsc_number
          if sell_contract.status == 1
            #说明是未完成
            suf += "，但是合同本身还未完成"
          elsif sell_contract.status == 2
            #说明是已经完成
            suf += "，已经完成"
          else
            #说明已经被取消
            suf += "，但已被取消"
          end
#        else
#          #说明合同已经完成
#          suf = "合同已经完成"
        end
      else
        suf = ""
      end
    when 9#这个8和9的区别还要调，先放上再说
      sell_contract = sale_log.sell_contract
      if sell_contract
        if sell_contract.flow_status == "1"
          #说明还在第一步，商务那边没弄完，返回自定义提示
          suf = "但还在商务的待办事宜中"
        elsif sell_contract.flow_status == "2"
          #说明商务已经定下了一部分，先把号弄上，再看合同本身的状态
          suf = sell_contract.etsc_number
          if sell_contract.status == "1"
            #说明是未完成
            suf += "，但是合同本身还未完成"
          elsif sell_contract.status == "2"
            #说明是已经完成
            suf += "，已经完成"
          else
            #说明已经被取消
            suf += "，但已被取消"
          end
#        else
#          #说明合同已经完成
#          suf = "合同已经完成"
        end
      else
        suf = ""
      end
    when 15
      suf = sale_log.comment
    end
#    p suf
    return pre+"："+suf
  end

  #以AJAX方式提交报价时的<表格>内容
  def submit_quote_ajax
#    p params.inspect
    #先看提交来的table_id
    case params[:table_id]
    when "1"#说明是标准报价
      #1.new一件事宜
      task = WorkTask.new
      task.sender_user_id = session[:user_id]
      task.reciever_role_id = Role.find_by_name("商务").id
      task.task_type = 1#产品做报价
      task.sent_on = DateTime.now
      task.deadline = DateTime.strptime(params[:deadline], "%Y年%m月%d日")+(17.0/24)#只好在这里加到17点……
      task.save
      #2.判断是否为新增个案
      if params[:submit][:sale_case_id]=="0"
        #说明是新个案，往个案表里加一条数据
        sale_case=SaleCase.new
        sale_case.number = SaleCase.next_number
        sale_case.start_time = DateTime.now
        sale_case.save
      else
        #说明是旧个案，只是加日志，所以从params里读出sale_case_id
        sale_case = SaleCase.find(params[:submit][:sale_case_id])
      end
      #3.new一条日志
      sl = SaleLog.new
      sl.customer_id = params[:customer_id]
      sl.process = 7#懒得传，直接指定算了，7=>做报价
      sl.contact_time = DateTime.now
      sl.sale_case_id = sale_case.id
      sl.user_id = session[:user_id]
      sl.save

      #4.new一个销售报价
      sq = SellQuote.new
      sq.customer_unit_id = params[:customer_unit_id]
      sq.customer_id = params[:customer_id]
      sq.sale_log_id = sl.id
#      sq.is_dividual = false#不是分项报价，貌似是要汇总用？感觉有点累赘，完全可以从type判断嘛
      sq.sale_user_id = session[:user_id]
      sq.work_task_id = task.id
      sq.language = params[:language]#语种
      sq.currency_id = params[:currency_id]#币种
      sq.our_company_id = params[:our_company_id]#报价以哪个公司名义做
      sq.request = params[:request]#销售那边写的额外要求
      sq.quote_type = params[:table_id]#报价类别
      sq.quote_number = SellQuote.next_number#报价编号
      sq.flow_status = 1#销售已发出请求
      sq.save

      #5.new一个销售报价块
      sqb = SellQuoteBlock.new
      sqb.quantity = 1#一个
      sqb.sell_quote_id = sq.id#取上面的id
      sqb.save#因为只有一块，所以一切都省略

      #6.new各个报价项
      #在params里查找所有键值里的项的键值有“price”的，两层嘛
      sell_quote_item_array = params.select{|k,v| v.member? "price"}
#      sell_quote_item_array大致结构如下：
#      [["p0", {"name"=>"AOIUf(Teledyne Judson Technologies)", "price"=>"EUR678",
#      "quantity"=>"4", "id"=>"3604", "param"=>"测试用数据768", "subtotal"=>"EUR2712"}],
#      ["p1", {"name"=>"Fgh[a(HOYAHOYA CANDEO OPTRONICS株式会社)", "price"=>"GBP777",
#      "quantity"=>"4", "id"=>"5394", "param"=>"测试用数据991", "subtotal"=>"GBP3108"}]]
      for sell_quote_item in sell_quote_item_array
        sqi = SellQuoteItem.new
        sqi.product_id = sell_quote_item[1][:id]
        sqi.product_quantity = sell_quote_item[1][:quantity]
        sqi.sell_quote_block_id = sqb.id
        price = sell_quote_item[1][:price]
        sqi.unit_price = price[3..-1]#价格再切成币种和价值，分别存
        currency = Currency.find_by_type_name(price[0..2])
        sqi.currency_id = currency.id
#        sqi.exchange_rate = currency.exchange_rate#汇率先取出来，编辑后再独立保存
#        --报价项没有汇率，汇率跟币种走的
        sqi.discounted_currency_id = sqb.sell_quote.currency_id
        #折后单价 = 折前单价 * 折前汇率 / 折后汇率
        exchange_rate_before = currency.exchange_rate
        exchange_rate_after = sqb.sell_quote.currency.exchange_rate
        unit_price_after_discount = price[3..-1].to_f * exchange_rate_before.to_f / exchange_rate_after.to_f
        sqi.unit_price_after_discount = unit_price_after_discount
        sqi.discount_to = unit_price_after_discount * sell_quote_item[1][:quantity].to_f
        sqi.parameter = sell_quote_item[1][:param]
        sqi.save
      end
      render :text => {"str" => "OK"}.to_json
    when "2"#说明是单项折扣
      #1.new一件事宜
      task = WorkTask.new
      task.sender_user_id = session[:user_id]
      task.reciever_role_id = Role.find_by_name("商务").id
      task.task_type = 1#产品做报价
      task.sent_on = DateTime.now
#      p params.inspect
      task.deadline = DateTime.strptime(params[:deadline], "%Y年%m月%d日")+(17.0/24)#只好在这里加到17点……
      task.save

      #2.判断是否为新增个案
      if params[:submit][:sale_case_id]=="0"
        #说明是新个案，往个案表里加一条数据
        sale_case=SaleCase.new
        sale_case.number = SaleCase.next_number
        sale_case.start_time = DateTime.now
        sale_case.save
      else
        #说明是旧个案，只是加日志，所以从params里读出sale_case_id
        sale_case = SaleCase.find(params[:submit][:sale_case_id])
      end

      #3.new一条日志
      sl = SaleLog.new
      sl.customer_id = params[:customer_id]
      sl.process = 7#懒得传，直接指定算了，7=>做报价
      sl.contact_time = DateTime.now
      sl.sale_case_id = sale_case.id
      sl.user_id = session[:user_id]
      sl.save

      #4.new一个销售报价
      sq = SellQuote.new
      sq.customer_unit_id = params[:customer_unit_id]
      sq.customer_id = params[:customer_id]
      sq.sale_log_id = sl.id
#      sq.is_dividual = false#不是分项报价，貌似是要汇总用？感觉有点累赘，完全可以从type判断嘛
      sq.sale_user_id = session[:user_id]
      sq.work_task_id = task.id
      sq.language = params[:language]#语种
      sq.currency_id = params[:currency_id]#币种
      sq.our_company_id = params[:our_company_id]#报价以哪个公司名义做
      sq.request = params[:request]#销售那边写的额外要求
      sq.quote_type = params[:table_id]#报价类别
      sq.quote_number = SellQuote.next_number#报价编号
      sq.flow_status = 1#销售已发出请求
      sq.save

      #5.new一个销售报价块
      sqb = SellQuoteBlock.new
      sqb.quantity = 1#一个
      sqb.sell_quote_id = sq.id#取上面的id
      sqb.save#因为只有一块，所以一切都省略

      #6.new各个报价项
      #在params里查找所有键值里的项的键值有“price”的，两层嘛
      sell_quote_item_array = params.select{|k,v| v.member? "price"}
#      sell_quote_item_array大致结构如下：
#      [["p0", {"name"=>"AOIUf(Teledyne Judson Technologies)", "price"=>"EUR678",
#      "quantity"=>"4", "id"=>"3604", "param"=>"测试用数据768", "subtotal"=>"EUR2712"}],
#      ["p1", {"name"=>"Fgh[a(HOYAHOYA CANDEO OPTRONICS株式会社)", "price"=>"GBP777",
#      "quantity"=>"4", "id"=>"5394", "param"=>"测试用数据991", "subtotal"=>"GBP3108"}]]
      for j_sell_quote_item in sell_quote_item_array
        sqi = SellQuoteItem.new
        sqi.product_id = j_sell_quote_item[1][:id]
        sqi.product_quantity = j_sell_quote_item[1][:quantity]
        sqi.sell_quote_block_id = sqb.id
        price = j_sell_quote_item[1][:price]
        sqi.unit_price = price[3..-1]#价格再切成币种和价值，分别存
        currency = Currency.find_by_type_name(price[0..2])
        sqi.currency_id = currency.id
#        sqi.exchange_rate = currency.exchange_rate#汇率先取出来，编辑后再独立保存
        sqi.parameter = j_sell_quote_item[1][:param]
        sqi.discount_rate = j_sell_quote_item[1][:discount_rate]
        sqi.discount_to = j_sell_quote_item[1][:discount_to]
        sqi.save
      end
      render :text => {"str" => "OK"}.to_json
    when "3"#说明是系统报价
      #1.new一件事宜
      task = WorkTask.new
      task.sender_user_id = session[:user_id]
      task.reciever_role_id = Role.find_by_name("商务").id
      task.task_type = 1#产品做报价
      task.sent_on = DateTime.now
      task.deadline = DateTime.strptime(params[:deadline], "%Y年%m月%d日")+(17.0/24)#只好在这里加到17点……
      task.save
#      p "1 OK"

      #2.判断是否为新增个案
      if params[:submit][:sale_case_id]=="0"
        #说明是新个案，往个案表里加一条数据
        sale_case=SaleCase.new
        sale_case.number = SaleCase.next_number
        sale_case.start_time = DateTime.now
        sale_case.save
      else
        #说明是旧个案，只是加日志，所以从params里读出sale_case_id
        sale_case = SaleCase.find(params[:submit][:sale_case_id])
      end
#      p "2 OK"

      #3.new一条日志
      sl = SaleLog.new
      sl.customer_id = params[:customer_id]
      sl.process = 7#懒得传，直接指定算了，7=>做报价
      sl.contact_time = DateTime.now
      sl.sale_case_id = sale_case.id
      sl.user_id = session[:user_id]
      sl.save
#      p "3 OK"

      #4.new一个销售报价
      sq = SellQuote.new
      sq.customer_unit_id = params[:customer_unit_id]
      sq.customer_id = params[:customer_id]
      sq.sale_log_id = sl.id
#      sq.is_dividual = false#不是分项报价，貌似是要汇总用？感觉有点累赘，完全可以从type判断嘛
      sq.sale_user_id = session[:user_id]
      sq.work_task_id = task.id
      sq.language = params[:language]#语种
      sq.currency_id = params[:currency_id]#币种
      sq.our_company_id = params[:our_company_id]#报价以哪个公司名义做
      sq.request = params[:request]#销售那边写的额外要求
      sq.quote_type = params[:table_id]#报价类别
      sq.quote_number = SellQuote.next_number#报价编号
      sq.flow_status = 1#销售已发出请求
      sq.save
#      p "4 OK"

      #5.取报价块数，按报价块数循环来new报价块
      "0".upto("9"){|i|
        s_key = "s"+i
        if params.include?(s_key)#反正系统只能是s0~s9，要改成两位的也就是s00~s99
          s_value = params[s_key]
          sqb = SellQuoteBlock.new
          sqb.description = s_value[:name]
          sqb.quantity = s_value[:quantity]
          sqb.parameter = s_value[:param]
          sqb.sell_quote_id = sq.id#取上面的id
#          p s_value
          sqb.discount_rate = s_value[:discount_rate]
          if s_value[:price] == "待定"
            #如果表格中传来的值是待定，则把报价块的价格暂存为空。至于报价块下报价项货币的统一问题，留着商务那边再弄
            sqb.discount_to = nil
          else
#            p s_value[:price][3..-1].to_f
            #如果不是待定则拆开币种和价格作为单价保存。此情况下无视其下报价项中的各种价格
            sqb.discount_to = s_value[:price][3..-1].to_f
          end
          if s_value[:discount_to] == "待定"
            #如果表格中传来的值是选定，则把报价块的折后价暂存为空。
            sqb.discount_to = nil
          else
            #如果不是待定，则拆出后半截作为折后价保存
            sqb.discount_to = s_value[:discount_to][3..-1].to_f
            #把报价块的折后总价再除以数量，存作折后单价
            sqb.unit_price_after_discount = sqb.discount_to / sqb.quantity
          end
          if s_value[:price] == "待定" && s_value[:discount_to] == "待定"
            sqb.currency_id = nil
          else
            if s_value[:price] == "待定"
              available = s_value[:discount_to]
            else
              available = s_value[:price]
            end
            sqb.currency_id = Currency.find_by_type_name(available[0..2]).id
          end
          sqb.save

          #6.在每个报价块中new报价项
          j = 0
          t = true
          while t == true
            p_key = "p"+j.to_s
#            p s_value.include?(p_key)
            if s_value.include?(p_key)#ruby支持字符串的循环，但不支持循环嵌套的时候变量重置……
              p_value = s_value[p_key]
#              p p_value
              sqi = SellQuoteItem.new
              sqi.product_id = p_value[:id]
              sqi.product_quantity = p_value[:quantity]
              sqi.sell_quote_block_id = sqb.id
              price = p_value[:price]
              sqi.unit_price = price[3..-1]#价格再切成币种和价值，分别存
              currency = Currency.find_by_type_name(price[0..2])
              sqi.currency_id = currency.id
#              sqi.exchange_rate = currency.exchange_rate#汇率先取出来，编辑后再独立保存#没有汇率这一项了
              sqi.parameter = p_value[:param]
              sqi.discount_rate = p_value[:discount_rate]
              discount_to = p_value[:discount_to]
              sqi.discount_to = discount_to[3..-1]#折后价格也切出价值来，币种上面有了
              sqi.save

              j = j + 1#土法循环……
            else
              t = false
            end
          end
        end
      }
      render :text => {"str" => "OK"}.to_json
    when "4"#说明是阶梯报价
      #1.new一件事宜
      task = WorkTask.new
      task.sender_user_id = session[:user_id]
      task.reciever_role_id = Role.find_by_name("商务").id
      task.task_type = 1#产品做报价
      task.sent_on = DateTime.now
      task.deadline = DateTime.strptime(params[:deadline], "%Y年%m月%d日")+(17.0/24)#只好在这里加到17点……
      task.save

      #2.判断是否为新增个案
      if params[:submit][:sale_case_id]=="0"
        #说明是新个案，往个案表里加一条数据
        sale_case=SaleCase.new
        sale_case.number = SaleCase.next_number
        sale_case.start_time = DateTime.now
        sale_case.save
      else
        #说明是旧个案，只是加日志，所以从params里读出sale_case_id
        sale_case = SaleCase.find(params[:submit][:sale_case_id])
      end

      #3.new一条日志
      sl = SaleLog.new
      sl.customer_id = params[:customer_id]
      sl.process = 7#懒得传，直接指定算了，7=>做报价
      sl.contact_time = DateTime.now
      sl.sale_case_id = sale_case.id
      sl.user_id = session[:user_id]
      sl.save

      #4.new一个销售报价
      sq = SellQuote.new
      sq.customer_unit_id = params[:customer_unit_id]
      sq.customer_id = params[:customer_id]
      sq.sale_log_id = sl.id
#      sq.is_dividual = false#不是分项报价，貌似是要汇总用？感觉有点累赘，完全可以从type判断嘛
      sq.sale_user_id = session[:user_id]
      sq.work_task_id = task.id
      sq.language = params[:language]#语种
      sq.currency_id = params[:currency_id]#币种
      sq.our_company_id = params[:our_company_id]#报价以哪个公司名义做
      sq.request = params[:request]#销售那边写的额外要求
      sq.quote_type = params[:table_id]#报价类别
      sq.quote_number = SellQuote.next_number#报价编号
      sq.flow_status = 1#销售已发出请求
      sq.save

      #5.new一个销售报价块
      sqb = SellQuoteBlock.new
      sqb.quantity = 1#一个
      sqb.sell_quote_id = sq.id#取上面的id
      sqb.save#因为只有一块，所以一切都省略

      #6.new各个报价项
      #在params里查找所有键值里的项的键值有“price”的，两层嘛
      sell_quote_item_array = params.select{|k,v| v.member? "price"}
#      sell_quote_item_array大致结构如下：
#      [["p0", {"name"=>"AOIUf(Teledyne Judson Technologies)", "price"=>"EUR678",
#      "quantity"=>"4", "id"=>"3604", "param"=>"测试用数据768", "subtotal"=>"EUR2712"}],
#      ["p1", {"name"=>"Fgh[a(HOYAHOYA CANDEO OPTRONICS株式会社)", "price"=>"GBP777",
#      "quantity"=>"4", "id"=>"5394", "param"=>"测试用数据991", "subtotal"=>"GBP3108"}]]
      for t_sell_quote_item in sell_quote_item_array
        sqi = SellQuoteItem.new
        sqi.product_id = t_sell_quote_item[1][:id]
        sqi.product_quantity = t_sell_quote_item[1][:quantity]
        sqi.product_quantity_2 = t_sell_quote_item[1][:quantity_2]
        sqi.sell_quote_block_id = sqb.id
        price = t_sell_quote_item[1][:price]
        sqi.unit_price = price[3..-1]#价格再切成币种和价值，分别存
        currency = Currency.find_by_type_name(price[0..2])
        sqi.currency_id = currency.id
#        sqi.exchange_rate = currency.exchange_rate#汇率先取出来，编辑后再独立保存
        sqi.parameter = t_sell_quote_item[1][:param]
        sqi.save
      end
      render :text => {"str" => "OK"}.to_json
    end
  end

#  def do_process
#    p params.to_json
#    render :text => params.to_json
#  end
end
