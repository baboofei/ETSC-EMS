/**
 * “提醒”表格里用到的store
 */
Ext.define('EIM.store.GridPersonalMessages', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridPersonalMessage',

    autoLoad: true,

    proxy: {
        url: 'personal_messages/get_grid_personal_messages/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'personal_messages',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});