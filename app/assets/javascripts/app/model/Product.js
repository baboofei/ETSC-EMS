Ext.define('EIM.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'model',
            type: 'string'
        },
        {
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'currency_name',
            type: 'string'
        },
        {
            name: 'price_in_list',
            type: 'float'
        },
        {
            name: 'price_from_vendor',
            type: 'float'
        },
        {
            name: 'price_to_market',
            type: 'float'
        },
        {
            name: 'price_in_site',
            type: 'float'
        },
        {
            name: 'custom_tax',
            type: 'float'
        },
        {
            name: 'simple_description_cn',
            type: 'string'
        },
        {
            name: 'simple_description_en',
            type: 'string'
        },
        {
            name: 'reference',
            type: 'string'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});