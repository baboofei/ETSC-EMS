/**
 * 页面资源权限store
 */
Ext.define('EIM.store.ElementPrivileges', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.ElementPrivilege',

    autoLoad:true,
    remoteSort: true,

    proxy: {
        url: '/privileges/get_grid_element_privileges/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'element_privileges',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});