/**
 * 合同里的客户联系人store
 * 用于小列表
 */
Ext.define('EIM.store.GridContractMiniCustomers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridContractMiniCustomer',

    autoLoad: false,

    proxy: {
        url: 'customers/get_grid_contract_mini_customers/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'grid_contract_mini_customers',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        },
        writer: {
            getRecordData: function(record) {
                return {user: record.data}
            }
        }
    }
});