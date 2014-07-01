/**
 * “销售个案”表格里用到的个案store
 */
Ext.define('EIM.store.GridFlowSheets', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridFlowSheet',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        type: 'ajax',
        url: 'flow_sheets/get_grid_flow_sheets/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'flow_sheets',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
        }
    }
});