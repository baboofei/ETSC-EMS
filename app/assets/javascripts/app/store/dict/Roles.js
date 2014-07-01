Ext.define('EIM.store.dict.Roles', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Role',

    autoLoad: true,

    proxy:{
        url:'/roles/role_list/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'roles',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allRole = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allRole.push(item.data);
            });
//            console.log(Ext.ComponentQuery.query('functree')[0].allRole);
        }
    }
});