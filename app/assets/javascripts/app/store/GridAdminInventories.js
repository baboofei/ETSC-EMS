/**
 * “库存管理”表格里用到的store
 */
Ext.define('EIM.store.GridAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridAdminInventory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'admin_inventories/get_grid_admin_inventories/list.json',
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