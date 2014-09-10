# encoding: utf-8
class CustomerUnit < ActiveRecord::Base
    require "reusable"
    include Reusable

    attr_accessible :comment, :credit_level, :cu_sort, :en_name, :name, :site, :user_id
    #has_many :customers
    has_many :quotes
    has_many :contracts
    #has_many :customer_unit_aliases
    has_many :unit_aliases, :class_name => 'CustomerUnitAlias', :foreign_key => 'customer_unit_id'

    #个案和客户单位多对多
    has_many :customer_units_salecases
    has_many :salecases, :through => :customer_units_salecases

    #水单和客户单位多对多
    has_many :customer_units_flow_sheets, :class_name => 'CustomerUnitsFlowSheet', :foreign_key => :customer_unit_id
    has_many :flow_sheets, :through => :customer_units_flow_sheets, :source => :flow_sheet

    #belongs_to :city
    has_many :customer_unit_addrs, :class_name => 'CustomerUnitAddr', :foreign_key => 'unit_id'

    belongs_to :user

    #快递单多态
    has_one :express_sheet, :as => :unit_receivable

    def self.query_by(query)
        where("customer_unit_aliases.unit_alias like ?", "%#{query}%").includes(:unit_aliases)
    end

    #TODO 似乎发现了了不得的大bug，关于引号的……待测待改
    def for_combo_json
        attr = attributes
        if customer_unit_addrs.size > 1
            attr['addr'] = customer_unit_addrs.map do |p|
                {
                    "name" => %Q|#{p['name']}|,#用最不可能出现在地址里的字符“|”当分隔
                    "postcode" => %Q|#{p['postcode']}|,
                    "addr" => %Q|#{p['addr']}|,
                    "en_addr" => %Q|#{p['en_addr']}|,
                    "customer_unit_addr_id" => "#{p['id']}"
                }
            end.to_s.gsub("=>", ":")
        else
            attr['addr'] = [{
                "name" => customer_unit_addrs[0]['name'].to_s,
                "postcode" => customer_unit_addrs[0]['postcode'].to_s,
                "addr" => customer_unit_addrs[0]['addr'].to_s,
                "en_addr" => customer_unit_addrs[0]['en_addr'].to_s,
                "customer_unit_addr_id" => customer_unit_addrs[0]['id'].to_s
            }].to_s.gsub("=>", ":")
        end

        #attr['addr'] = self.customer_unit_addrs.size > 1 ? (self.customer_unit_addrs.map{|p| "#{p.name}：#{p.addr}"}.join("；")) : (self.customer_unit_addrs[0].addr)
        attr
    end

    #def prime
    #    customer_unit_addrs.select{|p| p["is_prime"]}[0].city
    #end
    #
    #def city
    #    customer_unit_addrs.select{|p| p["is_prime"]}[0].city
    #    #customer_unit_addrs.map(&:city)[0]
    #end
    #def addr
    #    customer_unit_addrs.select{|p| p["is_prime"]}[0].addr
    #    #customer_unit_addrs.map(&:addr)[0]
    #end
    #def en_addr
    #    customer_unit_addrs.select{|p| p["is_prime"]}[0].en_addr
    #    #customer_unit_addrs.map(&:en_addr)[0]
    #end
    #def postcode
    #    customer_unit_addrs.select{|p| p["is_prime"]}[0].postcode
    #    #customer_unit_addrs.map(&:postcode)[0]
    #end

    def for_grid_json
        #binding.pry
        attr = attributes
        #binding.pry if city.nil?
        #这里有一个奇怪的关于过滤的不知道算不算bug的东东：
        #如果不要以下两句的话，带上过滤则会有错误。比如本来是三个地址的，过滤完后只显示一个，双击编辑时也只会显示一个，所以加上这两句修正一下
        real_customer_unit = self.customer_unit_addrs[0].customer_unit
        customer_unit_addrs = real_customer_unit.customer_unit_addrs

        attr['name|en_name|unit_aliases>unit_alias'] = name
        attr['customer_unit_addrs>city>name'] = customer_unit_addrs.map{|p| p.city.name}.uniq.join("、")
        attr['customer_unit_addrs>addr'] = customer_unit_addrs.map{|p| p.addr}.uniq.join("、")
        attr['customer_unit_addrs>en_addr'] = customer_unit_addrs.map{|p| p.en_addr}.uniq.join("/")
        attr['customer_unit_addrs>postcode'] = customer_unit_addrs.map{|p| p.postcode}.uniq.join("、")
        #attr['city_id'] = city.id if city
        #名称不显示在别称里
        customer_unit_aliases_id_array = []
        customer_unit_aliases_name_array = []
        unit_aliases.each do |customer_unit_alias|
            if customer_unit_alias.unit_alias != name
                customer_unit_aliases_id_array << customer_unit_alias.id
                customer_unit_aliases_name_array << customer_unit_alias.unit_alias
            end
        end
        attr['unit_aliases>id'] = customer_unit_aliases_id_array.join('|')
        attr['unit_aliases>unit_alias'] = customer_unit_aliases_name_array.join('、')

        attr['all_city_ids'] = customer_unit_addrs.map{|p| p.city_id}.join("||")
        attr['all_city_names'] = customer_unit_addrs.map{|p| p.city.name}.join("||")
        attr['all_is_primes'] = customer_unit_addrs.map{|p| p.is_prime}.join("||")
        attr['all_addr_names'] = customer_unit_addrs.map{|p| p.name}.join("||")
        attr['all_postcodes'] = customer_unit_addrs.map{|p| p.postcode}.join("||")
        attr['all_addrs'] = customer_unit_addrs.map{|p| p.addr}.join("||")
        attr['all_en_addrs'] = customer_unit_addrs.map{|p| p.en_addr}.join("||")
        attr
    end

    #成员组能看到的客户的并集
    # @param [Array] member_ids
    def self.get_data_from_members(member_ids, user_id)
        str = "(" + member_ids.map{"?"}.join(",") + ")"
        where("customers.user_id in #{str} or users.id in #{str}", *member_ids, *member_ids).includes(:shared_to)
    end

    #自定义提交。因为模型复杂，估计是不可能公用了
    def self.create_or_update_with(params, user_id)
        #binding.pry
        item = "客户单位"
        if !params[:id].blank?
            #修改时判断重名要看name和id
            if CustomerUnit.where("name = ? and id != ?", params['name|en_name|unit_aliases>unit_alias'], params[:id]).size > 0
                return {:success => false, :message => $etsc_duplicate_unit_name}
            else
                customer_unit = CustomerUnit.find(params[:id])
                message = $etsc_update_ok
            end
        else
            #新增时判断重名只看name
            if CustomerUnit.where("name = ?", params['name|en_name|unit_aliases>unit_alias']).size > 0
                return {success: false, :message => $etsc_duplicate_unit_name}
            else
                customer_unit = CustomerUnit.new
                customer_unit.credit_level = 4 #默认D级客户
                message = $etsc_create_ok
            end
        end
        #binding.pry
        fields_to_be_updated = %w(en_name site cu_sort comment)
        fields_to_be_updated.each do |field|
            customer_unit[field] = params[field]
        end
        #binding.pry
        customer_unit.user_id = user_id
        customer_unit.name = params['name|en_name|unit_aliases>unit_alias']
        customer_unit.save

        #地址不能删，因为地址和客户还有着关联
        #但地址正好也不提供删除功能，所以直接加就好了
        #CustomerUnitAddr.delete_all("unit_id = #{params[:id]}")

        #存地址
        params_keys = params.keys
        addr_list = params_keys.select{|p| p.include?("addr_name")}
        addr_count = addr_list.size

        #binding.pry
        #先来判断“有效地址”数
        max_tag_number = addr_list.map{|p| p[10..-1].to_i}.max
        if max_tag_number == 1
            #如果总长等于1，则认为其“有效”，用传来的参数直接进行处理
            if params[:id] == ""
                #新增
                addr = CustomerUnitAddr.new
            else
                #修改
                addr = CustomerUnitAddr.where("unit_id = ?", customer_unit.id).first
            end
            addr['name'] = params["addr_name_1"]
            addr['is_prime'] = params["is_prime_1"]
            if addr_count == 1
                addr['city_id'] = params["city_id_1"]
            else
                addr['city_id'] = params["real_city_id_1"].blank? ? params["city_id_1"] : params["real_city_id_1"]
            end

            addr['postcode'] = params["postcode_1"]
            addr['addr'] = params["addr_1"]
            addr['en_addr'] = params["en_addr_1"]
            addr['unit_id'] = customer_unit.id
            addr['user_id'] = user_id
            addr.save
        else
            #如果总长大于1，则循环，看是否有描述为空，有则无视此项，不为空的才处理
            if params[:id] == ""
                #新增
                1.upto(max_tag_number) do |index|
                    if params["addr_name_#{index}"].blank?
                    else
                        addr = CustomerUnitAddr.new
                        addr['name'] = params["addr_name_#{index}"]
                        addr['is_prime'] = params["is_prime_#{index}"]
                        addr['city_id'] = params["real_city_id_#{index}"].blank? ? params["city_id_#{index}"] : params["real_city_id_#{index}"]
                        addr['postcode'] = params["postcode_#{index}"]
                        addr['addr'] = params["addr_#{index}"]
                        addr['en_addr'] = params["en_addr_#{index}"]
                        addr['unit_id'] = customer_unit.id
                        addr['user_id'] = user_id
                        addr.save
                    end
                end
            else
                #修改
                to_delete_addr_array = []
                1.upto(max_tag_number) do |index|
                    if params["addr_name_#{index}"].blank?
                        #对应的某项变成没有描述，则说明此项不要了，删之
                        addr = CustomerUnitAddr.where("unit_id = ?", customer_unit.id)[index - 1]
                        to_delete_addr_array << addr#有可能取到空
                    else
                        addr = CustomerUnitAddr.where("unit_id = ?", customer_unit.id)[index - 1]
                        addr = CustomerUnitAddr.new if addr.blank?
                        addr['name'] = params["addr_name_#{index}"]
                        addr['is_prime'] = params["is_prime_#{index}"]
                        addr['city_id'] = params["real_city_id_#{index}"].blank? ? params["city_id_#{index}"] : params["real_city_id_#{index}"]
                        addr['postcode'] = params["postcode_#{index}"]
                        addr['addr'] = params["addr_#{index}"]
                        addr['en_addr'] = params["en_addr_#{index}"]
                        addr['unit_id'] = customer_unit.id
                        addr['user_id'] = user_id
                        addr.save
                    end
                end

                #集中删
                to_delete_addr_array.each do |addr|
                    addr.destroy
                end
            end
        end

        if params[:id] != ""
            CustomerUnitAlias.delete_all("customer_unit_id = #{params[:id]}")
            customer_unit_id = params[:id].to_i
        else
            customer_unit_id = customer_unit.id
        end
        #存别称
        #本名也作为别称的一条存起来
        alias_array = params['unit_aliases>unit_alias'].multi_split << params['name|en_name|unit_aliases>unit_alias']
        alias_array.each do |unit_alias|
            customer_unit_alias_params = {
                :customer_unit_id => customer_unit_id,
                :unit_alias => unit_alias
            }
            CustomerUnitAlias.create_or_update_with(customer_unit_alias_params, user_id)
        end
        return {:success => true, :message => "#{item}#{message}", :id => customer_unit.id}

    end
end
