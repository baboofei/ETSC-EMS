class ProdBTypesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /prod_b_types
  # GET /prod_b_types.xml
  def index
    @prod_b_types = ProdBType.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @prod_b_types }
    end
  end

  # GET /prod_b_types/1
  # GET /prod_b_types/1.xml
  def show
    @prod_b_type = ProdBType.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @prod_b_type }
    end
  end

  # GET /prod_b_types/new
  # GET /prod_b_types/new.xml
  def new
    @prod_b_type = ProdBType.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @prod_b_type }
    end
  end

  # GET /prod_b_types/1/edit
  def edit
    @prod_b_type = ProdBType.find(params[:id])
  end

  # POST /prod_b_types
  # POST /prod_b_types.xml
  def create
    @prod_b_type = ProdBType.new(params[:prod_b_type])

    respond_to do |format|
      if @prod_b_type.save
        format.html { redirect_to(@prod_b_type, :notice => 'Prod b type was successfully created.') }
        format.xml  { render :xml => @prod_b_type, :status => :created, :location => @prod_b_type }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @prod_b_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /prod_b_types/1
  # PUT /prod_b_types/1.xml
  def update
    @prod_b_type = ProdBType.find(params[:id])

    respond_to do |format|
      if @prod_b_type.update_attributes(params[:prod_b_type])
        format.html { redirect_to(@prod_b_type, :notice => 'Prod b type was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @prod_b_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /prod_b_types/1
  # DELETE /prod_b_types/1.xml
  def destroy
    @prod_b_type = ProdBType.find(params[:id])
    @prod_b_type.destroy

    respond_to do |format|
      format.html { redirect_to(prod_b_types_url) }
      format.xml  { head :ok }
    end
  end
end
