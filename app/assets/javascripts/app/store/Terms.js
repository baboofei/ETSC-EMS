/**
 * 这个是质保条款的store，要取的JSON值见model\Term
 */
Ext.define('EIM.store.Terms', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Term',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'warranty_terms/get_combo_warranty_terms/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'warranty_terms',
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