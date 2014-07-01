/**
 * 所有销售的列表
 */
Ext.define('EIM.store.dict.Sales', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Sale',

    autoLoad: true,

    proxy:{
        url:'/users/get_combo_sales/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'sales',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allSales = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allSales.push(item.data);
            });
        }
    }
});