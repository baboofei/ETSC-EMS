/**
 * 空的“客户管理”表格里用到的客户store，用来放“待操作客户”
 */
Ext.define('EIM.store.EmptyGridCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridCustomer',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: '',//'customers/get_grid_customers/list.json',
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