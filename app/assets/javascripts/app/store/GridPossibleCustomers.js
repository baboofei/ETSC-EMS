/**
 * “需求管理”表格里用到的“可能客户”的store
 */
Ext.define('EIM.store.GridPossibleCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridCustomer',

//    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'customers/get_grid_possible_customers/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'customers',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});