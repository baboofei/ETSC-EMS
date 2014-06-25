Ext.define('EIM.view.customer.CheckDupSubForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.customer_check_dup_sub_form',

    initComponent: function() {
        this.layout = 'form';
        this.width = 396;
        this.defaults = {
            xtype: 'container',
            layout: 'hbox',
            defaults: Ext.Object.merge(EIM_field_defaults, {xtype: 'textfield'})
        };

        this.items = [
            {
                items: [
                    {
                        fieldLabel: '姓名',
                        mergeType: 'override',
                        name: 'name'
                    },
                    {
                        fieldLabel: '英文名',
                        mergeType: 'override',
                        name: 'en_name'
                    }
                ]
            },
            {
                items: [
                    {
                        xtype: 'hidden',
                        name: 'customer_unit_id',
                        hidden: true
                    },
                    {
                        name: 'customer_unit_name',
                        fieldLabel: '客户单位'
                    }
                ]
            },
            {
                items: [
                    {
                        fieldLabel: '移动电话',
                        mergeType: 'addition',
                        name: 'mobile'
                    },
                    {
                        fieldLabel: '固定电话',
                        mergeType: 'addition',
                        name: 'phone'
                    }
                ]
            },
            {
                items: [
                    {
                        fieldLabel: '传真',
                        mergeType: 'addition',
                        name: 'fax'
                    },
                    {
                        fieldLabel: 'QQ/MSN',
                        mergeType: 'addition',
                        name: 'im'
                    }
                ]
            },
            {
                items: [
                    {
                        fieldLabel: '部门',
                        mergeType: 'override',
                        name: 'department'
                    },
                    {
                        fieldLabel: '职位',
                        mergeType: 'override',
                        name: 'position'
                    }
                ]
            },
            {
                items: [
                    {
                        name: 'addr',
                        mergeType: 'override',
                        fieldLabel: '地址'
                    }
                ]
            },
            {
                items: [
                    {
                        name: 'en_addr',
                        mergeType: 'override',
                        fieldLabel: '英文地址'
                    }
                ]
            },
            {
                items: [
                    {
                        fieldLabel: '邮编',
                        mergeType: 'override',
                        name: 'postcode'
                    },
                    {
                        fieldLabel: '电子邮件',
                        mergeType: 'addition',
                        name: 'email'
                    }
                ]
            },
            {
                items: [
                    {
                        xtype: 'combo',
                        name: 'lead_id',
                        mergeType: 'override',
                        fieldLabel: '结识方式',
                        store: Ext.create('Ext.data.Store', {
                            data: filter_all_dict('lead', true).concat(Ext.ComponentQuery.query('functree')[0].allExhibition),
                            model: 'EIM.model.AllDict',
                            proxy:  'memory'
                        }),
                        displayField: 'display',
                        valueField: 'value',
//                        value: "1",
                        triggerAction: 'all',
                        editable: false
                    },
                    {
                        xtype: 'combo',
                        name: 'vendor_unit_id',
                        mergeType: 'override',
                        fieldLabel: '供应商单位',
                        store: 'ComboVendorUnits',
                        queryMode: 'remote',
                        forceSelection: true,
                        hideTrigger: true,
                        triggerAction: 'query',
                        minChars: 1,
                        displayField: 'name',
                        valueField: 'id'
                    }
                ]
            },
            {
                items: [
                    {
                        name: 'comment',
                        mergeType: 'addition',
                        fieldLabel: '备注'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});