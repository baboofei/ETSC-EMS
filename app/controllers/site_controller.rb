class SiteController < ApplicationController
  layout "site", :except => "show_original_image"
  before_filter :append_allow_edit, :only => [:show_product]

  require "will_paginate"

  def append_allow_edit
    #视权限在页面里加上“[编辑]”链接，方便管理操作
    @allow_edit = false
    if session[:user_id]
      #如果已经登录，判断是否是Admin、市场或者技术
      u=User.find(session[:user_id])
      if u.role_ids.include?(9) or u.role_ids.include?(5) or u.role_ids.include?(11)
        @allow_edit = true
      end
    end
  end

  def index
    @recent_serials = Serial.recent_20
    all_recommend_serials = Serial.with_recommend_images.uniq#有图的才出……
    @recommend_serials = all_recommend_serials.shuffle![0..5]#打乱后取前6个
    @solutions = Solution.find(:all).shuffle![0..5]

    @recent_news = Event.order("created_at DESC").limit(6)

    @vendor_units = []
    recommend_array = %w(COH PIC PRM LUM ILX NEL THA LUN PLM MPD VES TKN QDL)
    recommend_array.each{
        |x|
      @vendor_units << VendorUnit.where("short_code = ?", x)[0]
    }
    @vendor_units += VendorUnit.where("is_partner = ? and is_producer = ?", 1, 1).order("name")
    render :layout => "site"
  end

  def download_file
    file = "#{Rails.root}/public/files/product/handbook/"+params[:id].to_s+"."+params[:format].to_s
    send_file(file,:disposition => "attachment")
  end

  #  def main
  ##    因为破handler和id的原因，3rdRails老报错，全归到这个里面好了
  #    @customer_college = CustomerUnit.find(:all, :conditions => "cu_sort = 1")
  #    @customer_institute = CustomerUnit.find(:all, :conditions => "cu_sort = 2")
  #    @customer_company = CustomerUnit.find(:all, :conditions => "cu_sort = 3")
  #    p params
  #  end

  def about1
  end

  def about2
    @customer_college = CustomerUnit.college
    @customer_institute = CustomerUnit.institute
    @customer_company = CustomerUnit.company
  end

  def about3
    @vendor_units = VendorUnit.where("is_partner = ? and is_producer = ?", 1, 1).order("name")
  end

  def about4
  end

  def prod_list
    @big_types = ProdBType.find(:all)
    #新版网站加上的“最新产品”和“解决方案”的侧边栏--20100506
    @recent_serials = Serial.recent_5
    @recent_solutions = Solution.order("created_at DESC").limit(5)
  end

  def show_b_type
    @big_types = ProdBType.find(:all)
    @current_big_type = ProdBType.find(params[:id])
    @mid_types = ProdMType.find(:all, :conditions => ["prod_b_type_id = ?",@current_big_type])
    #新版网站加上的“最新产品”和“解决方案”的侧边栏--20100506
    @recent_serials = Serial.recent_5
    @recent_solutions = Solution.order("created_at DESC").limit(5)
  end

  def show_m_type
    @big_types = ProdBType.find(:all)
    @current_mid_type = ProdMType.find(params[:id])
    @current_big_type = ProdBType.find(@current_mid_type.prod_b_type_id)
    @sml_types = ProdSType.where("prod_m_type_id = ?",@current_mid_type)
    @none_s_type_serials = Serial.without_s_type.where("prod_m_type_id = ?", @current_mid_type.id)
    #新版网站加上的“最新产品”和“解决方案”的侧边栏--20100506
    @recent_serials = Serial.recent_5
    @recent_solutions = Solution.order("created_at DESC").limit(5)
  end

  def show_s_type
    @big_types = ProdBType.find(:all)
    @current_sml_type = ProdSType.find(params[:id])
    @current_mid_type = ProdMType.find(@current_sml_type.prod_m_type_id)
    @current_big_type = ProdBType.find(@current_mid_type.prod_b_type_id)
    @serials = Serial.where("prod_s_type_id = ? and is_in_site = 1", @current_sml_type)
    #新版网站加上的“最新产品”和“解决方案”的侧边栏--20100506
    @recent_serials = Serial.recent_5
    @recent_solutions = Solution.order("created_at DESC").limit(5)
  end

  def show_product
    @big_types = ProdBType.find(:all)
    @serial = Serial.find(params[:id])
    if @serial.prod_s_type_id
      @current_sml_type = ProdSType.find(@serial.prod_s_type_id)
      @current_mid_type = ProdMType.find(@current_sml_type.prod_m_type_id)
    else
      @current_mid_type = ProdMType.find(@serial.prod_m_type_id)
    end
    @current_big_type = ProdBType.find(@current_mid_type.prod_b_type_id)

    all_images = Accessory.images.where("serial_id = ?", params[:id]).order("id").uniq
    @main_image = all_images[0]
    @other_images = (all_images.size>1)?(all_images[1..-1]):nil

    #    all_accessories = @serial.accessories.map{|p| [p.file_sort.to_i,p.id]}
    #    @accessory_sort = [[],[],[],[],[],[],[]]
    #    for i in all_accessories
    #      case i[0]
    #      when 1
    #        @accessory_sort[0] << i
    #      when 2
    #        @accessory_sort[1] << i
    #      when 3
    #        @accessory_sort[2] << i
    #      when 4
    #        @accessory_sort[3] << i
    #      when 5
    #        @accessory_sort[4] << i
    #      when 6
    #        @accessory_sort[5] << i
    #      when 7
    #        @accessory_sort[6] << i
    #      end
    #    end

    unless @serial.related_serials.blank?
      #说明存在与其相关的从产品系列，返回从系列ID数组
      @related_serials = @serial.related_serials
    else
      #说明没有相关产品系列
      @related_serials = nil
    end

    #系列所包含的产品
    @involve_products = (@serial.products.size > 0 ? @serial.products : nil)

    #    全都是系列了，不存在这项。20110815
    #    if @serial.serial
    #      #说明属于某系列，返回一个剔除掉自身的数组
    #      @serial_products = @serial.serial.products.reject{|e| e.id == @serial.id}
    #    else
    #      #说明不属于任何系列
    #      @serial_products = nil
    #    end

    #新版网站加上的“最新产品”和“解决方案”的侧边栏--20100506
    @recent_serials = Serial.recent_5
    @recent_solutions = Solution.order("created_at DESC").limit(5)
  end

  def show_original_image
    @image = Accessory.find(params[:id])
  end

  def about4
  end

  def support1
  end

  def support2
  end

  def support3
    @faqs = Faq.find(:all, :conditions => "is_in_site = true").paginate :page => params[:page], :per_page => 5
  end

  def solution
    @newest_solution = Solution.find(:first, :order => "created_at DESC")
    @laser_solution = Solution.find(:all, :limit => 15, :order => "created_at DESC", :conditions => "solution_sort = 1")
    @communication_solution = Solution.find(:all, :limit => 15, :order => "created_at DESC", :conditions => "solution_sort = 2")
    @industry_solution = Solution.find(:all, :limit => 15, :order => "created_at DESC", :conditions => "solution_sort = 3")
  end

  def show_laser_solution
    @all_laser_solution = Solution.find(:all, :order => "created_at DESC", :conditions => "solution_sort = 1").paginate :page => params[:page], :per_page => 15
    #@all_laser_solution = Solution.where("solution_sort = 1").paginate(:page => params[:page], :per_page => 15).order("created_at DESC")
  end

  def show_communication_solution
    @all_communication_solution = Solution.find(:all, :order => "created_at DESC", :conditions => "solution_sort = 2").paginate :page => params[:page], :per_page => 15
    #@all_communication_solution = Solution.where("solution_sort = 2").paginate(:page => params[:page], :per_page => 15).order("created_at DESC")
  end

  def show_industry_solution
    @all_industry_solution = Solution.find(:all, :order => "created_at DESC", :conditions => "solution_sort = 3").paginate :page => params[:page], :per_page => 15
    #@all_industry_solution = Solution.where("solution_sort = 3").paginate(:page => params[:page], :per_page => 15).order("created_at DESC")
  end

  def show_solution
    @solution = Solution.find(params[:id])
  end

  def news
    @newest_event = Event.find(:first, :order => "created_at DESC")
    @newest_image = if_news_image_exist(@newest_event)
    @company_news = Event.find(:all, :limit => 15, :order => "created_at DESC", :conditions => "event_sort = 1")
    @product_news = Event.find(:all, :limit => 15, :order => "created_at DESC", :conditions => "event_sort = 2")
  end

  def show_company_news
    @all_company_news = Event.where("event_sort = 1").order("created_at DESC").paginate :page => params[:page], :per_page => 15
  end

  def show_product_news
    @all_product_news = Event.where("event_sort = 2").order("created_at DESC").paginate :page => params[:page], :per_page => 15
  end

  def show_news
    @news = Event.find(params[:id])
    @main_image = if_news_image_exist(@news)
    @other_images = @news.event_images.size > 1 ? @news.event_images[1..-1] : nil
  end

  #判断新闻要不要显示图片的函数，返回一个Image对象或者nil
  def get_news_image(news)
    if news
      if !(news.event_images.blank?)
        #如果有新闻图片，则返回第一张图
        return news.event_images[0]
      else
        #如果没有新闻图片，则看附件表中与此新闻相关联的图片数量。方法是直接强大无比的ActiveRecord
        accessories = Accessory.where("accessories.url REGEXP '\/[A-Z]{3}_PIC_' and events.id = ?", news.id).joins(:products => {:serial => :events})
        if accessories.size == 0
          #说明没有这样关联的图片，返回nil
          return nil
        else
          #说明有这样的图片，返回第一个图片
          return accessories[0]
        end
        #        #如果没有新闻图片，则看有没有关联的产品系列
        #        if !(news.serials.blank?)
        #          #如果有相关产品系列，则再看此系列有没有图片
        #          counter = 0
        #          for product in news.serials
        #            if !(product.product_images.blank?)
        #              #如果产品有图片，则返回此图片
        #              return product.product_images[0]
        #              counter=counter+1
        #              break
        #            end
        #          end
        #          if counter == 0
        #            #产品也都没有图，那就是真没有了
        #            return nil
        #          end
        #        else
        #          #如果没有相关产品则为空
        #          return nil
        #        end
      end
    else
      #如果根本没有新闻，则直接为空
      return nil
    end
  end

  def job
  end

  def search_result
    if params[:keyword]=="请输入搜索关键字" or params[:keyword].blank?
      #说明没有输入，查询结果显示空并提示重新搜索
      @search_result = nil
      flash[:notice] = "请输入关键字后再进行查询！"
    else
      serials = Serial.where("(serials.brief like ? or
        serials.name like ? or
        serials.description like ? or
        serials.application_in_site like ? or
        serials.parameter_in_site like ? or
        serials.feature like ? or
        products.model like ? or
        products.name like ? or
        products.simple_description_cn like ? or
        products.simple_description_en like ? or
        vendor_units.name like ? or
        prod_b_types.name like ? or
        prod_m_types.name like ? or
        prod_s_types.name like ? ) and
        serials.is_in_site = ?",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             "%#{params[:keyword]}%",
                             1
      ).includes(:products, {:products => :producer}, :prod_m_type, :prod_s_type, {:prod_m_type => :prod_b_type})
      if serials.size > 0
        @search_result = serials.paginate :page => params[:page], :per_page => 15
      else
        flash[:notice] = "对不起，没有找到满足条件的产品！"
      end
    end
    #    render :text => params.inspect
  end

  def advsearch
  end

  def advsearch_result
    #    render :text => params.inspect
    #分页的示例    @fix_contracts_search_result = FixContract.paginate :page => params[:page]||1, :per_page => DATA_PER_PAGE, :order =>str,:conditions =>["flowsheet_number like ? and fix_type like ? and series_number like ? and model like ? and receive_date > ? and receive_date < ? and customer like ? and status like ? and (send_date is null) and agent like ?",
    @advsearch_result = Product.find(:all,:conditions => ["model LIKE ? AND vendor_unit.country.clime LIKE ?",
                                                          "%#{params[:product][:model].gsub(' ','%')}%",
                                                          ""],
                                     :include => [:vendor_unit => [:country => [:clime]]])
    #    "=>{"feature"=>"", "price_from"=>"", "clime"=>"", "application"=>"", "description"=>"", "currency_id"=>"", "model"=>"", "parameter"=>"", "price_to"=>""

    #    "%#{params[:flowsheet_number].gsub(' ','%')}%",
    #    "%#{params[:fix_type]}%",
    #    "%#{params[:series_number].gsub(' ','%')}%",
    #    "%#{params[:model].gsub(' ','%')}%",
    #    "#{params[:receive_date_s]}",
    #    "#{params[:receive_date_e]}",
    #    "%#{params[:customer].gsub(' ','%')}%",
    #    "%#{params[:status]}%",
    #    "%#{params[:agent]}%"])
  end

#给日程组件传假数据用
  def restful
    if request.get?
      render :text => {
          "success" => true,
          "message" => "成功",
          "data" => [{
                         "id" => 1023,
                         "cid" => 1,
                         "title" => "0000",
                         "start" => "2012-05-04T00:00:00",
                         "end" => "2012-05-04T01:00:00",
                         "rrule" => "",
                         "loc" => "",
                         "notes" => "",
                         "url" => "",
                         "ad" => true,
                         "rem" =>""
                     },{
                         "id" => 102,
                         "cid" => 3,
                         "title" => "2222",
                         "start" => "2012-05-04T00:00:00",
                         "end" => "2012-05-07T01:00:00",
                         "rrule" => "",
                         "loc" => "",
                         "notes" => "",
                         "url" => "",
                         "ad" => true,
                         "rem" =>""
                     }]
      }.to_json
    elsif request.post?
      # render :text => {
      #   "success" => false,
      #   "message" => "失败"
      # }
      render :text => {
          "success" => true,
          "message" => "成功",
          "data" => {
              "id" => 1023,
              "cid" => 1,
              "title" => "0000",
              "start" => "2012-05-04T00:00:00",
              "end" => "2012-05-04T01:00:00",
              "rrule" => "",
              "loc" => "",
              "notes" => "",
              "url" => "",
              "ad" => true,
              "rem" =>""
          }
      }.to_json
    elsif request.put?
      render :text => {
          "success" => true,
          "message" => "成功",
          "data" => {
              "id" => 1023,
              "cid" => 1,
              "title" => "0000",
              "start" => "2012-05-04T00:00:00",
              "end" => "2012-05-04T01:00:00",
              "rrule" => "",
              "loc" => "",
              "notes" => "",
              "url" => "",
              "ad" => true,
              "rem" =>""
          }
      }.to_json
    elsif request.delete?
      render :text => {
          "success" => true,
          "message" => "成功"
      }.to_json
    end
  end

  def get_calendar
    render :text => {"totalRecords" => 2, "calendars" => [{
                                                              "id" => 1, "title" => "Home", "color" => 2
                                                          }, {
                                                              "id" => 2, "title" => "喻承超", "color" => 5
                                                          }]
    }.to_json
  end
end
