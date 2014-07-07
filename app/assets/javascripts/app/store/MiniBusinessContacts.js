/**
 * 个案中涉及的商务相关单位及联系人列表
 */
Ext.define('EIM.store.MiniBusinessContacts', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.MiniBusinessContact',

    autoLoad: false,

    proxy: {
        url: 'business_contacts/get_mini_business_contacts/list.json',
        type: 'ajax',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'mini_business_contacts',
            successProperty: 'success'
        },
        writer: {
            getRecordData: function(record){
                return {user: record.data}
            }
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            var salecase_grid = Ext.ComponentQuery.query('salecase_grid')[0];
            var selected_item = salecase_grid.getSelectedItem();
            if(selected_item) {
                var selected_id = selected_item.get("id");
                this.proxy.setExtraParam('salecase_id', selected_id);
            }
        }
    }
});