class SiteController < ApplicationController
  layout :site

  def index
    render :layout => "site"
  end
end
