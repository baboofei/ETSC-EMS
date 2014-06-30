class LeadsController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  layout "basic"
  # GET /currencies
  # GET /currencies.xml
  #取结识方式的JSON
  def get_name
    respond_to do |format|
      format.json {
        lead = gen_name()
        render :text => lead.to_json
      }
    end
  end

  def gen_name(dummy = nil)
    t_array = []
    leads = Lead.where("be_shown != 0")
    for lead in leads
      t_array << eval("{'text' => '"+lead.name+ "', 'id' => '"+lead.id.to_s+ "', 'leaf' => true}")
    end
    return t_array
  end
end
