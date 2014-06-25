/**
 * “退货”的表单
 */
Ext.define('EIM.view.admin_inventory.RejectForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.admin_inventory_reject_form',

    requires: ['Ext.ux.form.field.BoxSelect'],

    title: '退货',
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
                        xtype: 'boxselect',
                        fieldLabel: '选择物品',
                        name: 'reject_numbers',
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
                        fieldLabel: '退货日期',
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