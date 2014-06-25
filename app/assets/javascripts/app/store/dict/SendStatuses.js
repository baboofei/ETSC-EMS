Ext.define('EIM.store.dict.SendStatuses', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.SendStatus',

    autoLoad:false,

    proxy:{
        url:'/users/fake_for_send_status',
        type:'ajax',
//        format: 'json',
        method:'GET',
        reader:{
            type:'json',
            root:'send_statuses',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    }
});