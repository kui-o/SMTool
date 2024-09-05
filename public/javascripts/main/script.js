$(document).ready(()=>{
    $.when(
        $.ajax({
            url: url+'/main/sm-notices',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                const noticeList = $('#sm-notice');
                try{
                    if(!response.success)
                        return noticeList.html('<li>오류가 발생했습니다.</li>');

                    $.each(response.body, (index, item)=>{
                        const noticeItem = $('<li></li>');
                        noticeItem.addClass('notice-item');
                        noticeItem.attr('data-title', item.title);
                        noticeItem.attr('data-content', item.content);
                        noticeItem.attr('data-date', item.publishDate);
                        noticeItem.text(item.title);
                        noticeList.append(noticeItem);
                    });
                }catch(e){
                    noticeList.html('<li>오류가 발생했습니다.</li>')
                }
            },
            error: function(xhr, status, error) {
                $('#sm-notice').html('<li>오류가 발생했습니다.</li>')
            }
        }),
        $.ajax({
            url: url+'/main/loa-notices',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                const noticeList = $('#loa-notice');
                try{
                    if(!response.success){
                        return response.code === 'LOA_NOTICE_API_LIMIT' ?
                            noticeList.html('<li>API 한도 초과</li>') :
                            noticeList.html('<li>오류가 발생했습니다.</li>');
                    }
                    console.log(response);

                    $.each(response.body, (index, item)=>{
                        const noticeItem = $('<li></li>');
                        noticeItem.addClass('notice-item');
                        noticeItem.data('link', item.link);
                        noticeItem.text(item.title);
                        noticeList.append(noticeItem);
                    });
                }catch(e){
                    noticeList.html('<li>오류가 발생했습니다.</li>')
                }
                console.log(response);
            },
            error: function(xhr, status, error) {
                $('#loa-notice').html('<li>오류가 발생했습니다.</li>')
            }
        })
    ).always(()=>{
        showContent();
    });
});

$('#sm-notice').on('click', 'li.notice-item', (event)=>{
    const item = $(event.target);

});

$('#loa-notice').on('click', 'li.notice-item', (event)=>{
    window.open($(event.target).data('link'));
});