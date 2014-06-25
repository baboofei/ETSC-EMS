Ext.define('EIM.store.dict.Areas', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Area',

    autoLoad: true,

    proxy:{
        url:'/areas/area_list/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
//            type:'json',
            root:'areas',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allArea = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allArea.push(item.data);
            });
//            console.log(Ext.ComponentQuery.query('functree')[0].allArea);
        }
    }
});