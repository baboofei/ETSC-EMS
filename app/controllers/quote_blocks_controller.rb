class QuoteBlocksController < ApplicationController
  # GET /quote_blocks
  # GET /quote_blocks.xml
  def index
    @quote_blocks = QuoteBlock.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @quote_blocks }
    end
  end

  # GET /quote_blocks/1
  # GET /quote_blocks/1.xml
  def show
    @quote_block = QuoteBlock.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @quote_block }
    end
  end

  # GET /quote_blocks/new
  # GET /quote_blocks/new.xml
  def new
    @quote_block = QuoteBlock.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @quote_block }
    end
  end

  # GET /quote_blocks/1/edit
  def edit
    @quote_block = QuoteBlock.find(params[:id])
  end

  # POST /quote_blocks
  # POST /quote_blocks.xml
  def create
    @quote_block = QuoteBlock.new(params[:quote_block])

    respond_to do |format|
      if @quote_block.save
        format.html { redirect_to(@quote_block, :notice => 'Quote block was successfully created.') }
        format.xml  { render :xml => @quote_block, :status => :created, :location => @quote_block }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @quote_block.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /quote_blocks/1
  # PUT /quote_blocks/1.xml
  def update
    @quote_block = QuoteBlock.find(params[:id])

    respond_to do |format|
      if @quote_block.update_attributes(params[:quote_block])
        format.html { redirect_to(@quote_block, :notice => 'Quote block was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @quote_block.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /quote_blocks/1
  # DELETE /quote_blocks/1.xml
  def destroy
    @quote_block = QuoteBlock.find(params[:id])
    @quote_block.destroy

    respond_to do |format|
      format.html { redirect_to(quote_blocks_url) }
      format.xml  { head :ok }
    end
  end
end
