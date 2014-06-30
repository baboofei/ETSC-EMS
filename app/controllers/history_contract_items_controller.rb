class HistoryContractItemsController < ApplicationController
  # GET /history_contract_items
  # GET /history_contract_items.xml
  def index
    @history_contract_items = HistoryContractItem.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @history_contract_items }
    end
  end

  # GET /history_contract_items/1
  # GET /history_contract_items/1.xml
  def show
    @history_contract_item = HistoryContractItem.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @history_contract_item }
    end
  end

  # GET /history_contract_items/new
  # GET /history_contract_items/new.xml
  def new
    @history_contract_item = HistoryContractItem.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @history_contract_item }
    end
  end

  # GET /history_contract_items/1/edit
  def edit
    @history_contract_item = HistoryContractItem.find(params[:id])
  end

  # POST /history_contract_items
  # POST /history_contract_items.xml
  def create
    @history_contract_item = HistoryContractItem.new(params[:history_contract_item])

    respond_to do |format|
      if @history_contract_item.save
        format.html { redirect_to(@history_contract_item, :notice => 'History contract item was successfully created.') }
        format.xml  { render :xml => @history_contract_item, :status => :created, :location => @history_contract_item }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @history_contract_item.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /history_contract_items/1
  # PUT /history_contract_items/1.xml
  def update
    @history_contract_item = HistoryContractItem.find(params[:id])

    respond_to do |format|
      if @history_contract_item.update_attributes(params[:history_contract_item])
        format.html { redirect_to(@history_contract_item, :notice => 'History contract item was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @history_contract_item.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /history_contract_items/1
  # DELETE /history_contract_items/1.xml
  def destroy
    @history_contract_item = HistoryContractItem.find(params[:id])
    @history_contract_item.destroy

    respond_to do |format|
      format.html { redirect_to(history_contract_items_url) }
      format.xml  { head :ok }
    end
  end
end
