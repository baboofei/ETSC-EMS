/**
 * 用于提示的入库商品型号store
 */
Ext.define('EIM.store.ComboAdminInventoryModels', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboAdminInventoryModel',

    autoLoad:false,

    proxy:{
        url:'admin_inventories/get_combo_admin_inventory_models/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'admin_inventory_models',
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