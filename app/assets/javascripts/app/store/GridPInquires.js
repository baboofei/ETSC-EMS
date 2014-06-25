/**
 * “工厂需求管理”表格里用到的客户store
 */
Ext.define('EIM.store.GridPInquires', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridPInquire',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'p_inquires/get_grid_p_inquires/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'p_inquires',
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