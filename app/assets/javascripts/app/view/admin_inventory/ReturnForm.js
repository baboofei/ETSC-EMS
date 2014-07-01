/**
 * “归还”的表单
 */
Ext.define('EIM.view.admin_inventory.ReturnForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_return_form',

    title: '归还',
    layout: 'fit',
    width: 400,
//    height: 205,
    border: 0,
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
                        xtype: 'hidden',
                        name: 'id',
                        hidden: true
                    },
                    {
                        xtype: 'combo',
                        displayField: 'display',
                        valueField: 'value',
                        value: '2',
                        triggerAction: 'all',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '存放地点',
                        name: 'keep_at',
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('stock_keep_at'),
                            model: 'EIM.model.AllDict',
                            proxy:  'memory'
                        })
                    },
                    {
                        xtype: 'boxselect',
                        fieldLabel: '选择物品',
                        name: 'outstock_numbers',
                        store: Ext.create('Ext.data.Store', {
                            model: 'EIM.model.dict.Member',
                            proxy:  'memory'
                        }),
                        queryMode: 'local',
                        height: 80,
                        displayField: 'name',
                        valueField: 'id',
                        emptyText: '可多选',
                        editable: false,
                        validator: function(){
                            if(this.invalidMsg === '') {
                                this.clearInvalid();
                                return true;
                            } else {
                                return this.invalidMsg;
                            }
                        },
                        invalidMsg: ''
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: '归还日期',
                        name: 'created_at',
                        value: new Date(),
                        allowBlank: false,
                        format: 'Y-m-d'
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