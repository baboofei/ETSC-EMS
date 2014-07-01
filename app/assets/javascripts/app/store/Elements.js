/**
 * 页面元素store
 */
Ext.define('EIM.store.Elements',{
    extend: 'Ext.data.Store',
    model: 'EIM.model.Element',

    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        url: '/privileges/all_elements/list.json',
        method: 'GET',
        reader: {
            root: 'elements',
            successProperty: 'success',
            totalProperty: 'totalRecords'
        }
//    },
//    root: {
//        text: 'Ext JS',
//        id: 'src',
//        expanded: true
    }//,
//    folderSort: true,
//    sorters: [{
//        property: 'text',
//        direction: 'ASC'
//    }]    
    
});