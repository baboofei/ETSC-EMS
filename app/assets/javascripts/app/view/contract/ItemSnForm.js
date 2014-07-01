Ext.define('EIM.view.contract.ItemSnForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_item_sn_form',

    title: '新增/修改序列号',
    layout: 'fit',
    width: 500,
    maximizable: true,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                defaults: {
                    xtype: 'textfield'
                },
                items: [
                    {
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        name: 'serial_number',
                        fieldLabel: '序列号',
                        emptyText: '请输入序列号，多个序列号用西文逗号“,”分开',
                        validator: function(){
                            if(this.invalidMsg === '') {
                                this.clearInvalid();
                                return true;
                            } else {
                                return this.invalidMsg;
                            }
                        },
                        invalidMsg: ''
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '确定',
                action: 'update'
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