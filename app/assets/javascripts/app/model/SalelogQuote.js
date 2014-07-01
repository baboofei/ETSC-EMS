Ext.define('EIM.model.SalelogQuote', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'vendor_unit_id',
        type: 'int'
    }, {
        name: 'product_id',
        type: 'int'
    }, {
        name: 'comment',
        type: 'string'
    }]
});