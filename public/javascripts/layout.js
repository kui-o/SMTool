
function logout(){
    sessionStorage.clear();
    localStorage.removeItem('token');
}
function loadGenericPreference(){
    const ss = sessionStorage.getItem('preference.generic');
    if(ss) {
        return JSON.parse(ss);
    }
    const ls = localStorage.getItem('preference.generic');
    if(ls) {
        return JSON.parse(ls);
    }
    return {d: window.matchMedia('(prefers-color-scheme: dark)').matches};
}
let saveGenericDelay;
function saveGenericPreference(param){
    const json = JSON.stringify(param);
    if(sessionStorage.getItem('preference.generic')){
        sessionStorage.setItem('preference.generic', json);
        if (saveGenericDelay) {
            clearTimeout(saveGenericDelay);
        }
        saveGenericDelay = setTimeout(() => {
            $.ajax({
                url: url + '/main/preference',
                type: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: {
                    j: json
                },
                error: function(xhr, status, error) {
                    if(xhr.status === 429) return;
                    showError(true);
                    if (xhr.status === 401) {
                        logout();
                    }
                }
            });
        }, 1500);
    }
    else{
        localStorage.setItem('preference.generic', json);
    }
}

const initArrays = []
let genericPreference;
function initMain(){
    genericPreference = loadGenericPreference();
    if(genericPreference.d){
        $('#darkmode-toggle').prop('checked', true);
        document.documentElement.setAttribute('dark-theme', 'true');
    } else {
        $('#darkmode-toggle').prop('checked', false);
        document.documentElement.setAttribute('dark-theme', 'false');
    }
    document.body.style.visibility = 'visible';
}
initArrays.push(initMain);
initMain();

$("#darkmode-toggle").change(function(){
    if($(this).is(':checked')){
        document.documentElement.setAttribute('dark-theme', 'true');
        genericPreference.d = true;
    } else {
        document.documentElement.setAttribute('dark-theme', 'false');
        genericPreference.d = false;
    }
    saveGenericPreference(genericPreference);
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

function initTooltips(){
    $('[data-bs-toggle="tooltip"]').each(function () {
        if (!$(this).data('bs.tooltip')) {
            new bootstrap.Tooltip(this);
        }
    });
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
        logout();
        window.location.href='/';
    });

});

const ajaxRequests = [];
let displayError = false;

$(document).ready(()=>{
    const token = localStorage.getItem('token');
    if(token){
        if(!sessionStorage.getItem('login')) {
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
                            sessionStorage.setItem('login', response.body.name);
                            const preference = response.body.preference;
                            for(const key in preference){
                                sessionStorage.setItem('preference.'+key, preference[key]);
                            }
                            initArrays.forEach(init => init());
                            $('#user-name').text(response.body.name);
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
            $('#user-name').text(sessionStorage.getItem('login'));
            $('.user-form').show();
        }
    } else {
        $('.login-form').show();
    }
    $('.darkmode-toggle-circle').removeClass('no-animation');

    $.when(...ajaxRequests).always(()=>{
        displayError ? showError(false) : showContent();
    });

    initTooltips();
})