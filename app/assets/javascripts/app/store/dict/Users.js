/**
 * 所有用户的列表，比如消息，发件人可能是任何人
 */
Ext.define('EIM.store.dict.Users', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.User',

    autoLoad: true,

    proxy:{
        url:'/users/user_list/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'users',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allUser = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allUser.push(item.data);
            });
//            console.log(Ext.ComponentQuery.query('functree')[0].allUser);
        }
    }
});