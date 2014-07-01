/**
 * 空的“供应商管理”表格里用到的供应商联系人store，用来放“待操作供应商1”
 *
 */
Ext.define('EIM.store.EmptyGridVendors', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridVendor',

    autoLoad: true,

    proxy: {
        url: '',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'vendors',
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