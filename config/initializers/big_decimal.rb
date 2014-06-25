class BigDecimal

    #为了自然语言的通顺，如果有小数则返回小数，无小数则返回整数
    #如3.5 => 3.5  3.0 => 3
    def trunk_decimal_part
        self.to_i == self.to_f ? self.to_i : self.to_f
    end
end