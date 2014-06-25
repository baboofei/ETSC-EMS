Ext.define('EIM.view.express_sheet.SimpleForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.express_sheet_simple_form',

    title: '打印快递单',
    iconCls: 'btn_print',
    layout: 'fit',
    width: 300,
    height: 128,
    modal: true,
    autoShow: false,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'form',
                fieldDefaults: EIM_field_defaults,
                trackResetOnLoad: true,
                defaults: {
                    xtype: 'combo'
                },
                items: [
                    {
                        xtype: 'hidden',
                        hidden: true,
                        name: 'customer_ids'
                    },
                    {
                        fieldLabel: '快递公司',
                        name: 'express_id',
                        allowBlank: false,
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('express', true),
                            model: 'EIM.model.AllDict',
                            proxy:  'memory'
                        }),
                        displayField: 'display',
                        valueField: 'value',
                        editable: false
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '发件公司',
                        name: 'our_company_id',
                        allowBlank: false,
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_our_company(),
                            model: 'EIM.model.dict.OurCompany',
                            proxy:  'memory'
                        }),
                        valueField: 'id',
                        displayField: 'name'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '打印',
                action: 'printExpressSheet'
            },
//            {
//                text: '邮件发送PDF',
//                action: 'mailExpressSheet'
//            },
            {
                text: '取消',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});