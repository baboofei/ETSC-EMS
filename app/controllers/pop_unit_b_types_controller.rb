class PopUnitBTypesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /pop_unit_b_types
  # GET /pop_unit_b_types.xml
  def index
    @pop_unit_b_types = PopUnitBType.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @pop_unit_b_types }
    end
  end

  # GET /pop_unit_b_types/1
  # GET /pop_unit_b_types/1.xml
  def show
    @pop_unit_b_type = PopUnitBType.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @pop_unit_b_type }
    end
  end

  # GET /pop_unit_b_types/new
  # GET /pop_unit_b_types/new.xml
  def new
    @pop_unit_b_type = PopUnitBType.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @pop_unit_b_type }
    end
  end

  # GET /pop_unit_b_types/1/edit
  def edit
    @pop_unit_b_type = PopUnitBType.find(params[:id])
  end

  # POST /pop_unit_b_types
  # POST /pop_unit_b_types.xml
  def create
    @pop_unit_b_type = PopUnitBType.new(params[:pop_unit_b_type])

    respond_to do |format|
      if @pop_unit_b_type.save
        format.html { redirect_to(@pop_unit_b_type, :notice => 'Pop unit b type was successfully created.') }
        format.xml  { render :xml => @pop_unit_b_type, :status => :created, :location => @pop_unit_b_type }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @pop_unit_b_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /pop_unit_b_types/1
  # PUT /pop_unit_b_types/1.xml
  def update
    @pop_unit_b_type = PopUnitBType.find(params[:id])

    respond_to do |format|
      if @pop_unit_b_type.update_attributes(params[:pop_unit_b_type])
        format.html { redirect_to(@pop_unit_b_type, :notice => 'Pop unit b type was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @pop_unit_b_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /pop_unit_b_types/1
  # DELETE /pop_unit_b_types/1.xml
  def destroy
    @pop_unit_b_type = PopUnitBType.find(params[:id])
    @pop_unit_b_type.destroy

    respond_to do |format|
      format.html { redirect_to(pop_unit_b_types_url) }
      format.xml  { head :ok }
    end
  end
end
