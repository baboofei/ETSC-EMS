/**
 * 空的“公共联系人管理”表格里用到的公共联系人store，用来放“待操作公共联系人”
 *
 */
Ext.define('EIM.store.EmptyGridPops', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridPop',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: '',
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