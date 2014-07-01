/**
 * 实收款项store
 */
Ext.define('EIM.store.Collections', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Collection',

    autoLoad: false,

    proxy: {
        url: 'collections/get_collections/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'collections',
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