/**
 * “提醒”表格里用到的store
 */
Ext.define('EIM.store.GridReminds', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridRemind',

    autoLoad: true,

    proxy: {
        url: 'reminds/get_grid_reminds/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'reminds',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});