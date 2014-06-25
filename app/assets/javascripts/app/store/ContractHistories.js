/**
 * 合同改动历史store
 */
Ext.define('EIM.store.ContractHistories', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ContractHistory',

    autoLoad: false,

    proxy: {
        url: 'contract_histories/get_contract_histories/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'contract_histories',
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