/**
 * “供应商联系人管理”表格里用到的供应商联系人store
 */
Ext.define('EIM.store.GridVendors', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridVendor',

    autoLoad: true,

    proxy: {
        url: 'vendors/get_grid_vendors/list.json',
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