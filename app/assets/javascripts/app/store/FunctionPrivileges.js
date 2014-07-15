/**
 * 功能权限store
 */
Ext.define('EIM.store.FunctionPrivileges', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.FunctionPrivilege',

    autoLoad: true,
    remoteSort: true,

    proxy: {
        url: '/functions/get_function_privileges/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'function_privileges',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        }
    }
});