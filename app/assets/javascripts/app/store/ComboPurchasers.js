/**
 * 能选的采购store
 * 对采购来说是自己或者下级（看配置的时候怎么配了）
 */
Ext.define('EIM.store.ComboPurchasers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboPurchaser',

    autoLoad: true,

    proxy: {
        url: 'users/get_combo_purchasers/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'purchasers',
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