/**
 * 这个是生产厂家联系人的store，用于combo中
 */
Ext.define('EIM.store.ComboVendors', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboVendor',

    autoLoad: true,

    proxy: {
        url: 'vendors/get_combo_vendors/list.json',
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