Ext.define('EIM.view.m_inquire.TransferForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.m_inquire_transfer_form',

    title: '转让客户',
    iconCls: 'btn_transfer',
    layout: 'fit',
    width: 300,
//    height: 93,
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
                        xtype: 'combo',
                        fieldLabel: '转让给',
                        name: 'trans_to',
                        store: Ext.create('Ext.data.Store', {
                            data: userArray,
                            model: 'EIM.model.ComboUser',
                            proxy: 'memory'
                        }),
                        displayField: 'name',
                        valueField: 'id',
                        editable: false,
                        allowBlank: false
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
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