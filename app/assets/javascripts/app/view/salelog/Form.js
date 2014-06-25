Ext.define('EIM.view.salelog.Form', {
    extend: 'Ext.window.Window',
    alias: 'widget.salelog_form',

    title: '新增销售工作日志',
    layout: 'fit',
    width: 640,
    height: 400,
    modal: true,
    maximizable: true,
    //    closeAction: 'hide',
    //    resizable: false,

    initComponent: function() {
        this.items = [
            {
                xtype: 'container',
                layout: 'anchor',
                items: [
                    {
                        xtype: 'tabpanel',
                        border: 0,
                        anchor: '100% -65',
                        items: [
                            {
                                xtype: 'recommend_tab'
                            },
                            {
                                xtype: 'mail_tab'
                            },
                            {
                                xtype: 'quote_tab'
                            },
                            {
                                xtype: 'contract_tab'
                                //                }, {
                                //                    xtype: 'problem_tab'
                            },
                            {
                                xtype: 'wait_tab'
                                //                }, {
                                //                    xtype: 'change_tab'
                            },
                            {
                                xtype: 'cancel_tab'
                            },
                            {
                                xtype: 'other_tab'
                            }
                        ]
                    },
                    {
                        xtype: 'salelog_extra_info'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});