/**
 * 备注和实际日期两个组件
 * 因为会有Disable的时候，还会在弹出的别的窗口里用到，所以独立出来
 */
Ext.define('EIM.view.salelog.ExtraInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.salelog_extra_info',

    title: '',
    fieldDefaults: EIM_field_defaults,
    bodyPadding: 4,
    border: 0,
    layout: 'hbox',
    items: [
        {
            xtype: 'textfield',
            name: 'comment',
            fieldLabel: '备注',
            flex: 1,
            validator: function() {
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
            name: 'contact_at',
            format: 'Y-m-d',
            fieldLabel: '联系日期',
            emptyText: '请选择此条日志实际发生的日期(比如事后填写的情况)',
            value: new Date(),
            flex: 1,
            allowBlank: false
        }
    ],
    buttons: [
        {
            text: '确定',
            action: 'saveSalelog'
        }
    ]
});