/**
 * 字典项拼的大store
 */
Ext.define('EIM.store.AllDicts', {
    extend:'Ext.data.Store',
    model:'EIM.model.AllDict',

    autoLoad: true,

    proxy:{
        url:'/dictionaries/dictionary_list/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'dictionaries',
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
        'load' :  function(store,records,options) {
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allDict.push(item.data);
            });
        }
    }
});