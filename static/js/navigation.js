
var $window = $(window);
var winW = $window.outerWidth();
var winH = $window.outerHeight();
var st = $window.scrollTop();

var gfn_body = {
    hold: function(tf){
        tf = tf != undefined ? tf : true;
        if(tf){
            $body.addClass('is-hold');
        }else{
            $body.removeClass('is-hold');
        }
    }
};


var $appHeader = $('.app-header');
var $appMenu = $('.app-menu');
if($appMenu.length){
    //header 타입별 분기
    var headerType = $appHeader.data('type');

    if(headerType != undefined) headerType = headerType.toLowerCase();
    
    switch (headerType){
        case 'back':
            $appHeader.find('.btn-history-back').show().siblings().not('.page-tit').remove();
            $appMenu.remove();
            break;
        case 'close':
            $appHeader.find('.btn-close').show().siblings().not('.page-tit').remove();
            $appMenu.remove();
            break;
        case 'title':
            $appHeader.find('.page-tit').siblings().remove();
            $appMenu.remove();
            break;
        case 'notice':
            $appHeader.find('.btn-notice-box, .btn-allmenu').show()
            $appHeader.find('.btn-history-back, .btn-close').remove();
            break;
        case '':
            $appHeader.find('.btn-history-back, .btn-allmenu').show()
            $appHeader.find('.btn-notice-box, .btn-close').remove();
            break;
        default:
            $appHeader.find('.btn-history-back, .btn-allmenu').show()
            $appHeader.find('.btn-notice-box, .btn-close').remove();
            console.log('There is no Type ' + headerType);
    }

    //header button
    $appHeader.on('click','.btn-allmenu',function(){
        $appMenu.addClass('is-active');
        gfn_body.hold(true);
    });

    $appMenu.on('click','.btn-close',function(){
        $appMenu.removeClass('is-active');
        gfn_body.hold(false);
    });

    $('.all-menu-list').on('click','a',function(){
        $(this).parent('li').addClass('is-active').siblings('li').removeClass('is-active');
    });
}




var nav = '<div class="app-gnb-wrap">';
    nav += '<div class="app-gnb tab swiper-container">';
    nav += '<ul class="swiper-wrapper">';
    nav += '</ul>';
    nav += '</div>';
    nav += '</div>';
    nav += '<div class="app-sub-wrap">';
    nav += '<div class="tab depth2 swiper-container app-sub">';
    nav += '<ul class="swiper-wrapper">';
    nav += '</ul>';
    nav += '</div>';
    nav += '</div>';

if($('.app').data('page') == 'submain'){
    if(!$('.app-lnb').length) $('.app-container').prepend('<div class="app-lnb"></div>');
    $('.app-lnb').empty().html(nav);
}


var gnbMenuSwiper;
var subMenuSwiper;

$('.tab.swiper-container').each(function(){
    var $tab = $(this);
    if(!$tab.hasClass('app-gnb')){
        subMenuSwiper = new Swiper('.app-sub',{
            slidesPerView: 'auto',
            //spaceBetween: 34,
            watchOverflow: true,
            on: {
                click : function(swiper, event){
                    //swiper.slideTo(swiper.clickedIndex);
                    $(swiper.clickedSlide).addClass('is-active').siblings('.swiper-slide').removeClass('is-active');
                },
            }
        });
    }else{
        gnbMenuSwiper = new Swiper('.app-gnb',{
            slidesPerView: 'auto',
            //spaceBetween: 32,
            watchOverflow: true,
            on: {
                click : function(swiper, event){
                    //swiper.slideTo(swiper.clickedIndex);
                    $(swiper.clickedSlide).addClass('is-active').siblings('.swiper-slide').removeClass('is-active');
                },
            }
        });
    }
});

//GNB
var depth1 = 0;
var depth2 = 0;
var subShow;
var $gnb = $('.app-gnb');
var gnbMenuList = [];
var subMenuList = [];
var $subMenu = $('.app-sub-wrap');
var gfn_gnb = {
    init : function(){
        $.each(gnbArr, function(index, item){
            gnbMenuList[index] = '<li class="swiper-slide" data-index="' + item.number+ '"><a href="' + item.link + '" data-sub="' + item.sub + '">' + item.name + '</a></li>';
        });
        gnbMenuSwiper.removeAllSlides();
        gnbMenuSwiper.appendSlide(gnbMenuList);
        gnbMenuSwiper.updateSize()
    },
    select: function(gnb, sub, subExposure){
        depth1 = gnb;
        depth2 = sub;
        subShow = subExposure;
    },
    //메뉴 선택
    choose: function(gnbIdx, subIdx){
        if($gnb.length){
            if(gnbIdx == undefined) gnbIdx = depth1;
            if(subIdx == undefined) subIdx = depth2;
            if(subShow == undefined) subShow = true;

            if(isNumeric(gnbIdx)){//숫자로 입력
                var sub = $gnb.find('.swiper-slide[data-index="' + gnbIdx + '"]').find('a').data('sub');
                if(sub == '' || !sub || !subShow){
                    $subMenu.hide();
                    $('.app-lnb').removeClass('app-sub-active');
                }else{
                    $subMenu.show();
                    subMenuList = [];
                    $.each(subMenu[0][sub], function(index, item){
                        subMenuList[index] = '<li class="swiper-slide" data-index="' + item.number+ '"><a href="' + item.link + '">' + item.name + '</a></li>';
                    });
                    subMenuSwiper.removeAllSlides();
                    subMenuSwiper.appendSlide(subMenuList);
                    subMenuSwiper.updateSize();

                    //2depth activation
                    if(!subIdx) subIdx = 0;
                    $subMenu.find('.swiper-slide[data-index="' + subIdx + '"]').addClass('is-active').siblings('li').removeClass('is-active');
                    $('.app-lnb').addClass('app-sub-active');
                    subMenuSwiper.slideTo(subIdx)
                    //if(depth2 >= 2) subMenuSwiper.slideTo(depth2 - 2)
                }
            }else{//문자 입력(에러)
                alert('index 번호를 입력하세요');
            }

            //1depth activation
            $gnb.find('.swiper-slide[data-index="' + gnbIdx + '"]').addClass('is-active').siblings('li').removeClass('is-active');
            gnbMenuSwiper.slideTo(gnbIdx);

            depth1 = gnbIdx;
            depth2 = subIdx;
        }
    }
};

$(window)
.on('load',function(){
    if($gnb.length){
        gfn_gnb.init();
        gfn_gnb.choose();
    }
    //remove unneccessary LNB
    if($('.app-lnb').is(':empty')) $('.app-lnb').remove();

    //Web A11Y
    var waHTML = '<div class=\"skip-nav\"><a href=\"#content\">본문으로 이동하기</a></div>'    
    if(!$('.skip-nav').length) $('body').prepend(waHTML);
    if($('.app-content').attr('id') != 'content') $('.app-content').attr('id','content');
})
.on('resize',function(){
    if($gnb.length){
        gnbMenuSwiper.update();
        subMenuSwiper.update();
        //console.log('resized')
    }
});


//공통 스크롤 이벤트
var scrollStatus = false;// down (true = up)
var currentSt = st;
var $processStep = $('.process-step');
var fixedTop;
if($gnb.length) fixedTop = $('.app-lnb').offset().top;

var scrollDirection = function(st){
    if(!st) st = 0;
    if(st > currentSt){
        scrollStatus = false;
    }else if(st < currentSt){
        scrollStatus = true;
    }
    currentSt = st;
    return scrollStatus;
};

$(window).on('scroll',function(){
    st = $(this).scrollTop();

    //Scroll Status
    //scrollDirection(st);

    //gnb fixed
    if($gnb.length) {
        if(st >= fixedTop){
            $('.app-lnb').addClass('is-fixed');
        }else{
            $('.app-lnb').removeClass('is-fixed');
        }
    }

    //Process
    // if(st > 0){
    //     if($('.app-header').length) $('.app-header').addClass('is-fixed');
    //     if($processStep.length) $processStep.addClass('is-fixed');
    // }else{
    //     if($processStep.length) $processStep.removeClass('is-fixed');
    //     if($('.app-header').length) $('.app-header').removeClass('is-fixed');
    // }
});


function isNumeric(str) {
    if (typeof str != "number"){
        return !isNaN(str) && !isNaN(parseFloat(str));
    }else{
        return true;
    }
}

