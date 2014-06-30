class HistoryCollectionsController < ApplicationController
  # GET /history_collections
  # GET /history_collections.xml
  def index
    @history_collections = HistoryCollection.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @history_collections }
    end
  end

  # GET /history_collections/1
  # GET /history_collections/1.xml
  def show
    @history_collection = HistoryCollection.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @history_collection }
    end
  end

  # GET /history_collections/new
  # GET /history_collections/new.xml
  def new
    @history_collection = HistoryCollection.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @history_collection }
    end
  end

  # GET /history_collections/1/edit
  def edit
    @history_collection = HistoryCollection.find(params[:id])
  end

  # POST /history_collections
  # POST /history_collections.xml
  def create
    @history_collection = HistoryCollection.new(params[:history_collection])

    respond_to do |format|
      if @history_collection.save
        format.html { redirect_to(@history_collection, :notice => 'History collection was successfully created.') }
        format.xml  { render :xml => @history_collection, :status => :created, :location => @history_collection }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @history_collection.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /history_collections/1
  # PUT /history_collections/1.xml
  def update
    @history_collection = HistoryCollection.find(params[:id])

    respond_to do |format|
      if @history_collection.update_attributes(params[:history_collection])
        format.html { redirect_to(@history_collection, :notice => 'History collection was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @history_collection.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /history_collections/1
  # DELETE /history_collections/1.xml
  def destroy
    @history_collection = HistoryCollection.find(params[:id])
    @history_collection.destroy

    respond_to do |format|
      format.html { redirect_to(history_collections_url) }
      format.xml  { head :ok }
    end
  end
end
