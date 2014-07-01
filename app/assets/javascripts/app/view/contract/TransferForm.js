Ext.define('EIM.view.contract.TransferForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_transfer_form',

    title: '转让合同',
    iconCls: 'btn_transfer',
    layout: 'fit',
    width: 300,
//    height: 93,
    modal: true,

    initComponent: function() {
        var businessArray = filter_all_business();

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
                            data: businessArray,
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