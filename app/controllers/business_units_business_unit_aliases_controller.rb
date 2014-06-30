class BusinessUnitsBusinessUnitAliasesController < ApplicationController
  # GET /business_units_business_unit_aliases
  # GET /business_units_business_unit_aliases.xml
  def index
    @business_units_business_unit_aliases = BusinessUnitsBusinessUnitAlias.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @business_units_business_unit_aliases }
    end
  end

  # GET /business_units_business_unit_aliases/1
  # GET /business_units_business_unit_aliases/1.xml
  def show
    @business_units_business_unit_alias = BusinessUnitsBusinessUnitAlias.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @business_units_business_unit_alias }
    end
  end

  # GET /business_units_business_unit_aliases/new
  # GET /business_units_business_unit_aliases/new.xml
  def new
    @business_units_business_unit_alias = BusinessUnitsBusinessUnitAlias.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @business_units_business_unit_alias }
    end
  end

  # GET /business_units_business_unit_aliases/1/edit
  def edit
    @business_units_business_unit_alias = BusinessUnitsBusinessUnitAlias.find(params[:id])
  end

  # POST /business_units_business_unit_aliases
  # POST /business_units_business_unit_aliases.xml
  def create
    @business_units_business_unit_alias = BusinessUnitsBusinessUnitAlias.new(params[:business_units_business_unit_alias])

    respond_to do |format|
      if @business_units_business_unit_alias.save
        format.html { redirect_to(@business_units_business_unit_alias, :notice => 'Business units business unit alias was successfully created.') }
        format.xml  { render :xml => @business_units_business_unit_alias, :status => :created, :location => @business_units_business_unit_alias }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @business_units_business_unit_alias.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /business_units_business_unit_aliases/1
  # PUT /business_units_business_unit_aliases/1.xml
  def update
    @business_units_business_unit_alias = BusinessUnitsBusinessUnitAlias.find(params[:id])

    respond_to do |format|
      if @business_units_business_unit_alias.update_attributes(params[:business_units_business_unit_alias])
        format.html { redirect_to(@business_units_business_unit_alias, :notice => 'Business units business unit alias was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @business_units_business_unit_alias.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /business_units_business_unit_aliases/1
  # DELETE /business_units_business_unit_aliases/1.xml
  def destroy
    @business_units_business_unit_alias = BusinessUnitsBusinessUnitAlias.find(params[:id])
    @business_units_business_unit_alias.destroy

    respond_to do |format|
      format.html { redirect_to(business_units_business_unit_aliases_url) }
      format.xml  { head :ok }
    end
  end
end
