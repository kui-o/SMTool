function formatNumber(number) {
    if (-100 < number && number < 100) {
        return parseFloat(number.toFixed(2));
    } else if (-1000 < number && number < 1000) {
        return parseFloat(number.toFixed(1));
    } else {
        return Math.floor(number);
    }
}


$('.setting-panel').on('click', 'button', (event)=>{
    $('#setting-modal').modal('show');
});