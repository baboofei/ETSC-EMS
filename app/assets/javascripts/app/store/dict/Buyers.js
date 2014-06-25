/**
 * 所有采购角色的列表，只列本部门(带继承关系)
 */
Ext.define('EIM.store.dict.Buyers', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Buyer',

    autoLoad: true,

    proxy:{
        url:'/users/get_combo_purchasers/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'purchasers',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allBuyer = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allBuyer.push(item.data);
            });
        }
    }
});