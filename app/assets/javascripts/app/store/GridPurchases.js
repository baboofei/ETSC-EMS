/**
 * “采购信息管理”表格里用到的采购信息store
 */
Ext.define('EIM.store.GridPurchases', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridPurchase',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'purchases/get_grid_purchases/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'purchases',
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