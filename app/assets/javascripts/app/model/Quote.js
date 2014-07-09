Ext.define('EIM.model.Quote', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'salelog>salecase>id',
            type: 'int'
        }, {
            name: 'salelog>salecase>number',
            type: 'string'
        }, {
            name: '^quotable>(salecase|flow_sheet)>id',
            type: 'int'
        }, {
            name: '^quotable>(salecase|flow_sheet)>(number)',
            type: 'string'
        }, {
            name: 'quote_id',
            type: 'int'
        }, {
            name: 'customer_unit>id',
            type: 'int'
        }, {
            name: 'customer_unit>(name|unit_aliases>unit_alias)',
            type: 'string'
        }, {
            name: 'customer>id',
            type: 'int'
        }, {
            name: 'customer>name',
            type: 'string'
        }, {
            name: 'salelog_id',
            type: 'int'
        }, {
            name: 'quotable_type',
            type: 'string'
        }, {
            name: 'quotable_id',
            type: 'int'
        },
        //        {
        //            name: 'salecase_id',
        //            type: 'int'
        //        },
        //        {
        //            name: 'salecase_number',
        //            type: 'string'
        //        },
        {
            name: 'number',
            type: 'string'
        }, {
            name: 'summary',
            type: 'string'
        }, {
            name: 'currency_id',
            type: 'int'
        }, {
            name: 'currency_name',
            type: 'string'
        }, {
            name: 'fif_currency_id',
            type: 'int'
        }, {
            name: 'fif_currency_name',
            type: 'string'
        }, {
            name: 'total_discount', //总折扣
            type: 'float'
        }, {
            name: 'fif', //运保费
            type: 'float'
        }, {
            name: 'vat',
            type: 'decimal'
        }, {
            name: 'declaration_fee', //清关费用
            type: 'float'
        }, {
            name: 'max_custom_tax', //最大关税
            type: 'float'
        }, {
            name: 'does_count_ctvat', //是否计算关税/增值税
            type: 'boolean'
        }, {
            name: 'x_discount', //最终的那个“折”显示
            type: 'float'
        }, {
            name: 'total', //合计
            type: 'float'
        }, {
            name: 'final_price', //总计
            type: 'float'
        }, {
            //            name: 'sale:users|id',
            name: 'sale>id',
            type: 'int'
        }, {
            name: 'sale>name',
            type: 'string'
        }, {
            //            name: 'business:users|id',
            name: 'business>id',
            type: 'int'
        }, {
            name: 'business>name',
            type: 'string'
        }, {
            name: 'work_task_id', //任务。之前一直说做但没做的模块，跟消息可能有重叠的地方
            type: 'int'
        }, {
            name: 'work_task_number',
            type: 'string'
        }, {
            name: 'language',
            type: 'string'
        }, {
            name: 'request', //报价要求
            type: 'string'
        }, {
            name: 'quote_format',
            type: 'string'
        }, {
            name: 'quote_format_name',
            type: 'int'
        }, {
            name: 'our_company_id',
            type: 'int'
        }, {
            name: 'our_company_name',
            type: 'string'
        }, {
            name: 'quote_type',
            type: 'string'
        }, {
            name: 'term', //JSON
            type: 'text'
        }, {
            name: 'pdf', //JSON
            type: 'text'
        }, {
            name: 'comment',
            type: 'text'
        }, {
            name: 'state', //状态机
            type: 'string'
        }, {
            name: 'rmb',
            type: 'float'
        }, {
            name: 'created_at',
            type: 'date'
        }, {
            name: 'updated_at',
            type: 'date'
        }, {
            name: 'group_id',
            type: 'int'
        }, {
            name: 'editable',
            type: 'boolean'
        }
    ]
});