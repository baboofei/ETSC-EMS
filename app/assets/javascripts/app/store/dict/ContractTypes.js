Ext.define('EIM.store.dict.ContractTypes', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.ContractType',

    autoLoad: false,

    proxy: {
        url: '/users/fake_for_contract_type',
        type: 'ajax',
//        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'contract_types',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});