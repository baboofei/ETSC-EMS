/**
 * 所有技术角色的列表
 */
Ext.define('EIM.store.dict.Supporters', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.Supporter',

    autoLoad: true,

    proxy: {
        url: '/users/get_combo_supporters/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'supporters',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        }
    },
    listeners: {
        'load': function(store, records, options) {
            Ext.ComponentQuery.query('functree')[0].allSupporter = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allSupporter.push(item.data);
            });
        }
    }
});