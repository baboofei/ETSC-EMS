/**
 * 这个是生产厂家的store，用于表格中
 */
Ext.define('EIM.store.VendorUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.VendorUnit',

    autoLoad: false,

    proxy: {
        url: 'vendor_units/get_combo_vendor_units/list.json',
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