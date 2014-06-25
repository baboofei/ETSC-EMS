/**
 * 用于提示的入库商品名称store
 */
Ext.define('EIM.store.ComboAdminInventoryNames', {
    extend:'Ext.data.Store',
    model:'EIM.model.ComboAdminInventoryName',

    autoLoad:false,

    proxy:{
        url:'admin_inventories/get_combo_admin_inventory_names/list.json',
        type:'ajax',
        format:'json',
        method:'GET',
        reader:{
            root:'admin_inventory_names',
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