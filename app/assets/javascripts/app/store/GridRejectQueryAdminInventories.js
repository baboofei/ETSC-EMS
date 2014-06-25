/**
 * 打开并可进行入库操作的“待归还综管物品”表格里用到的store
 */
Ext.define('EIM.store.GridRejectQueryAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridRejectQueryAdminInventory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'admin_inventories/get_grid_reject_query_admin_inventories',//'admin_inventories/get_auditing_admin_inventories',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'admin_inventories',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});