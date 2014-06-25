/**
 * 表格里的报价store
 * TODO
 */
Ext.define('EIM.store.Quotes', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Quote',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'quotes/get_quotes/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'quotes',
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