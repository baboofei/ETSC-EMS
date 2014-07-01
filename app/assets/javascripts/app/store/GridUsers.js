//// Models are typically used with a Store, which is basically a collection of Model instances.
//Ext.define('EIM.store.Users', {
//  extend: 'Ext.data.Store',
//
//  model: 'EIM.model.User',
//  autoLoad: true,
//  autoSync: false,
//
//  listeners: {
//    load: function() {
//      console.log(arguments);
//    },
//    update: function() {
//      console.log(arguments);
//    },
//    beforesync: function() {
//      console.log(arguments);
//    }
//  }
//});
//以上是User Grid的store代码

//以下是登录用的User Store
Ext.define('EIM.store.GridUsers', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridUser',

    autoLoad: true,
     
    proxy: {
        url: 'users/get_grid_users/list.json',
//        type: 'rest',
        type: 'ajax',
        format: 'json',
        method: 'GET',
    //    reader: {
    //      root: 'users',
    //      record: 'user',
    //      successProperty: 'success',
    //    },
    //    writer: {
    //      // wrap user params for Rails
    //      getRecordData: function(record) {
    //        return { user: record.data };
    //      }
    //    }    
        reader: {
//            type: 'json',
            root: 'users',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data };
            }
        }
     }
 });
