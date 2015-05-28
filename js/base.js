/**
 * 通用统一基础̨js
 *
 * Created by Rayintee on 2015-05-17.
 * @author rayintee@gmail.com
 */
$(function(){
    'use strict';
    var isDebug = true;//调试模式为true

    var $that = $('body'),
        $banner = $('.banner', $that),
        $noticeHd = $('#noticeHd li', $that),
        $noticeBd = $('.notice-bd', $that);

    //注册事件
    function addEvent(){
        var $menu = $('.category-popup .list-item', $that),
            $arrow = $('.banner .arrows', $that);

        $menu.hover(function() {//菜单悬停
            ($(this).find('.extra-area')).addClass('show');
        }, function() {
            ($(this).find('.extra-area')).removeClass('show');
        });

        $banner.hover(function(){//广告悬停
            console.log(111);
            $arrow.addClass('show');
        }, function(){
            $arrow.removeClass('show');
        });

        $noticeHd.hover(function(){//公告栏悬停
            if($(this).hasClass('selected')) return false;
            $('.notice-hd li.selected').removeClass('selected');//移除激活的li
            $(this).addClass('selected');//添加selected
            var $target = $(this).attr('data-target');
            console.log('target---->' + $target);
            $noticeBd.removeClass('selected');//bd移除激活状态
            $('#' + $target).addClass('selected');
        }, function(){
            return false;
        });
    }

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
    var succGetMenuList = function(data){
        //console.log("data--->\n" + JSON.stringify(data));
        var _html = $("#categoryMenuTempl").render(data);
        $('#categoryMenu').html('').html(_html);
        addEvent();//ע���¼�
    };

    //加载菜单
    function _loadMenu(){
        if(isDebug) {
            var api = "data/menuList.json", param = {};
            get(api, param, succGetMenuList);
        }
    }

    //初始化banner
    function _initBanner(){
        $banner.unslider({
            arrows: true,
            fluid: true,
            dots: true,
            speed: 600,
            delay: 4000,
            prev: '&lt;',
            next: '&gt;'
        });
    }

    /*工程入口*/
    var init = function(){
        console.log("init page, start init menu list...");
        _initBanner();
        _loadMenu();
    }();

});
