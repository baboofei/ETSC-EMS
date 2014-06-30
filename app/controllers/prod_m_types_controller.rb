class ProdMTypesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /prod_m_types
  # GET /prod_m_types.xml
  def index
    @prod_m_types = ProdMType.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @prod_m_types }
    end
  end

  # GET /prod_m_types/1
  # GET /prod_m_types/1.xml
  def show
    @prod_m_type = ProdMType.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @prod_m_type }
    end
  end

  # GET /prod_m_types/new
  # GET /prod_m_types/new.xml
  def new
    @prod_m_type = ProdMType.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @prod_m_type }
    end
  end

  # GET /prod_m_types/1/edit
  def edit
    @prod_m_type = ProdMType.find(params[:id])
  end

  # POST /prod_m_types
  # POST /prod_m_types.xml
  def create
    @prod_m_type = ProdMType.new(params[:prod_m_type])

    respond_to do |format|
      if @prod_m_type.save
        format.html { redirect_to(@prod_m_type, :notice => 'Prod m type was successfully created.') }
        format.xml  { render :xml => @prod_m_type, :status => :created, :location => @prod_m_type }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @prod_m_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /prod_m_types/1
  # PUT /prod_m_types/1.xml
  def update
    @prod_m_type = ProdMType.find(params[:id])

    respond_to do |format|
      if @prod_m_type.update_attributes(params[:prod_m_type])
        format.html { redirect_to(@prod_m_type, :notice => 'Prod m type was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @prod_m_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /prod_m_types/1
  # DELETE /prod_m_types/1.xml
  def destroy
    @prod_m_type = ProdMType.find(params[:id])
    @prod_m_type.destroy

    respond_to do |format|
      format.html { redirect_to(prod_m_types_url) }
      format.xml  { head :ok }
    end
  end

  #所有中类小类的级别关系，并生成JSON供combotree用
  def get_prod_m_and_s_type
    respond_to do |format|
      format.json {
        prod_m_and_s_type = gen_prod_m_and_s_type
        render :text => prod_m_and_s_type
      }
    end
  end

  def gen_prod_m_and_s_type(dummy = nil)
    output_array = []
    prod_m_types = ProdMType.all
    for prod_m_type in prod_m_types
      prod_s_type_array = []
      prod_s_types = ProdSType.where("prod_m_type_id = ?", prod_m_type.id)
      for prod_s_type in prod_s_types
        prod_s_type_array << {
          "text" => prod_s_type.name,
          "id" => pre_add_zero(prod_m_type.id,3) + "_" + pre_add_zero(prod_s_type.id,3),
          "leaf" => true
        }
      end
      output_array << {
        "text" => prod_m_type.name,
        "id" => pre_add_zero(prod_m_type.id,3),
#        "leaf" => false,
        "children" => prod_s_type_array
      }
    end
    return output_array.to_json
  end
end
