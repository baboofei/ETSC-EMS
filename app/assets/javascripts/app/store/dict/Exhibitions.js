/**
 * 展会的store
 */
Ext.define('EIM.store.dict.Exhibitions', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.Exhibition',

    autoLoad: true,

    proxy:{
        url:'/exhibitions/exhibition_list/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'exhibitions',
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
            var times = 0;
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allExhibition.push(item.data);
                if(times < 3) {
                    Ext.ComponentQuery.query('functree')[0].recentExhibition.push(item.data);
                    times += 1;
                }
            });
        }
    }
});

