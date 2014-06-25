# encoding: utf-8
class RealExchangeRate < ActiveRecord::Base
    require "reusable"
    include Reusable
    attr_accessible :cad, :date, :eur, :gbp, :jpy, :usd, :hkd, :ntd

    #抓取中国银行网页上的汇率信息存入数据库
    #http://www.boc.cn/sourcedb/whpj/index.html
    #
    def self.spider
        require 'rubygems'
        require 'nokogiri'
        require 'open-uri'

        real_exchange_rate = self.new
        real_exchange_rate.date = Date.today
        url = "http://www.boc.cn/sourcedb/whpj/index.html"
        doc = Nokogiri::HTML(open(url))
        table = doc.xpath("/html/body/div[@class='wrapper']/div[@class='BOC_main']/div[@class='publish']/div[2]/table")
        #table = doc.xpath("/html/body/table[2]/tr/td[2]/table[3]/tr/td/table") 20140116过期
        #binding.pry
        if table.xpath('tr').xpath('td[6]').inner_text.blank?
            UserMailer.alert_email("汇率获取失败，可能是对方网站改版").deliver
        else
            table.xpath('tr').each { |tr|
                case tr.xpath('td[1]').inner_text
                    when "新台币"
                        real_exchange_rate.ntd = tr.xpath('td[6]').inner_text
                    when "英镑"
                        real_exchange_rate.gbp = tr.xpath('td[6]').inner_text
                    when "港币"
                        real_exchange_rate.hkd = tr.xpath('td[6]').inner_text
                    when "美元"
                        real_exchange_rate.usd = tr.xpath('td[6]').inner_text
                    when "日元"
                        real_exchange_rate.jpy = tr.xpath('td[6]').inner_text
                    when "加拿大元"
                        real_exchange_rate.cad = tr.xpath('td[6]').inner_text
                    when "欧元"
                        real_exchange_rate.eur = tr.xpath('td[6]').inner_text
                end
            }
            real_exchange_rate.save
            #puts table
            contracts = Contract.where("signed_at is null and currency_id != 11")
            contracts.each do |contract|
                currency_name = contract.currency.name
                exchange_rate = eval("real_exchange_rate.#{currency_name.downcase}")
                contract.exchange_rate = exchange_rate
                contract.rmb = contract.sum * exchange_rate / 100.0
                contract.save
            end
        end
    end

    def for_grid_json
        #attr = attributes
        #attr['usd'] = usd
        #attr
        attributes
    end
end


