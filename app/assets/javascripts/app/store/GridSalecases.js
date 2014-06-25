/**
 * “销售个案”表格里用到的个案store
 */
Ext.define('EIM.store.GridSalecases', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridSalecase',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        type: 'ajax',
        url: 'salecases/get_grid_salecases/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'salecases',
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