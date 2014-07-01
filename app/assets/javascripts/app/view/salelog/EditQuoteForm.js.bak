Ext.define('EIM.view.salelog.EditQuoteForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.salelog_edit_quote_form',

    title: '修改报价',
    layout: 'anchor',
    width: 400,
    height: 330,
    modal: true,
    autoShow: true,
    maximizable: true,

    initComponent: function() {
        this.items = [{
            xtype: 'hidden',
            fieldLabel: 'id'
        }, {
            xtype: 'salelog_quoted_item_grid',
            title: '已报价项目列表',
            anchor: '100% -98',
            padding: '0 4 4 4'
        }, {
            xtype: 'form',
            bodyPadding: '5 5 0',
            layout: 'anchor',
            border: 0,
            fieldDefaults: EIM_field_defaults,
            items: [{
                xtype: 'textfield',
                fieldLabel: '修改要求',
                anchor: '100%'
            }]
        }, {
            xtype: 'salelog_extra_info'
        }];

        this.callParent(arguments);
    }
});