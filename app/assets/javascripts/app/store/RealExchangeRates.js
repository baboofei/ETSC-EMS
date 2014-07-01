Ext.define('EIM.store.RealExchangeRates', {
    extend:'Ext.data.Store',
    model:'EIM.model.RealExchangeRate',

    autoLoad: true,
    remoteSort: true,

    proxy:{
//        url:'/our_companies/our_company_list/list.json',
        url:'/real_exchange_rates/get_real_exchange_rates/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
//            type:'json',
            root:'real_exchange_rates',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    }
});