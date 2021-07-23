//세자리수 콤마
function gfn_comma3Digit(number){
    if (number === "") return;
    if (typeof number === "number") number = String(number);
    number = number.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    return Number(number).toLocaleString();
}
function gfn_removeComma3Digit(number){
    if (number === "") return;
    return Number(number.replace(/,/g, ""));
}
function gfn_dateFormatter(ydm){
    var dateVal;
    ydm = ydm.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if(ydm !== undefined && String(ydm) !== ''){
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        var tmp = String(ydm).replace(/(^\s*)|(\s*$)/gi, '').replace(regExp, ''); // 공백 및 특수문자 제거
        if(tmp.length <= 4){
            dateVal = tmp;
        }else if(tmp.length > 4 && tmp.length <= 6){
            dateVal = tmp.substr(0, 4) + '.' + tmp.substr(4, 2);
        }else {
            dateVal = tmp.substr(0, 4) + '.' + tmp.substr(4, 2) + '.' + tmp.substr(6, 2);

        }
    }
    return dateVal;
}

function gfn_fnChkByte($target, maxByte){
    maxByte = maxByte.replace(/[\D\s\._\-]+/g, "");
    var str = $target.val();
    var str_len = str.length;

    var rbyte = 0;
    var rlen = 0;
    var one_char = "";
    var str2 = "";

    for(var i=0; i < str_len; i++){
        one_char = str.charAt(i);
        if(escape(one_char).length > 4){
            rbyte += 2;                                          //한글2Byte
        }else{
            rbyte++;                                            //영문 등 나머지 1Byte
        }

        if(rbyte <= maxByte){
            rlen = i+1;                                          //return할 문자열 갯수
        }
    }

    if(rbyte > maxByte){
        modalPopup({
            message: "한글 "+(maxByte/2)+"자 / 영문 "+maxByte+"자를 초과 입력할 수 없습니다."
        });
        str2 = str.substr(0,rlen);                                  //문자열 자르기
        $target.val(str2);
        gfn_fnChkByte($target, maxByte);
    }else{
        $target.parent('.textarea').find('.current').text(gfn_comma3Digit(rbyte));
    }
}

var $body = $('body');
var $layered = $('.layered');

//Device Check
/*
    Homebar 가 있는 모델 및 비율 , livv, new starbanking 에는 webview 상단 48~72 (예상)
    iPhone 12 Pro Max	        428*926 (0.46 / 0.50)
    iPhone 12, 12 Pro	        390*844 (0.46 / 0.51)
    iPhone 11 Pro Max, XS Max	414*896 (0.46 / 0.50)
    iPhone 11, XR	            414*896 (0.46 / 0.50)
    iPhone X, XS, 11 Pro	    375*812 (0.46 / 0.51)

    iPhone 7,8	                375*667	(0.56 / 0.63)
    iPhone 6+,7+,8+	            414*736	(0.56 / 0.62)
    iPhone 6, SE2	            375*667	(0.56 / 0.63)
    iPhone 5, SE	            320*568	(0.56 / 0.65)
*/
if((winH / winW) < 0.52 && $('html').hasClass('ios')) $('html').addClass('homebar');

var gfn_dim = {
    show : function($target, level, duration){
        duration = duration != undefined ? duration : 200;
        if(!$target.prev('.dim').length) $('<div class="dim"/>').insertBefore($target);
        $target.prev('.dim').fadeIn(duration).css('z-index',(level - 1));
    },
    hide : function($target, duration){
        var $dim = $(".dim");
        duration = duration != undefined ? duration : '200';
        $target = !$target.is('.dim') ? $dim : $target;
        //console.log($target)
        $target.fadeOut(duration,function(){
            $(this).remove();
        });
    }
};

$('body').on('click','.dim',function(){
    if($(this).next('div').is('.bottom-sheet') || $(this).next('div').is('.floating-banner')){
        gfn_dim.hide($(this));
        gfn_layered.close($(this).next('div').attr('data-layered-name'));
    }
});

var _btnTop = {
    click : function(){
        $('.btn-top').on('click',function(){
            $('html,body').stop().animate({'scrollTop' : 0},200);
        });
    },
    scroll : function(st){
        var footerTop = $('.app-footer').offset().top;
        if(st >= footerTop - winH){
            $('.btn-top').addClass('no-fixed');
        }else{
            $('.btn-top').removeClass('no-fixed');
        }
    }
};
if($('.btn-top').length){
    _btnTop.scroll(st);
    _btnTop.click();
}

var layeredLevel = 301;
var gfn_layered = {
    open: function(name, dim, duration){
        dim = dim == undefined ? true : dim;
        duration = duration == undefined ? 200 : duration;
        if(name != '' && name != undefined){
            var $selectedLayer = $layered.children('div[data-layered-name=' + name + ']');
            if ($selectedLayer.length === 0) return;

            if(dim){
                if(!$selectedLayer.hasClass('popup')) gfn_dim.show($selectedLayer, layeredLevel, duration);
                //gfn_dim.show($selectedLayer, layeredLevel);
            }
            $selectedLayer.addClass('is-active').css('z-index', layeredLevel);
            gfn_body.hold(true);

            layeredLevel = layeredLevel + 2;
        }
        //console.log('layered.open')
    },
    close: function(name, duration){
        //console.log(name, 'layered.close')
        duration = duration == undefined ? 200 : duration;
        if(name != '' && name != undefined){
            var $selectedLayer = $layered.children('div[data-layered-name=' + name + ']');
            gfn_body.hold(false);
            gfn_dim.hide($selectedLayer.prev('.dim'), duration);
            $selectedLayer.removeClass('is-active is-expanded').removeAttr('style');
        }else{
            gfn_dim.hide();
            $layered.children('div').removeClass('is-active is-expanded').removeAttr('style');
        }
    }
};
$layered.children('div').each(function(){
    if($(this).hasClass('is-active')) gfn_layered.open($(this).attr('data-layered-name'));
});

//레이어 호출
$('body').on('click','[data-call-layered]',function(){
    var name = $(this).data('call-layered');
    gfn_layered.open(name);
    if($(this).closest('.kb-form').length) $(this).closest('.kb-form').addClass('is-active');
});

//레이어 닫기
$('body').on('click','[data-action=close]',function(){
    var name = $(this).parents('div[data-layered-name]').data('layered-name');
    var duration = $(this).data('call-layered') != undefined ? 0 : undefined;
    gfn_layered.close(name, duration);
});

//modal 호출(data-call-modal 이름과 modal의 ID가 같아야함)
$('body').on('click','button[data-call-modal]',function(){
    var id = $(this).data('call-modal');
    $('#'+id).modalPopup('open');
});


//is-disabled 공통
$('.is-disabled, button:disabled').on('click focusin', function(){
    return false;
});

//form-select
var gfn_formText = {
    fill: function($target){
        var $thisForm = $target.parent('.kb-form');
        var value = $target.find('input').val();
        value!='' ? $thisForm.removeClass('not-ready') : $thisForm.addClass('not-ready');
    },
    calculate: function($target){
        var $input = $target.find('input');
        //세자리수 콤마 실행
        if($input.data('action') == 'autoSeperator'){
            $input.val(gfn_comma3Digit($input.val()));
        }

        //unit 위치
        // if($target.find('.measurement').length){
        //     $target.find('.measurement').text($input.val());
        //     $target.find('.unit').css({'left' : $target.find('.measurement').outerWidth() + 4 + 'px'});
        // }
        //console.log($target.find('.measurement').outerWidth())
    },
    empty: function($target){
        $target.parent('.kb-form').addClass('not-ready');
        $target.find('input').val('').focus();
        $target.find('.measurement').text('');
    },
    write: function(id, val){
        var $this;
        if(typeof(id) == 'string'){
            $this = $('#'+id);
        }else if(typeof(id) == 'object'){
            $this = $(id);
        }

        if($this.attr('data-action') != 'autoSeperator'){
            $this.val(val);
            $this.closest('.kb-form').removeClass('not-ready').addClass('is-active');
        }else{
            $this.val(val);
            $this.closest('.kb-form').removeClass('not-ready').addClass('is-active');
            gfn_formText.calculate($this.closest('.kb-form'));
        }
    },
    clear: function(id){
        var $this;
        if(typeof(id) == 'string'){
            $this = $('#'+id);
        }else if(typeof(id) == 'object'){
            $this = $(id);
        }
        $this.val('');
        $this.closest('.kb-form').removeClass('is-active').addClass('not-ready');
    }
};

$('.form-text')
.each(function(){
    var $input = $(this).find('input');
    var $thisForm = $(this).parent('.kb-form');

    //disabled
    if($thisForm.hasClass('is-disabled') || $thisForm.hasClass('is-readonly')) $input.prop('readonly',true).siblings('button:not(.btn-data-clear)').prop('disabled',true);

    //init (단위가 있으면 : 단위 삽입 & input 넓이 확인용 span 삽입)
    if($input.data('unit') != '' && $input.data('unit') != undefined ){
        //console.log($input.data('unit') != '' , $input.data('unit') != undefined )
        $('<span class="unit">' + $input.data('unit') + '</span>').insertAfter($input);
        $(this).append('<span class="measurement"/>'); //input 넓이 확인용
        //console.log('순서 확인')
        $('.unit').on('click',function(){
            $(this).siblings('input').focus();
        });
    }
    if($input.attr('inputmode') == 'numeric') $input.siblings('.btn-data-clear').remove();

    //value가 있는지 확인
    gfn_formText.fill($(this));

    //계산
    gfn_formText.calculate($(this));
})
.on('focus','input',function(){
    var $thisForm = $(this).parents('.kb-form');
    var $thisFormSelect = $(this).parents('.kb-form_inner');

    if(!$thisForm.hasClass('is-disabled') && !$thisForm.hasClass('is-readonly')){
        $('.kb-form').removeClass('is-active').find('.kb-form_inner').removeClass('is-focused');

        if($(this).data('call-layered') != '' && $(this).data('call-layered') != undefined){
            gfn_layered.open($(this).data('call-layered'));
        }else{
            $thisForm.addClass('is-active').find('.kb-form_inner').addClass('is-focused');
        }
    }
    //Multi form
    $thisFormSelect.siblings('.kb-form_inner').removeClass('is-focused');
})
.on('click','.btn-data-clear',function(e){
    e.stopPropagation();
    var $thisForm = $(this).parents('.kb-form');
    var $thisFormText = $(this).parent('.form-text');
    gfn_formText.empty($thisFormText);
    gfn_formText.calculate($thisFormText);
    $thisForm.addClass('is-active').find('.kb-form_inner').addClass('is-focused');
})
.on('keyup','input',function(){
    var $this = $(this).parent('.form-text');
    gfn_formText.fill($this);
    gfn_formText.calculate($this);
});

//form select
var gfn_bsSelect = {
    bind: function(){
        $bsSelect.find('.bottom-sheet_select').on('click','button',function(e){
            e.stopPropagation();
            var idx = $(this).parent('li').index();
            var $activeForm = $('.kb-form.is-active');
            var $activeFormSelect = $activeForm.find('.form-select');
            $(this).parent('li').addClass('is-active').siblings('li').removeClass('is-active');

            //활성화된 select
            $activeFormSelect.find('option').eq(idx + 1).prop('selected',true);
            $activeFormSelect.find('.selected-option').text($activeFormSelect.find('option:selected').text());
            $activeFormSelect.parent('.kb-form').removeClass('is-active not-ready').find('.kb-form_inner').removeClass('is-focused');
            gfn_layered.close('bsSelect');
            gfn_bsSelect.unbind();
            $activeFormSelect.find('select').trigger('change');
        });
    },
    unbind: function(){
        $bsSelect.find('.bottom-sheet_select').off('click','button');
    }
};

var gfn_formSelect = {
    open: function($target){
        var $thisForm = $target.parent('.kb-form');
        var $thisFormSelect = $target;
        if(!$thisForm.hasClass('is-disabled')){
            $thisForm.addClass('is-active');
            $thisFormSelect.addClass('is-focused');
            var dataLayerName = $thisFormSelect.children('button').data('call-layered');

            if(dataLayerName != '' && dataLayerName != undefined){
                //gfn_layered.open(dataLayerName);
            }else if($bsSelect.length){
                //make select option
                $bsSelect.find('.bottom-sheet_header').children('.tit').text($target.find('select').attr('title'));
                $bsSelect.find('.bottom-sheet_contents').empty().append('<ul class="bottom-sheet_select"/>');

                var $options = $target.find('select').find('option');
                $options.each(function(idx) {
                    var selectedClass = $(this).is(":selected") ? "is-selected" : "";
                    if(idx != 0)
                    $bsSelect.find('.bottom-sheet_select').append('<li class="'+selectedClass+'"><button type="button">'+$(this).text()+'</button></li>');
                });

                //call bottom sheet
                gfn_layered.open('bsSelect');
                gfn_bsSelect.bind();
            }
        }
    },
    // form-select 의 선택 옵션 바꾸는 메소드
    select: function(id, idx) {
        var $select = $('#'+id);
        var $options = $select.find('option');
        var $thisForm = $select.parents('.kb-form');
        var $selectedOption = $thisForm.find('.selected-option');
        $options.eq(idx).prop('selected', true);
        $selectedOption.text($options.eq(idx).text());
        $select.trigger('change');
    }
};

//이메일폼
if($('.kb-form_email').length){
    $('.kb-form_email')
    .on('change','select',function(){
        if($(this).val() != 'writingemail'){
            $('.kb-form_email').find('.add-email-input').hide();
            //$('.kb-form_email').find('.add-email-input').addClass('is-disabled').find('input').prop('disabled',true)
        }else{
            $('.kb-form_email').find('.add-email-input').show();
            //$('.kb-form_email').find('.add-email-input').removeClass('is-disabled').find('input').prop('disabled',false)
        }
    })
    .on('change','input[type=checkbox]',function(){
        var $thisEmailForm = $(this).parents('.kb-form_email');
        if($(this).prop('checked')){
            $thisEmailForm.find('.kb-form').addClass('is-disabled').find('input').prop('disabled',true);
        }else{
            $thisEmailForm.find('.kb-form').removeClass('is-disabled').find('input').prop('disabled',false);
        }
    });
    $('.kb-form_email').each(function(){
        $(this).find('select').trigger('change');
    });
}

$('.select-list').on('click','button',function(){
    var $selectList = $(this).parents('.select-list');
    if(!$selectList.hasClass('is-disabled')){
        if($selectList.data('selection') != 'multiple'){
            $(this).parent('li').addClass('is-active').siblings('li').removeClass('is-active');
        }else{
            $(this).parent('li').toggleClass('is-active');
        }
    }
});

$('[data-action=text]').on('click',function(){
    var txt = $(this).text();
    var layeredName = $(this).closest('.popup').length ? $(this).closest('.popup').data('layered-name') : $(this).closest('.bottom-sheet').data('layered-name');
    gfn_layered.close(layeredName);
    $('.kb-form.is-active').find('input').val(txt);
    $('[data-call-layered=' + layeredName + ']').closest('.kb-form').removeClass('is-active');
});

//바텀시트에서 셀렉트 값 넣기
$('.bottom-sheet').on('click','[data-action=select]',function(){
    var thisBSName = $(this).closest('.bottom-sheet').data('layered-name');
    var value = $(this).data('value');
    var $activeForm = $('.kb-form.is-active');
    $activeForm.removeClass('not-ready').find('select option[value=' + value + ']').prop('selected',true);
    var txt = $activeForm.find('option:selected').text();
    $activeForm.find('.selected-option').text(txt);
    gfn_layered.close(thisBSName);
});

//Layer layout(버튼이 있는 경우, 없는 경우 여백 다름)
if($('.popup').length){
    $('.popup').each(function(){
        if($(this).find('.popup_buttons').length) $(this).addClass('with-button');//버튼이 있는 경우 하단 여백이 큼
    });
}
if($('.bottom-sheet').length){
    $('.bottom-sheet').each(function(){
        if($(this).find('.bottom-sheet_buttons').length) $(this).addClass('with-button');//버튼이 있는 경우 하단 여백이 큼
    });

    //바텀시트 내용이 많을 경우 스크롤했을때 확장 (제거)
    // $('.bottom-sheet_contents').on('scroll',function(){
    //     var thisH = $(this).outerHeight();
    //     var childrenH = 0;
    //     $(this).children().each(function(i){
    //         childrenH += $(this).outerHeight();
    //     });
    //     if(childrenH >= thisH * 2) $(this).parents('.bottom-sheet.is-active').addClass('is-expanded');
    // });
}

//datepicker 입력
$('body').on('keyup','.datepicker input, .period-selector input, .date-time-selector input:first-child',function(){
    var val = $(this).val();
    var date = gfn_dateFormatter(val);
    $(this).val(date);
})
.on('click','.btn-datepicker',function(e){
    e.preventDefault();
    if(!$(this).closest('.is-disabled').length) gfn_layered.open('bsCalendar');
});

//날짜 선택
$('.datepicker').each(function(){
    if($(this).hasClass('is-disabled')){
        $(this).find('input').prop('readonly',true);
    }else{
        $(this).find('input').prop('readonly',false);
    }
    $(this).find('input').attr('inputmode','numeric');
    $(this).find('input').after('<button class="btn-data-clear"><i class="icon-data-clear_24">지우기</i></button><button class="btn-datepicker"><span>날짜선택</span></button>');
});

//기간 선택
$('.period-selector').each(function(){
    if($(this).hasClass('is-disabled')){
        $(this).find('input').prop('readonly',true);
    }else{
        $(this).find('input').prop('readonly',false);
    }
    $(this).find('input').attr('inputmode','numeric');
    $(this).find('input').after('<button class="btn-datepicker"><span>날짜선택</span></button>');
});

//날짜 시간 선택
$('.date-time-selector')
.on('focus','input',function(){
    if(!$(this).parent('.date-time-selector').hasClass('is-disabled')){
        //$(this).index() != 0 ? gfn_layered.open('bsTime') : gfn_layered.open('bsCalendar');
        if($(this).is(':last-child')) gfn_layered.open('bsTime');
    }
})
.each(function(){
    $(this).find('input:first-child').attr('inputmode','numeric');
    $(this).find('input:first-child').after('<button class="btn-datepicker"><span>날짜선택</span></button>');
    if($(this).hasClass('is-disabled')){
        $(this).find('input').prop('readonly',true);
    }else{
        $(this).find('input:first-child').prop('readonly',false);   //날짜
        $(this).find('input:last-child').prop('readonly',true);     //시간
    }
});

if($('.form-select').length){
    //select bs가 없는 경우 써주기
    if($('.bottom-sheet[data-layered-name=bsSelect]').length == 0){
        var $bsSelectHtml = '<div class="bottom-sheet" data-layered-name="bsSelect">';
            $bsSelectHtml += '<div class="bottom-sheet_header">';
            $bsSelectHtml += '<span class="tit"></span>';
            $bsSelectHtml += '</div>';
            $bsSelectHtml += '<div class="bottom-sheet_contents"></div>';
            $bsSelectHtml += '<button class="btn-close" data-action="close"><span>닫기</span></button>';
            $bsSelectHtml += '</div>';
        $('.layered').append($bsSelectHtml);
    }
    var $bsSelect = $('.bottom-sheet[data-layered-name=bsSelect]');

    $('.form-select')
    .each(function(){
        var $thisFormSelect = $(this);
        var $thisForm = $thisFormSelect.parent('.kb-form');
        $thisFormSelect.find('option:selected').index() != 0 ? $thisForm.removeClass('not-ready') : $thisForm.addClass('not-ready');
        $thisFormSelect.find('.selected-option').text($(this).find('option:selected').text());
    })
    .on('click','button',function(e){
        //e.stopPropagation();
        if($(this).data('layered-name') == undefined || $(this).data('layered-name') == ''){

            var $thisForm = $(this).parents('.kb-form');
            var $thisFormSelect = $(this).parent('.form-select');

            $('.kb-form').not($thisForm).removeClass('is-active').find('.kb-form_inner').removeClass('is-focused');
            if(!$thisFormSelect.hasClass('is-disabled')) gfn_formSelect.open($thisFormSelect);

            //Multi form
            $thisFormSelect.siblings('.kb-form_inner').removeClass('is-focused');

        }
    });
}
$('.kb-form')
.on('click','label',function(){
    var $thisFormSelect = $(this).siblings('.form-select');
    if($thisFormSelect.length) $thisFormSelect.find('.selected-option').trigger('click');
});

//form 공통 (상대적 비활성화, body 클릭시 비활성화)
$body.on('click',function(e){
    if($('.kb-form').hasClass('is-active') && !$('.kb-form').has(e.target).length){
        $('.kb-form').removeClass('is-active').find('.kb-form_inner').removeClass('is-focused');
    }
});

if($('.textarea').length){
    $('.textarea').each(function(){
        var $textarea = $(this);
        if($textarea.hasClass('is-disabled')) $textarea.find('textarea').prop('disabled',true);
    });
    $('.textarea')
    .on('keyup','textarea',function(){
        var $textarea = $(this).parent('.textarea');
        var max = $textarea.find('.total').text();
        max = max.replace(/,/g, "");
        gfn_fnChkByte($(this), max);
    })
    .on('focus','textarea',function(){
        if(!$(this).prop('disabled') && !$(this).prop('readonly')){
            $(this).parent('.textarea').addClass('is-focused');
        }
    })
    .on('focusout','textarea',function(){
        $(this).parent('.textarea').removeClass('is-focused');
    });
}

$('input[type=checkbox], input[type=radio]').on('change',function(){
    // 전체 동의에서 오류 발생 해결을 위해 추가....
    if ($(this).parents(".agreement-to-terms.expansion-mode").length) return;

    var tf = $(this).prop('checked');
    var name = $(this).next('label').data('call-layered');
    if(tf && name) gfn_layered.open(name);
});



//TAB
/*
var $tab = $('.tab');
var tab = function(){
    var tabSwiper = new Swiper('.tab',{
        slidesPerView: 'auto',
        spaceBetween: 32,
        watchOverflow: true,
        on: {
            init : function(){

            },
            click : function(swiper, event){
                swiper.slideTo(swiper.clickedIndex)
            },
        }
    });
    $('.tab').on('click','a',function(){
        var idx = $(this).parent('li').index();
        var $tabCont = $(this).parents('.tab').next('.tab_contents');
        $(this).parent('li').addClass('is-active').siblings('li').removeClass('is-active');
        if($tabCont.length) {
            $tabCont.children('div').eq(idx).addClass('is-active').siblings('div').removeClass('is-active');
            return false;
        }
    });
};
if($tab.length) tab();
*/

$('.tab.swiper-container').each(function(idx) {
    var $tab = $(this);
    var $tabLinks = $tab.find("a, button");
    var $tabContents = $tab.next('.tab_contents').find('> div');
    var isContentsTab = $tab.next('.tab_contents');
    var isContentsSwiper = $tab.parent().hasClass('tab-swiper-wrap');

    if(!$tab.hasClass('app-sub') && !$tab.hasClass('app-gnb')){

        $tab.addClass('tab-'+idx);
        $tab.data('swiper',new Swiper('.tab.tab-'+idx,{
            slidesPerView: 'auto',
            //spaceBetween: space,
            watchOverflow: true,
            on: {
                init : function(swiper){
                    var index = $('.tab.tab-'+idx).find('.is-active').index();
                    swiper.slideTo(index);
                },
                click : function(swiper, event){
                    swiper.slideTo(swiper.clickedIndex);
                },
            }
        }));
        $tabLinks.on('click', function() {
            var $link = $(this);
            var idx = $link.parent('li').index();
            if (isContentsTab) {
                $tabLinks.parent('li').removeClass('is-active');
                $tabLinks.eq(idx).parent('li').addClass('is-active');
                $tabContents.removeClass('is-active');
                $tabContents.eq(idx).addClass('is-active');
                if ($tabContents.eq(idx).data('swiper')) {
                    $tabContents.eq(idx).data('swiper').update();
                }
                //return false;
            }
        });
        if (isContentsSwiper) {
            $tabContents.each(function(i) {
                var $content = $(this);
                $content.find('.swiper-container').each(function(){
                    var swiperClass = 'swiper-container-'+idx+'-'+i;
                    $(this).addClass(swiperClass);
                    var options = {};
                    if ($(this).find(".swiper-pagination").length) {
                        options.pagination = {};
                        options.pagination.el = ".swiper-pagination";
                        if ($(this).find(".swiper-pagination").data("type") !== undefined) {
                            options.pagination.type = $(this).find(".swiper-pagination").data("type");
                        }
                    }
                    $content.data('swiper', new Swiper('.'+swiperClass, options));
                });
            });
        }
    }
});

//Slider
if($('.js-slider').length){
    $('.js-slider').each(function(i){
        var theme = $(this).data('theme');
        var $graph = $(this).find('.graph-area');
        var $handle = $(this).find('.handle');
        var dft = $(this).find('.graph-area').data('default');
        var min = gfn_removeComma3Digit($(this).find('.start-txt').text());
        var max = gfn_removeComma3Digit($(this).find('.end-txt').text());
        var defaultNum = gfn_comma3Digit((max - min) * dft * 0.01);
        // console.log(min, max, defaultNum);
        $graph.slider({
            value: dft,
            orientation: "horizontal",
            range: "min",
            animate: true,
            create: function(event, ui) {
                $handle.find('.value').text(defaultNum);
            },
            slide: function( event, ui ) {
                var val = gfn_comma3Digit((max - min) * ui.value * 0.01);
                $handle.find('.value').text( val );
                if(ui.value >= 80){
                    $(this).removeClass('left').addClass('right');
                }else if(ui.value <= 20){
                    $(this).removeClass('right').addClass('left');
                }else{
                    $(this).removeClass('right left');
                }
            }
          });

    });
}

//accordian
if($('.accordian').length){
    $('.accordian')
    .on('click','button',function(e){
        e.stopPropagation();
        var $dt = $(this).parent('dt');
        if(!$dt.hasClass('is-active')){
            $dt.addClass('is-active').siblings('dt').removeClass('is-active');
        }else{
            $dt.removeClass('is-active');
        }
    })
    .on('click','a[href]',function(e){
        if($(this).attr('href').indexOf('#') >= 0 || $(this).attr('href') != '') e.stopPropagation();
    })
    .on('click','dt',function(e){
        e.stopPropagation();
        $(this).find('button').trigger('click');
        if(e.target.nodeName.lowerCase == 'label') return;
    });
}

//btn-more-view
$('body').on('click','.more-view-box .btn-more-view',function(){
    $(this).closest('.more-view-box').toggleClass('is-show');
})



//폼 수정 및 추가
if($('.add-form-box').length){
    $('.edit-user')
    .on('click', function(e){
        e.stopPropagation();
        var chkStatus = $(this).hasClass('is-edit');
        if(chkStatus){
            return;
        }
    })
    .on('click', 'button', function(){
        var $this = $(this);
        var $editBox = $this.parents('.edit-user');
        var resetVal = $editBox.find('input[type="text"]').attr('name');
        var valChk = $editBox.find('input[type="text"]').val();
        var $edit = $this.hasClass('btn-edit-form');
        var $save = $this.hasClass('btn-save-form');
        var $cancel = $this.hasClass('btn-edit-cancel');
        //btn-edit-form
        if($edit){
            $editBox.addClass('is-edit').attr('data-status', 'edit');
            $editBox.find('input[type="text"]').val('').removeAttr('readonly');
        }
        //btn-save-form
        if($save){
            $editBox.removeClass('is-edit').attr('data-status', 'normal');
            $editBox.find('input[type="text"]').attr('readonly');
            if(valChk == ''){
                $editBox.find('input[type="text"]').val(resetVal);
            }
        }
        //btn-edit-cancel
        if($cancel){
            $editBox.removeClass('is-edit').attr('data-status', 'normal');
            $editBox.find('input[type="text"]').val(resetVal).attr('readonly');
        }
    });
    $('.btn-add-form').on('click', function(){
        //btn-add-form
        var $this = $(this);
        var formVal = $this.data('form-name');
        var $target = $this.closest('.add-form-box').find('.add-form-target[data-form-name="'+ formVal +'"]');
        var $addItem = $this.closest('.kb-sec').find('.template.add-form-item[data-form-name="'+ formVal +'"] > .kb-form');
        var isCount = $this.data('add-count') == 'once';
        var isLength =  $this.closest('.add-form-target').find('.kb-form[data-form-name="'+ formVal +'"]').length;
        $('.btn-edit-delete').on('click', function(){
            $(this).closest('.add-category').remove();
            $(this).closest('.add-sub-category').remove();
        });
        if(isCount && isLength){
            return false;
        }else{
            $addItem.clone().appendTo($target);
        }
    });
}

// 알려드립니다 (토글)
if($('.toggle-notice').length){
    $(".toggle-notice").each(function(){
        var $this = $(this);
        var $button = $this.find('.header button');
        var $list = $this.find('.notice-list');
        $button.on('click', function() {
            if ($this.hasClass('is-closed')) {
                $this.removeClass('is-closed');
                $list.slideDown(300);
            } else {
                $this.addClass('is-closed');
                $list.slideUp(300);
            }
        });
    });
}

//체크박스 하위 선택
$('.js-checkbox-selector').on('change','input:checkbox',function(){
    var tf = $(this).prop('checked');

    if($(this).closest('dt').length){   //상단 전체 선택
        if(tf){
            $(this).closest('dt').next('dd').find('input:checkbox').prop('checked',true);
        }else{
            $(this).closest('dt').next('dd').find('input:checkbox').prop('checked',false);
        }
    }else{  //하단 개별 선택
        if(tf){
            if($(this).closest('dd').find('input:checkbox').not(':checked').length == 0){
                $(this).closest('dd').prev('dt').find('input:checkbox').prop('checked',true);
            }
        }else{
            $(this).closest('dd').prev('dt').find('input:checkbox').prop('checked',false);
        }
    }
    // btn-switch 분리되어있을 때
    if($(this).closest('.list-controls').length){
        var targetName = $(this).closest('.js-checkbox-selector').data('target');
        if(tf){
            $(this).closest('section').find('dl[data-target="' + targetName + '"]').find('input:checkbox').prop('checked',true);
        }else{
            $(this).closest('section').find('dl[data-target="' + targetName + '"]').find('input:checkbox').prop('checked',false);
        }
    }
});

$('.js-checkbox-selector-trigger').on('change','input:checkbox',function(){
    var targetName = $(this).closest('.js-checkbox-selector-trigger').data('target');
    var tf = $(this).prop('checked');
    var $target = $('.js-checkbox-selector[data-target=' + targetName + ']');
    if(!tf){
        $target.find('input:checkbox').prop({'checked':false, 'disabled': true});
    }else{
        $target.find('input:checkbox').prop({'checked':false, 'disabled': false});
    }
    // console.log(targetName);
});

// 목록 더보기 토글
if($('[data-action=moreViewList]').length) {
    $('[data-action=moreViewList]').each(function(){
        var $this = $(this);
        var $button = $this.find('[data-moreview=toggle]');
        var $list = $this.find('[data-moreview=list]');
        var showClass = "is-moreview-show";
        $button.on('click', function() {
            if ($this.hasClass(showClass)) {
                $this.removeClass(showClass);
            } else {
                $this.addClass(showClass);
            }
        });
    });
}

// 전체동의
if($('.agreement-to-terms').length) {
    $('.agreement-to-terms').each(function(){
        var $this = $(this);
        var $allCheck = $this.find('.header input[type=checkbox]');
        var $checkboxs = $this.find('.checkbox-group input[type=checkbox]');
        var $childCheckboxs = $this.find('.agreement-service-choice input[type=checkbox]'); //하위 서비스
        var isExpansionMode = $this.hasClass("expansion-mode");

        $allCheck.on('click', allCheckCange);
        $checkboxs.on('change', function() {
            var isAllCheck = true;
            $checkboxs.each(function(){
                if(!$(this).closest('.agreement-service-choice').length){ //하위 서비스 제외
                    if ($(this).prop('checked') === false) {
                        isAllCheck = false;
                    }
                }
            });
            $allCheck.prop('checked', isAllCheck);
            $allCheck.trigger('change');
        });

        function allCheckCange() {
            if ($allCheck.is(':checked')) {
                $checkboxs.prop('checked', true);
                if($childCheckboxs.length) $childCheckboxs.prop({'checked': true, 'disabled': false});
            } else {
                $checkboxs.prop('checked', false);
                if($childCheckboxs.length) $childCheckboxs.prop({'checked': false, 'disabled' : false});
            }
        }

        $this.find("[data-call-layered]").on("click", function(e) {
            var $this = $(this);
            var id = $this.siblings('input[type=checkbox]').prop('id');
            var $checkbox = $("#"+id);
            var isAllCheckbox = $checkbox.parent().parent().hasClass("header");
            var layered = $this.data('call-layered');
            var $layered = $("[data-layered-name="+layered+"]");

            $layered.find("[data-confirm=true]").off("click").on("click", function() {
                $checkbox.prop("checked", true);
                $checkbox.trigger('change');
                if (isAllCheckbox) {
                    allCheckCange();
                }
            });

            if ($this.prop('tagName') === "LABEL" && !$checkbox.is(":checked")) {
                gfn_layered.open($(this).data("call-layered"));
                e.preventDefault();
            }
        });

        if (isExpansionMode) {
            $this.find("label").on("click", function(e) {
                var $checkbox = $("#"+$(this).prop("for"));
                var $buttonLink = $(this).siblings("button.link");

                if (!$checkbox.is(":checked")) {
                    if ($buttonLink.length > 0) {
                        $buttonLink.trigger("click");
                        e.preventDefault();
                    } else if ($(this).parent().parent().hasClass("header") && $(this).data("call-layered")) {
                        gfn_layered.open($(this).data("call-layered"));
                        e.preventDefault();
                    }
                }
            });
        }
    });
}

//Tooltip
if($('.btn-question').length){
    $('.btn-question').on('click',function(){
        $(this).next('.tooltip').fadeIn(200);
    });
}
if($('.tooltip').length){
    $('.tooltip').on('click','.btn-close',function(){
        $(this).parent('.tooltip').fadeOut(200);
    });
}

// 폰트 로딩 시간 차이로 인하여 계산이 잘못 되어 겹치는 경우 방지를 위해 추가
$(window).on('load', function(){
    $('.form-text').each(function(){
        gfn_formText.calculate($(this));
    });
});

// 내 차로 만드는 금융전략 스크립트
function wishCarStrategyInit() {
    var $section = $(".wishcar-strategy").eq(0);
    if ($section.length === 0) return;

    var $strategyProgressBar = $section.find(".strategy-progress-bar");
    // var $carMovingZone = $section.find(".car-moving-zone");
    // var $progressBarZone = $section.find(".progress-bar-zone");
    var $barMyCar = $section.find(".bar-mycar");
    var $barMyAsset = $section.find(".bar-myasset");
    var $checkboxs = $section.find("input[type=checkbox]");
    var $checkboxCar = $section.find("#toggleMyCar");
    var $checkboxAsset = $section.find("#toggleMyAsset");
    var $need = $section.find(".need");
    var $notEnough =  $section.parents(".app-content").find(".not.enough");
    var $enough = $section.parents(".app-content").find(".enough").not(".not");
    var $car = $section.find(".car-moving-zone .car");

    var price = parseInt($strategyProgressBar.data("price"));   // Wish car 시세
    var car = parseInt($strategyProgressBar.data("car"));     // My Car 자산
    var asset = parseInt($strategyProgressBar.data("asset"));   // My 금융 자산
    var car_isChecked = false;
    var asset_isChecked = false;

    if (!price) return;   // 시세가 지정되어 있지 않으면

    var need = price;
    var per = {
        car: car / price * 100,
        asset: asset / price * 100
    };

    $checkboxs.on('change', assetChange);
    setBind();
    setMessage();
    assetChange();

    function assetChange() {
        car_isChecked = $checkboxCar.is(":checked");
        asset_isChecked = $checkboxAsset.is(":checked");
        barChange();
        need = price;
        if (car_isChecked) { need -= car; }
        if (asset_isChecked) { need -= asset; }
        setMessage();
    }

    function barChange() {
        var v = 0;
        var add = 0;
        if (car_isChecked) {
            v = (per.car > 100) ? 100 : per.car;
            $barMyCar.css("width", v + "%");
            add = v;
        } else {
            $barMyCar.css("width", "0%");
        }

        if (asset_isChecked) {
            v = ((per.asset + add) > 100) ? 100 : (per.asset + add);
            $barMyAsset.css("width", v + "%");
        } else {
            $barMyAsset.css("width", "0%");
        }

        $car.css("left", v+"%");
        $car.css("transform", "scale("+(0.7 + (0.3 * v / 100))+")");
    }

    function setMessage() {
        if (need > 0) {
            $notEnough.show();
            $enough.hide();
        } else {
            $notEnough.hide();
            $enough.show();
        }
        $need.text(need.toLocaleString() + "만원");
        $strategyProgressBar.data("need", need);
    }

    function setBind() {
        $section.find(".num.price").text(price.toLocaleString());
        $section.find(".num.car").text(car.toLocaleString());
        $section.find(".num.asset").text(asset.toLocaleString());
    }
}
$(window).on("load.wishcar", wishCarStrategyInit);

// 저축을 한다면?
function ifYouSaveInit() {
    var $section = $(".if-you-save");
    if ($section.length === 0) return;

    var $monthIncome = $section.find("input#myMonthlyIncome");
    var $saveRadios = $section.find("input[name=saveRadio]");

    var $resultCaseA = $section.find(".result-case.case-a");
    var $resultCaseB = $section.find(".result-case.case-b");
    var $resultCaseC = $section.find(".result-case.case-c");
    var $resultCaseD = $section.find(".result-case.case-d");

    function updateResult() {
        if ($monthIncome.val() == 0) {      // 월 수입금액 0원
            changeResult("D");
        } else if (getRadioValue() == 0) {  // 저축비율이 0%
            changeResult("C");
        } else {
            var need = getNeedValue();
            var totalMonths = Math.ceil(need / ($monthIncome.val().replace(",","") * (getRadioValue() / 100)));
            var y = Math.floor(totalMonths / 12);
            var m = totalMonths % 12;
            if (y >= 30) {      // 30년 이상
                changeResult("B");
            } else {
                if (y == 0) {
                    $resultCaseA.find(".y").hide();
                } else {
                    $resultCaseA.find(".y").show().find(".num").text(y);
                }
                if (m == 0) {
                    $resultCaseA.find(".m").hide();
                } else {
                    $resultCaseA.find(".m").show().find(".num").text(m);
                }
                changeResult("A");
            }
        }
    }

    function getRadioValue() {
        return parseInt($("input[name=saveRadio]:checked").val());
    }

    function getNeedValue() {
        return $(".strategy-progress-bar").data("need");
    }

    function changeResult(c) {
        $resultCaseA.hide();
        $resultCaseB.hide();
        $resultCaseC.hide();
        $resultCaseD.hide();
        if (c === "A") {
            $resultCaseA.show();
        } else if (c === "B") {
            $resultCaseB.show();
        } else if (c === "C") {
            $resultCaseC.show();
        } else if (c === "D") {
            $resultCaseD.show();
        }
    }

    $monthIncome.on("keyup.savefunc", updateResult);
    $saveRadios.on("click.savefunc", updateResult);

    updateResult();
}

// Form text 에 data-default 가 지정 되어 있을 경우
$(".kb-form .form-text input[data-default]").each(function(){
    var $input = $(this);
    var $kbForm = $input.parents(".kb-form");
    if ($input.val() == '') {
        $input.val($input.data('default'));
        $kbForm.removeClass("not-ready");
    }
    $input.on("keyup", function(){
        if ($input.data("default") != undefined && $input.val() == "") {
            $input.val($input.data("default"));
        }
    });
    $input.parents(".form-text").find(".btn-data-clear").on("click", function(e){
        $input.val($input.data("default"));
        gfn_formText.calculate($input.parents(".form-text"));
        $input.trigger("keyup.savefunc");
        e.stopPropagation();
    });
});




//DATEPICKER
$.datepicker.parseDate = function(format, value) {
    return moment(value, format).toDate();
};
$.datepicker.formatDate = function (format, value) {
    return moment(value).format(format);
};

$('#datepicker').datepicker({
    dateFormat: "yyyy.MM.DD",
    regional: 'ko',
    beforeShow: function(){
        var date = $('#datepicker').datepicker('getDate');
        calendarDateSet(date);
    }
});

var date = $('#datepicker').datepicker('getDate');
calendarDateSet(date);

var now = moment();
var today = now.format('yyyy.MM.DD');
$('.calendar-nav').on('click','button',function(){
    var cls = $(this).attr('class');
    if(cls == 'btn-text'){
        $('#datepicker').datepicker('setDate', today);
    }else if(cls == 'btn-prev'){
        now = now.subtract(1, 'M');
    }else if(cls == 'btn-next'){
        now = now.add(1, 'M');
    }else if(cls == 'btn-first'){
        now = now.subtract(1, 'Y');
    }else if(cls == 'btn-last'){
        now = now.add(1, 'Y');
    }
    $('#datepicker').datepicker('setDate', now.format("yyyy.MM.DD"));
    var changedDate = $('#datepicker').datepicker('getDate');
    calendarDateSet(changedDate);

});

function calendarDateSet(date){
    $('.calendar-nav').find('strong').text($.datepicker.formatDate("yyyy", date) + '년 ' + $.datepicker.formatDate("MM", date) + '월');
    //console.log($.datepicker.formatDate("yyyy", date) + '년 ' + $.datepicker.formatDate("MM", date) + '월')
}

//DATEPICKER [e]

//button 형 세그먼트
$('body').on('click','.btn-segmented button, .btn-segmented a',function(){
    var tagName = this.tagName.toLowerCase();
    if(tagName == 'a'){
        if(!$(this).hasClass('is-disabled')){
            $(this).addClass('is-selected').parent('li').siblings('li').find('a').removeClass('is-selected');
        }
    }else if(tagName == 'button'){
        if(!$(this).prop('disabled')){
            $(this).addClass('is-selected').parent('li').siblings('li').find('button').removeClass('is-selected');
        }
    }
});

//권유 직원 검색
var $recommendEmployees = $('.recommend-employees');
if($recommendEmployees.length){
    $recommendEmployees.find('.btn-segmented').on('click','button',function(){
        var idx = $(this).parent('li').index();
        $(this).addClass('is-selected').parent('li').siblings('li').find('button').removeClass('is-selected');
        var $recommendEmployeesFrom = $recommendEmployees.find('.recommend-employees-form');
        $recommendEmployeesFrom.children('.kb-form').hide();
        if(idx == 3){
            $recommendEmployeesFrom.find('p').hide();
        }else{
            $recommendEmployeesFrom.find('p').show();
            if(idx == 2){
                $recommendEmployeesFrom.children('.kb-form:eq(3)').show();
            }else if(idx == 1){
                $recommendEmployeesFrom.children('.kb-form:eq(2)').show();
            }else if(idx == 0){
                $recommendEmployeesFrom.children('.kb-form:eq(1)').show();
                $recommendEmployeesFrom.children('.kb-form:eq(0)').show();
            }
        }
    });
}


// swiper
$(".js-swiper").each(function() {
    var $this = $(this);
    if ($this.data('init-call')) {
        window[$this.data('init-call')] = function() {
            jsSwiperInit($this);
        }
    } else {
        jsSwiperInit($this);
    }
});

function jsSwiperInit($elem) {
    var id = new Date().getTime();
    var $jsSwiper = $elem;
    var options = $jsSwiper.data('swiper-options');
    if (typeof options === "string") {
        options = window[options];
    }
    $jsSwiper.addClass("js-swiper-"+id);
    $jsSwiper.data('swiper', new Swiper('.js-swiper-'+id, options));
}



// SVG Gauge Functions
function drawInsuranceGauge(selector, current) {
    var status = $(selector).parents(".report-circle").data("status");
    var colors = {
        "good": "#4dabff",
        "caution": "#ffd338",
        "short": "#d672f6"
    }
    setGauge(selector, current, 100, colors[status]);
}

function drawCreditGauge(selector, current, max) {
    setGauge(selector, current, max, "#ffd338");
}

function drawDdayGauge(selector, current, max) {
    setGauge(selector, current, max, "#f7956c");
}

function setGauge(selector, current, max, strokeColor) {
    var current = current || 0;
    var max = max || 100;
    var strokeColor = strokeColor || "#ff0000";
    var barFg = document.querySelector(selector + " .bar-fg");
    var path = document.querySelector(barFg.getAttribute("xlink:href"));
    var barFgLength = path.getTotalLength();
    var percent = current / max;
    var startPer = 0;
    var ttl = 60;
    var tick = 0;

    if (percent >= 1) percent = 1;
    barFg.style.strokeDasharray = barFgLength;
    barFg.style.stroke = strokeColor;

    var changePer = percent - startPer;

    function draw() {
        var progress = easeOutQuad(tick / ttl);
        var per = (changePer * progress);
        var gpal = (startPer + per) * barFgLength;

        barFg.style.strokeDashoffset = barFgLength * (1 - startPer - per);

        if (tick < ttl) {
            tick++;
            requestAnimationFrame(draw);
        } else {
            startPer = percent;
        }
    }
    function easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }
    draw();
}

// 캐릭터 그래프 사이즈 처리
if($('.character-graph').length > 0){
    $('.character-graph').each(function(){
        var $this = $(this);
        var $span = $this.find(".graph-area > span[data-goal]");
        var dataGoal = $span.data("goal");
        var $spanSub = $this.find(".graph-area.sub > span[data-goal]");
        var dataGoalSub = $spanSub.data("goal");

        if (dataGoal !== undefined) {
            $span.css("width", dataGoal + "%");
        }

        //비교군 있을 시
        if (dataGoalSub !== undefined) {
            $spanSub.css("width", dataGoalSub + "%");
        }

        // 캐릭터 그래프 최소사이즈
        var item = $this.find(".graph-area > span > i");
        var itemBar = item.parent();

        if(itemBar.width() - 8 < item.width()){
            itemBar.addClass('min-size');
        }else{
            itemBar.removeClass('min-size');
        }
    });
}

// 대시보다 상단 알림 메시지 animate
// function dashboardAlarmMessage() {
//     var msgWidth = $('.dashboard .link-bell .message > span').width();
//     $('.dashboard .link-bell .message').delay(500).animate({
//         'width': msgWidth
//     }, 1000, function() {
//         setTimeout(function() {
//             $('.dashboard .link-bell .message').animate({
//                 'width': 0
//             }, 1000);
//         }, 2000);
//     });
// }
// if($('.dashboard .link-bell').length > 0){
//     $(window).on('load.ui', dashboardAlarmMessage);
// }

//percentage-graph.type2 current-txt 위치값 제어
function currentTxtPosition(obj){
    var $obj = $(obj);
    $obj.each(function(){
        var graphWidth = parseInt($(this).find('.graph-area').css('width'));
        var targetWidth = parseInt($(this).find('.graph-area > span').css('width'));
        var currentWidth = parseInt($(this).find('.current-txt').css('width'))/2;
        var currentGap = graphWidth - targetWidth;
        if(targetWidth < currentWidth){
            $(this).find('.current-txt').css('margin-left','0');
        }else if(currentGap < currentWidth){
            $(this).find('.current-txt').css('margin-left','-'+currentWidth*2+"px");
        }else{
            $(this).find('.current-txt').css('margin-left','-'+currentWidth+"px");
        }
    })
}

//Cookie
var setCookie = function(name, value, day) {
    var date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};

var getCookie = function(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

var deleteCookie = function(name) {
    var date = new Date();
    document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}

$('.cookie-hidden').on('change',function(){
    var value = $(this).prop('checked');
    var name = $(this).attr('name');
    var day = $(this).data('expire-day');
    if(!value){
        deleteCookie(name);
    }else{
        setCookie(name, value, day);
    }
})

//이벤트 스티커
$('body').on('click','.event-sticker .btn-close',function(){
    $(this).parents('.event-sticker').remove();
});

//Promotion (Global)
(function($) {

    //Floating Banner
    $.fn.fb = function(options) {
        var settings = $.extend({
            // 옵션의 기본 값입니다.
            fbName: "bsFloatingBannerOneQuarter",
            fbType: "",
            fbAnimation: "",
            fbTitle: "",
            fbMsg: "",
            fbLink: 'javascript:;',
            fbLinkMsg: '바로가기',
            fbImgSrc: "",
            fbCheckboxId: "notToday",
            fbCheckboxName: "promotionBanner",
            fbCheckboxChecked:'',
            fbExpireDay: "1",
            fbCheckboxMsg: "오늘 하루 보지 않기",
            fbShow: false
        }, options );

        
        var floatingBannerHTML = '<div class=\"floating-banner\" data-type=\"' + settings.fbType + '\" data-animation=\"' + settings.fbAnimation + '\" data-layered-name=\"' + settings.fbName + '\">';            
            floatingBannerHTML += '<div class=\"floating-banner_contents\">';
            floatingBannerHTML += '<section class=\"kb-sec\">';
            floatingBannerHTML += '<p class=\"not-today\"><span class=\"form-checkbox_24\"><input type=\"checkbox\" class=\"cookie-hidden\" data-expire-day=\"' + settings.fbExpireDay + '\" id=\"' + settings.fbCheckboxId + '\" name=\"' + settings.fbCheckboxName + '\" ' + settings.fbCheckboxChecked + '><label for=\"' + settings.fbCheckboxId + '\">' + settings.fbCheckboxMsg + '</label></span></p>';
            floatingBannerHTML += '<div class=\"fb-msg\">';
            if(settings.fbTitle.length > 0) floatingBannerHTML += '<strong class=\"tit\">' + settings.fbTitle + '</strong>';
            floatingBannerHTML += '<p>' + settings.fbMsg + '</p>';
            floatingBannerHTML += '<a href=\"' + settings.fbLink + '\" class=\"link\"><span>' + settings.fbLinkMsg + '</span></a>';
            floatingBannerHTML += '<div class=\"img\"><img src=\"' + settings.fbImgSrc + '\" alt=""></div>';
            floatingBannerHTML += '</div>';            
            floatingBannerHTML += '</section>';
            floatingBannerHTML += '</div>';
            floatingBannerHTML += '<button class=\"btn-close\" data-action=\"close\"><span>닫기</span></button>';
            floatingBannerHTML += '</div>';

        this.append(floatingBannerHTML);

        //바로 보여주기
        if(settings.fbShow) gfn_layered.open(settings.fbName);
        
        return false;
    };

    //Event Sticker
    $.fn.sticker = function(options) {
        var settings = $.extend({
            // 옵션의 기본 값입니다.
            esPosition: "1",
            esLink: '',
            esCallLayered: '',
            esAnimation: '',
            esImgSrc: '',
            esImgAlt: '',
            //esImgSize: '',
            esClose: true
        }, options );

        //Validation
        if(settings.esPosition > 9 || settings.esPosition < 1){
            alert('1~9 사이의 숫자를 넣어주세요.');
            return false;
        }
        // if(!isNumeric(settings.esImgSize)){
        //     alert('px로 숫자만 넣어주세요.');
        //     return false;
        // }else{
        //     settings.esImgSize = (settings.esImgSize / 10);//rem 으로 변환            
        // }
        
        if(settings.esCallLayered.length > 0 && settings.esLink.length > 0){
            alert('링크, 바텀시트 호출 중 하나만 입력하세요');
            return false;
        }else if(settings.esCallLayered.length == false && settings.esLink.length == false){
            alert('링크, 바텀시트 호출 중 하나를 입력하세요');
            return false;
        }

        var eventStickerHTML = '<div class=\"event-sticker\" data-animation=\"' + settings.esAnimation + '\" data-position=\"' + settings.esPosition + '\">'
            if(settings.esLink != '') eventStickerHTML += '<a href=\"' + settings.esLink + '\">';
            if(settings.esCallLayered != '') eventStickerHTML += '<a href=\"javascript:;\" role=\"button\" data-call-layered=\"'  + settings.esCallLayered +  '\">';
            //eventStickerHTML += '<img src="' + settings.esImgSrc + '" alt="' + settings.esImgAlt + '" style="width:' + settings.esImgSize + 'rem;">';
            eventStickerHTML += '<img src="' + settings.esImgSrc + '" alt="' + settings.esImgAlt + 'rem;">';
            if(settings.esLink != '') eventStickerHTML += '</a>';
            if(settings.esCallLayered != '') eventStickerHTML += '</a>';
            if(settings.esClose) eventStickerHTML += '<button class="btn-close"><i class=\"icon-sticker-close_20\">닫기</i></button>';
            eventStickerHTML += '</div>';

        this.append(eventStickerHTML);

        return false;
    };

}(jQuery));