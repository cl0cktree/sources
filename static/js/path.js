
//Path 파일용
if($('#wrap', parent.document).length){
    var url = window.location.href;
    $('#wrap', parent.document).contents().find('#url').val(url);
}