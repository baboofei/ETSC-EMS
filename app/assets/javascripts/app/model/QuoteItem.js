Ext.define('EIM.model.QuoteItem', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'quote_id',
        type: 'int'
    }, {
        name: 'inner_id', //“1-3-1”这样的编号
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'product_id',
        type: 'int'
    }, {
        name: 'product_model',
        type: 'string'
    }, {
        name: 'product_name',
        type: 'string'
    }, {
        name: 'vendor_unit_id',
        type: 'int'
    }, {
        name: 'vendor_unit_name',
        type: 'string'
    }, {
        name: 'quantity',
        type: 'int'
    }, {
        name: 'quantity_2',
        type: 'int'
    }, {
        name: 'original_unit_price', //从list价/工厂价/市场价/网站价里选一个取出来的价格
        type: 'float'
    }, {
        name: 'original_currency_id',
        type: 'int'
    }, {
        name: 'original_currency_name',
        type: 'string'
    }, {
        name: 'original_exchange_rate',
        type: 'float'
    }, {
        name: 'times_1', //乘以多少
        type: 'float'
    }, {
        name: 'divide_1', //除以多少
        type: 'float'
    }, {
        name: 'currency_id', //本报价里所采用的币种
        type: 'int'
    }, {
        name: 'currency_name', //本报价里所采用的币种
        type: 'string'
    }, {
        name: 'exchange_rate',
        type: 'float'
    }, {
        name: 'unit_price', //折合成符合本报价币种后的单价
        type: 'float'
    }, {
        name: 'discount', //折掉的单价
        type: 'float'
    }, {
        name: 'discount_to', //折剩下的单价
        type: 'float'
    }, {
        name: 'custom_tax', //关税，跟产品走的。仅显示
        type: 'float'
    }, {
        name: 'total', //乘数量，本报价项总价
        type: 'float'
    }, {
        name: 'is_leaf',
        type: 'boolean'
    }, {
        name: 'leaf',
        type: 'boolean'
    }, {
        name: 'times_2',
        type: 'float'
    }, {
        name: 'divide_2',
        type: 'float'
    }, {
        name: 'system_price', //系统价
        type: 'float'
    }, {
        name: 'system_discount', //系统折扣
        type: 'float'
    }, {
        name: 'item_total_amount', //系统下产品小计
        type: 'float'
    }, {
        name: 'item_total_currency_id', //系统下产品小计后的币种，按说应该和最终的币种一样，但以防万一
        type: 'int'
    }, {
        name: 'parent_id',
        type: 'int'
    }, {
        name: 'inner_id',
        type: 'string'
    }, {
        name: 'custom_tax',
        type: 'float'
    }]
});