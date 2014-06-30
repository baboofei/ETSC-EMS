class BusinessUnitAliasesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  # GET /business_unit_aliases
  # GET /business_unit_aliases.xml
  def index
    @business_unit_aliases = BusinessUnitAlias.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @business_unit_aliases }
    end
  end

  # GET /business_unit_aliases/1
  # GET /business_unit_aliases/1.xml
  def show
    @business_unit_alias = BusinessUnitAlias.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @business_unit_alias }
    end
  end

  # GET /business_unit_aliases/new
  # GET /business_unit_aliases/new.xml
  def new
    @business_unit_alias = BusinessUnitAlias.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @business_unit_alias }
    end
  end

  # GET /business_unit_aliases/1/edit
  def edit
    @business_unit_alias = BusinessUnitAlias.find(params[:id])
  end

  # POST /business_unit_aliases
  # POST /business_unit_aliases.xml
  def create
    @business_unit_alias = BusinessUnitAlias.new(params[:business_unit_alias])

    respond_to do |format|
      if @business_unit_alias.save
        format.html { redirect_to(@business_unit_alias, :notice => 'Business unit alias was successfully created.') }
        format.xml  { render :xml => @business_unit_alias, :status => :created, :location => @business_unit_alias }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @business_unit_alias.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /business_unit_aliases/1
  # PUT /business_unit_aliases/1.xml
  def update
    @business_unit_alias = BusinessUnitAlias.find(params[:id])

    respond_to do |format|
      if @business_unit_alias.update_attributes(params[:business_unit_alias])
        format.html { redirect_to(@business_unit_alias, :notice => 'Business unit alias was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @business_unit_alias.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /business_unit_aliases/1
  # DELETE /business_unit_aliases/1.xml
  def destroy
    @business_unit_alias = BusinessUnitAlias.find(params[:id])
    @business_unit_alias.destroy

    respond_to do |format|
      format.html { redirect_to(business_unit_aliases_url) }
      format.xml  { head :ok }
    end
  end

  #根据传入的文本和ids，通过AJAX方式给指定单位增加别称
  def add_from_input(dummy = nil)
    #先看传入的文本在别称表里有没有
    business_unit_alias = BusinessUnitAlias.find_by_unit_alias(params["alias"])
    if business_unit_alias.blank?
      #找不到，就以此别称为名，新增一个
      business_unit_alias = BusinessUnitAlias.new("unit_alias" => params["alias"], "user_id" => session[:user_id])
      business_unit_alias.save
    end

    added_alias_array = []

    for business_unit_id in params["selection"].split("|")
      BusinessUnitsBusinessUnitAlias.delete_all(["business_unit_id = ? and business_unit_alias_id = ?", business_unit_id, business_unit_alias.id])
      business_units_business_unit_aliases = BusinessUnitsBusinessUnitAlias.new("business_unit_id" => business_unit_id, "business_unit_alias_id" => business_unit_alias.id)
      business_units_business_unit_aliases.save
      added_alias_array << business_unit_id
    end
    if added_alias_array.size > 0
      render :text => {"str" => "OK", "added_alias" => added_alias_array.join("|"), "added_alias_length" => added_alias_array.length}.to_json
    else
      render :text => {"str" => "NO"}.to_json
    end
  end

end
