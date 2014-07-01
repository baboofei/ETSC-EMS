/**
 * 自定义的组件，包含一个币种下拉框和一个金额输入框
 */
Ext.define('EIM.view.etscux.AmountWithCurrency', {
    extend:'Ext.container.Container',
    alias:'widget.amount_with_currency',

    initComponent:function () {
        Ext.tip.QuickTipManager.init();

        this.layout = 'hbox';
        //在某些布局里（如报价条款），必须要它的flex是undefined才能正常显示
        //正好又需要一个subFlex来设置两个组件的比例，所以加上这么一个参数
        if(this.subFlex === undefined) this.flex = 1;

        this.items = [
            {
                xtype:'combo',
                fieldLabel:(this.fieldLabel || '金额'),
                labelSeparator: (this.labelSeparator || '：'),
                labelWidth: (this.labelWidth || 80),
                name: (this.name ? (this.name + '_') : '') + 'currency_id',
                store: Ext.create('Ext.data.Store', {
                    data: eval("filter_currency(" + this.storeHint +")"),
                    model: 'EIM.model.dict.Currency',
                    proxy:  'memory'
                }),
                flex: (this.subFlex ? (Number(this.subFlex.split("|")[0]) || 1) : 1),
                displayField:'name',
                valueField:'id',
                emptyText:'选币种',
                allowBlank: (this.allowBlank === false ? false : true),
                editable:false,
//            mode: 'remote',
                triggerAction:'all',
                disabled: this.itemDisabled//整个container的disable辨识度太差，所以分开disable
            },
            {
                xtype:'numberfield',
                fieldLabel:'',
                labelWidth:0,
                name: (this.name ? (this.name + '_') : '') + 'amount',
                flex: (this.subFlex ? (Number(this.subFlex.split("|")[1]) || 1) : 1),
                minValue: (this.minValue || 0),
//                negativeText:'金额不能为负数！',
                allowBlank: (this.allowBlank === false ? false : true),
                allowZero: (this.allowZero === undefined ? undefined :true),
                value: (this.value || 0),
                emptyText: (this.emptyText || ''),
                disabled: this.itemDisabled//整个container的disable辨识度太差，所以分开disable
            }
        ];

        this.callParent(arguments);
    }
});