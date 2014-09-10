/**
 * “客户单位管理”表格里用到的客户单位store
 */
Ext.define('EIM.store.GridCustomerUnits', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridCustomerUnit',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'customer_units/get_grid_customer_units/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'customer_units',
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