/**
 * 打开并可进行审批操作的“待出库综管物品”表格里用到的store
 */
Ext.define('EIM.store.GridOutStockQueryAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridOutStockQueryAdminInventory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'admin_inventories/get_grid_out_stock_query_admin_inventories',//'admin_inventories/get_auditing_admin_inventories',
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