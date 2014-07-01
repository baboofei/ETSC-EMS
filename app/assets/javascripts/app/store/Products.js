/**
 * 这个是产品的store，用于combo中。没加combo是历史遗留
 */
Ext.define('EIM.store.Products', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Product',

    autoLoad: false,

    proxy: {
        url: 'products/get_combo_products/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'products',
            successProperty: 'success',
            totalProperty:'totalRecords'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
        }
    }
});