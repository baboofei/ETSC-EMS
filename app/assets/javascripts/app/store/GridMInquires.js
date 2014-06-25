/**
 * “市场需求管理”表格里用到的需求store
 */
Ext.define('EIM.store.GridMInquires', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridMInquire',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'm_inquires/get_grid_m_inquires/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'm_inquires',
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