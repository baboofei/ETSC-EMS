class JobHistoriesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /job_histories
  # GET /job_histories.xml
  def index
    @job_histories = JobHistory.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @job_histories }
    end
  end

  # GET /job_histories/1
  # GET /job_histories/1.xml
  def show
    @job_history = JobHistory.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @job_history }
    end
  end

  # GET /job_histories/new
  # GET /job_histories/new.xml
  def new
    @job_history = JobHistory.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @job_history }
    end
  end

  # GET /job_histories/1/edit
  def edit
    @job_history = JobHistory.find(params[:id])
  end

  # POST /job_histories
  # POST /job_histories.xml
  def create
    @job_history = JobHistory.new(params[:job_history])

    respond_to do |format|
      if @job_history.save
        format.html { redirect_to(@job_history, :notice => 'Job history was successfully created.') }
        format.xml  { render :xml => @job_history, :status => :created, :location => @job_history }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @job_history.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /job_histories/1
  # PUT /job_histories/1.xml
  def update
    @job_history = JobHistory.find(params[:id])

    respond_to do |format|
      if @job_history.update_attributes(params[:job_history])
        format.html { redirect_to(@job_history, :notice => 'Job history was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @job_history.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /job_histories/1
  # DELETE /job_histories/1.xml
  def destroy
    @job_history = JobHistory.find(params[:id])
    @job_history.destroy

    respond_to do |format|
      format.html { redirect_to(job_histories_url) }
      format.xml  { head :ok }
    end
  end
end
