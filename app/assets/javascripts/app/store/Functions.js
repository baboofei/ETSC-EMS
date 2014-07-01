/**
 * 功能树store
 */
Ext.define('EIM.store.Functions',{
    extend: 'Ext.data.TreeStore',
    // model: 'EIM.model.Function',

    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        url: '/privileges/function_tree/list.json'
    },
    root: {
        text: 'Ext JS',
        id: 'src',
        expanded: true
    }//,
//    folderSort: true,
//    sorters: [{
//        property: 'text',
//        direction: 'ASC'
//    }]    
    
});