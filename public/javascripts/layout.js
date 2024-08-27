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