# encoding = utf-8
class Series < ActiveRecord::Base
    attr_accessible :application_in_site, :brief, :description, :feature, :is_display, :is_recommend, :name, :parameter_in_site, :sort_by_application_id, :sort_by_function_id, :user_id

    def self.for_site(per_page, filter)
        category = filter["category"]
        if category == "0"
            output = where("true")
        else
            output = where("sort_by_category_id = ?", category)
        end

        form = filter["form"]
        #binding.pry
        checkbox_hash = {}
        range_hash = {}
        form.each_with_index do |item, index|
            case item[1]["name"]
                when "big-keyword"
                    unless item[1]["value"].blank?
                        big_keyword = item[1]["value"]
                        target_column_array = %w(brief name description application_in_site parameter_in_site feature)
                        fore_str = target_column_array.map{|p| p + " like ? "}.join("or ")
                        back_array = target_column_array.map{|p| "%#{big_keyword}%"}
                        #p output.where(fore_str, *back_array).to_sql
                        output = output.where(fore_str, *back_array)
                    end
                when /<>$/
                    #单选radio
                    #binding.pry
                    unless item[1]["value"] == "0"
                        #TODO 加数据库列
                        #p output.where("#{item[1]["name"][0..-3]} = ?", item[1]["value"]).to_sql
                        output = output.where("#{item[1]["name"][0..-3]} = ?", item[1]["value"])
                    end
                when /\[\]$/
                    #多选checkbox
                    #binding.pry
                    if checkbox_hash[item[1]["name"]].blank?
                        checkbox_hash[item[1]["name"]] = []
                    end
                    checkbox_hash[item[1]["name"]] << item[1]["value"]
                when /-m(?:in|ax)-(?:value|combo)$/
                    #binding.pry
                    if range_hash[item[1]["name"][0..-11]].blank?
                        range_hash[item[1]["name"][0..-11]] = {}
                    end
                    range_hash[item[1]["name"][0..-11]][item[1]["name"][-9..-1]] = item[1]["value"]
            end
        end

        checkbox_hash.each do |checkbox|
            options = checkbox[1]
            #TODO 加数据库列
            #p output.where("#{checkbox[0][0..-3]} in (#{options.map{"?"}.join(",")})", *options).to_sql
            output = output.where("#{checkbox[0][0..-3]} in (#{options.map{"?"}.join(",")})", *options)
        end
        #binding.pry
        range_hash.each do |range|
            unless range[1]['min-value'].blank? && range[1]['max-value'].blank?
                if range[1].size == 4
                    #有combo的
                    actually_min_value = "#{range[1]['min-value']}e#{range[1]['min-combo']}".to_f
                    actually_max_value = "#{range[1]['max-value']}e#{range[1]['max-combo']}".to_f
                else
                    #无combo的
                    actually_min_value = range[1]['min-value']
                    actually_max_value = range[1]['max-value']
                end
                #还得看是本身在表里是range值还是单值
                if self.column_names.include?(range[0])
                    #单值
                    output = output.where("#{range[0]} >= ? and #{range[0]} <= ?", actually_min_value, actually_max_value)
                elsif self.column_names.include?("#{range[0]}_min")
                    #range值
                    output = output.where("#{range[0]}_min >= ? and #{range[0]}_max <= ?", actually_min_value, actually_max_value)
                else
                    #无此栏，随便搜一下吧
                end
            end
            #binding.pry
        end
        #binding.pry
        filter['page'] = 1 if filter['page'].to_i == 0

        offset = per_page * (filter['page'].to_i - 1)
        #binding.pry
        real_output = output.order("id DESC").offset(offset).limit(per_page)

        return {:products => real_output, :total_pages => (output.size / per_page) + 1}
    end
end

