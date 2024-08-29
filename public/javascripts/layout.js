const isUserColorTheme = localStorage.getItem('dark-theme');
const isOsColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const getUserTheme = isUserColorTheme ? isUserColorTheme : isOsColorTheme;
if (getUserTheme === 'true') {
    localStorage.setItem('dark-theme', 'true');
    document.documentElement.setAttribute('dark-theme', 'true');
} else {
    localStorage.setItem('dark-theme', 'false');
    document.documentElement.setAttribute('dark-theme', 'false');
}


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

$(document).ready(()=>{
    if (getUserTheme === 'true') {
        $('#darkmode-toggle').prop('checked', true);
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
})