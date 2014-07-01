Ext.define('EIM.store.dict.Currencies', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Currency',

    autoLoad: true,

    proxy:{
        url:'/currencies/currency_list/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'currencies',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load' :  function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allCurrency = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allCurrency.push(item.data);
            });
//            console.log(Ext.ComponentQuery.query('functree')[0].allCurrency);
        }
    }
});