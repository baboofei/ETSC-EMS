#encoding: UTF-8
class LoginController < ApplicationController
    #skip_before_filter :verify_authenticity_token
    before_filter :authorize, :except => [:login, :logout, :verify, :fake_login, :android_login]
    layout false #"login"

    def login
        @updates = Update.where(true).order("version DESC, update_type, function_id").limit(50)
        @update_type_dict = Hash[*Dictionary.where("data_type = ?", "update_type").map { |p| [p.value, p.display] }.flatten]
        @function_dict = Hash[*Function.where(true).map { |p| [p.id, p.name] }.flatten]

        @natural_time_description = get_natural_time_description
        from_time = case Time.now.month
                        when 1..3
                            "#{Time.now.year - 1}-01-01"
                        when 4..6
                            "#{Time.now.year}-01-01"
                        when 7..9
                            "#{Time.now.year}-01-01"
                        when 10..12
                            "#{Time.now.year}-01-01"
                    end
        to_time = case Time.now.month
                      when 1..3
                          "#{Time.now.year}-01-01"
                      when 4..6
                          "#{Time.now.year}-04-01"
                      when 7..9
                          "#{Time.now.year}-07-01"
                      when 10..12
                          "#{Time.now.year}-10-01"
                  end
        real_to_time = case Time.now.month
                           when 1..3
                               "#{Time.now.year - 1}-12-31"
                           when 4..6
                               "#{Time.now.year}-03-31"
                           when 7..9
                               "#{Time.now.year}-06-30"
                           when 10..12
                               "#{Time.now.year}-09-30"
                       end
        @distribute_contracts = Contract.period_distribute_contracts(from_time, to_time)
        @nps_contracts = Contract.period_nps_contracts(from_time, to_time)
        @rps_contracts = Contract.period_rps_contracts(from_time, to_time)
        @taiwan_contracts = Contract.period_taiwan_contracts(from_time, to_time)

        @tsd_contracts = Contract.period_tsd_contracts(from_time, to_time)

        @rent_contracts = Contract.period_rent_contracts(from_time, to_time)

        @project_contracts = Contract.period_project_contracts(from_time, to_time)

        @period_contracts = Contract.period_contracts(from_time, to_time)

        @sales = User.sale
        @groups = Group.where(true)
        #binding.pry
        #p session[:user_id] == nil
        if request.post?
            user=User.authenticate(params[:reg_name], params[:password])
            #binding.pry
            if user && user.status == 1
                #激活用户才能登录
                session[:user_id] = user.id
                # redirect_to({:controller => "index", :action => "index"})
                # binding.pry
                respond_to do |format|
                    #binding.pry
                    format.json { render :json => {:user => user, "success" => true} }
                end
                # render :text => {"success" => true}.to_json
            else
                # respond_to do |format|
                # format.json { render :json => {"success" => false } }
                # end
                render :json => {"success" => false}
            end
            #else
            #    render :json => {"success" => false}
        end
    end

    def android_login
        if request.post?
            user = User.authenticate(params[:reg_name], params[:password])
            #binding.pry
            if user && user.status == 1
                #激活用户才能登录
                session[:user_id] = user.id
                # redirect_to({:controller => "index", :action => "index"})
                #binding.pry
                respond_to do |format|
                    #binding.pry
                    format.json {
                        binding.pry
                        @user = user
                        render :json => {:user => user, "success" => true}
                    }
                    format.html {
                        #binding.pry
                        #@user = user
                        render :json => {"success" => true}
                    }
                end
                # render :text => {"success" => true}.to_json
            else
                # respond_to do |format|
                # format.json { render :json => {"success" => false } }
                # end
                render :json => {"success" => false}
            end
            #else
            #    render :json => {"success" => false}
        end
    end

    def logout
        session[:user_id] = nil
        render :json => {"success" => false}
        #redirect_to(:action => "login")
    end

    def edit_profile
        @user = User.find(session[:user_id])
    end

    def update_profile
        @user = User.find(session[:user_id])
        if @user.update_attributes(params[:user])
            flash[:notice] = 'OK'
            render :action => 'index'
        else
            render :action => 'edit_profile'
        end
    end

    def verify
        #binding.pry
        if session[:user_id]
            u = User.find(session[:user_id])
            render :json => {
                :success => true,
                :user => session[:user_id],
                :user_name => u.name,
                :unread_reminds => u.reminds.unread.at_time.size
            }
        else
            render :json => {
                :success => false,
                :user => nil,
                :user_name => nil
            }
        end
        #binding.pry
    end

    #根据当前时间，动态显示符合中文习惯的显示值
    def get_natural_time_description
        now_time = Time.now
        case now_time.month
            when 1..3
                "#{now_time.year - 1}年度"
            when 4..6
                "#{now_time.year}年第一季度"
            when 7..9
                "#{now_time.year}年上半年"
            when 10..12
                "#{now_time.year}年前三季度"
        end
    end

    #把userid=?的值写入session，以防万一
    #TODO 全部切换到新版后记得要删掉相关内容
    #--terry20120802
    def fake_login
        session[:user_id] = params["id"]
        render :json => {"success" => true}
    end
end