Ext.define('EIM.view.salelog.ProblemTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.problem_tab',

    title: '产品有问题',
    border: 0,
    padding: 4,
    layout: 'anchor',
    fieldDefaults: EIM_field_defaults,
    items: [{
        xtype: 'textfield',
        fieldLabel: '客户单位',
        name: 'customer_unit_id',
        emptyText: '请输入并选择客户单位'
    }, {
        xtype: 'textfield',
        fieldLabel: '产品型号',
        name: 'product_id',
        emptyText: '请输入并选择产品型号'
    }, {
        xtype: 'combo',
        fieldLabel: '合同号',
        name: 'contract_id',
        emptyText: '请选择合同号',
        store: [[1, "a"], [2, "b"]],
        editable: false,
        allowBlank: false
    }]
});