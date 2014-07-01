/**
 * 打开并可进行入库操作的“待归还综管物品”表格里用到的store
 */
Ext.define('EIM.store.GridReturnQueryAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridReturnQueryAdminInventory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'admin_inventories/get_grid_return_query_admin_inventories',//'admin_inventories/get_auditing_admin_inventories',
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