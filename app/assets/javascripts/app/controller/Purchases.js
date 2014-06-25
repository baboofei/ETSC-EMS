Ext.define('EIM.controller.Purchases', {
    extend: 'Ext.app.Controller',

    stores: [
        'GridPurchases'
    ],
    models: [
        'GridPurchase'
    ],

    views: [
        'purchase.Grid',
        'purchase.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'purchase_grid'
    }],

    init: function() {
        var me = this;
        me.control({
            'purchase_grid': {
                itemdblclick: this.editPurchase,
                selectionchange: this.selectionChange
            },
            'button[action=addPurchase]': {
                click: this.addPurchase
            },
            'purchase_form button[action=save]': {
            	click: this.savePurchase
            }
        });
    },

    addPurchase: function() {
        Ext.widget('purchase_form').show();
    },
    
    savePurchase: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        if(form.form.isValid()) {
            //防双击
            button.disable();
            form.submit({
                url: "purchases/save_purchase",
                submitEmptyText:false,
                success: function(form, action) {
                    win.close();
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridPurchases').load();
                },
                failure: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('失败', msg.message);
                    button.enable();
                }
            });
        }
    },

    loadPurchases: function() {
//        Ext.getStore("Purchases").load();
//        Ext.getStore("dict.Cities").load();
    },

    editPurchase: function() {
        var record = this.getGrid().getSelectedItem();
        var view = Ext.widget('purchase_form').show();
        view.down('form', false).loadRecord(record);
//        //给combo做一个假的store以正确显示值
//        var city_field = view.down('[name=city_id]', false);
//        city_field.getStore().loadData([[record.get('city_id'), record.get('city_name')]]);
//        city_field.setValue(record.get('city_id'));
    },

    selectionChange: function() {

    }
});