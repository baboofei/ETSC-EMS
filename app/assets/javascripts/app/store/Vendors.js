/**
 * 这个是生产厂家联系人的store
 */
Ext.define('EIM.store.Vendors', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Vendor',

    autoLoad: false,

    proxy: {
        url: 'servlet/GetLogData?type=vendors',//TODO 要改的……
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