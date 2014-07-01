/**
 * 就算是combo框里的客户store吧，没有加combo是历史遗留问题，加个
 * TODO 吧
 */
Ext.define('EIM.store.Customers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Customer',

    autoLoad: false,

    proxy: {
        url: 'customers/get_combo_customers/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'customers',
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