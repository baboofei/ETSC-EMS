# encoding: utf-8
class String
    #多重分割符分割成数组，默认以半角逗号、全角逗号和顿号分，要以别的分自己加参数
    def multi_split(splitters=%w(, ， 、))
        #先以第一个分隔符分一次
        #binding.pry
        k_array_2 = self.split(splitters[0])
        splitters[1..-1].each { |splitter|
            #先把array_1转成待分数组，array_2清空
            k_array_1 = k_array_2
            k_array_2 = []
            k_array_1.each { |w1|
                #对array_1中每个元素，以分隔符序列中的元素分一次试试
                s1 = w1.split(splitter)
                #分的结果每部分当成一个元素存入k_array_2中，备用
                s1.each { |w2|
                    k_array_2 << w2
                }
            }
        }
        k_array_2.uniq
    end

    #将形如“Q1300325”这样的报价/个案/资产等编号转成一个能在ExtJS里点击跳转的链接
    #这是“提醒”里的，有“提醒序列号”r_sn的存在
    # @param [string] sn
    # @param [String] show_as，默认为原字符串不变
    # @return [String]
    def to_eim_remind_link(sn, show_as = self)
        if match(/\b[A-Z]\d{7}\b/)
            #满足标准形式才转换
            signal = self[0]
            function = Function.find_by_signal(signal)
            %{<a href="#" class='innerNavi' x="r_sn:#{sn}|id:#{function.ext_id}|innerId:#{function.id}|title:#{function.name}|controller:#{function.controller}|widget:#{function.widget}|filterStr:#{self}">#{show_as}</a>}
        else
           self
        end
    end
    #这是“消息”里的，有“消息序列号”m_sn的存在
    # @param [string] sn
    # @param [String] show_as，默认为原字符串不变
    # @return [String]
    def to_eim_message_link(sn, show_as = self)
        if match(/\b[A-Z]\d{7}\b/)
            #满足标准形式才转换
            signal = self[0]
            function = Function.find_by_signal(signal)
            %{<a href="#" class='innerNavi' x="m_sn:#{sn}|id:#{function.ext_id}|innerId:#{function.id}|title:#{function.name}|controller:#{function.controller}|widget:#{function.widget}|filterStr:#{self}">#{show_as}</a>}
        else
            self
        end
    end
    #这是“普通版”的，不用设置已读，不要sn
    # @param [String] show_as，默认为原字符串不变
    # @return [String]
    def to_eim_link(show_as = self)
        if match(/\b[A-Z]\d{7}\b/)
            #满足标准形式才转换
            signal = self[0]
            function = Function.find_by_signal(signal)
            %{<a href="#" class='innerNavi' x="id:#{function.ext_id}|innerId:#{function.id}|title:#{function.name}|controller:#{function.controller}|widget:#{function.widget}|filterStr:#{self}">#{show_as}</a>}
        else
           self
        end
    end
    #这是“姓名”用的，根本无法用上面的“标准形式”，所以单写一个
    # @param [String] sn
    # @param [String] show_as，默认为原字符串不变
    def customer_name_to_eim_link(sn, show_as = self)
        %{<a href="#" class='innerNavi' x="m_sn:#{sn}|id:source_grid|innerId:3|title:客户管理|controller:Customers|widget:customer_panel|filterStr:#{self}">#{show_as}</a>}
    end


    #中文防奇怪的标点排头问题
    def chinese_wrap
        # 强行，还有中文标点前/后多一个小号的半角空格。希望能解决PDF里的各种排头排尾问题
        #先把中文标点前后误敲的空格去掉
        text = self.gsub(/\s+([，。；、（）“”\(\)\[\]])\s+/, '\1')
        #先把“<”替换成“&lt;”
        text = text.gsub(/</, "&lt;")
        #把半角空格换成小号的全角空格
        text = text.gsub(/ /, %q(<font size="4">　</font>))
        #再把中文标点相应的前后加上半角空格，防排头排尾。注意(&lt;5)这样的不能替换，不然就拆散了，所以判断“非&”的字符
        text = text.gsub(/(.)([，。；、”）\)\]]+)/, '<font size="1"> </font>\1\2<font size="1"> </font>').gsub(/([“（\(\[])([^&]+)/, '<font size="1"> </font>\1\2<font size="1"> </font>')
        #再把回车换成100个空格，以确保挤到下一行
        text = text.gsub(/\n\r/, " "*100)
        #如果有“&lt;su”这样的表示上标下标的，再换回来
        text = text.gsub(/&lt;\/su/, "</su").gsub(/&lt;su/, "<su")
        text
    end

    #其实不是换行的问题，只是单纯地替换<，但命名跟上面的一系列吧
    def english_wrap
        #先把“<”替换成“&lt;”
        text = self.gsub(/</, "&lt;")
        #如果有“&lt;su”这样的表示上标下标的，再换回来
        text = text.gsub(/&lt;\/su/, "</su").gsub(/&lt;su/, "<su")
        text
    end
    #TODO 优化
end