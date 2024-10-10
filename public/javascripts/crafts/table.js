const datatable = {
   pageTotal: 0,
   pageNumber: 1,
   pageSize: 10,
   sortTarget: 0,
   categories: '',
   sortAsc: true
}
let originData = [];
let renderData = [];


function renderTable(){
   const tbody = $('#crafts-table>tbody');
   tbody.html('');
   $.each(renderData.slice(datatable.pageSize * (datatable.pageNumber-1), datatable.pageSize * datatable.pageNumber), (i, item)=>{
      const tr = $('<tr data-item="'+item.itemId+'">');
      if(craftsPreference.bookmarks.includes(item.itemId)) tr.append('<td class="bookmark"><button value="'+item.itemId+'"><i class="fa-solid fa-star"></i></button></td>');
      else tr.append('<td class="bookmark"><button value="'+item.itemId+'"><i class="fa-regular fa-star"></i></button></td>');

      let td = $('<td class="item-icon">');
      let span = $('<span class="slot">');
      span.addClass('grade-'+item.itemTier);
      span.append('<img src="https://cdn-lostark.game.onstove.com/'+item.itemImage+'"/>');
      td.append(span);
      tr.append(td);

      tr.append('<td class="item-name">'+item.itemName+'</td>');
      tr.append('<td class="item-price"><div class="money gold">'+formatNumber(item.itemPrice)+'</div></td>');
      tr.append('<td class="item-profit"><div class="money gold">'+formatNumber(item.itemProfit)+'</div></td>');
      tr.append('<td class="energy-value"><div class="energy"><span>'+formatNumber(item.energyValue)+'</span><i class="fa-solid fa-bolt-lightning"></i></div></td>');
      tbody.append(tr);
   });
}

function setPage(p = 1){
   if(p < 1) return;
   if(p > datatable.pageTotal) return;
   datatable.pageNumber = p;
   $('.page-button.active').removeClass('active');
   $('#pbt-'+p).addClass('active');
   $('#pbt-p').attr('disabled', p === 1);
   $('#pbt-n').attr('disabled', p === datatable.pageTotal);
   renderTable();
}

function sortTable(target = datatable.sortTarget, asc = datatable.sortAsc){
   target = parseInt(target);

   datatable.sortTarget = target;
   datatable.sortAsc = asc;

   const bookmarkItems = [];
   const normalItems = [];

   $.each(renderData, (i, item)=>{
      if(craftsPreference.bookmarks.includes(item.itemId))
         bookmarkItems.push(item);
      else
         normalItems.push(item);
   });

   if(target === 1){
      if(asc){
         bookmarkItems.sort((a, b) => (a.itemName > b.itemName) ? 1 : (a.itemName < b.itemName) ? -1 : 0);
         normalItems.sort((a, b) => (a.itemName > b.itemName) ? 1 : (a.itemName < b.itemName) ? -1 : 0);
      } else {
         bookmarkItems.sort((a, b) => (a.itemName < b.itemName) ? 1 : (a.itemName > b.itemName) ? -1 : 0);
         normalItems.sort((a, b) => (a.itemName < b.itemName) ? 1 : (a.itemName > b.itemName) ? -1 : 0);
      }
   } else if(target === 2){
      if(asc){
         bookmarkItems.sort((a, b) => a.itemPrice - b.itemPrice);
         normalItems.sort((a, b) => a.itemPrice - b.itemPrice);
      } else {
         bookmarkItems.sort((a, b) => b.itemPrice - a.itemPrice);
         normalItems.sort((a, b) => b.itemPrice - a.itemPrice);
      }
   } else if(target === 3){
      if(asc){
         bookmarkItems.sort((a, b) => a.itemProfit - b.itemProfit);
         normalItems.sort((a, b) => a.itemProfit - b.itemProfit);
      } else {
         bookmarkItems.sort((a, b) => b.itemProfit - a.itemProfit);
         normalItems.sort((a, b) => b.itemProfit - a.itemProfit);
      }
   } else if(target === 4){
      if(asc){
         bookmarkItems.sort((a, b) => a.energyValue - b.energyValue);
         normalItems.sort((a, b) => a.energyValue - b.energyValue);
      } else {
         bookmarkItems.sort((a, b) => b.energyValue - a.energyValue);
         normalItems.sort((a, b) => b.energyValue - a.energyValue);
      }
   } else {
      datatable.sortTarget = 0;
      bookmarkItems.sort((a, b) => a.itemId - b.itemId);
      normalItems.sort((a, b) => a.itemId - b.itemId);
   }
   renderData = bookmarkItems.concat(normalItems);
   renderTable();
}
function renderPagination() {
   if(renderData.length < 1)
      datatable.pageTotal = 1;
   else datatable.pageTotal = Math.ceil(renderData.length / datatable.pageSize);
   datatable.pageNumber = 1;

   const pagination = $('.pagination-panel');
   pagination.html('');
   let button = $('<button id="pbt-p"><i class="fa-solid fa-angle-left"></i></button>')
   button.attr('disabled', true);
   pagination.append(button);
   for(let i = 1; i <= datatable.pageTotal; i++){
      button = $('<button>');
      button.addClass('page-button');
      button.attr('id', 'pbt-'+i);
      button.val(i);
      button.text(i);
      if(i === 1) button.addClass('active');
      pagination.append(button);
   }
   button = $('<button id="pbt-n"><i class="fa-solid fa-angle-right"></i></button>')
   if(datatable.pageTotal === 1) button.attr('disabled', true);
   pagination.append(button);
}
function filterTable(categories= datatable.categories){
   datatable.categories = categories;
   const search = $('#search-input').val().replace(/\s/g, '');
   renderData = originData.filter(item => {
      return (!categories || item.itemType === categories) && (!search || item.itemName.replace(/\s/g, '').includes(search))
   });
   renderPagination();
   sortTable();
}

function debounce(func, delay) {
   let timeout;
   return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
   };
}

$('#search-input').on('input', debounce(()=>filterTable(), 300));

$('.categories-button').on('click', (event) => {
   const button = $(event.currentTarget);
   if(button.hasClass('active')) return;
   $('.categories-button.active').removeClass('active');
   button.addClass('active');
   filterTable(button.val());
});

$('.sortable_header span').on('click', (event) => {
   const header = $(event.currentTarget);
   const icon = $(header).children('i');
   if(icon.hasClass('fa-minus')){
      $('.sortable_header i').attr('class', 'fa-solid fa-minus');
      icon.attr('class', 'fa-solid fa-caret-up');
      sortTable(header.attr('data-value'), true);
   } else if(icon.hasClass("fa-caret-up")){
      $('.sortable_header i').attr('class', 'fa-solid fa-minus');
      icon.attr('class', 'fa-solid fa-caret-down');
      sortTable(header.attr('data-value'), false);
   } else {
      icon.attr('class', 'fa-solid fa-minus');
      sortTable(0);
   }
});

let saveBookMarksDelay;
$('#crafts-table>tbody').on('click', 'tr>td.bookmark>button', (event) => {
   event.stopPropagation();
   const button = $(event.currentTarget);
   const i = $(event.currentTarget).children('i');
   const id = parseInt(button.val());
   if(!id) return;
   if(i.hasClass('fa-regular')){
      craftsPreference.bookmarks.push(id);
      i.removeClass('fa-regular');
      i.addClass('fa-solid');
   } else {
      craftsPreference.bookmarks = craftsPreference.bookmarks.filter(item => item !== id);
      i.removeClass('fa-solid');
      i.addClass('fa-regular');
   }
   if(saveBookMarksDelay) clearTimeout(saveBookMarksDelay);
   saveBookMarksDelay = setTimeout(()=>{
      saveCraftsPreference(craftsPreference);
   }, 2000);
   sortTable();
});

$('#crafts-table>tbody').on('click', 'tr', (event) => {
   window.location.href = '/crafts/'+$(event.currentTarget).attr('data-item');
});

$('.pagination-panel').on('click', 'button', (event) => {
   const button = $(event.currentTarget);
   if(button.attr('id') === 'pbt-p'){
      setPage(datatable.pageNumber - 1);
   } else if(button.attr('id') === 'pbt-n'){
      setPage(datatable.pageNumber + 1);
   } else {
      setPage(parseInt(button.val()));
   }
});

ajaxRequests.push(
    $.ajax({
       url: url+'/crafts/',
       type: 'GET',
       dataType: 'json',
       success: function(response) {
          try{
             if(!response.success) {
                return showError(false);
             }
             originData = response.body;
             filterTable('');
          }catch(e){
             console.error(e);
             showError(false);
          }
       },
       error: function(xhr, status, error) {
          showError(false);
       }
    })
);