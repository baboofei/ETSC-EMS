/**
 * 自定义的组件，用于填写单位的多地址信息。包含描述、城市、邮编、中英文地址
 */
Ext.define('EIM.view.etscux.AddrForUnit', {
    extend:'Ext.container.Container',
    alias:'widget.addr_for_unit',

    initComponent:function () {
        Ext.tip.QuickTipManager.init();

        this.title = this.title ? this.title : '地址';

        this.items = [
            {
                bodyPadding: '0 4 4 0',
                layout: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'addr_name_' + this.addrIndex,
                        grossName: 'addr_name',//因为每个标签里的name都变得不一样了，所以用这个自定义属性来方便ComponentQuery取组件
                        fieldLabel: '描述',
                        emptyText: '如只有一个地址则此项可为空'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
//                        padding: '0 0 3',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'city_id_' + this.addrIndex,
                                grossName: 'city_id',
                                fieldLabel: '所属城市',
                                store: 'dict.Cities',
                                displayField: 'name',
                                valueField: 'id',
                                allowBlank: false,
                                mode: 'remote',
                                emptyText: '请输入所属城市名称',
                                triggerAction: 'query',
                                minChars: 1,
                                hideTrigger: true, //伪成输入框
                                forceSelection: true
                            },
                            {
                                name: 'postcode_' + this.addrIndex,
                                grossName: 'postcode',
                                fieldLabel: '邮政编码'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        padding: '0 0 3',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'addr_' + this.addrIndex,
                                grossName: 'addr',
                                fieldLabel: '地址',
                                emptyText: '不要写城市名称，因为已经选择了'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        name: 'en_addr_' + this.addrIndex,
                        grossName: 'en_addr',
                        fieldLabel: '英文地址'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});