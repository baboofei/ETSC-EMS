/**
 * “快递单管理”表格里用到的快递单store
 */
Ext.define('EIM.store.GridExpressSheets', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridExpressSheet',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'express_sheets/get_grid_express_sheets/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'express_sheets',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});