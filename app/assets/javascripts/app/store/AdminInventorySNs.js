/**
 * 综管资产管理里的序列号store
 */
Ext.define('EIM.store.AdminInventorySNs', {
    extend:'Ext.data.Store',
    model:'EIM.model.AdminInventorySN',

    autoLoad: false,

    proxy:{
        type:'memory',
        format:'json',
        method:'GET'

/***JSONP的写法示例存档***/
//        type: 'jsonp',
//        url: 'http://192.168.10.83:3000/users/fake_jsonp',
//        reader: {
//            type: 'json',
//            root: 'data',
//            totalProperty: 'totalRecords'
//        }
//    },
//    listeners: {
//        load: function(store, records) {
//            Ext.each(records, function(rec) {
//                console.log(rec.get('name'));
//            });
//        }
    }
});