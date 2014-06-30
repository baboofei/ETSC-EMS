class ProdSTypesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /prod_s_types
  # GET /prod_s_types.xml
  def index
    @prod_s_types = ProdSType.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @prod_s_types }
    end
  end

  # GET /prod_s_types/1
  # GET /prod_s_types/1.xml
  def show
    @prod_s_type = ProdSType.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @prod_s_type }
    end
  end

  # GET /prod_s_types/new
  # GET /prod_s_types/new.xml
  def new
    @prod_s_type = ProdSType.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @prod_s_type }
    end
  end

  # GET /prod_s_types/1/edit
  def edit
    @prod_s_type = ProdSType.find(params[:id])
  end

  # POST /prod_s_types
  # POST /prod_s_types.xml
  def create
    @prod_s_type = ProdSType.new(params[:prod_s_type])

    respond_to do |format|
      if @prod_s_type.save
        format.html { redirect_to(@prod_s_type, :notice => 'Prod s type was successfully created.') }
        format.xml  { render :xml => @prod_s_type, :status => :created, :location => @prod_s_type }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @prod_s_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /prod_s_types/1
  # PUT /prod_s_types/1.xml
  def update
    @prod_s_type = ProdSType.find(params[:id])

    respond_to do |format|
      if @prod_s_type.update_attributes(params[:prod_s_type])
        format.html { redirect_to(@prod_s_type, :notice => 'Prod s type was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @prod_s_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /prod_s_types/1
  # DELETE /prod_s_types/1.xml
  def destroy
    @prod_s_type = ProdSType.find(params[:id])
    @prod_s_type.destroy

    respond_to do |format|
      format.html { redirect_to(prod_s_types_url) }
      format.xml  { head :ok }
    end
  end
end
