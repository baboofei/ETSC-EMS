/**
 * 自定义的组件，就是一个按钮，只不过因为要在不同模块调用它
 * 如果不这样写就会导致：
 *      每个模块单独写方法就会重复执行，加载几个用到它的模块就弹几个框
 *      某个模块不写方法就弹不出框来，除非先加载了别的模块
 */

Ext.define('EIM.view.etscux.ReusablePopExpressGridButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.popup_express_grid_button',

    initComponent: function() {
        Ext.tip.QuickTipManager.init();

        this.text = '打印快递单()';
        this.iconCls = 'btn_print';
        this.action = 'selectExpress';
        this.disabled = true;

        this.callParent(arguments);
    }
});