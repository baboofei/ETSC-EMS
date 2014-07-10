/**
 * 空的“VIP联系人管理”表格里用到的VIP联系人store，用来放“待操作VIP联系人”
 *
 */
Ext.define('EIM.store.EmptyGridVips', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridVip',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: '',
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