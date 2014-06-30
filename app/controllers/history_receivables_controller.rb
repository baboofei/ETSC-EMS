class HistoryReceivablesController < ApplicationController
  # GET /history_receivables
  # GET /history_receivables.xml
  def index
    @history_receivables = HistoryReceivable.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @history_receivables }
    end
  end

  # GET /history_receivables/1
  # GET /history_receivables/1.xml
  def show
    @history_receivable = HistoryReceivable.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @history_receivable }
    end
  end

  # GET /history_receivables/new
  # GET /history_receivables/new.xml
  def new
    @history_receivable = HistoryReceivable.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @history_receivable }
    end
  end

  # GET /history_receivables/1/edit
  def edit
    @history_receivable = HistoryReceivable.find(params[:id])
  end

  # POST /history_receivables
  # POST /history_receivables.xml
  def create
    @history_receivable = HistoryReceivable.new(params[:history_receivable])

    respond_to do |format|
      if @history_receivable.save
        format.html { redirect_to(@history_receivable, :notice => 'History receivable was successfully created.') }
        format.xml  { render :xml => @history_receivable, :status => :created, :location => @history_receivable }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @history_receivable.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /history_receivables/1
  # PUT /history_receivables/1.xml
  def update
    @history_receivable = HistoryReceivable.find(params[:id])

    respond_to do |format|
      if @history_receivable.update_attributes(params[:history_receivable])
        format.html { redirect_to(@history_receivable, :notice => 'History receivable was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @history_receivable.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /history_receivables/1
  # DELETE /history_receivables/1.xml
  def destroy
    @history_receivable = HistoryReceivable.find(params[:id])
    @history_receivable.destroy

    respond_to do |format|
      format.html { redirect_to(history_receivables_url) }
      format.xml  { head :ok }
    end
  end
end
