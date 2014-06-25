/**
 * 所有成员的列表，比如客户的负责人，只列本部门(带继承关系)
 */
Ext.define('EIM.store.dict.Members', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Member',

    autoLoad: true,

    proxy:{
        url:'/users/get_combo_users/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'members',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allMember = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allMember.push(item.data);
            });
        }
    }
});