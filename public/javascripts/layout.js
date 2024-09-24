const isUserColorTheme = localStorage.getItem('dark-theme');
const isOsColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const darkmode = isUserColorTheme ? isUserColorTheme : isOsColorTheme;

document.body.style.visibility = 'visible';
if (darkmode === 'true') {
    $('#darkmode-toggle').prop('checked', true);
    document.documentElement.setAttribute('dark-theme', 'true');
}
$("#darkmode-toggle").change(function(){
    if($(this).is(':checked')){
        localStorage.setItem('dark-theme', 'true');
        document.documentElement.setAttribute('dark-theme', 'true');
    } else {
        localStorage.setItem('dark-theme', 'false');
        document.documentElement.setAttribute('dark-theme', 'false');
    }
});

function showError(doneLoad){
    if(!doneLoad) {
        $(".loading-panel").first().hide();
        $(".error-panel").first().show();
    } else {
        $(".main-panel").first().hide();
        $(".error-panel").first().show();
    }
}
function showContent(){
    $(".loading-panel").first().hide();
    $(".main-panel").first().show();
}

function hideContent(){
    $(".loading-panel").first().show();
    $(".main-panel").first().hide();
}

$('#user-name').on('click', ()=>{
    const opt = confirm("로그아웃 하시겠습니까?");
    if(!opt) return;
    $.ajax({
        url: url+'/main/logout',
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    }).always(function(){
        localStorage.removeItem('token');
        window.location.href='/';
    });

});

const ajaxRequests = [];
let displayError = false;

$(document).ready(()=>{
    $('.darkmode-toggle-circle').removeClass('no-animation');
    const token = localStorage.getItem('token');
    if(token){
        ajaxRequests.push(
            $.ajax({
                url: url+'/main/login',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    try{
                        if(!response.success) return;
                        $('#user-name').text(response.body);
                        $('.user-form').show();
                    }catch(e){
                        console.error(e);
                        $('.login-form').show();
                    }
                },
                error: function(xhr, status, error) {
                    if(xhr.status === 401){
                        localStorage.removeItem('token');
                    }
                    $('.login-form').show();
                }
            })
        );
    } else {
        $('.login-form').show();
    }

    $.when(...ajaxRequests).always(()=>{
        displayError ? showError(false) : showContent();
    });
})