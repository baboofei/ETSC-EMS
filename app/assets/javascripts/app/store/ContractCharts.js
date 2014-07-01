/**
 * 合同图表store
 */
Ext.define('EIM.store.ContractCharts', {
    extend:'Ext.data.Store',
    model:'EIM.model.ContractChart',

    autoLoad:true,

    proxy:{
        url:'/users/fake_for_contract_chart', //TODO 要改的……
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'contract_charts',
            successProperty:'success',
            totalProperty:'totalRecords'
        },
        writer:{
            getRecordData:function (record) {
                return {user:record.data}
            }
        }
    }
});