Ext.define('EIM.view.customer.ShareForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.customer_share_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '共享客户',
    iconCls: 'btn_share',
    layout: 'fit',
    width: 300,
    height: 122,
    modal: true,

    initComponent: function() {
        var userArray = filter_all_user();

        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                items: [
                    {
                        xtype: 'boxselect',
                        fieldLabel: '共享给',
//                        name: 'share_to',//boxselect不要name，反正提交不了
                        store: Ext.create('Ext.data.Store', {
                            data: userArray,
                            model: 'EIM.model.ComboUser',
                            proxy: 'memory'
                        }),
                        displayField: 'name',
                        valueField: 'id',
                        height: 50,
                        emptyText: '可多选',
                        allowBlank: false
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '保存',
                action: 'save'
            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});