class Array
    # @return [Hash]
    # ["customer", "customer_unit", "city", "prvc", "area"]
    # 会变成
    # {"customer" => {"customer_unit" => {"city" => {"prvc" => "area"}}}}
    # 方便被join
    def to_link_table_hash
        if self.length > 1
            #后两项并成一个Hash
            last = self.delete_at(-1)
            last_2 = self.delete_at(-1)
            new_array = self[0..-1] << Hash[last_2, last]
            new_array.to_link_table_hash
        else
            self[0]
        end
    end

    #不带参数，用self来递归
    def cross_multi
        case self.size
            when 1
                return self
            when 2
                self_expand(result = [])
                return result.map{|p| p.flatten}
            else
                [self[0], self[1..-1].cross_multi].cross_multi
        end
    end

    #数组长度为2时就可以交叉“乘”了
    def self_expand(result = [])
        expand_into(self[0], self[1], result)
        return result
    end

    #两个数组做类似“乘法”，变成一个二维数组，结果输出为result
    def expand_into(front_item, back_item, result)
        #binding.pry
        if back_item.class.name == "Array"
            back_item.each do |item|
                expand_into_right(front_item, item, result)
            end
        else
            expand_into_right(front_item, back_item, result)
        end
        return result
    end

# 一个数组和一个单元素做类似“乘法”，变成一个二维数组，结果输出为result
# [].expand_into_right([1, 2, 3], 7, [])
#>> [[1, 7], [2, 7], [3, 7]]
#[].expand_into_right(1, 5, [])
#>> [[1, 5]]
# @param [Array or String or Integer] front_item
# @param [String or Integer] back_item
# @param [Array] result
# @return [Array] 合并之后的数组
    def expand_into_right(front_item, back_item, result)
        if front_item.class.name == "Array"
            front_item.each do |item_0|
                result << [item_0] + [back_item]
            end
        else
            result << [front_item] + [back_item]
        end
        return result
    end

    #一个长数组，形如：
    #["vendor_unit", {"vendor_unit" => {"unit_aliases" => "a"}}, {"vendor_unit"=>"unit_aliases"}, "vendor_unit"]
    #可能有String或者Hash。
    #取出其中最“长”的
    # @return [Object]
    def get_longest_include_hash
        hash_part = []
        self.each do |item|
            if item.class.name == "Hash"
                hash_part << item
            end
        end

        return self[0]
    end
end