/**
 * 涉及权限的所有元素拼的大store
 */
Ext.define('EIM.store.AllElements', {
    extend:'Ext.data.Store',
    model:'EIM.model.AllElement',

    autoLoad: true,

    proxy:{
        url:'/privileges/all_elements/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'elements',
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
//            Ext.ComponentQuery.query('functree')[0].allElement = records;
            Ext.ComponentQuery.query('functree')[0].allElement = store.proxy.reader.rawData;
//            console.log(Ext.decode(records['invisible']));
//            Ext.Array.each(records, function(item, index, allItems) {
//                Ext.ComponentQuery.query('functree')[0].allElement.push(item.data);
//            });
        }
    }
});