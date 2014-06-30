class BusinessAliasesController < ApplicationController
  # GET /business_aliases
  # GET /business_aliases.xml
  def index
    @business_aliases = BusinessAlias.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @business_aliases }
    end
  end

  # GET /business_aliases/1
  # GET /business_aliases/1.xml
  def show
    @business_alias = BusinessAlias.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @business_alias }
    end
  end

  # GET /business_aliases/new
  # GET /business_aliases/new.xml
  def new
    @business_alias = BusinessAlias.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @business_alias }
    end
  end

  # GET /business_aliases/1/edit
  def edit
    @business_alias = BusinessAlias.find(params[:id])
  end

  # POST /business_aliases
  # POST /business_aliases.xml
  def create
    @business_alias = BusinessAlias.new(params[:business_alias])

    respond_to do |format|
      if @business_alias.save
        format.html { redirect_to(@business_alias, :notice => 'Business alias was successfully created.') }
        format.xml  { render :xml => @business_alias, :status => :created, :location => @business_alias }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @business_alias.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /business_aliases/1
  # PUT /business_aliases/1.xml
  def update
    @business_alias = BusinessAlias.find(params[:id])

    respond_to do |format|
      if @business_alias.update_attributes(params[:business_alias])
        format.html { redirect_to(@business_alias, :notice => 'Business alias was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @business_alias.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /business_aliases/1
  # DELETE /business_aliases/1.xml
  def destroy
    @business_alias = BusinessAlias.find(params[:id])
    @business_alias.destroy

    respond_to do |format|
      format.html { redirect_to(business_aliases_url) }
      format.xml  { head :ok }
    end
  end
end
