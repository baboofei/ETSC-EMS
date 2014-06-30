class HistoryContractsController < ApplicationController
  # GET /history_contracts
  # GET /history_contracts.xml
  def index
    @history_contracts = HistoryContract.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @history_contracts }
    end
  end

  # GET /history_contracts/1
  # GET /history_contracts/1.xml
  def show
    @history_contract = HistoryContract.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @history_contract }
    end
  end

  # GET /history_contracts/new
  # GET /history_contracts/new.xml
  def new
    @history_contract = HistoryContract.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @history_contract }
    end
  end

  # GET /history_contracts/1/edit
  def edit
    @history_contract = HistoryContract.find(params[:id])
  end

  # POST /history_contracts
  # POST /history_contracts.xml
  def create
    @history_contract = HistoryContract.new(params[:history_contract])

    respond_to do |format|
      if @history_contract.save
        format.html { redirect_to(@history_contract, :notice => 'History contract was successfully created.') }
        format.xml  { render :xml => @history_contract, :status => :created, :location => @history_contract }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @history_contract.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /history_contracts/1
  # PUT /history_contracts/1.xml
  def update
    @history_contract = HistoryContract.find(params[:id])

    respond_to do |format|
      if @history_contract.update_attributes(params[:history_contract])
        format.html { redirect_to(@history_contract, :notice => 'History contract was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @history_contract.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /history_contracts/1
  # DELETE /history_contracts/1.xml
  def destroy
    @history_contract = HistoryContract.find(params[:id])
    @history_contract.destroy

    respond_to do |format|
      format.html { redirect_to(history_contracts_url) }
      format.xml  { head :ok }
    end
  end

  #取出合同变动下所有变动项。此项只能读，而且细节全是自然语言
  def get_all
    respond_to do |format|
      format.json {
        #不支持排序，就相当于用默认的ID降序排
        history_json = gen_history_paginate_json(params[:start],params[:limit])#,params[:keyword])#,params[:sort],params[:dir])
        render :text => history_json.to_json
      }
    end
  end
  
  def gen_history_paginate_json(start,limit,keyword="",sort="id",dir="DESC")
    history_json = []
    #没有关键字，全部
    total_records = HistoryContract.where("contract_id = ?", params["contract_id"])
    histories = HistoryContract.where("contract_id = ?", params["contract_id"]).limit(limit.to_i).offset(start.to_i).order(sort + " " + dir)
    for history in histories
      history_json << gen_etsc_history_json(history)
    end
    {"totalRecords" => total_records.size.to_s, "data" => history_json}
  end

  #自定义生成所需字段的json，给“增”“改”“查”用
  def gen_etsc_history_json(history)
    {
      "change_detail" => history.change_detail,
      "user_name" => User.find(history.user_id).real_name,
      "updated_at" => history.updated_at.strftime("%Y年%m月%d日"),
      "reason" => history.reason,
      "id" => history.id
    }
  end
end

