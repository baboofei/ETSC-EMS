# coding: UTF-8
class UsersController < ApplicationController
    skip_before_filter :verify_authenticity_token

    #TODO 这里的combo和list有点乱，要整理
    #TODO 然后index这几个原生的方法可以干掉了吧

    def index
        @users = User.at_job

        respond_to do |format|
            format.json { render :json => { :users => @users.map{|p| p.for_tree_json} } }
        end
    end

    def create
        @user = User.new(params[:user])

        respond_to do |format|
            if @user.save
                format.json { render :json => { :success => true, :users => [@user] } }
            end
        end
    end

    def update
        @user = User.find(params[:id])

        respond_to do |format|
            if @user.update_attributes(params[:user])
                format.json { render :json => { :success => true, :users => [@user] } }
            end
        end
    end

    def destroy
        @user = User.find(params[:id])
        @user.destroy

        respond_to do |format|
            format.json { render :json => { :success => true } }
        end
    end

    def user_list
        users = User.at_job

        respond_to do |format|
            format.json {
                render :json => {
                    :users => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #ExtJS里的ComboUsers的store
    def get_combo_users
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        users = User.at_job.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :members => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    def get_combo_member_sales
        user_id = session[:user_id]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型
        sales = User.get_available_data(target_store, user_id).sale

        respond_to do |format|
            format.json {
                render :json => {
                    :sales => sales.map{|p| p.for_list_json},
                    :totalRecords => sales.size
                }
            }
        end
    end

    def get_grid_users
        user_id = session[:user_id]
        limit = params[:limit].to_i
        start = params[:start].to_i
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #binding.pry
        users = User.at_job.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id)

        respond_to do |format|
            format.json {
                render :json => {
                    :users => users.limit(limit).offset(start.to_i).map{|p| p.for_grid_json(target_store, user_id)},
                    :totalRecords => users.size
                }
            }
        end
    end

    #所有商务角色的列表
    def get_list_business
        users = User.business
        respond_to do |format|
            format.json {
                render :json => {
                    :businesses => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #所有在职商务角色的列表
    def get_at_job_business_list
        users = User.business.at_job
        respond_to do |format|
            format.json {
                render :json => {
                    :users => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #所有销售角色的列表
    def get_list_sale
        users = User.sale
        respond_to do |format|
            format.json {
                render :json => {
                    :users => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #报价的时候能选的销售下拉菜单
    def get_combo_quote_sales
        user_id = session[:user_id]
        filter = params[:filter]
        sort = params[:sort]
        target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #binding.pry
        users = User.get_available_data(target_store, user_id).updated_filter_by(filter).updated_sort_by(sort, user_id).sale

        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :quote_sales => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #不分级别选所有技术的下拉菜单
    def get_combo_supporters
        #user_id = session[:user_id]
        #filter = params[:filter]
        #sort = params[:sort]
        #target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #binding.pry
        users = User.supporter

        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :supporters => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #不分级别选所有采购的下拉菜单
    def get_combo_purchasers
        #user_id = session[:user_id]
        #filter = params[:filter]
        #sort = params[:sort]
        #target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #binding.pry
        users = User.purchaser

        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :purchasers => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    #不分级别选所有商务的下拉菜单
    def get_combo_businesses
        #user_id = session[:user_id]
        #filter = params[:filter]
        #sort = params[:sort]
        #target_store = action_name.camelize[3..-1]#根据方法名来取模型

        #binding.pry
        users = User.business

        #binding.pry
        respond_to do |format|
            format.json {
                render :json => {
                    :businesses => users.map{|p| p.for_list_json},
                    :totalRecords => users.size
                }
            }
        end
    end

    def save_user
        result = User.create_or_update_with(params, session[:user_id])

        render :json => {:success => result[:success], :message => result[:message]}
    end

    def change_password
        user_id = session[:user_id]
        old_password = params[:old_password]
        new_password = params[:new_password]
        update = User.change_password(user_id, old_password, new_password)
        #binding.pry
        render :json => {:success => update[:success], :message => update[:message]}
    end

    def validate_reg_name_unique
        result = User.validate_reg_name_unique(params)

        render :json => {:success => result[:success], :message => result[:message]}
    end

    ##########################################################################################################################
    #以下是之前的各种测试，不管也行
    ##########################################################################################################################
    def generate_tree(user_id)
        #生成左边树的列表对应的JSON

        if user_id
            #用户的角色的功能权限，则显示
            current_roles = User.find(user_id).role_ids
            permissions = Permission.where("unit_id" => current_roles).where("unit_type = 'Role'")
            #用户的部门的功能权限，则显示
            current_depts = User.find(user_id).department_id
            permissions += Permission.where("unit_id" => current_depts).where("unit_type = 'Department'")
                                                        #用户自己的功能权限
            permissions += Permission.where("unit_type = 'User' and unit_id = ?", user_id)
            permissions = permissions.uniq

            array = []
            url = request.url.split("/")[0..2].join("/")#"http://localhost:8080"，或者"http://localhost:8011"，也可能是"http://192.168.10.8"不带端口
            pure_url = url.gsub(/:\d+$/, "")#纯URL，如http://etsc.imwork.net
                                                        # port_number = url.scan(/\d+/)[0] || "80"#端口，没有就取成80。备用
                                                        # binding.pry
            for permission in permissions
                function = permission.function
                # url_action = function.url.gsub(/:\d+/, "")#/event_images这样的操作。备用
                #然后判断，如果冒号后面是8011，则后面先加url再加userid=xx，如果不是则后面只加数据库里取得的url
                new_url = pure_url + ((function.url =~ /^:8011/ || function.url =~ /^:3000/) ? (function.url + "?userid=" + session[:user_id].to_s) : function.url)
                array << {
                    "text" => function.name,
                    "leaf" => true,
                    "action" => new_url,
                    "iconCls" => function.icon_class,
                    "id" => function.id
                }
            end
            array.uniq!
        end
        json = {"root" => ".", "children" => array}
        return json#.uniq_by { |i| i["text"] }
    end

    #打印模块的测试，先放这里
    def etsc_print
        normal_font =  "../../.fonts/yahei_mono.ttf"
        image = "shunfeng_96dpi.jpg"
        require "prawn"
        require "prawn/measurement_extensions"
        #参数配置
        shunfeng = {
            "page_size" => [210.mm, 125.mm],
            "margin" => [0, 13.mm, 10.mm, 13.mm],
            "sender" => {
                "company" => {
                    "xy" => [14.mm, 84.mm],
                    "w" => 40.mm
                },
                "name" => {
                    "xy" => [63.mm, 84.mm]
                },
                "addr" => {
                    "xy" => [9.mm, 78.mm],
                    "w" => 70.mm
                },
                "phone" => {
                    "xy" => [31.mm, 64.mm]
                },
                "cell" => {
                    "xy" => [31.mm, 59.mm]
                },
                "monthly_payment_ac" => {
                    "xy" => [139.mm, 82.mm]
                },
                "sign" => {
                    "xy" => [162.mm, 37.mm]
                },
                "month" => {
                    "xy" => [142.mm, 29.mm]
                },
                "day" => {
                    "xy" => [155.mm, 29.mm]
                }
            },
            "receiver" => {
                "company" => {
                    "xy" => [14.mm, 44.mm],
                    "w" => 40.mm
                },
                "name" => {
                    "xy" => [63.mm, 44.mm]
                },
                "addr" => {
                    "xy" => [9.mm, 36.mm],
                    "w" => 70.mm
                },
                "phone" => {
                    "xy" => [31.mm, 27.mm]
                },
                "cell" => {
                    "xy" => [31.mm, 22.mm]
                }
            }
        }
        sender = {
            "company" => "武汉东隆科技有限公司",
            "name" => "陈天睿",
            "addr" => "湖北省武汉市东湖新技术开发区东信路SBI创业街1号楼9层(430074)",
            "phone" => "027-87807177",
            "cell" => "13579246810",
            "monthly_payment_ac" => "0271986539",
            "month" => "08",
            "day" => "23"
        }
        receiver = {
            "company" => "中兴通讯股份有限公司深圳办事处",
            "name" => "伍鹏",
            "addr" => "广东省深圳市南山区高新技术产业园科技南路中兴通讯大厦A座二层(518057)",
            "phone" => "0755-26770993",
            "cell" => "13828731646"
        }
        #参数配置完成

        using = shunfeng
        Prawn::Document.generate("ABC.pdf",
                                 #"page_size" => [609,397],
                                 :page_size => using["page_size"],
                                 #"background" => image,
                                 :margin => using["margin"]) do |pdf|

            pdf.font normal_font, :size => 8

            pdf.text_box(sender["company"], :at => using["sender"]["company"]["xy"], :width => using["sender"]["company"]["w"])
            pdf.text_box(sender["name"], :at => using["sender"]["name"]["xy"])
            pdf.text_box(sender["addr"], :at => using["sender"]["addr"]["xy"], :width => using["sender"]["addr"]["w"])
            pdf.text_box(sender["phone"], :at => using["sender"]["phone"]["xy"])
            pdf.text_box(sender["cell"], :at => using["sender"]["cell"]["xy"])
            pdf.text_box(sender["monthly_payment_ac"], :at => using["sender"]["monthly_payment_ac"]["xy"], :size => 13)
            pdf.text_box(sender["name"], :at => using["sender"]["sign"]["xy"], :size => 10)
            pdf.text_box(sender["month"], :at => using["sender"]["month"]["xy"])
            pdf.text_box(sender["day"], :at => using["sender"]["day"]["xy"])
            pdf.text_box(receiver["company"], :at => using["receiver"]["company"]["xy"], :width => using["receiver"]["company"]["w"])
            pdf.text_box(receiver["name"], :at => using["receiver"]["name"]["xy"])
            pdf.text_box(receiver["addr"], :at => using["receiver"]["addr"]["xy"], :width => using["receiver"]["addr"]["w"])
            pdf.text_box(receiver["phone"], :at => using["receiver"]["phone"]["xy"])
            pdf.text_box(receiver["cell"], :at => using["receiver"]["cell"]["xy"])
            #pdf.stroke_bounds
        end

        system("lp -o media=Custom.210x135mm ABC.pdf")
        #binding.pry
        render :text => {"success" => true}.to_json
    end

    #也是测试，给个案提供假数据用
    def fake_for_salecase
        respond_to do |format|
            format.json {
                #array = generate_tree(session[:user_id])
                obj = [{
                           "id" => 1,
                           "number" => "G1200005",
                           "comment" => "这是一条假数据<br/>而且还换了一行",
                           "start_time" => 15.day.ago,
                           "end_time" => 1.day.ago,
                           "priority" => 1,
                           "feasible" => 30,
                           "user" => {
                               "id" => 5,
                               "name" => "陈天睿"
                           },
                           "customers" => [{
                                               "id" => 30,
                                               "name" => "张三",
                                               "phone" => "027-87654321",
                                               "mobile" => "13579246810",
                                               "fax" => "027-88776655",
                                               "customer_unit" => {
                                                   "id" => 99,
                                                   "name" => "武汉大学"
                                               }
                                           },{
                                               "id" => 35,
                                               "name" => "李四",
                                               "phone" => "027-87654321",
                                               "mobile" => "13579246810",
                                               "fax" => "027-88776655",
                                               "customer_unit" => {
                                                   "id" => 100,
                                                   "name" => "华中科技大学"
                                               }
                                           }],
                           "remind" => DateTime.now
                       }, {
                           "id" => 7,
                           "number" => "G1200010",
                           "customers" => [{
                                               "id" => 30,
                                               "name" => "张三",
                                               "phone" => "027-87654321",
                                               "mobile" => "13579246810",
                                               "fax" => "027-88776655",
                                               "customer_unit" => {
                                                   "id" => 99,
                                                   "name" => "武汉大学"
                                               }
                                           }],
                       }, {
                           "id" => 3,
                           "number" => "G1200018",
                           "customers" => [{
                                               "id" => 35,
                                               "name" => "李四",
                                               "phone" => "027-87654321",
                                               "mobile" => "13579246810",
                                               "fax" => "027-88776655",
                                               "customer_unit" => {
                                                   "id" => 100,
                                                   "name" => "华中科技大学"
                                               }
                                           }],
                       }]
                render :json => {:salecases => obj}
            }
        end
    end

    def fake_for_salelog
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "process_type" => 1,
                        "detail" => "产品A、产品B",
                        "created_at" => 10.day.ago
                    }, {
                        "id" => 2,
                        "process_type" => 4,
                        "detail" => "寄资料XXX",
                        "created_at" => 5.day.ago
                    }, {
                        "id" => 3,
                        "process_type" => 2,
                        "detail" => "做报价Q1200351",
                        "created_at" => 2.day.ago
                    }, {
                        "id" => 4,
                        "process_type" => 2,
                        "detail" => "做报价Q1200355",
                        "created_at" => 0.day.ago
                    }
                ]
                render :json => {:salelogs => obj, :success => true}
            }
        end
    end

    def fake_for_mini_customer
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 30,
                        "name" => "张三",
                        "phone" => "027-87654321",
                        "mobile" => "13579246810",
                        "fax" => "027-88776655",
                        "lead_id" => 5,
                        "application_ids" => "1|7|8",
                        "customer_unit" => {
                            "id" => 99,
                            "name" => "武汉大学"
                        }
                    }, {
                        "id" => 35,
                        "name" => "李四",
                        "phone" => "027-87654321",
                        "mobile" => "13579246810",
                        "fax" => "027-88776655",
                        "customer_unit" => {
                            "id" => 100,
                            "name" => "华中科技大学"
                        }
                    }
                ]
                render :json => {:mini_customers => obj, :success => true}
            }
        end
    end

    def fake_for_customer
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 30,
                        "name" => "张三",
                        "phone" => "027-87654321",
                        "mobile" => "13579246810",
                        "fax" => "027-88776655",
                        "lead_id" => 5,
                        "application_ids" => "1|7|8",
                        "customer_unit" => {
                            "id" => 99,
                            "name" => "武汉大学"
                        }
                    }, {
                        "id" => 35,
                        "name" => "李四",
                        "phone" => "027-87654321",
                        "mobile" => "13579246810",
                        "fax" => "027-88776655",
                        "customer_unit" => {
                            "id" => 100,
                            "name" => "华中科技大学"
                        }
                    }
                ]
                render :json => {:customers => obj, :success => true}
            }
        end
    end

    def fake_for_business_contact
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 30,
                        "name" => "张三",
                        "phone" => "027-87654321",
                        "mobile" => "13579246810",
                        "fax" => "027-88776655",
                        "lead_id" => 5,
                        "application_ids" => "1|7|8",
                        "customer_unit" => {
                            "id" => 99,
                            "name" => "武汉大学"
                        }
                    }, {
                        "id" => 35,
                        "name" => "李四",
                        "phone" => "027-87654321",
                        "mobile" => "13579246810",
                        "fax" => "027-88776655",
                        "customer_unit" => {
                            "id" => 100,
                            "name" => "华中科技大学"
                        }
                    }
                ]
                render :json => {:business_contacts => obj, :success => true}
            }
        end
    end

    def fake_for_salelog_process
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "推荐"
                    }, {
                        "id" => 2,
                        "name" => "报价"
                    }, {
                        "id" => 3,
                        "name" => "合同"
                    }, {
                        "id" => 4,
                        "name" => "寄"
                    }
                ]
                render :json => {:salelog_processes => obj, :success => true}
            }
        end
    end

    def fake_for_lead
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "自己发掘"
                    }, {
                        "id" => 2,
                        "name" => "其他客户介绍"
                    }, {
                        "id" => 3,
                        "name" => "网上咨询"
                    }, {
                        "id" => 4,
                        "name" => "来电咨询"
                    }, {
                        "id" => 5,
                        "name" => "研讨会"
                    }, {
                        "id" => 6,
                        "name" => "工厂转"
                    }, {
                        "id" => 7,
                        "name" => "展会(2012上海)"
                    }, {
                        "id" => 8,
                        "name" => "展会(2012深圳)",
                        "description" => "深圳激光"
                    }
                ]
                render :json => {:leads => obj, :success => true}
            }
        end
    end

    def fake_for_application
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "冷原理和原子囚禁"
                    }, {
                        "id" => 2,
                        "name" => "气体分析及探测"
                    }, {
                        "id" => 3,
                        "name" => "荧光光谱及寿命测试"
                    }, {
                        "id" => 4,
                        "name" => "无损检测"
                    }, {
                        "id" => 5,
                        "name" => "激光退火"
                    }, {
                        "id" => 6,
                        "name" => "激光强化"
                    }, {
                        "id" => 7,
                        "name" => "激光划片及剥离"
                    }, {
                        "id" => 8,
                        "name" => "激光雷达及遥感"
                    }, {
                        "id" => 9,
                        "name" => "激光拉曼/LIBS光谱"
                    }, {
                        "id" => 10,
                        "name" => "非线性光学"
                    }, {
                        "id" => 11,
                        "name" => "粒子加速器"
                    }, {
                        "id" => 12,
                        "name" => "高功率激光焊接及切割"
                    }, {
                        "id" => 13,
                        "name" => "量子光学与冷原子相关联"
                    }, {
                        "id" => 14,
                        "name" => "显微成像"
                    }, {
                        "id" => 15,
                        "name" => "光纤激光器生产及研发"
                    }, {
                        "id" => 16,
                        "name" => "激光微加工"
                    }, {
                        "id" => 17,
                        "name" => "小微信号处理"
                    }, {
                        "id" => 18,
                        "name" => "激光器测试"
                    }, {
                        "id" => 19,
                        "name" => "THz光学"
                    }, {
                        "id" => 20,
                        "name" => "射频功率器件封装"
                    }, {
                        "id" => 21,
                        "name" => "光无源器件性能测试"
                    }, {
                        "id" => 22,
                        "name" => "光有源器件性能测试"
                    }, {
                        "id" => 23,
                        "name" => "微波光电子"
                    }, {
                        "id" => 24,
                        "name" => "FTTX"
                    }, {
                        "id" => 25,
                        "name" => "高速光通信"
                    }, {
                        "id" => 26,
                        "name" => "光器件自动对准及封装"
                    }, {
                        "id" => 27,
                        "name" => "结构健康监测"
                    }, {
                        "id" => 28,
                        "name" => "机器视觉"
                    }, {
                        "id" => 29,
                        "name" => "光器件标定"
                    }, {
                        "id" => 30,
                        "name" => "温度的光纤传感监测"
                    }, {
                        "id" => 31,
                        "name" => "天文观测及卫星遥感"
                    }, {
                        "id" => 32,
                        "name" => "光化学"
                    }, {
                        "id" => 33,
                        "name" => "激光显示"
                    }, {
                        "id" => 34,
                        "name" => "激光医疗"
                    }, {
                        "id" => 35,
                        "name" => "生物芯片"
                    }, {
                        "id" => 36,
                        "name" => "光纤陀螺"
                    }, {
                        "id" => 37,
                        "name" => "汽车电子"
                    }, {
                        "id" => 38,
                        "name" => "环境监测"
                    }, {
                        "id" => 39,
                        "name" => "航空飞行控制",
                        "description" => "航空飞行控制"
                    }
                ]
                render :json => {:applications => obj, :success => true}
            }
        end
    end

    def fake_for_customer_unit_sort
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "高校"
                    }, {
                        "id" => 2,
                        "name" => "研究院所"
                    }, {
                        "id" => 3,
                        "name" => "公司"
                    }, {
                        "id" => 4,
                        "name" => "渠道"
                    }
                ]
                render :json => {:customer_unit_sorts => obj, :success => true}
            }
        end
    end

    def fake_for_salecase_cancel_reason
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "成为非目标客户"
                    }, {
                        "id" => 2,
                        "name" => "客户觉得价格贵"
                    }, {
                        "id" => 3,
                        "name" => "仅询价"
                    }, {
                        "id" => 4,
                        "name" => "指标不符"
                    }, {
                        "id" => 5,
                        "name" => "已通过其它渠道购买"
                    }, {
                        "id" => 6,
                        "name" => "其他"
                    }
                ]
                render :json => {:salecase_cancel_reasons => obj, :success => true}
            }
        end
    end

    def fake_for_customer_unit
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 99,
                        "name" => "武汉大学",
                        "city_id" => 30,
                        "postcode" => "430070",
                        "addr" => "武昌区珞瑜路129号",
                        "en_name" => "Wuhan University",
                        "en_addr" => "",
                        "site" => "http://www.wuhanuniversity.edu",
                        "sort_id" => 1,
                        "alias" => "武大",
                        "comment" => ""
                    }, {
                        "id" => 100,
                        "name" => "华中科技大学",
                        "city_id" => 30,
                        "postcode" => "430070",
                        "addr" => "武昌区珞喻路1037号",
                        "en_name" => "Huazhong University of Science and Technology",
                        "en_addr" => "",
                        "site" => "http://www.hust.edu",
                        "sort_id" => 1,
                        "alias" => "华工、华科、华科大",
                        "comment" => ""
                    }
                ]
                render :json => {:customer_units => obj, :success => true}
            }
        end
    end

    def fake_for_business_unit
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 99,
                        "name" => "武汉大学",
                        "city_id" => 30,
                        "postcode" => "430070",
                        "addr" => "武昌区珞瑜路129号",
                        "en_name" => "Wuhan University",
                        "en_addr" => "",
                        "site" => "http://www.wuhanuniversity.edu",
                        "sort_id" => 1,
                        "alias" => "武大",
                        "comment" => ""
                    }, {
                        "id" => 100,
                        "name" => "华中科技大学",
                        "city_id" => 30,
                        "postcode" => "430070",
                        "addr" => "武昌区珞喻路1037号",
                        "en_name" => "Huazhong University of Science and Technology",
                        "en_addr" => "",
                        "site" => "http://www.hust.edu",
                        "sort_id" => 1,
                        "alias" => "华工、华科、华科大",
                        "comment" => ""
                    }
                ]
                render :json => {:business_units => obj, :success => true}
            }
        end
    end

    def fake_for_vendor_unit
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 99,
                        "name" => "武汉大学",
                        "city_id" => 30,
                        "postcode" => "430070",
                        "addr" => "武昌区珞瑜路129号",
                        "en_name" => "Wuhan University",
                        "en_addr" => "",
                        "site" => "http://www.wuhanuniversity.edu",
                        "sort_id" => 1,
                        "alias" => "武大",
                        "comment" => ""
                    }, {
                        "id" => 100,
                        "name" => "华中科技大学",
                        "city_id" => 30,
                        "postcode" => "430070",
                        "addr" => "武昌区珞喻路1037号",
                        "en_name" => "Huazhong University of Science and Technology",
                        "en_addr" => "",
                        "site" => "http://www.hust.edu",
                        "sort_id" => 1,
                        "alias" => "华工、华科、华科大",
                        "comment" => ""
                    }
                ]
                render :json => {:vendor_units => obj, :success => true}
            }
        end
    end

    def fake_for_city
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "北京市",
                        "en_name" => "Beijing",
                        "exact_name" => "华北-北京市"
                    }, {
                        "id" => 2,
                        "name" => "天津市",
                        "en_name" => "Tianjin",
                        "exact_name" => "华北-天津市"
                    }, {
                        "id" => 3,
                        "name" => "石家庄市",
                        "en_name" => "Shijiazhuang",
                        "exact_name" => "华北-河北省石家庄市"
                    }, {
                        "id" => 30,
                        "name" => "武汉市",
                        "en_name" => "Wuhan",
                        "exact_name" => "华中-湖北省武汉市"
                    }
                ]
                render :json => {:cities => obj, :success => true}
            }
        end
    end


    def fake_for_contract
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "number" => "C1200005",
                        "summary" => "这是一个合同",
                        "currency_id" => 11,
                        "sum" => 5000
                    }, {
                        "id" => 2,
                        "number" => "C1200117",
                        "summary" => "合同",
                        "currency_id" => 15,
                        "sum" => 7000
                    }, {
                        "id" => 3,
                        "number" => "C1200054",
                        "summary" => "这也是一个合同",
                        "currency_id" => 11,
                        "sum" => 150000
                    }, {
                        "id" => 4,
                        "number" => "C1100111",
                        "summary" => "这是一个合同",
                        "currency_id" => 15,
                        "sum" => 2000
                    }
                ]
                render :json => {:contracts => obj, :success => true}
            }
        end
    end

    def fake_for_contract_item
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "contract_id" => 1,
                        "serial_number" => "DS-3216",
                        "product_id" => 11,
                        "product_quantity" => 5,
                        "expected_leave_factory_on" => "2012-09-15"
                    }, {
                        "id" => 2,
                        "contract_id" => 1,
                        "serial_number" => "FUSDTS",
                        "product_id" => 19,
                        "product_quantity" => 1,
                        "appointed_leave_factory_on" => "2012-09-10"
                    }, {
                        "id" => 3,
                        "contract_id" => 2,
                        "serial_number" => "CC&SS",
                        "product_id" => 100,
                        "product_quantity" => 1,
                        "check_and_accept_on" => "2012-08-31"
                    }, {
                        "id" => 4,
                        "contract_id" => 4,
                        "serial_number" => "PP-XA30",
                        "product_id" => 53,
                        "product_quantity" => 2,
                        "expected_leave_factory_on" => "2012-08-04"
                    }
                ]
                render :json => {:contract_items => obj, :success => true}
            }
        end
    end

    def fake_for_contract_history
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "contract_id" => 1,
                        "change_detail" => "<b>安装需求</b> 从 <font color='red'>不需要安装</font> 变成 <font color='green'>不需要安装</font>",
                        "reason" => "测试",
                        "created_on" => "2012-09-15"
                    }, {
                        "id" => 2,
                        "contract_id" => 1,
                        "change_detail" => "<b>PDL 800-B (40 MHz)皮秒半导体激光器驱动源、LDH-P-C-405B紫外－红外皮秒激光头的预计发货时间</b> 从 <font color='red'>[混合]</font> 变成 <font color='green'>2011年12月16日</font>",
                        "reason" => "1",
                        "created_on" => "2012-09-10"
                    }
                ]
                render :json => {:contract_histories => obj, :success => true}
            }
        end
    end

    def fake_for_contract_chart
        respond_to do |format|
            format.json {
                @contracts = Contract.all

                respond_to do |format|
                    format.json { render :json => { :contract_charts => Contract.find(1).sum_to_user } }
                end
            }
        end
    end

    def fake_for_contract_status
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "未完成"
                    }, {
                        "id" => 2,
                        "name" => "已完成"
                    }, {
                        "id" => 3,
                        "name" => "已取消"
                    }
                ]
                render :json => {:contract_statuses => obj, :success => true}
            }
        end
    end

    def fake_for_contract_type
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "销售合同"
                    }, {
                        "id" => 2,
                        "name" => "维修合同"
                    }, {
                        "id" => 3,
                        "name" => "租借/试用合同"
                    }, {
                        "id" => 4,
                        "name" => "项目合同"
                    }
                ]
                render :json => {:contract_types => obj, :success => true}
            }
        end
    end

    def fake_for_collection
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "contract_id" => 1,
                        "amount" => 300,
                        "received_on" => "2012-09-15",
                        "reason" => ""
                    }, {
                        "id" => 2,
                        "contract_id" => 1,
                        "amount" => 1500,
                        "received_on" => "2012-09-30",
                        "reason" => "尾款"
                    }
                ]
                render :json => {:collections => obj, :success => true}
            }
        end
    end

    def fake_for_receivable
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "contract_id" => 1,
                        "amount" => 300,
                        "expected_receive_on" => "2012-08-30",
                        "reason" => ""
                    }, {
                        "id" => 2,
                        "contract_id" => 1,
                        "amount" => 1500,
                        "expected_receive_on" => "2012-09-05",
                        "reason" => "尾款"
                    }
                ]
                render :json => {:receivables => obj, :success => true}
            }
        end
    end

    def fake_for_requirement_sort
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "国外→国内"
                    }, {
                        "id" => 2,
                        "name" => "国外→国外"
                    }, {
                        "id" => 3,
                        "name" => "国内→国外"
                    }, {
                        "id" => 4,
                        "name" => "国内→国内"
                    }
                ]
                render :json => {:requirement_sorts => obj, :success => true}
            }
        end
    end

    def fake_for_product
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "测试用产品",
                        "model" => "DS-3216"
                    }, {
                        "id" => 2,
                        "name" => "这也是测试用产品",
                        "model" => "FF335456"
                    }
                ]
                render :json => {:products => obj, :success => true}
            }
        end
    end

    def fake_for_send_status
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "货品生产中"
                    }, {
                        "id" => 2,
                        "name" => "等待发货中"
                    }, {
                        "id" => 3,
                        "name" => "国际运输途中"
                    }, {
                        "id" => 4,
                        "name" => "在货代处"
                    }, {
                        "id" => 5,
                        "name" => "在ETSC香港"
                    }, {
                        "id" => 6,
                        "name" => "清关中"
                    }, {
                        "id" => 7,
                        "name" => "在东隆"
                    }, {
                        "id" => 8,
                        "name" => "国内运输途中"
                    }, {
                        "id" => 9,
                        "name" => "在客户处"
                    }, {
                        "id" => 10,
                        "name" => "返厂中"
                    }
                ]
                render :json => {:send_statuses => obj, :success => true}
            }
        end
    end

    def fake_for_check_and_accept_status
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "未验收"
                    }, {
                        "id" => 2,
                        "name" => "验收正常"
                    }, {
                        "id" => 3,
                        "name" => "验收有问题"
                    }
                ]
                render :json => {:check_and_accept_statuses => obj, :success => true}
            }
        end
    end

    def fake_for_term
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "从出厂起12个月"
                    }, {
                        "id" => 2,
                        "name" => "从客户开始使用起10000个小时"
                    }
                ]
                render :json => {:terms => obj, :success => true}
            }
        end
    end

    def fake_for_pay_mode
        respond_to do |format|
            format.json {
                obj = [
                    {
                        "id" => 1,
                        "name" => "签合同时付100%(信用证)"
                    }, {
                        "id" => 2,
                        "name" => "发货后付USD7000(电汇)，验收后付USD3000(电汇)"
                    }
                ]
                render :json => {:pay_modes => obj, :success => true}
            }
        end
    end

    def fake_for_currency
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "%"
                    }, {
                        :id => 2,
                        :name => "混合"
                    }, {
                        :id => 11,
                        :name => "RMB",
                        :exchange_rate => 100.00
                    }, {
                        :id => 12,
                        :name => "EUR",
                        :exchange_rate => 808.17
                    }, {
                        :id => 13,
                        :name => "GBP",
                        :exchange_rate => 999.06
                    }, {
                        :id => 14,
                        :name => "USD",
                        :exchange_rate => 622.82
                    }, {
                        :id => 15,
                        :name => "CAD",
                        :exchange_rate => 627.39
                    }, {
                        :id => 16,
                        :name => "JPY",
                        :exchange_rate => 7.58
                    }, {
                        :id => 17,
                        :name => "HKD",
                        :exchange_rate => 80.36
                    }, {
                        :id => 18,
                        :name => "NTD",
                        :exchange_rate => 21.44
                    }
                ]
                render :json => {:currencies => obj, :success => true}
            }
        end
    end

    def fake_for_quote
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 2,
                        :quote_nmuber => "Q1300001",
                        :summary => "1234567",
                        :total => 3000,
                        :currency_id => 14,
                        :currency_name => "USD",
                        :pdf => {
                            :show_footer_discount => "off"
                        },
                        :term => {
                            :extra_term => "附加的条款"
                        }
                    },
                    {
                        :id => 7,
                        :quote_nmuber => "Q1300224",
                        :summary => "789456123",
                        :total => 8000,
                        :currency_id => 11,
                        :currency_name => "EUR",
                        :pdf => {
                            :show_footer_total => "off"
                        },
                        :term => {
                            :price_type_of_term => 1
                        }
                    }
                ]
                render :json => {:quotes => obj, :success => true}
            }
        end
    end

    def fake_for_quote_item
        respond_to do |format|
            format.json {
                obj = {
                    :text => ".",
                    #"leaf"     => false,
                    :children => [
                        {
                            :product_id => nil,
                            :product_model => 'PM48',
                            :product_name => '',
                            :vendor_unit_id => nil,
                            :vendor_unit_name => '',
                            :description => 'PM48',
                            :quantity => 1,
                            :quantity_2 => nil,
                            :original_unit_price => nil,
                            :original_currency => 'EUR',
                            :original_currency_id => 12,
                            :original_exchange_rate => 1000.00,
                            :times => 1,
                            :divide => 1,
                            :currency => 'USD',
                            :currency_id => 14,
                            :exchange_rate => 650.00,
                            :unit_price => nil,
                            :discount => nil,
                            :discount_to => nil,
                            :custom_tax => nil,
                            :total => nil,
                            :expanded => true,
                            :inner_id => '1',
                            :children => [
                                {
                                    :product_id => 563,
                                    :product_model => 'FM120-PM-mount',
                                    :product_name => '激光焦点分析仪配件',
                                    :vendor_unit_id => 100,
                                    :vendor_unit_name => 'Primes',
                                    :description => 'Overhead mount for FM120 on PM',
                                    :quantity => 2,
                                    :quantity_2 => nil,
                                    :original_unit_price => 650.00,
                                    :original_currency => 'EUR',
                                    :original_currency_id => 12,
                                    :original_exchange_rate => 1000.00,
                                    :times => 1,
                                    :divide => 1,
                                    :currency => 'USD',
                                    :currency_id => 14,
                                    :exchange_rate => 650.00,
                                    :unit_price => 1000.00,
                                    :discount => 100.00,
                                    :discount_to => 900.00,
                                    :custom_tax => nil,
                                    :total => 1800.00,
                                    :inner_id => '1-1',
                                    :leaf => true
                                },
                                {
                                    :product_id => 565,
                                    :product_model => 'PM48-TC',
                                    :product_name => '激光功率分析仪配件',
                                    :vendor_unit_id => 100,
                                    :vendor_unit_name => 'Primes',
                                    :description => 'travel case PM48',
                                    :quantity => 2,
                                    :quantity_2 => nil,
                                    :original_unit_price => 300.00,
                                    :original_currency => 'EUR',
                                    :original_currency_id => 12,
                                    :original_exchange_rate => 1000.00,
                                    :times => 1,
                                    :divide => 1,
                                    :currency => 'USD',
                                    :currency_id => 14,
                                    :exchange_rate => 650.00,
                                    :unit_price => 461.54,
                                    :discount => 11.54,
                                    :discount_to => 450.00,
                                    :custom_tax => nil,
                                    :total => 900.00,
                                    :inner_id => '1-2',
                                    :leaf => true
                                }
                            ]
                        },
                        {
                            :product_id => nil,
                            :product_model => 'PM120',
                            :product_name => '',
                            :vendor_unit_id => nil,
                            :vendor_unit_name => '',
                            :description => 'PM120',
                            :quantity => 1,
                            :quantity_2 => nil,
                            :original_unit_price => nil,
                            :original_currency => 'EUR',
                            :original_currency_id => 12,
                            :original_exchange_rate => 1000.00,
                            :times => 1,
                            :divide => 1,
                            :currency => 'RMB',
                            :currency_id => 11,
                            :exchange_rate => 650.00,
                            :unit_price => nil,
                            :discount => nil,
                            :discount_to => nil,
                            :custom_tax => nil,
                            :total => nil,
                            :expanded => true,
                            :inner_id => '2',
                            :children => [
                                {
                                    :product_id => 1563,
                                    :product_model => 'FM120HP',
                                    :product_name => '激光焦点分析仪',
                                    :vendor_unit_id => 100,
                                    :vendor_unit_name => 'Primes',
                                    :description => 'FM120 for high power applications The FM120HP has a rotation unit (7500 rpm) for the measurement tip as 2 linear axis (8 mm and 120 mm). This results in a measurement range for beams of 0.1 to 5 mm with Rayleigh length up to 25 mm.',
                                    :quantity => 1,
                                    :quantity_2 => nil,
                                    :original_unit_price => 800.00,
                                    :original_currency => 'EUR',
                                    :original_currency_id => 12,
                                    :original_exchange_rate => 1000.00,
                                    :times => 1,
                                    :divide => 1,
                                    :currency => 'USD',
                                    :currency_id => 14,
                                    :exchange_rate => 650.00,
                                    :unit_price => 1230.77,
                                    :discount => 30.77,
                                    :discount_to => 1200.00,
                                    :custom_tax => nil,
                                    :total => 1200.00,
                                    :inner_id => '2-1',
                                    :leaf => true
                                },
                                {
                                    :product_id => nil,
                                    :product_model => '子系统',
                                    :product_name => '',
                                    :vendor_unit_id => nil,
                                    :vendor_unit_name => '',
                                    :description => '子系统的参数，这个可以有',
                                    :quantity => 2,
                                    :quantity_2 => nil,
                                    :original_unit_price => 300.00,
                                    :original_currency => 'EUR',
                                    :original_currency_id => 12,
                                    :original_exchange_rate => 1000.00,
                                    :times => 1,
                                    :divide => 1,
                                    :currency => 'USD',
                                    :currency_id => 14,
                                    :exchange_rate => 650.00,
                                    :unit_price => 461.54,
                                    :discount => 11.54,
                                    :discount_to => 450.00,
                                    :custom_tax => nil,
                                    :total => 450.00,
                                    :expanded => true,
                                    :inner_id => '2-2',
                                    :children => [
                                        {
                                            :product_id => 1563,
                                            :product_model => 'FM120HP',
                                            :product_name => '激光焦点分析仪',
                                            :vendor_unit_id => 100,
                                            :vendor_unit_name => 'Primes',
                                            :description => 'FM120 for high power applications The FM120HP has a rotation unit (7500 rpm) for the measurement tip as 2 linear axis (8 mm and 120 mm). This results in a measurement range for beams of 0.1 to 5 mm with Rayleigh length up to 25 mm.',
                                            :quantity => 1,
                                            :quantity_2 => nil,
                                            :original_unit_price => 800.00,
                                            :original_currency => 'EUR',
                                            :original_currency_id => 12,
                                            :original_exchange_rate => 1000.00,
                                            :times_2 => 0.5,
                                            :divide_2 => 1,
                                            :currency => 'USD',
                                            :currency_id => 14,
                                            :exchange_rate => 650.00,
                                            :unit_price => 1230.77,
                                            :discount => 610.77,
                                            :discount_to => 620.00,
                                            :custom_tax => nil,
                                            :total => 620.00,
                                            :inner_id => '2-2-1',
                                            :leaf => true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
                render :text => obj.to_json
            }
        end
    end

    def fake_for_combo_our_company
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "武汉东隆科技有限公司",
                        :en_name => "ETSC Technologies Co., Ltd."
                    }, {
                        :id => 2,
                        :name => "武汉隽龙科技有限公司",
                        :en_name => "Junno Technologies Co."
                    }
                ]
                render :json => {:our_companies => obj, :success => true}
            }
        end
    end

    def fake_for_combo_sale
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "陈芬芬"
                    }, {
                        :id => 2,
                        :name => "高袁满"
                    }
                ]
                render :json => {:sales => obj, :success => true}
            }
        end
    end

    def fake_for_quote_type
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "销售报价"
                    }, {
                        :id => 2,
                        :name => "维修报价"
                    }, {
                        :id => 3,
                        :name => "租用/借用报价"
                    }, {
                        :id => 4,
                        :name => "项目报价"
                    }
                ]
                render :json => {:quote_types => obj, :success => true}
            }
        end
    end

    def fake_for_quote_language
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "中文"
                    }, {
                        :id => 2,
                        :name => "英文"
                    }
                ]
                render :json => {:quote_languages => obj, :success => true}
            }
        end
    end

    def fake_for_quote_format
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "普通报价"
                    }, {
                        :id => 2,
                        :name => "阶梯报价"
                    }
                ]
                render :json => {:quote_formats => obj, :success => true}
            }
        end
    end


    def fake_for_all_dict
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "普通报价",
                        :key => "quote"
                    },
                    {
                        :id => 2,
                        :name => "阶梯报价",
                        :key => "quote"
                    },
                    {
                        :id => 3,
                        :name => "中文",
                        :key => "language"
                    },
                    {
                        :id => 4,
                        :name => "英文",
                        :key => "language"
                    }
                ]
                render :json => {:all_dicts => obj, :success => true}
            }
        end
    end

    def fake_jsonp
        #String jsonString = "{success: true}";
        #String cb = Request.Params.Get("callback");
        #String responseString = "";
        #if (!String.IsNullOrEmpty(cb)) {
        #    responseString = cb + "(" + jsonString + ")";
        #} else {
        #    responseString = jsonString;
        #}
        #Response.Write(responseString);
        respond_to do |format|
            format.json {
                obj = [
                    {
                        :id => 1,
                        :name => "terry"
                    }
                ]
                #binding.pry
                render :text => params[:callback] + '(' + '{"data":[{"id": 3, "name": "xxx"}], "totalRecords": 5}' + ');'
            }
        end
    end

end
