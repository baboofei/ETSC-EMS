/**
 * “脑洞”表格里用到的store
 */
Ext.define('EIM.store.GridTodos', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.GridTodo',

    autoLoad: true,

    proxy: {
        url: 'todos/get_grid_todos/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'todos',
            successProperty: 'success',
            totalProperty:'totalRecords'
        }
    }
});