Ext.define('EIM.model.SalelogQuotedItem', {
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
        name: 'parameter',
        type: 'string'
    }]
});