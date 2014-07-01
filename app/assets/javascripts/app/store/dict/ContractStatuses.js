Ext.define('EIM.store.dict.ContractStatuses', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.ContractStatus',

    autoLoad: false,

    proxy: {
        url: '/users/fake_for_contract_status',
        type: 'ajax',
//        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'contract_statuses',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});