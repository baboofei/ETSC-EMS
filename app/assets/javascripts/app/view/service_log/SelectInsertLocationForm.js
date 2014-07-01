Ext.define('EIM.view.service_log.SelectInsertLocationForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.service_log_select_insert_location_form',

    title: '选择日志发生时间',
    layout: 'fit',
    width: 300,
    modal: true,

    initComponent: function() {
        this.items = [
            {
                xtype: 'panel',
                height: 300,
                layout: 'border',
                border: 0,
                items: [
                    {
                        xtype: 'grid',
                        title: '待新增的日志(拖到下面↓)',
                        name: 'to_be_inserted',
                        columns: [{dataIndex: 'natural_language',text: '描述',flex: 1}],
                        hideHeaders: true,
                        store: Ext.create('Ext.data.Store', {
                            model: 'EIM.model.GridServiceLogInsertion'
                        }),
                        region: 'north',
                        height: 90,
                        padding: '4 4 4 4',
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'service_log_insertion'
                            }
                        }
                    },
                    {
                        xtype: 'grid',
                        title: '现有的日志(拖动上面到这里)',
                        name: 'insert_location',
                        columns: [{dataIndex: 'natural_language',text: '描述',flex: 1}],
                        hideHeaders: true,
                        store: Ext.create('Ext.data.Store', {
                            model: 'EIM.model.GridServiceLogInsertion'
                        }),
                        region: 'center',
                        padding: '0 4 4 4',
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragGroup: 'service_log_insertion',
                                dropGroup: 'service_log_insertion'
                            }
                        }
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