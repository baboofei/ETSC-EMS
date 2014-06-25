Ext.define('EIM.view.contract.Chart', {
    extend:'Ext.chart.Chart',
    alias:'widget.contract_chart',
    autoRender:true,

    store:'ContractCharts',
    width:400,
    height:300,
    legend:{
        position:'right'
    },
    axes:[
        {
            type:'Numeric',
            position:'left',
            fields:['sum'],
            label:{
                renderer:Ext.util.Format.numberRenderer('0.0')
            },
            title:'销售额',
            grid:true,
            minimum:0
        },
        {
            type:'Numeric',
            position:'left',
            fields:['rmb'],
            label:{
                renderer:Ext.util.Format.numberRenderer('0.0')
            },
            title:'金额',
            grid:true,
            minimum:0
        },
        {
            type:'Category',
            position:'bottom',
            fields:['dealer_name'],
            title:'销售人员'
        }
    ],
    series:[
        {
            type:'column',
//        axis: 'bottom',
            highlight:true,
            tips:{
                trackMouse:true,
                width:140,
                height:28,
                renderer:function (storeItem, item) {
                    this.setTitle(storeItem.get('dealer_name') + ': ' + storeItem.get('id'));
                }
            },
            label:{
                display:'insideEnd',
                field:'sum',
                renderer:Ext.util.Format.numberRenderer('0.0'),
                orientation:'horizontal',
                color:'#333',
                'text-anchor':'middle'
            },
            xField:['dealer_name'],
            yField:['sum', 'rmb'],
            title:['销售额', '也是折合人民币']
        },
        {
            type:'line',
//        axis: 'bottom',
            highlight:true,
            tips:{
                trackMouse:true,
                width:140,
                height:28,
                renderer:function (storeItem, item) {
                    this.setTitle(storeItem.get('dealer_name') + ': ' + storeItem.get('id'));
                }
            },
            label:{
                display:'insideEnd',
                field:'rmb',
                renderer:Ext.util.Format.numberRenderer('0'),
                orientation:'horizontal',
                color:'#333',
                'text-anchor':'middle'
            },
            xField:['dealer_name'],
            yField:['rmb'],
            title:'折合人民币'
        }
    ],

    initComponent:function () {
        this.callParent(arguments);
    }
});


///**
// * 自定义颜色的pie chart
// * @type {Array}
// */
//var array = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
//var makeColor = function(){
//    return "#"+array[Math.floor(Math.random()*100)%16]+array[Math.floor(Math.random()*100)%16]+array[Math.floor(Math.random()*100)%16];
//}
//
//var store = Ext.create('Ext.data.JsonStore', {
//    fields: ['name', 'data', 'data2', 'data3', 'customColor'],
//    data: [
//        { 'name': '张三',   'data':Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '李四',   'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '王五', 'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '赵六',  'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '张三',   'data':Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '李四',   'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '王五', 'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '赵六',  'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '张三',   'data':Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '李四',   'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '王五', 'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()},
//        { 'name': '赵六',  'data': Math.random()*10 , 'data2':Math.random()+10, 'data3':Math.random()*10, 'customColor': makeColor()}
//
//    ]
//});
//
//Ext.define('EIM.view.contract.Chart', {
//    extend: 'Ext.chart.Chart',
//    alias: 'widget.contract_chart',
//    autoRender: true,
//
//    animate: true,
//    width: 800,
//    height: 600,
//    store: store,
//    theme: 'Base:gradients',
//    legend: {
//        position: 'right',
//        renderer: function (sprite, record, attributes, index, store) {
//            var color = record.get('customColor');
//            return Ext.apply(attributes, {
//                fill: color
//            });
//        }
//    },
//    series: [{
//        type: 'pie',
//        angleField: 'data',
//        lengthField: 'data2',
//        showInLegend: true,
//        tips: {
//            trackMouse: true,
//            //width: 140,
//            //height: 28,
//            renderer: function(storeItem, item) {
//                // calculate and display percentage on hover
//                var total = 0;
//                store.each(function(rec) {
//                    total += rec.get('data');
//                });
//                this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
//            }
//        },
//        highlight: {
//            segment: {
//                margin: 20
//            }
//        },
////        style: {
////            colors: ['#FFFFFF']//,'#FF0000','#FF9900','#FF6600','#FF3300','#FF0000','#660000','#663300']
////        } ,
//        label: {
//            field: 'name',
//            display: 'rotate',//rotate文字沿半径方向显示，饼图里其它值都无效
//            contrast: true,//黑色字在深色区域里看不清时自动显示成白色字
//            font: '18px Arial'
//        },
//        renderer: function (sprite, record, attributes, index, store) {
//            var color = record.get('customColor');
//            return Ext.apply(attributes, {
//                fill: color
//            });
//        }
//
//    }],
//
//    initComponent: function(){
//        this.callParent(arguments);
//    }
//});