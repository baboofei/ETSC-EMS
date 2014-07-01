/**
 * 报价项store
 */
Ext.define('EIM.store.QuoteItems', {
    extend:'Ext.data.TreeStore',
    model:'EIM.model.QuoteItem',

    autoLoad: false,

    proxy:{
        url: 'quote_items/get_quote_items/list.json',
//        url: 'users/fake_for_quote_item',
        type:'ajax',
        format:'json'/*,
        method:'GET',
        reader:{
            root:'quote_items',
            successProperty:'success',
            totalProperty:'totalRecords'
        }*/
//    },
//    listeners: {
//        load: function(store, node, records, successful, eOpts) {
//            console.log(records);
//        }
    }
});

//var store = Ext.create('Ext.data.TreeStore', {
//    model: 'Task',
//    proxy: {
//        type: 'ajax',
//        //the store will get the content from the .json file
//        url: 'treegrid.json'
//    },
//    folderSort: true
//});