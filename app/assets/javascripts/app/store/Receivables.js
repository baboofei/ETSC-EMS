/**
 * 待收款项store
 */
Ext.define('EIM.store.Receivables', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Receivable',

    autoLoad: false,

    proxy: {
        url: 'receivables/get_receivables/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'receivables',
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