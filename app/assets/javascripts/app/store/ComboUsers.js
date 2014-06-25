/**
 * 所有在职用户store，用于combo下拉选择
 */
Ext.define('EIM.store.ComboUsers', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboUser',

    autoLoad:false,

    proxy:{
        url:'users/get_combo_users/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'users',
            successProperty:'success',
            totalProperty:'totalRecords'
        },
        writer:{
            getRecordData:function (record) {
                return {user:record.data}
            }
        }
    },
    listeners: {
        'load': function(store,records,options) {
//            Ext.ComponentQuery.query('functree')[0].allMember = [];
//            Ext.Array.each(records, function(item, index, allItems) {
//                Ext.ComponentQuery.query('functree')[0].allMember.push(item.data);
//            });
//            console.log(store);
        }
    }
});