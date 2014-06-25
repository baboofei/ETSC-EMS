/**
 * 能选的商务store
 * 对商务来说是自己或者下级（看配置的时候怎么配了）
 */
Ext.define('EIM.store.ComboBusinesses', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboBusiness',

    autoLoad: true,

    proxy: {
        url: 'users/get_combo_businesses/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'businesses',
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