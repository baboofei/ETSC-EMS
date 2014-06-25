Ext.define('EIM.view.salelog.NewQuoteForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.salelog_new_quote_form',

    title: '新增报价',
    layout: 'anchor',
    width: 400,
    height: 330,
    modal: true,
    autoShow: true,
    maximizable: true,

    initComponent: function() {
        this.items = [{
            xtype: 'salelog_quoted_item_grid',
            title: '已报价项目列表',
//            height: 200,
            anchor: '100% -98',
            padding: '4'
//            bodyPadding: 4
//            xtype: 'panel'
        }, {
            xtype: 'form',
            bodyPadding: '5 5 0',
            layout: 'anchor',
            border: 0,
            fieldDefaults: EIM_field_defaults,
            items: [{
                xtype: 'textfield',
                fieldLabel: '报价要求',
                anchor: '100%'
            }]
        }, {
            xtype: 'salelog_extra_info'
        }];

        this.callParent(arguments);
    }
});