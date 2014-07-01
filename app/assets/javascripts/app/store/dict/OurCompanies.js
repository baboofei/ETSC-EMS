Ext.define('EIM.store.dict.OurCompanies', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.OurCompany',

    autoLoad: true,

    proxy:{
        url:'/our_companies/our_company_list/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
//            type:'json',
            root:'our_companies',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allOurCompany = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allOurCompany.push(item.data);
            });
//            console.log(Ext.ComponentQuery.query('functree')[0].allOurCompany);
        }
    }
});