Ext.define('EIM.store.dict.MaterialCodes', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.MaterialCode',

    autoLoad: true,

    proxy:{
        url:'/material_codes/get_material_codes/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
//            type:'json',
            root:'material_codes',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store, records, successful, options) {
            Ext.ComponentQuery.query('functree')[0].allMaterialCode = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allMaterialCode.push(item.data);
            });
//            console.log(successful);
//            if(store.count() === 0) {
//                //如果未取到值，则在extraParams里给个信号
//                store.getProxy().extraParams = {"returnEmpty": true};
//            } else {
//                store.getProxy().extraParams = {"returnEmpty": null};
//            }
//            console.log(Ext.ComponentQuery.query('functree')[0].allMaterialCode);
        }
    }
});