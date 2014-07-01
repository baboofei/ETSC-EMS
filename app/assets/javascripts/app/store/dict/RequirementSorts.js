Ext.define('EIM.store.dict.RequirementSorts', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.RequirementSort',

    autoLoad:false,

    proxy:{
        url:'/users/fake_for_requirement_sort',
        type:'ajax',
//        format: 'json',
        method:'GET',
        reader:{
            type:'json',
            root:'requirement_sorts',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    }
});