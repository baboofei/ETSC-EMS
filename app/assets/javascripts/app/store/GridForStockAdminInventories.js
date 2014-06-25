/**
 * 填写“待入库综管物品”表格里用到的store
 */
Ext.define('EIM.store.GridForStockAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridForStockAdminInventory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: '',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'admin_inventories',
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