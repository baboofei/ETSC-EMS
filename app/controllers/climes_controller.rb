class ClimesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /climes
  # GET /climes.xml
  def index
    @climes = Clime.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @climes }
    end
  end

  # GET /climes/1
  # GET /climes/1.xml
  def show
    @clime = Clime.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @clime }
    end
  end

  # GET /climes/new
  # GET /climes/new.xml
  def new
    @clime = Clime.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @clime }
    end
  end

  # GET /climes/1/edit
  def edit
    @clime = Clime.find(params[:id])
  end

  # POST /climes
  # POST /climes.xml
  def create
    @clime = Clime.new(params[:clime])

    respond_to do |format|
      if @clime.save
        format.html { redirect_to(@clime, :notice => 'Clime was successfully created.') }
        format.xml  { render :xml => @clime, :status => :created, :location => @clime }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @clime.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /climes/1
  # PUT /climes/1.xml
  def update
    @clime = Clime.find(params[:id])

    respond_to do |format|
      if @clime.update_attributes(params[:clime])
        format.html { redirect_to(@clime, :notice => 'Clime was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @clime.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /climes/1
  # DELETE /climes/1.xml
  def destroy
    @clime = Clime.find(params[:id])
    @clime.destroy

    respond_to do |format|
      format.html { redirect_to(climes_url) }
      format.xml  { head :ok }
    end
  end
end
