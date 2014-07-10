/**
 * 整体布局上的controller
 */

Ext.define('EIM.controller.Layout', {
    extend: 'Ext.app.Controller',

    stores: [
        'AllDicts',
        'AllElements',
        'dict.Exhibitions',
        'dict.Currencies',
        'dict.Applications',
        'dict.Areas',
        'dict.OurCompanies',
        'dict.Roles',
        'dict.Users',
        'dict.Members',
        'dict.MemberSales',
        'dict.Buyers',
        'dict.Businesses',
        'dict.Supporters'
    ],
    models: [
        'AllDict',
        'AllElement',
        'dict.Exhibition',
        'dict.Currency',
        'dict.Application',
        'dict.Area',
        'dict.OurCompany',
        'dict.Role',
        'dict.User',
        'dict.Member',
        'dict.MemberSale',
        'dict.Buyer',
        'dict.Business',
        'dict.Supporter'
    ],

    views: [
        'layout.Layout'
    ],

    init: function() {
        var me = this;
        me.control({
            'tabpanel#center': {
                /**
                 * 解决标签切换时左边树节点的对应选中与否
                 * @param tabPanel
                 * @param newCard
                 * @param oldCard
                 * @param eOpts
                 */
                tabchange: function(tabPanel, newCard, oldCard, eOpts) {
                    var tree = Ext.ComponentQuery.query("functree")[0];
                    var record = tree.getRootNode().findChild('id', newCard.innerId, true);
                    if (record) {
                        tree.selectPath(record.getPath());
                    } else {
                        tree.getSelectionModel().deselectAll();
                    }
                },
                render: function() {
                    var me = this;
                    /**
                     * 给class为innerNavi的元素(也就是在提醒或者消息里点击能打开其它标签的那个链接)加载一个事件代理
                     */
                    Ext.getBody().on('click', function(event, target) {
                        /*target大概是这样：
                         *<a href="#" class="innerNavi" x="r_sn:1364519247618|id:customer_unit_tab|innerId:2|title:客户单位管理|controller:CustomerUnits|widget:customer_unit_grid|filterStr:张">link</a>
                         */
                        var trunked_str = target["attributes"]["x"].nodeValue;
                        /**
                         * 不出意外应该拆成这样：
                         * "r_sn:1364519247618|id:customer_unit_tab|innerId:2|title:客户单位管理|controller:CustomerUnits|widget:customer_unit_grid|filterStr:张"
                         * 去引号
                         * r_sn:1364519247618|id:customer_unit_tab|innerId:2|title:客户单位管理|controller:CustomerUnits|widget:customer_unit_grid|filterStr:张
                         */
                        var array = trunked_str.split("|");
                        /**
                         * 就成了这样：
                         * [
                         * "r_sn:1364519247618"
                         * "id:​customer_unit_tab",
                         * "innerId:​2",
                         * "title:​客户单位管理",
                         * "controller:​CustomerUnits",
                         * "widget:​customer_unit_grid"
                         * "filterStr:张"
                         * ]
                         */
                        var hash = {};
                        for (var i = 0; i < array.length; i++) {
                            hash[array[i].split(":")[0]] = array[i].split(":")[1];
                        }
                        /**
                         * 终于变成了hash
                         */
                        var r_sn = hash["r_sn"];
                        var m_sn = hash["m_sn"];
                        var id = hash["id"];
                        var innerId = hash["innerId"];
                        var controller = hash["controller"];
                        var title = hash["title"];
                        var tabParent = Ext.getCmp('center');
                        var widget = hash["widget"];
                        globeFilter = hash["filterStr"];

                        if (tabParent) {
                            if (tabParent.getChildByElement(id)) {
                                tabParent.setActiveTab(id);
                                var grid_name = widget.replace(/_\S+\b/, "_grid"); //约定最后都是“xxx_grid”的形式
                                //                                console.log(grid_name);
                                var grid = Ext.ComponentQuery.query(grid_name)[0];
                                me.getController(controller).applyFilter(grid);
                            } else {
                                //TODO 可以重构
                                Ext.getBody().mask("加载中，请稍候……");
                                me.getController('Functions').onTabLoad(controller);
                                var newTab = tabParent.add({
                                    id: id,
                                    innerId: innerId,
                                    title: title,
                                    closable: true,
                                    xtype: widget
                                });
                                tabParent.setActiveTab(newTab);
                                Ext.getBody().unmask();
                            }
                            //同时判断是哪一类链接，并Ajax把本条设为已读
                            if (r_sn) {
                                Ext.Ajax.request({
                                    url: 'reminds/mark_single_as_read',
                                    params: {
                                        sn: r_sn
                                    },
                                    success: function() {
                                        if (Ext.getStore('GridReminds')) Ext.getStore('GridReminds').load();
                                    }
                                });
                            }
                            if (m_sn) {
                                Ext.Ajax.request({
                                    url: 'personal_messages/mark_single_as_read',
                                    params: {
                                        sn: m_sn
                                    },
                                    success: function() {
                                        if (Ext.getStore('GridPersonalMessages')) Ext.getStore('GridPersonalMessages').load();
                                    }
                                });
                            }
                        }
                    }, null, {
                        delegate: '.innerNavi'
                    });

                    /**
                     * 给class为innerAuditing的元素(也就是在提醒或者消息里点击弹出一个新窗口要审批的那个链接)加载一个事件代理
                     */
                    Ext.getBody().on('click', function(event, target) {
                        //                        console.log("xx");
                        /*target大概是这样：
                         有一些物品要入库：<a href="#"  class='innerAuditing' x="m_sn:1366708282424|admin_item_apply_for_sn:buy_in_55_1366792785025">点击查看</a>
                         不是上面那样，扩展成这样：
                         有一XXX需要XXX：<a href="#"  class='innerAuditing' x="m_sn:1366708282424|controller:AdminInventories|item_sn:buy_in_55_1366792785025">点击查看</a>
                         */
                        var trunked_str = target["attributes"]["x"].nodeValue;
                        var array = trunked_str.split("|");
                        var hash = {};
                        for (var i = 0; i < array.length; i++) {
                            hash[array[i].split(":")[0]] = array[i].split(":")[1];
                        }
                        //                        console.log(hash);
                        var m_sn = hash['m_sn'];
                        var controller = hash['controller'];
                        var sn = hash['item_sn'];

                        var sn_array = sn.split("_");
                        var sn_action = sn.replace(/(^.*?)_\d.*$/, "$1");
                        var sn_user_id = sn_array[sn_array.length - 2];
                        var sn_sn = sn_array[sn_array.length - 1];


                        switch (controller) {
                            case "Contracts":
                                switch (sn_action) {
                                    case "contract_audit":
                                        load_uniq_controller(me, 'contract.AuditForm');
                                        var view = Ext.widget('contract_audit_form').show();
                                        var panel = view.down('panel[title=合同详情]', false);
                                        var info_form = panel.down('form[name=contract_info]', false);
                                        var content_form = panel.down('contract_content', false);

                                        var id_field = content_form.down('[name=id]', false);
                                        var currency_field = content_form.down('amount_with_currency combo', false);
                                        var sum_field = content_form.down('amount_with_currency numberfield', false);

                                        var customer_unit_field = info_form.down('[name=customer_unit_id] combo', false);
                                        var buyer_customer_field = info_form.down('[name=buyer_customer_id] combo', false);
                                        var end_user_customer_field = info_form.down('[name=end_user_customer_id] combo', false);
                                        var business_unit_field = info_form.down('[name=business_unit_id] combo', false);
                                        var business_contact_field = info_form.down('[name=business_contact_id] combo', false);
                                        var pay_mode_field = content_form.down('expandable_pay_mode_combo combo', false);

                                        panel.items['items'][1].setWidth(200);
                                        panel.getHeader().hide();

                                        Ext.getStore('SingleContracts').getProxy().setExtraParam('number', sn_sn);
                                        Ext.getStore('SingleContracts').load({
                                            callback: function(records, operation, success) {
                                                // the operation object
                                                // contains all of the details of the load operation
                                                //                                                console.log(id_field);
                                                //                                                console.log(records[0].get('state'));
                                                info_form.loadRecord(records[0]);
                                                content_form.loadRecord(records[0]);

                                                id_field.setValue(records[0].get('id'));
                                                currency_field.setValue(records[0].get('currency_id'));
                                                sum_field.setValue(records[0].get('sum'));
                                                //给combo做一个假的store以正确显示值
                                                customer_unit_field.getStore().loadData([
                                                    [records[0].get('customer_unit>id'), records[0].get('customer_unit>(name|unit_aliases>unit_alias)')]
                                                ]);
                                                customer_unit_field.setValue(records[0].get('customer_unit>id'));

                                                buyer_customer_field.getStore().loadData([
                                                    [records[0].get('buyer_customer_id'), records[0].get('buyer>name')]
                                                ]);
                                                buyer_customer_field.setValue(records[0].get('buyer_customer_id'));
                                                buyer_customer_field.getStore().getProxy().setExtraParam('customer_unit_id', records[0].get('customer_unit>id'));

                                                end_user_customer_field.getStore().loadData([
                                                    [records[0].get('end_user_customer_id'), records[0].get('end_user>name')]
                                                ]);
                                                end_user_customer_field.setValue(records[0].get('end_user_customer_id'));
                                                end_user_customer_field.getStore().getProxy().setExtraParam('customer_unit_id', records[0].get('customer_unit>id'));

                                                if (records[0].get('business_unit_id') === 0) {
                                                    business_unit_field.getStore().removeAll();
                                                    business_unit_field.setValue("");
                                                } else {
                                                    business_unit_field.getStore().loadData([
                                                        [records[0].get('business_unit_id'), records[0].get('business_unit>name')]
                                                    ]);
                                                    business_unit_field.setValue(records[0].get('business_unit_id'));
                                                }

                                                if (records[0].get('business_contact_id') === 0) {
                                                    business_contact_field.getStore().removeAll();
                                                    business_contact_field.setValue("");
                                                } else {
                                                    business_contact_field.getStore().loadData([
                                                        [records[0].get('business_contact_id'), records[0].get('business_contact>name')]
                                                    ]);
                                                    business_contact_field.setValue(records[0].get('business_contact_id'));
                                                    business_contact_field.getStore().getProxy().setExtraParam('business_unit_id', records[0].get('business_unit_id'))
                                                }

                                                pay_mode_field.getStore().loadData([
                                                    [records[0].get('pay_mode_id'), records[0].get('pay_mode>name')]
                                                ]);
                                                pay_mode_field.setValue(records[0].get('pay_mode_id'));
                                                pay_mode_field.validate();

                                                //几个表格store的读取
                                                Ext.getStore("ContractItems").getProxy().setExtraParam('contract_id', records[0].get("id"));
                                                Ext.getStore("ContractItems").load();

                                                //如果已经签署，则把下面的审批按钮灰掉
                                                if (records[0].get("state") != "b_auditing") {
                                                    panel.up('panel').up('panel').down('button[text=审批通过]', false).disable();
                                                    panel.up('panel').up('panel').down('button[text=审批驳回]', false).disable();
                                                }
                                            }
                                        });


                                        //                                        Ext.getStore('GridInStockQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn);
                                        //                                        Ext.getStore('GridInStockQueryAdminInventories').load();
                                        break;
                                    default:

                                }

                                break;
                            case "AdminInventories":
                                //                                console.log(sn_array, sn_action, sn_sn);
                                switch (sn_action) {
                                    case "buy_in":
                                        load_uniq_controller(me, 'admin_inventory.InStockQueryForm');
                                        var view = Ext.widget('admin_inventory_in_stock_query_form').show();
                                        Ext.getStore('GridInStockQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridInStockQueryAdminInventories').load();
                                        break;
                                    case "apply_for_use_auditing":
                                        load_uniq_controller(me, 'admin_inventory.AuditingQueryForm');
                                        var view = Ext.widget('admin_inventory_auditing_query_form').show();
                                        Ext.getStore('GridAuditingQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridAuditingQueryAdminInventories').load();
                                        break;
                                    case "apply_for_use":
                                        load_uniq_controller(me, 'admin_inventory.OutStockQueryForm');
                                        var view = Ext.widget('admin_inventory_out_stock_query_form').show();
                                        Ext.getStore('GridOutStockQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridOutStockQueryAdminInventories').load();
                                        view.down('[name=out_stock_type]', false).setValue('use');
                                        break;
                                    case "agree":
                                        load_uniq_controller(me, 'admin_inventory.OutStockQueryForm');
                                        var view = Ext.widget('admin_inventory_out_stock_query_form').show();
                                        Ext.getStore('GridOutStockQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridOutStockQueryAdminInventories').load();
                                        view.down('[name=out_stock_type]', false).setValue('use');
                                        break;
                                    case "apply_for_loan":
                                        load_uniq_controller(me, 'admin_inventory.OutStockQueryForm');
                                        var view = Ext.widget('admin_inventory_out_stock_query_form').show();
                                        Ext.getStore('GridOutStockQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridOutStockQueryAdminInventories').load();
                                        view.down('[name=out_stock_type]', false).setValue('loan');
                                        break;
                                    case "apply_for_sell":
                                        load_uniq_controller(me, 'admin_inventory.OutStockQueryForm');
                                        var view = Ext.widget('admin_inventory_out_stock_query_form').show();
                                        Ext.getStore('GridOutStockQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridOutStockQueryAdminInventories').load();
                                        view.down('[name=out_stock_type]', false).setValue('sell');
                                        break;
                                    case "return":
                                        load_uniq_controller(me, 'admin_inventory.ReturnQueryForm');
                                        var view = Ext.widget('admin_inventory_return_query_form').show();
                                        Ext.getStore('GridReturnQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridReturnQueryAdminInventories').load();
                                        break;
                                    case "apply_for_reject":
                                        load_uniq_controller(me, 'admin_inventory.RejectQueryForm');
                                        var view = Ext.widget('admin_inventory_reject_query_form').show();
                                        Ext.getStore('GridRejectQueryAdminInventories').getProxy().setExtraParam('admin_item_apply_for_sn', sn_sn)
                                        Ext.getStore('GridRejectQueryAdminInventories').load();
                                        break;
                                    default:
                                }
                                break;
                            default:

                        }

                        //本条设为已读
                        Ext.Ajax.request({
                            url: 'personal_messages/mark_single_as_read',
                            params: {
                                sn: m_sn
                            },
                            success: function() {
                                if (Ext.getStore('GridPersonalMessages')) Ext.getStore('GridPersonalMessages').load();
                            }
                        });
                    }, null, {
                        delegate: '.innerAuditing'
                    });

                    /**
                     * 给class为innerAcceptCustomer的元素(也就是在提醒或者消息里点击能打开一个接受被转让客户的那个链接)加载一个事件代理
                     */
                    Ext.getBody().on('click', function(event, target) {
                        /*target大概是这样：
                         *<a href="#" class="innerAcceptCustomer" x="m_sn:1364519247618|controller:MInquires|id:m_inquire_id">link</a>
                         */
                        var trunked_str = target["attributes"]["x"].nodeValue;
                        var array = trunked_str.split("|");
                        var hash = {};
                        for (var i = 0; i < array.length; i++) {
                            hash[array[i].split(":")[0]] = array[i].split(":")[1];
                        }
                        var m_sn = hash['m_sn'];
                        var controller = hash['controller'];
                        var id = hash['id'];

                        switch (controller) {
                            case "MInquires":
                                load_uniq_controller(me, 'customer.CheckDupForm');
                                var view = Ext.widget('customer_check_dup_form').show();
                                Ext.getStore("GridPossibleCustomers").getProxy().extraParams = {
                                    source_controller: controller,
                                    id: id
                                };
                                Ext.getStore("GridPossibleCustomers").load();
                                Ext.Ajax.request({
                                    url: '/customers/load_inquire_info',
                                    params: {
                                        source_controller: controller,
                                        id: id
                                    },
                                    success: function(response) {
                                        var msg = Ext.decode(response.responseText);
                                        view.down('customer_check_dup_sub_form[title=客户信息(转入)]').loadRecord({
                                            "data": msg['customers'][0]
                                        });
                                        view.down('textarea[name=detail]').setValue(msg['customers'][0]['detail']);
                                        view.down('[name=inquire_type]').setValue(msg['inquire_type']);
                                        view.down('[name=inquire_id]').setValue(msg['inquire_id']);
                                    },
                                    failure: function() {
                                        Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
                                    }
                                });
                                break;
                            case "PInquires":
                                load_uniq_controller(me, 'customer.CheckDupForm');
                                var view = Ext.widget('customer_check_dup_form').show();
                                Ext.getStore("GridPossibleCustomers").getProxy().extraParams = {
                                    source_controller: controller,
                                    id: id
                                };
                                Ext.getStore("GridPossibleCustomers").load();
                                //因为两边都要用VendorUnit的store，所以Load一下吧
                                Ext.getStore("ComboVendorUnits").load();
                                //                                console.log(controller, id);
                                Ext.Ajax.request({
                                    url: '/customers/load_inquire_info',
                                    params: {
                                        source_controller: controller,
                                        id: id
                                    },
                                    success: function(response) {
                                        var msg = Ext.decode(response.responseText);
                                        view.down('customer_check_dup_sub_form[title=客户信息(转入)]').loadRecord({
                                            "data": msg['customers'][0]
                                        });
                                        view.down('customer_check_dup_sub_form[title=客户信息(转入)] [name=lead_id]').setValue('6'); //默认成“工厂转”
                                        view.down('textarea[name=detail]').setValue(msg['customers'][0]['detail']);
                                        view.down('[name=inquire_type]').setValue(msg['inquire_type']);
                                        view.down('[name=inquire_id]').setValue(msg['inquire_id']);
                                        //                                        console.log(msg['customers'][0]['vendor_unit_id']);
                                    },
                                    failure: function() {
                                        Ext.Msg.alert('错误', '可能是网络问题，请找Terry处理');
                                    }
                                });
                                break;
                            default:

                        }

                        //本条设为已读
                        Ext.Ajax.request({
                            url: 'personal_messages/mark_single_as_read',
                            params: {
                                sn: m_sn
                            },
                            success: function() {
                                if (Ext.getStore('GridPersonalMessages')) Ext.getStore('GridPersonalMessages').load();
                            }
                        });
                    }, null, {
                        delegate: '.innerAcceptCustomer'
                    });

                    /**
                     * 定时任务
                     * @type {Object}
                     */
                    var task = {
                        run: function() {
                            Ext.Ajax.request({
                                url: 'personal_messages/check_new_messages',
                                //                                params: {
                                //                                    id: abc
                                //                                },
                                success: function(response) {
                                    //                                    console.log(response.responseText);
                                    //                                    console.log(Ext.decode(response.responseText));
                                    //                                    console.log(Ext.decode(response.responseText)['first_content']);
                                    var text = Ext.decode(response.responseText);
                                    if (text['totalRecords'] === 1) {
                                        if (text['first_content'] != "") {
                                            Ext.example.msg('消息', text['first_content'], 't', 't', 5000);
                                        }
                                    } else {
                                        if (text['totalRecords'] > 1) {
                                            Ext.example.msg('消息', '你有' + text['totalRecords'] + '条新消息', 't', 't', 5000);
                                        }
                                    }
                                },
                                failure: function() {

                                }
                            });
                        },
                        interval: 30000
                    }
                    Ext.TaskManager.start(task);
                }
            },
            'field': {
                /**
                 * 解决必填项前加标记
                 * 这里加的是“*”
                 * @param thisField
                 * @param eOpts
                 */
                beforerender: function(thisField, eOpts) {
                    if (thisField && !thisField.rendered && thisField.isFieldLabelable && thisField.fieldLabel && thisField.allowBlank == false) {
                        thisField.fieldLabel += '<span class="req" style="color:#ff0000">*</span>';
                    }
                }
            },
            'boxselect': {
                'beforequery': function(e) {
                    var combo = e.combo;
                    if (combo.queryMode === "local") {
                        if (!e.forceAll) {
                            var input = e.query.replace(/[^\wA-Za-z\u4e00-\u9fa5]/g, '');
                            // 检索的正则
                            var regExp = new RegExp(".*" + input + ".*", "i"); //忽略大小写
                            // 执行检索
                            combo.store.filterBy(function(record, id) {
                                // 得到每个record的项目名称值
                                var text = record.get(combo.displayField);
                                return regExp.test(text);
                            });
                            combo.expand();
                            return false;
                        }
                    }
                }
            },
            'button[action=changePassword]': {
                click: function() {
                    load_uniq_controller(me, 'Users');
                    Ext.widget('password_form').show();
                }
            },
            'button[action=logout]': {
                click: function() {
                    Ext.Msg.confirm('确认注销', '真的要注销并回到登录界面？', function(button) {
                        if (button === 'yes') {
                            Ext.Ajax.request({
                                url: '/login/logout',
                                success: function() {
                                    location.reload();
                                },
                                failure: function() {}
                            });
                        }
                    });
                }
            }
        });
    }
});