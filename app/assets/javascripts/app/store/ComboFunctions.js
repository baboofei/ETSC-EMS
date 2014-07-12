/**
 * 功能模块store
 */
Ext.define('EIM.store.ComboFunctions', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboFunction',

    autoLoad: true,

    proxy:{
        url:'functions/get_combo_functions/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'functions',
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