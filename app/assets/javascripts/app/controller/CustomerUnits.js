Ext.define('EIM.controller.CustomerUnits', {
    extend: 'Ext.app.Controller',

    stores: [
        'CustomerUnits', 'dict.CustomerUnitSorts', 'dict.Cities', 'GridCustomerUnits'
    ],
    models: [
        'CustomerUnit', 'dict.CustomerUnitSort', 'dict.City', 'GridCustomerUnit'
    ],

    views: [
        'customer_unit.Grid', 'customer_unit.Form'
    ],

    refs: [{
        ref: 'grid',
        selector: 'customer_unit_grid'
    }],

    init: function() {
        var me = this;
        var active_tab_name = "";
        me.control({
            'customer_unit_grid': {
                itemdblclick: this.editCustomerUnit,
                selectionchange: this.selectionChange
            },
            'customer_unit_grid button[action=addCustomerUnit]': {
                click: this.addCustomerUnit
            },
            'customer_unit_form button[action=save]': {
                click: this.saveCustomerUnit
            },
            'customer_unit_form [name=addr_group_tab] addr_for_unit': {
                deactivate: this.writeValueToHidden,
                activate: this.writeValueFromHidden
            },
            'customer_unit_form [name=addr_group_tab] [title=+]': {
                activate: this.determineWhetherAddNewTab
            }
        });
    },

    addCustomerUnit: function() {
        Ext.widget('customer_unit_form').show();
    },

    saveCustomerUnit: function(button) {
        var win = button.up('window');
        var form = win.down('form', false);
        var tab_panel = form.down('tabpanel');
        var tabs = tab_panel.items.items;
        var all_tabs_valid = true;
        var tab_count = tabs.length;
        if(tab_count > 2) {//其实是一个标签，但“+”也要算一个……
            Ext.Array.each(tabs, function(item, index) {
                if(item.xtype === "addr_for_unit" && Ext.isEmpty(item.down('[grossName=addr_name]', false).getValue())) {
                    Ext.example.msg("错误", "请为现有地址添加一个“描述”！");
                    tab_panel.setActiveTab(index);
                    all_tabs_valid = false;
                    return false;
                }
            });
            for(var i = 0; i < tab_count - 1; i++) {
                form.down('tabpanel').setActiveTab(i);
            }
        }
        if (form.form.isValid() && all_tabs_valid) {
            //防双击
            button.disable();
            form.submit({
                url: "customer_units/save_customer_unit",
                submitEmptyText: false,
                success: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    var target_by_id = form.down('[name=source_element_id]', false).getValue();
                    //如果是从小加号来的窗口(也就是source_element_id的值不为空)，则把值回填到小加号前面的combo里
                    if (!Ext.isEmpty(target_by_id)) {
                        var target = Ext.getCmp(target_by_id);
                        var target_combo = target.up('container').down("combo", false);
                        var text = response.request.options.params.name;
                        target_combo.store.load({
                            params: {
                                query: text
                            },
                            callback: function(records, operation, success) {
                                target_combo.select(msg['id']);
                                //如果有带加号的客户选择组件，则为其加一个过滤参数
                                var customer_combo_array = Ext.ComponentQuery.query("expandable_customer_combo");
                                if (customer_combo_array.length > 0) {
                                    Ext.Array.each(customer_combo_array, function(item) {
                                        if (item.up('form') === target_combo.up('form')) {
                                            item.down('combo', false).getStore().getProxy().setExtraParam('customer_unit_id', msg['id'])
                                        }
                                    });
                                }
                            }
                        });
                    }
                    win.close();
                    Ext.example.msg('成功', msg.message);
                    Ext.getStore('GridCustomerUnits').load();
                },
                failure: function(the_form, action) {
                    var response = action.response;
                    var msg = Ext.decode(response.responseText);
                    Ext.example.msg('失败', msg.message);
                    button.enable();
                }
            });
        }
    },

    /**
     * 把值赋给两个hidden，同时把store重置
     * @param tab
     */
    writeValueToHidden: function(tab) {
        tab.down('[grossName=real_city_id]', false).setValue(tab.down('combo[grossName=city_id]', false).getValue());
        tab.down('[grossName=real_city_name]', false).setValue(tab.down('combo[grossName=city_id]', false).getRawValue());
        tab.down('combo[grossName=city_id]', false).getStore().removeAll();
    },
    /**
     * 用两个hidden的值写回store里
     * @param tab
     */
    writeValueFromHidden: function(tab) {
        var id = tab.down('[grossName=real_city_id]', false).getValue();
        var name = tab.down('[grossName=real_city_name]', false).getValue();
        tab.down('combo[grossName=city_id]', false).getStore().loadData([{
            id: id,
            name: name
        }]);

        tab.down('combo[grossName=city_id]', false).setValue(Number(id));
    },
    /**
     * 如果有addr_name是空着的tab，则不让新增
     * @param tab
     */
    determineWhetherAddNewTab: function(tab) {
        var tab_panel = tab.up('tabpanel');
        var tabs = tab_panel.items.items;
        var valid_tab_count = 0;
        var me = this;
        Ext.Array.each(tabs, function(item, index) {
            if(item.xtype === "addr_for_unit" && Ext.isEmpty(item.down('[grossName=addr_name]', false).getValue())) {
                Ext.example.msg("错误", "请为现有地址添加一个“描述”！");
                tab_panel.setActiveTab(index);
                return false;
            } else {
                valid_tab_count ++;
            }
        });
        if(valid_tab_count === tabs.length) {
            var new_tab = tab_panel.add(tabs.length - 1, {
                title: '新地址',
                xtype: 'addr_for_unit',
                addrIndex: tabs.length
            });
            var new_checkbox = new_tab.down('checkbox', false);
            new_checkbox.setValue(false);
            new_checkbox.on('change', me.selectPrime, this);
            tab_panel.setActiveTab(new_tab);
        }
    },

    /**
     * 保证全部tab里至多只有一个被选中：
     * 选中某一个时取消其它所有
     * 把选中的这个取消的时候，强制选中第一个
     * @param checkbox
     * @param newValue
     */
    selectPrime: function(checkbox, newValue) {
        var tab_panel = checkbox.up('tabpanel');
        var tabs = tab_panel.items.items;
        var checkbox_array = Ext.Array.clean(Ext.Array.map(tabs, function(item) {
            return item.down('checkbox', false);
        }));
        if(newValue === true) {
            Ext.Array.each(checkbox_array, function(item) {
                if(item != checkbox) {
                    item.setValue(false);
                }
            });
        } else {
            var false_count = 0;
            Ext.Array.each(checkbox_array, function(item) {
                if(!item.getValue()) {
                    false_count += 1;
                }
            });
            if(false_count === checkbox_array.length) {
                Ext.example.msg('<span style="color: red; ">注意</span>', '因为你没有选择主地址，系统帮你选择了“' + tabs[0].tab.text + '”作为主地址。');
                checkbox_array[0].setValue(true);
            }
        }
    },

    loadCustomerUnits: function() {
        //        Ext.getStore("CustomerUnits").load();
        //        Ext.getStore("dict.Cities").load();
    },

    editCustomerUnit: function() {
        var me = this;
        var record = this.getGrid().getSelectedCustomerUnit();
        var view = Ext.widget('customer_unit_form').show();
        view.down('form', false).loadRecord(record);
        //根据传来的“all_addr_names”等值的长度，来决定生成多少标签
//        console.log(record.get('all_addr_names'));
        var addr_name_array = record.get('all_addr_names').split("||");
        var city_id_array = record.get('all_city_ids').split("||");
        var city_name_array = record.get('all_city_names').split("||");
        var is_prime_array = record.get('all_is_primes').split("||");
        var postcode_array = record.get('all_postcodes').split("||");
        var addr_array = record.get('all_addrs').split("||");
        var en_addr_array = record.get('all_en_addrs').split("||");
        
        var tab_panel = view.down('tabpanel', false);
        //先禁用掉判断checkbox是不是都为空的trigger，要不然上来就直接报错并把第一个设为主了
        //此时还只有一个标签
        var checkbox_field = Ext.ComponentQuery.query('customer_unit_form [grossName=is_prime]');
        Ext.Array.each(checkbox_field, function(item) {
            item.un('change', me.selectPrime, this);
        });

        Ext.Array.each(addr_name_array, function(item, index) {
            if(index === 0) {
                //第一个标签已经存在，直接对表单赋值
//                console.log(view.down('[name=addr_group_tab]', false));
                var first_tab = tab_panel.down('addr_for_unit', false);
                if(Ext.isEmpty(item)) {
                    first_tab.tab.setText("新地址");
                } else {
                    first_tab.tab.setText(item);
                }
                first_tab.down('[grossName=addr_name]', false).setValue(item);
                first_tab.down('[grossName=is_prime]', false).setValue(is_prime_array[index]);
                //给combo做一个假的store以正确显示值
                var city_field = first_tab.down('[grossName=city_id]', false);
                city_field.getStore().loadData([
                    [Number(city_id_array[index]), city_name_array[index]]
                ]);
                city_field.setValue(Number(city_id_array[index]));
                first_tab.down('[grossName=real_city_id]', false).setValue(city_id_array[index]);
                first_tab.down('[grossName=real_city_name]', false).setValue(city_name_array[index]);
                first_tab.down('[grossName=postcode]', false).setValue(postcode_array[index]);
                first_tab.down('[grossName=addr]', false).setValue(addr_array[index]);
                first_tab.down('[grossName=en_addr]', false).setValue(en_addr_array[index]);
            } else {
                //若有多的则必须用程序创建
                var tabs = tab_panel.items.items;
                var new_tab = tab_panel.add(tabs.length - 1, {
                    xtype: 'addr_for_unit',
                    addrIndex: tabs.length
                });
                new_tab.tab.setText(item);
                new_tab.down('[grossName=addr_name]', false).setValue(addr_name_array[index]);
                new_tab.down('[grossName=is_prime]', false).setValue(is_prime_array[index]);
                //给combo做一个假的store以正确显示值
                var city_field = new_tab.down('[grossName=city_id]', false);
                city_field.getStore().loadData([
                    [Number(city_id_array[index]), city_name_array[index]]
                ]);
                city_field.setValue(Number(city_id_array[index]));
                new_tab.down('[grossName=real_city_id]', false).setValue(city_id_array[index]);
                new_tab.down('[grossName=real_city_name]', false).setValue(city_name_array[index]);
                new_tab.down('[grossName=postcode]', false).setValue(postcode_array[index]);
                new_tab.down('[grossName=addr]', false).setValue(addr_array[index]);
                new_tab.down('[grossName=en_addr]', false).setValue(en_addr_array[index]);
            }
        });
        //再把判断checkbox是不是都为空的trigger加载回来
        //这时候已经是多个了
        var checkbox_field = Ext.ComponentQuery.query('customer_unit_form [grossName=is_prime]');
        Ext.Array.each(checkbox_field, function(item) {
            item.on('change', me.selectPrime, this);
        });
    },

    selectionChange: function() {

    }
});

