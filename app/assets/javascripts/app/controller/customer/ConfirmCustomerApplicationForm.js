/**
 * 单独加载一个提示输入客户应用的boxselect用的controller
 */
Ext.define('EIM.controller.customer.ConfirmCustomerApplicationForm', {
    extend: 'Ext.app.Controller',

    stores: [
//        'dict.Applications'
    ],

    models: [
//        'dict.Application'
    ],

    views: [
        'customer.ConfirmCustomerApplicationForm'/*,
        'etscux.ExpandableCustomerUnitCombo'*/
    ],

    init: function() {
        var me = this;

        me.control({

        });
    }
});