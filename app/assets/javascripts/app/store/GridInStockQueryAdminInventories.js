/**
 * 打开并可进行入库操作的“待入库综管物品”表格里用到的store
 */
Ext.define('EIM.store.GridInStockQueryAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridInStockQueryAdminInventory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'admin_inventories/get_grid_in_stock_query_admin_inventories',//'admin_inventories/get_auditing_admin_inventories',
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