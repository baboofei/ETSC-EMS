class EventsController < ApplicationController
  include ActionView::Helpers::TextHelper
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /events
  # GET /events.xml
  def index
    @events = Event.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @events }
    end
  end

  # GET /events/1
  # GET /events/1.xml
  def show
    @event = Event.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @event }
    end
  end

  # GET /events/new
  # GET /events/new.xml
  def new
    @event = Event.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @event }
    end
  end

  # GET /events/1/edit
  def edit
    @event = Event.find(params[:id])
    @title = @event.title
  end

  # POST /events
  # POST /events.xml
  def create
    @event = Event.new(params[:event])

    respond_to do |format|
      if @event.save
        format.html { redirect_to(@event, :notice => 'Event was successfully created.') }
        format.xml  { render :xml => @event, :status => :created, :location => @event }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /events/1
  # PUT /events/1.xml
  def update
    @event = Event.find(params[:id])

    respond_to do |format|
      if @event.update_attributes(params[:event])
        format.html { redirect_to(@event, :notice => 'Event was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1
  # DELETE /events/1.xml
  def destroy
    @event = Event.find(params[:id])
    @event.destroy

    respond_to do |format|
      format.html { redirect_to(events_url) }
      format.xml  { head :ok }
    end
  end

  def normal_create
    auto_change_to_blank
    @event = Event.new(params[:submit])

    respond_to do |format|
      if @event.save
        format.html { redirect_to :action => "index" }
        format.xml  { head :ok }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  def normal_update
    @event = Event.find(params[:id])
    auto_change_to_blank

    respond_to do |format|
      if @event.update_attributes(params[:submit])
        #对已经选过来的产品循环，在events_events表中先删除新闻ID对应所有数据，然后再添加相应条数据
        EventsEvent.delete_all(["event_id = ?", params[:id]])
        for event in params[:submit][:relate_event_id].split("|")
          new_events_event = EventsEvent.new()
          new_events_event.event_id = @event.id
          new_events_event.event_id = event.to_i
          new_events_event.save
        end
        format.html { redirect_to :action => "index" }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  def auto_change_to_blank
    params[:submit][:title] = "" if params[:submit][:title] == "请输入新闻标题……"
  end

  def ext_paginate
    #响应分页事件
    respond_to do |format|
      #      if request.post?
      format.json {
        event_json = gen_event_paginate_json(params[:start].to_i,params[:limit],params[:sort],params[:dir],params[:keyword])
        render :text => event_json.to_json
      }
      #      elsif request.get?
      #        format.html
      #        format.json
      #      end
    end
  end

  #保存指定系列和新闻之间的关系
  def save_serial_ids(event_id, serials_ids)
    serial_id_array = (serials_ids.blank? ? [] : serials_ids.split("|"))
    EventsSerial.delete_all(["event_id = ?", event_id])
    for serial_id in serial_id_array
      event_serial = EventsSerial.new("event_id" => event_id, "serial_id" => serial_id)
      event_serial.save
    end
  end

  def gen_event_paginate_json(start,limit,keyword,sort="id",dir="DESC")
    #生成新闻的分页JSON
    event_json=[]
    if keyword.blank?
      #没有关键字，那就是全部
      total_records = Event.all
      events = Event.limit(limit.to_i).offset(start.to_i).order(sort + " " + dir)
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
      columns = %w(name model simple_description_cn simple_description_en)
      fore_conditions_keyword = []#按关键字再循环后的数组
      back_conditions = []
      #先对关键字循环
      for i_keyword in keywords
        #再对字段循环
        fore_conditions_column = []#按字段循环后的数组
        for column in columns
          fore_conditions_column << "events."+column+" like ?"#这里需要注意，带“表名”，为避免多表里有重名字段要特别标记之
          back_conditions << "%"+i_keyword+"%"
        end
        #以下是跨表字段，单独写
        fore_conditions_column << "vendor_units.name like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "vendor_units.en_name like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "serials.description like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "serials.application_in_site like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "serials.parameter_in_site like ?"
        back_conditions << "%"+i_keyword+"%"
        fore_conditions_column << "serials.feature like ?"
        back_conditions << "%"+i_keyword+"%"

        fore_condition_column = "(" + fore_conditions_column.join(" or ") + ")"#这一层全是or，因为是针对每个字段
        fore_conditions_keyword << fore_condition_column
      end
      fore_condition = fore_conditions_keyword.join(" "+joint+" ")
      conditions = fore_condition.to_a + back_conditions
      #跨表查询，include后面带的是“模型”里“belongs_to”或者“has_many”的那个东东
      #      total_records = Event.find(:all, :conditions => conditions, :include => [:producer])
      #      events = Event.find(:all,
      #        :order => "events."+sort+" "+dir,#这里也有重名字段问题，所以一定要写前面的表名
      #        :conditions => conditions,
      #        :limit => limit,
      #        :offset => start,
      #        :include => [:producer])
      total_records = Event.where(*conditions).includes(:producer, :serial)
      events = Event.where(*conditions).includes(:producer, :serial).order("events."+sort+" "+dir).limit(limit).offset(start.to_i)
    end
    for event in events
      #      p event.producer
      event_json << gen_etsc_event_json(event)
    end
    {"totalRecords" => total_records.size.to_s, "data" => event_json}
  end

  #生成包含关键字的所有新闻标题的JSON，以供输入时下拉提示
  def get_title_q
    respond_to do |format|
      format.json {
        title = gen_title_q(params[:query])
        render :text => title.to_json
      }
    end
  end

  def gen_title_q(query)
    t_array = []
    events = Event.where("title like ?", "%#{query}%")
    for event in events
      t_array << {
        "title" => event.title,
        "id" => event.id
      }
    end
    return t_array
  end

  def get_ini_value
    respond_to do |format|
      format.json {
        cur_news = Event.find(params[:id])
        event_sort = cur_news.event_sort
        content = cur_news.content
        relate_events_str = cur_news.events.map{|p| p.model+"("+p.producer.name+")"+"|"+p.id.to_s}.join("$$")

        ini_array = eval("{"+
            "'event_sort' => '"+ event_sort.to_s+
            "', 'content' => '"+ content.to_s+
            "', 'relate_events_str' => '"+ relate_events_str+
            "'}")
        #        p ini_array
        render :text => ini_array.to_json
      }
    end
  end
  def restful
    if request.get?
      #查
      respond_to do |format|
        format.json {
          if params[:sort].nil?
            #如果没有在表格里排序，则没有参数传回来，不管，就相当于用默认的ID降序排
            event_json = gen_event_paginate_json(params[:start],params[:limit],params[:keyword])#,params[:sort],params[:dir])
          else
            #如果表格里有排序，会传过来类似"[{\"property\":\"mobile\",\"direction\":\"ASC\"}]"的参数
            sort_param_hash = JSON.parse(params[:sort])
            sort = sort_param_hash[0]["property"]
            dir = sort_param_hash[0]["direction"]
            event_json = gen_event_paginate_json(params[:start],params[:limit],params[:keyword],sort,dir)
          end
          render :text => event_json.to_json
        }
      end
    elsif request.put?
      #改
      data = params["data"]

      save_serial_ids(data["id"], data["serials_ids"])

      #处理完毕，新增json、砍多余字段
      event_json = []
      event_id = data["id"]
      event = Event.find(event_id)
      data.delete("id")
      data.delete("serials_ids")
      #保存
      event.update_attributes(data)
      data["id"] = event_id
      event_json << gen_etsc_event_json(event)
      render :text => {"success" => true, "message" => "已修改", "data" => event_json}.to_json
    elsif request.post?
      #增
      data = params["data"]
      temp_serials_ids = data["serials_ids"]

      #处理完毕，新增json、砍多余字段
      event_json = []
      data.delete("serials_ids")
      data.delete("serials_names")

      event = Event.new(data)
      event.save
      data["id"] = event.id

      save_serial_ids(data["id"], temp_serials_ids)

      event_json << gen_etsc_event_json(event)
      render :text => {"success" => true, "message" => "已新建", "data" => event_json}.to_json
    end
  end

  #自定义生成所需字段的json，给“增”“改”“查”用
  def gen_etsc_event_json(event)
    serials_names = event.serials.map{|p| p.name_txt}.join("、")
    {
      "title" => event.title,
      "content" => event.content,
      "event_sort" => event.event_sort,
      "serials_ids" => event.serials.map{|p| p.id}.join("|"),
      "serials_names" => serials_names,
      "id" => event.id
    }
  end

end
