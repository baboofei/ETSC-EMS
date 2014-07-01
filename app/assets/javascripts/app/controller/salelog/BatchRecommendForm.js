/**
 * 拆开后加载“批量推荐产品”视图用的controller
 */
Ext.define('EIM.controller.salelog.BatchRecommendForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'ComboVendorUnits',
        'Products'
    ],
    models: [
        'ComboVendorUnit',
        'Product'
    ],

    views: [
        'salelog.BatchRecommendItemForm'
    ],

//    refs: [{
//        ref: 'list',
//        selector: 'recommended_item_grid'
//    }],

    init: function() {
        var me = this;

        me.control({
            'batch_recommend_item_form button[action=save]': {
                click: this.validate
            }
        });
    },

    validate: function(button) {
        var win = button.up('window');
        var form = win.down('form', true);
        if(form.form.isValid()) {
            //循环存产品ID到表格
            var products = Ext.ComponentQuery.query('functree')[0].tempBatchProduct;

            Ext.Object.each(products, function(key, value) {
                //要传：工厂名称、工厂ID、产品型号、产品ID、产品中文简述、客户需求
                //工厂ID和客户需求从表单里取
                var data = form.getValues();
                //工厂名称
                data.vendor_unit_name = form.down('[name=vendor_unit_id]', false).getRawValue();
                //产品的信息
                var current_store_data = value['data'];

                data["simple_description_cn"] = current_store_data['simple_description_cn'];
                data["product_id"] = key;
                data["product_model"] = current_store_data['model'];
                Ext.getStore("RecommendedItems").add(data);
            });
            win.close();
        }
    }
});