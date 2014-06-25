/**
 * “供应商单位管理”表格里用到的供应商单位store
 */
Ext.define('EIM.store.GridVendorUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridVendorUnit',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'vendor_units/get_grid_vendor_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'vendor_units',
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