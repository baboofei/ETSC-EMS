/**
 * “需求管理”表格里用到的“可能个案”的store
 */
Ext.define('EIM.store.GridPossibleSalecases', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridSalecase',

//    autoLoad: true,

    proxy: {
        url: 'salecases/get_grid_possible_salecases/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'salecases',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});