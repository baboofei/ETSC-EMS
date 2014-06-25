/**
 * 维修水单“更换零部件”操作时“库存管理”的“待处理”store
 * 如果不命名会和别的要拖拽的store冲突
 */
Ext.define('EIM.store.GridCopyMiniAdminInventories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridAdminInventory',

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