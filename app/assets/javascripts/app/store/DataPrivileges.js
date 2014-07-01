/**
 * 数据权限store
 */
Ext.define('EIM.store.DataPrivileges', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.DataPrivilege',

    autoLoad: true,
//    remoteSort: true,

    proxy: {
        url: '/stores/get_data_privileges/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'data_privileges',
            totalProperty:'totalRecords'
        }
    }
});