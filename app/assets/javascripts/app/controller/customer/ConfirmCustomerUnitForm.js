/**
 * 单独加载一个提示输入客户单位的自定义combo用的controller
 */
Ext.define('EIM.controller.customer.ConfirmCustomerUnitForm', {
    extend: 'Ext.app.Controller',

    stores: [
        'CustomerUnits'
    ],

    models: [
        'CustomerUnit'
    ],

    views: [
        'customer.ConfirmCustomerUnitForm',
        'etscux.ExpandableCustomerUnitCombo'
    ],

    init: function() {
        var me = this;

        me.control({

        });
    }
});