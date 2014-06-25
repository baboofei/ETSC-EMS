/**
 * “库存历史”表格里用到的store
 */
Ext.define('EIM.store.GridAdminInventoryHistories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridAdminInventoryHistory',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'admin_inventory_histories/get_grid_admin_inventory_histories/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'admin_inventory_histories',
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