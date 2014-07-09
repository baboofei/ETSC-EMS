//Ext.define('EIM.model.User', {
//  extend: 'Ext.data.Model',
//  fields: [
//    { name: 'id', type: 'int' },
//    { name: 'first_name', type: 'string' },
//    { name: 'last_name', type: 'string' },
//    { name: 'email', type: 'string' }
//  ],
//  validations: [
//    { type: 'presence', field: 'first_name' },
//    { type: 'presence', field: 'last_name' },
//    { type: 'presence', field: 'email' }
//  ],
//
//  idProperty: 'id',
//  proxy: {
//    url: '/users',
//    type: 'rest',
//    format: 'json',
//
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
//  }
//});
//以上是User Grid的模型代码

//以下是登录用的User模型代码
Ext.define('EIM.model.GridUser', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'en_name',
        type: 'string'
    }, {
        name: 'reg_name',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'mobile',
        type: 'string'
    }, {
        name: 'extension',
        type: 'string'
    }, {
        name: 'etsc_email',
        type: 'string'
    }, {
        name: 'qq',
        type: 'string'
    }, {
        name: 'msn',
        type: 'string'
    }, {
        name: 'editable',
        type: 'boolean'
    }]
    //        fields : ['username', 'isAdmin', 'authenticated', 'loggedOut']
});