/**
 * 维修报价时能选的维修store
 * 对维修来说是自己或者下级（看配置的时候怎么配了）
 */
Ext.define('EIM.store.ComboSupporters', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ComboSupporter',

    autoLoad: true,

    proxy: {
        url: 'users/get_combo_supporters/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'supporters',
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