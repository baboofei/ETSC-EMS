Ext.define('EIM.store.dict.Applications', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.dict.Application',

    autoLoad: true,

    proxy: {
        url: '/prod_applications/prod_application_list/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'prod_applications',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load' :  function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allApplication = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allApplication.push(item.data);
            });
        }
    }
});