/**
 * 自定义的组件，用于填写单位的多地址信息。包含描述、城市、邮编、中英文地址
 */
Ext.define('EIM.view.etscux.AddrForUnit', {
    extend:'Ext.form.Panel',
    alias:'widget.addr_for_unit',

    initComponent:function () {
        Ext.tip.QuickTipManager.init();

        this.title = this.title ? this.title : '新地址';
        this.border = 0;

        this.items = [
            {
                bodyPadding: '0 4 4 0',
                layout: 'form',
                items: [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'addr_name_' + this.addrIndex,
                                grossName: 'addr_name',//因为每个标签里的name都变得不一样了，所以用这个自定义属性来方便ComponentQuery取组件
                                fieldLabel: '描述',
                                emptyText: '只有一个地址时可为空，但如是多地址则必填，如“紫金港校区”'
                            },
                            {
                                xtype: 'checkbox',
                                name: 'is_prime_' + this.addrIndex,
                                grossName: 'is_prime',
                                fieldLabel: '设为主地址',
                                checked: true
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'textfield'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'city_id_' + this.addrIndex,
                                grossName: 'city_id',
                                fieldLabel: '所属城市',//'<span class="req" style="color:#ff0000">*</span>',
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
                            //多个标签里都用到城市store时，不能选择不同的城市。但又不能每个创建一个新store给它（因为标签数不定）
                            //所以弄了以下两个hidden来保存id和name来记录combo的值
                            //每当标签失去焦点时就把值赋给这两个hidden，同时把store重置
                            //当标签得到焦点时再用这两个hidden的值写回store里
                            //但有一个问题就是这个框就得是不必填，因为取的是hidden掉的那些框里的值。伪了一个“*”
                            {
                                xtype: 'hidden',
                                name: 'real_city_id_' + this.addrIndex,
                                grossName: 'real_city_id',
                                hidden: true
                            },
                            {
                                xtype: 'hidden',
                                name: 'real_city_name_' + this.addrIndex,
                                grossName: 'real_city_name',
                                hidden: true
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