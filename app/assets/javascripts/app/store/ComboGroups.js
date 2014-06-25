/**
 * 项目组store
 */
Ext.define('EIM.store.ComboGroups', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboGroup',

    autoLoad: true,

    proxy:{
        url:'groups/get_combo_groups/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'groups',
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