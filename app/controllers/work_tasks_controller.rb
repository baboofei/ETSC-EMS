class WorkTasksController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /work_tasks
  # GET /work_tasks.xml
  def index
    @tasks = WorkTask.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @tasks }
    end
  end

  # GET /work_tasks/1
  # GET /work_tasks/1.xml
  def show
    @task = WorkTask.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @task }
    end
  end

  # GET /work_tasks/new
  # GET /work_tasks/new.xml
  def new
    @task = WorkTask.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @task }
    end
  end

  # GET /work_tasks/1/edit
  def edit
    @task = WorkTask.find(params[:id])
    case @task[:task_type]
    when 1#销售报价
      #      p "销售报价"
      redirect_to :controller => "sell_quotes", :action => "edit", :id => @task.sell_quote.id
    when 3#销售合同
      redirect_to :controller => "contracts", :action => "edit", :id => @task.contract.id
    end
  end

  # POST /work_tasks
  # POST /work_tasks.xml
  def create
    @task = WorkTask.new(params[:task])

    respond_to do |format|
      if @task.save
        format.html { redirect_to(@task, :notice => 'WorkTask was successfully created.') }
        format.xml  { render :xml => @task, :status => :created, :location => @task }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /work_tasks/1
  # PUT /work_tasks/1.xml
  def update
    @task = WorkTask.find(params[:id])

    respond_to do |format|
      if @task.update_attributes(params[:task])
        format.html { redirect_to(@task, :notice => 'WorkTask was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @task.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /work_tasks/1
  # DELETE /work_tasks/1.xml
  def destroy
    @task = WorkTask.find(params[:id])
    @task.destroy

    respond_to do |format|
      format.html { redirect_to(tasks_url) }
      format.xml  { head :ok }
    end
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
      format.json {
        task_json = gen_task_paginate_json(params[:start].to_i,params[:limit],params[:sort],params[:dir],params[:keyword],params[:button_filter])
        render :text => task_json.to_json
      }
    end
  end

  def gen_task_paginate_json(start,limit,sort,dir,keyword,button_filter)
    role_condition = true
    #    p button_filter
    case button_filter.to_s
    when "0"
      #一个都没选，条件里加上false
      role_condition = false
    when "1"
      #选上了“待办事宜”，条件里加上“完成时间为空”
      role_condition = "completed_on is null"
    when "2"
      #选上了“已办事宜”，条件里加上“完成时间不为空且最后经手人是自己”
      role_condition = "completed_on is not null and last_user_id = #{session[:user_id]}"
    when "3"
      #选上了“待办事宜”和“已办事宜”，条件里加上以上两条的“or”
      role_condition = "(completed_on is null or (completed_on is not null and last_user_id = #{session[:user_id]}))"
    end
    #再加上一个条件，就是只看自己角色能看的，也就是事宜的接收角色=自身的角色
    role_array = User.find(session[:user_id]).roles.map{|p| "receiver_role_id = #{p.id}"}
    role_expr = role_array.join(" or ")
    role_expr = "(" + role_expr + ")"

    role_condition = role_condition.to_s + " and #{role_expr}"

    #生成待办事宜列表的分页JSON
    task_json=[]
    if keyword.blank?
      #没有关键字，那就是用上面的条件
      #      p role_condition
      tasks = WorkTask.find(:all, :limit => limit, :offset => start, :order => sort+" "+dir, :conditions => role_condition)
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
      columns = %w(sent_on completed_on deadline)#不能带虚拟属性查询，这是个大问题……
      fore_conditions_keyword = []#按关键字再循环后的数组
      back_conditions = []
      #先对关键字循环
      for i_keyword in keywords
        #再对字段循环
        fore_conditions_column = []#按字段循环后的数组
        for column in columns
          fore_conditions_column << "tasks."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
          back_conditions << "%"+i_keyword+"%"
        end
        #        #以下是跨表字段，单独写
        #        fore_conditions_column << "vendor_units.name like ?"
        #        back_conditions << "%"+keyword+"%"
        #        fore_conditions_column << "vendor_units.en_name like ?"
        #        back_conditions << "%"+keyword+"%"
        #
        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
        fore_conditions_keyword << fore_condition_column
      end
      fore_condition = fore_conditions_keyword.join(" "+joint+" ") + " and " + role_condition
      conditions = fore_condition.to_a + back_conditions
      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
      total_records = WorkTask.find(:all, :conditions => conditions)
      tasks = WorkTask.find(:all,
        :order => "tasks."+sort+" "+dir,#这里也有重名字段问题，所以一定要写前面的表名
        :conditions => conditions,
        :limit => limit,
        :offset => start)
    end
    for task in tasks
      task_json << {"task_type" => task.type_txt,
        "content" => task.content_txt,
        "deadline" => task.deadline.strftime("%Y-%m-%d"),
        "sender" => task.sender.real_name,
        "sent_on" => task.sent_on.strftime("%Y-%m-%d %H:%M"),
        "last_user" => task.last_user.blank? ? "无" : task.last_user.real_name,
        "id" => task.id
      }
    end
    {"totalRecords" => tasks.size.to_s, "root" => task_json}
  end
end
