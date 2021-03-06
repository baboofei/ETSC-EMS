Ext.define('EIM.model.GridProduct', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'model',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'seller>(name|short_name|short_code|en_name)',
            type: 'string'
        },
        {
            name: 'seller>id',
            type: 'int'
        },
        {
            name: 'producer>(name|short_name|short_code|en_name)',
            type: 'string'
        },
        {
            name: 'producer>id',
            type: 'int'
        },
        {
            name: 'reference',
            type: 'string'
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
            name: 'currency_id',
            type: 'int'
        },
        {
            name: 'currency_name',
            type: 'string'
        },
        {
            name: 'custom_tax',
            type: 'float'
        },
        {
            name: 'tax_number',
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
            name: 'serial>id',
            type: 'int'
        },
        {
            name: 'serial>name',
            type: 'string'
        },
        {
            name: 'user_id',
            type: 'int'
        },
        {
            name: 'comment',
            type: 'string'
        }
    ]
});