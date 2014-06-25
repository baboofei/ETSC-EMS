/**
 * “物料编码管理”表格里用到的物料编码store
 */
Ext.define('EIM.store.GridMaterialCodes', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridMaterialCode',

    autoLoad: true,

    proxy: {
        url: 'material_codes/get_grid_material_codes/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'material_codes',
            successProperty: 'success',
            totalProperty:'totalRecords'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
        }
    }
});