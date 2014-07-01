Ext.define('EIM.view.contract.QuoteForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.contract_quote_form',

    title: '选择报价',
    layout: 'fit',
    width: 250,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                bodyPadding: 4,
                layout: 'anchor',
                fieldDefaults: EIM_field_defaults,
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: '报价编号',
                        name: 'quote_id',
                        allowBlank: false,
                        emptyText: '请输入并选择报价编号',
                        forceSelection: true,
                        triggerAction: 'query',
                        minChars: 1,
                        hideTrigger: true,
                        store: 'ComboContractQuotes',
                        valueField: 'id',
                        displayField: 'number',
                        tpl: '<tpl for=".">' +
                            '<li role="option" class="x-boundlist-item" data-qtip="' +
                            "{summary}" +
                            '">{number}' +
                            '</li></tpl>'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: '下一步',
                action: 'next'
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