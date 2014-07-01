/**
 * “采购信息管理”表格里用到的采购信息store
 */
Ext.define('EIM.store.GridProducts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridProduct',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'products/get_grid_products/list.json',
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