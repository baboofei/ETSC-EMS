/**
 * “VIP联系人管理”表格里用到的VIP联系人store
 */
Ext.define('EIM.store.GridVips', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridVip',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: 'vips/get_grid_vips/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'vips',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});