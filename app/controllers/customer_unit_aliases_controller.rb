class CustomerUnitAliasesController < ApplicationController
  before_filter :authorize, :time_zone_adjust
  skip_before_filter :verify_authenticity_token
  #  layout "basic"
  #  def check_alias_input
  #    respond_to do |format|
  #      format.json {
  #        #传过来的输入值
  #        cu_alias = params[:unit_alias]
  ##        p cu_alias
  #        if cu_alias.blank?
  #          #空值，则提示错误
  #          render :text => {'status' => 'XX', 'str' => '你啥都没输入哎！'}.to_json
  #        else
  #          #          tar_alias = CustomerUnitAlias.find_by_unit_alias(cu_alias)
  #          #          if tar_alias.blank?
  #          #            #找不到此值，则以此为名new一个
  #          #因为可以多单位同一别称，换上了多对多表，所以不用判断了--Terry20110221
  #          #还是考虑不周，详见下
  #          tar_alias = CustomerUnitAlias.where("unit_alias = ?",cu_alias)
  #          if tar_alias.blank?
  #            #找不到以此为别称的，new一个
  ##            p params
  ##            p cu_alias
  #            create_new_alias(params[:customer_unit_id], cu_alias, session[:user_id])
  #          else
  #            #找到有这个别称，再反查别称为此的单位
  #            customer_units_array = CustomerUnit.where("customer_unit_aliases.unit_alias = ?",cu_alias).includes(:unit_aliases)
  #            customer_unit_ids = customer_units_array.map { |p| p.id }
  #            if customer_unit_ids.include?(params[:customer_unit_id].to_i)
  #              #如果其中已经包含params[:customer_unit_id]，则提示已经存在
  #              render :text => {'status' => 'XX', 'str' => '你所输入的别称已经存在！'}.to_json
  #            else
  #              #否则也new一个
  #              create_new_alias(params[:customer_unit_id], cu_alias, session[:user_id])
  #            end
  #          end
  #          #          else
  #          #            #已有此值，则提示已经存在
  #          #            render :text => {'str' => '你所输入的别称已经存在！是这个单位的：'+ tar_alias.customer_unit.name}.to_json
  #          #          end
  #        end
  #      }
  #    end
  #  end
  #
  #  def create_new_alias(customer_unit_id, cu_alias, user_id)
  #    new_alias = CustomerUnitAlias.new(:unit_alias => cu_alias, :user_id => user_id)
  #    if new_alias.save
  #      #保存成功
  #      new_link = CustomerUnitsCustomerUnitAlias.new(:customer_unit_id => customer_unit_id, :customer_unit_alias_id => new_alias.id)
  #      if new_link.save
  #        render :text => {'status' => 'OK', 'str' => '已成功为单位“'+CustomerUnit.find(customer_unit_id).name+'”添加别称 '+cu_alias+' ！'}.to_json
  #      end
  #    else
  #      #保存失败
  #      render :text => {'status' => 'XX', 'str' => '数据库那边好像出问题了……找管理员看看吧'}.to_json
  #    end
  #  end

  #根据传入的文本和ids，通过AJAX方式给指定单位增加别称
  def add_from_input(dummy = nil)
    #先看传入的文本在别称表里有没有
    customer_unit_alias = CustomerUnitAlias.find_by_unit_alias(params["alias"])
    if customer_unit_alias.blank?
      #找不到，就以此别称为名，新增一个
      customer_unit_alias = CustomerUnitAlias.new("unit_alias" => params["alias"], "user_id" => session[:user_id])
      customer_unit_alias.save
    end

    added_alias_array = []

    for customer_unit_id in params["selection"].split("|")
      CustomerUnitsCustomerUnitAlias.delete_all(["customer_unit_id = ? and customer_unit_alias_id = ?", customer_unit_id, customer_unit_alias.id])
      customer_units_customer_unit_aliases = CustomerUnitsCustomerUnitAlias.new("customer_unit_id" => customer_unit_id, "customer_unit_alias_id" => customer_unit_alias.id)
      customer_units_customer_unit_aliases.save
      added_alias_array << customer_unit_id
    end
    if added_alias_array.size > 0
      render :text => {"str" => "OK", "added_alias" => added_alias_array.join("|"), "added_alias_length" => added_alias_array.length}.to_json
    else
      render :text => {"str" => "NO"}.to_json
    end
  end

end
