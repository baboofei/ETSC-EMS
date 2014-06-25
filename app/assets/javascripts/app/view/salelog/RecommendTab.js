Ext.define('EIM.view.salelog.RecommendTab', {
    extend: 'Ext.form.Panel',
    alias: 'widget.recommend_tab',

    title: '推荐',
    border: 0,
    padding: '0 4',
//    bodyPadding: 4,
    layout: 'fit',
    fieldDefaults: EIM_field_defaults,
    items: [{
        xtype: 'recommended_item_grid',
        padding: '5 0 0 0'
    }]
});