/**
 * “角色”表格里用到的角色store
 */
Ext.define('EIM.store.GridRoles', {
    extend:'Ext.data.Store',
    model:'EIM.model.GridRole',

    autoLoad:false,

    proxy: {
        url: '/roles/role_list/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            type: 'json',
            root: 'roles'
        }
    }
     /*,
     //TODO 远程的时候用这段
    proxy: {
        url: 'servlet/CustomerServlet',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'customers',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }*/
});