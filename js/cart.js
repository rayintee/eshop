/**
 * 购物车依赖js
 *
 * Created by Rayintee on 2015-05-21.
 */
$(function(){
    'use strict';

    var isDebug = true;//调试模式为true

    var $that = $('body');

    //计算金额
    function sumMoney(obj, val){
        var $ul = $(obj).parent().parent().parent().parent().parent().parent();
        var oldPrice = parseFloat($ul.find('.td-price em.price-original').text())*100,
            newPrice = parseFloat($ul.find('.td-price em.price-now').text())*100;
        $ul.find('.td-sum em.price-original').text(((oldPrice*val)/100).toFixed(2));
        $ul.find('.td-sum .number').text(((newPrice*val)/100).toFixed(2));
        var $isChecked = $ul.find('input[name="orderList"]:checked'), isChecked = $isChecked.length;
        if(isChecked) sumAllMoney();//统计所有money
    }

    //计算总金额
    function sumAllMoney(){
        var oldMoney = 0, newMoney = 0;//定义变量
        $('input[name="orderList"]:checked').each(function(){
            var $ul = $(this).parent().parent().parent().parent(),
                $oldNum = $ul.find('em.old_number'),
                $newNum = $ul.find('em.number');
            oldMoney += parseFloat($oldNum.text())*100;
            newMoney += parseFloat($newNum.text())*100;
        });
        var toalMoney = newMoney/100, totalLess = (oldMoney - newMoney)/100;
        $('.amount-money').text(toalMoney.toFixed(2));
        $('.amount-less').text(totalLess.toFixed(2));
    }

    //注册事件
    $that.on('click', '.minus', function(){
        var val = parseInt($(this).parent().find('input').val()) - 1;
        $(this).parent().find('input').val(val);
        //计算金额
        sumMoney(this, val);
        if(val<2) {
            $(this).removeClass('minus').addClass('no-minus');
            return false;
        }
    }).on('click', '.plus', function(){
        var val = parseInt($(this).parent().find('input').val()) + 1;
        $(this).parent().find('input').val(val);
        //计算金额
        sumMoney(this, val);
        if(val == 2){
            $(this).parent().find('a.no-minus').removeClass('no-minus').addClass('minus');
        }
    }).on('keydown', 'input.allNum', function(evt){
        var kc = evt.keyCode;
        //键盘及数字键盘监听
        var array = new Array(48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105);
        var flag = true;
        for (var i = 0; i < array.length && flag; i++) {
            if (kc == array[i]) {
                flag = false;
            }
        }
        if (flag) {
            evt.keyCode = 0;
            evt.returnValue = false;
            return false;
        }
    }).on('keyup', 'input.allNum', function(){
        //计算金额
        var val = parseInt($(this).val());
        sumMoney(this, val);
    }).on('click', 'a.order_del', function(){
        $(this).parent().parent().parent().parent().parent().parent().remove();
        var orderObj = $('.order-list').find('.order');
        sumAllMoney();//统计所有money
        if(orderObj.length<1){//如果列表为空
            var html = $("#emptyTempl").render();
            $('#cartWrap').html('').html(html);
        }
    }).on('click', 'input[name="orderList"]', function(e){//勾选单个的复选框
        var $body = $(this).parent().parent().parent().parent().parent();
        $body.toggleClass('order-selected');//添加背景色
        //全选、取消全选
        var num = ($('.order-list').children()).length,
            checkedNum = $('input[name="orderList"]:checked').length;
        if(num==checkedNum) $('input[name="select-all"]').attr('checked', 'checked');
        else $('input[name="select-all"]').removeAttr('checked');
        //统计所有money
        sumAllMoney();
    }).on('click', 'input[name="select-all"]', function(){//全部复选框
        var flag = !!(this.checked);
        if(flag){//全部选中
            $('input[name="orderList"]').each(function(){
                var isChecked = this.checked;
                if(!isChecked) {
                    this.checked = 'checked';//赋值
                    var $body = $(this).parent().parent().parent().parent().parent();
                    $body.addClass('order-selected');
                }
            });
        } else {//取消全选
            $(this).removeAttr('checked');
            $('input[name="orderList"]:checked').each(function(){
                $(this).removeAttr('checked');
                var $body = $(this).parent().parent().parent().parent().parent();
                $body.removeClass('order-selected');
            });
        }
        sumAllMoney();//计算金额
    });

    //ajax远程服务请求
    var get = function(api, param, succ){
        console.log('start to call server http request...');
        if(isDebug){
            $.getJSON(api, param, function(data){
                if(succ) succ(data);
            });
        } else {

        }
    };

    //成功回调函数，处理list
    var succGetCartList = function(data){
        //console.log("data--->\n" + JSON.stringify(data));
        if(!data || data['orderList']==null){
            var html = $("#emptyTempl").render();
            $('#cartWrap').html('').html(html);
            return false;
        }
        var _html = $("#cartListTempl").render(data);
        $('#cartWrap').html('').html(_html);
    };

    //加载购物list
    function _loadCartList(){
        if(isDebug) {
            var api = "data/cartList.json", param = {};
            get(api, param, succGetCartList);
        }
    }

    //页面初始化js
    var init = function(){
        _loadCartList();
    }();
});