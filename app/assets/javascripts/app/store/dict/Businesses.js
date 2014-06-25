/**
 * 所有商务角色的列表
 */
Ext.define('EIM.store.dict.Businesses', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.Business',

    autoLoad: true,

    proxy: {
        url: '/users/get_list_business/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'businesses',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        }
    },
    listeners: {
        'load': function(store, records, options) {
            Ext.ComponentQuery.query('functree')[0].allBusiness = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allBusiness.push(item.data);
            });
        }
    }
});