/**
 * 工作日志的列表store
 */
Ext.define('EIM.store.Salelogs', {
    extend: 'Ext.data.Store',
    model: 'EIM.model.Salelog',

    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'salelogs/get_salelogs/list.json',
        format: 'json',
        method: 'GET',
        reader: {
            root: 'salelogs',
            successProperty: 'success',
            totalProperty:'totalRecords'
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