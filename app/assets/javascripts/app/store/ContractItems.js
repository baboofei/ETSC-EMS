/**
 * 合同项store
 */
Ext.define('EIM.store.ContractItems', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ContractItem',

    autoLoad: false,

    proxy: {
        url: 'contract_items/get_contract_items/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'contract_items',
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