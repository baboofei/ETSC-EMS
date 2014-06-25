/**
 * 所有下级销售的列表
 */
Ext.define('EIM.store.dict.MemberSales', {
    extend:'Ext.data.Store',
    model:'EIM.model.dict.MemberSale',

    autoLoad: true,

    proxy:{
        url:'/users/get_combo_member_sales/list.json',
        type:'ajax',
        format: 'json',
        method:'GET',
        reader:{
            root:'sales',
            successProperty:'success',
            totalProperty:'totalRecords'
        }
    },
    listeners: {
        'load': function(store,records,options) {
            Ext.ComponentQuery.query('functree')[0].allMemberSales = [];
            Ext.Array.each(records, function(item, index, allItems) {
                Ext.ComponentQuery.query('functree')[0].allMemberSales.push(item.data);
            });
        }
    }
});