/**
 * 合同store
 */
Ext.define('EIM.store.Contracts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Contract',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'contracts/get_contracts/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'contracts',
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