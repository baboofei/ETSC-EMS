/**
 * “公共联系人管理”表格里用到的公共联系人store
 */
Ext.define('EIM.store.GridPops', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridPop',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'pops/get_grid_pops/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'pops',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});