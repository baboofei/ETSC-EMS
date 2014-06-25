Ext.define('EIM.store.dict.CheckAndAcceptStatuses', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.CheckAndAcceptStatus',

    autoLoad:false,

    proxy:{
        url:'/users/fake_for_check_and_accept_status',
        type:'ajax',
//        format: 'json',
        method:'GET',
        reader:{
            type:'json',
            root:'check_and_accept_statuses',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    }
});