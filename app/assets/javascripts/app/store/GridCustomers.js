/**
 * “客户管理”表格里用到的客户store
 */
Ext.define('EIM.store.GridCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridCustomer',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'customers/get_grid_customers/list.json',
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