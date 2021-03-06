Ext.define('EIM.view.quote.Panel', {
    extend:'Ext.panel.Panel',
    alias:'widget.quote_panel',

    layout:'border',
    items:[
        {
            xtype:'quote_grid',
            height:300,
            minHeight:100,
            maxHeight:400,
            region:'north',
            padding:"4 4 0 4",
            collapsible: true,
//        border: 0,
            split:true
        },
        {
//            xtype:'panel',
            xtype:'quote_detail',
            region:'center',
            padding:"0 4 4 4",
//        title: 'bb',
            split:true
//        },
//        {
//            /**
//             * 用来存所有币种的汇率的缓存
//             * “报价”标签打开的时候重新加载一次它的内容
//             * “修改汇率”里的改变提交后，后台存新汇率，同时它变
//             * 它onchange时，改变“报价项”和“报价块”里的汇率hidden
//             * 它的格式："[{'currency': 'USD', 'exchange_rate': 622.82}, {'currency': 'EUR', 'exchange_rate': 808.17}, ...]"
//             */
//            xtype: 'textfield',
//            region: 'south',
//            height: 25,
//            name: 'exchange_rate_hash',
//            value: "[{'currency': 'USD', 'exchange_rate': 622.82}, {'currency': 'EUR', 'exchange_rate': 808.17}, {'currency': 'JPY', 'exchange_rate': 7.58}]"
        }
    ],

    buttons:[
        {
            text: '交至商务',
            action: 'sale_create',
            iconCls: 'btn_save',
            id: 'privilege_button_sale_create',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '生成PDF',
            action: 'business_check',
            iconCls: 'btn_save_pdf',
            id: 'privilege_button_business_check',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '通知销售',
            action: 'business_first_done',
            iconCls: 'btn_message',
            id: 'privilege_button_business_first_done',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '有问题',
            action: 'sale_check_fail',
            iconCls: 'btn_question',
            id: 'privilege_button_sale_check_fail',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '更改完毕',
            action: 'business_fix',
            iconCls: 'btn_save_pdf_message',
            id: 'privilege_button_business_fix',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text: '完成',
            action: 'sale_check_ok',
            iconCls: 'btn_done',
            id: 'privilege_button_sale_check_ok',
            allowPrivilege: true,
            isInWorkflow: true,
            tempDisabled: true
        },
        {
            text:'保存为新报价(会生成一个新的报价编号，没事请不要乱点，谢谢)',
            action:'save_as',
            iconCls: 'btn_save_as',
            disabled: true
        }
//        {
//            text:'保存本报价',
//            action:'save',
//            iconCls: 'btn_save',
//            disabled: true
//        },
//        {
//            text: '保存并生成PDF',
//            action: 'generate_pdf',
//            iconCls: 'btn_save_pdf',
//            disabled: true,
//            hidden: true
//        },
//        {
//            text: '完成',
//            action: 'generate_log',
//            iconCls: 'act_done',
//            disabled: true,
//            hidden: true
//        }
    ],

    initComponent:function () {
        this.callParent(arguments);
    }
});