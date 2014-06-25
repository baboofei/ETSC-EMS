Ext.define('EIM.model.ComboContractQuote', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'number',
            type: 'string'
        },
        {
            name: 'summary',
            type: 'string'
        },
        {
            name: 'customer_unit_id',
            type: 'int'
        },
        {
            name: 'customer_unit_name',
            type: 'string'
        },
        {
            name: 'customer_id',
            type: 'int'
        },
        {
            name: 'customer_name',
            type: 'string'
        },
        {
            name: 'our_company_id',
            type: 'int'
        },
        {
            name: 'our_company_name',
            type: 'string'
        },
        {
            name: 'sale_user_id',
            type: 'int'
        },
        {
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'total',
            type: 'float'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});