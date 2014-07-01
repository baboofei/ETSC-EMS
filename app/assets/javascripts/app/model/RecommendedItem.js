Ext.define('EIM.model.RecommendedItem', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'vendor_unit_id',
            type: 'int'
        },
        {
            name: 'vendor_unit_name',
            type: 'string'
        },
        {
            name: 'product_id',
            type: 'int'
        },
        {
            name: 'product_model',
            type: 'string'
        },
        {
            name: 'simple_description_cn',
            type: 'string'
        },
        {
            name: 'parameter',
            type: 'string'
        },
        {
            name: 'customer_requirement',
            type: 'string'
        }
    ]
});