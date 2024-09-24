const datatable = {
   pageTotal: 8,
   pageNumber: 1,
   pageSize: 10,
   sortTarget: 0,
   categories: '',
   sortAsc: true
}
let originData = [
   {id: 1, name: '회오리 수류탄', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 140, profit: 35, energy: 910, tier: 2},
   {id: 2, name: '맛있는 라면', type: '요리', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 80, profit: 18, energy: 512, tier: 2},
   {id: 3, name: '나무 곡괭이', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 127, profit: 29, energy: 602, tier: 2},
   {id: 4, name: '용의 숨결', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 156, profit: 42, energy: 730, tier: 2},
   {id: 5, name: '불타는 검', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 130, profit: 21, energy: 890, tier: 2},
   {id: 6, name: '독약', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 90, profit: 15, energy: 63, tier: 2},
   {id: 7, name: '마법 지팡이', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 120, profit: 20, energy: 820, tier: 2},
   {id: 8, name: '빛의 방패', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 165, profit: 45, energy: 780, tier: 2},
   {id: 9, name: '불사조의 깃털', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 200, profit: 55, energy: 900, tier: 2},
   {id: 10, name: '날카로운 화살', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 115, profit: 28, energy: 620, tier: 2},
   {id: 11, name: '얼음 폭탄', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 90, profit: 19, energy: 710, tier: 2},
   {id: 12, name: '전설의 물약', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 135, profit: 23, energy: 840, tier: 2},
   {id: 13, name: '은빛 단검', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 145, profit: 33, energy: 50, tier: 2},
   {id: 14, name: '폭발물 셋트', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 180, profit: 47, energy: 970, tier: 2},
   {id: 15, name: '황금 곡괭이', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 125, profit: 31, energy: 600, tier: 2},
   {id: 16, name: '빙결 지팡이', type: '요리', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 105, profit: 26, energy: 700, tier: 2},
   {id: 17, name: '질주 부츠', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 140, profit: 37, energy: 850, tier: 2},
   {id: 18, name: '마법의 활', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 190, profit: 52, energy: 920, tier: 2},
   {id: 19, name: '신성한 포션', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 130, profit: 24, energy: 780, tier: 2},
   {id: 20, name: '강철 방패', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 160, profit: 41, energy: 610, tier: 2},
   {id: 21, name: '불의 방패', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 145, profit: 39, energy: 910, tier: 2},
   {id: 22, name: '금빛 화살', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 175, profit: 48, energy: 53, tier: 2},
   {id: 23, name: '칠흑의 단검', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 180, profit: 49, energy: 98, tier: 2},
   {id: 24, name: '신속의 부적', type: '요리', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 155, profit: 43, energy: 740, tier: 2},
   {id: 25, name: '용암 폭탄', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 120, profit: 25, energy: 870, tier: 2},
   {id: 26, name: '치명적인 화살', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 190, profit: 50, energy: 530, tier: 2},
   {id: 27, name: '고대의 곡괭이', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 165, profit: 44, energy: 570, tier: 2},
   {id: 28, name: '얼음의 활', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 110, profit: 30, energy: 670, tier: 2},
   {id: 29, name: '풍뎅이 폭탄', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 125, profit: 32, energy: 850, tier: 2},
   {id: 30, name: '암흑의 부적', type: '특수', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 140, profit: 35, energy: 890, tier: 2},
   {id: 31, name: '신의 곡괭이', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 170, profit: 46, energy: 660, tier: 2},
   {id: 32, name: '황금의 화살', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 185, profit: 51, energy: 560, tier: 2},
   {id: 33, name: '불멸의 방패', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 175, profit: 47, energy: 910, tier: 2},
   {id: 34, name: '빙하의 검', type: '배틀', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 150, profit: 40, energy: 730, tier: 2},
   {id: 35, name: '서리의 곡괭이', type: '생활', img: '/EFUI_IconAtlas/Battle_Item/Battle_Item_01_53.png', price: 135, profit: 27, energy: 590, tier: 2}];
let data = [];
let bookmarks = [6, 10, 15, 23];


function renderTable(){
   const tbody = $('#crafts-table>tbody');
   tbody.html('');
   $.each(data.slice(datatable.pageSize * (datatable.pageNumber-1), datatable.pageSize * datatable.pageNumber), (i, item)=>{
      //TODO: AJAX 데이터를 받은 후 검증할 것
      const tr = $('<tr>');
      if(bookmarks.includes(item.id)) tr.append('<td class="bookmark"><button value="'+item.id+'"><i class="fa-solid fa-star"></i></button></td>');
      else tr.append('<td class="bookmark"><button value="'+item.id+'"><i class="fa-regular fa-star"></i></button></td>');

      let td = $('<td class="item-icon">');
      let span = $('<span class="slot">');
      span.addClass('grade-'+item.tier);
      span.append('<img src="https://cdn-lostark.game.onstove.com'+item.img+'"/>');
      td.append(span);
      tr.append(td);

      tr.append('<td class="item-name">'+item.name+'</td>');
      tr.append('<td class="item-price"><div class="money">'+item.price+'</div></td>');
      tr.append('<td class="item-profit"><div class="money">'+item.profit+'</div></td>');
      tr.append('<td class="energy-value"><div class="energy"><span>'+item.energy+'</span><i class="fa-solid fa-bolt-lightning"></i></div></td>');
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

   $.each(data, (i, item)=>{
      if(bookmarks.includes(item.id))
         bookmarkItems.push(item);
      else
         normalItems.push(item);
   });

   if(target === 1){
      if(asc){
         bookmarkItems.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
         normalItems.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
      } else {
         bookmarkItems.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
         normalItems.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
      }
   } else if(target === 2){
      if(asc){
         bookmarkItems.sort((a, b) => a.price - b.price);
         normalItems.sort((a, b) => a.price - b.price);
      } else {
         bookmarkItems.sort((a, b) => b.price - a.price);
         normalItems.sort((a, b) => b.price - a.price);
      }
   } else if(target === 3){
      if(asc){
         bookmarkItems.sort((a, b) => a.profit - b.profit);
         normalItems.sort((a, b) => a.profit - b.profit);
      } else {
         bookmarkItems.sort((a, b) => b.profit - a.profit);
         normalItems.sort((a, b) => b.profit - a.profit);
      }
   } else if(target === 4){
      if(asc){
         bookmarkItems.sort((a, b) => a.energy - b.energy);
         normalItems.sort((a, b) => a.energy - b.energy);
      } else {
         bookmarkItems.sort((a, b) => b.energy - a.energy);
         normalItems.sort((a, b) => b.energy - a.energy);
      }
   } else {
      datatable.sortTarget = 0;
      bookmarkItems.sort((a, b) => a.id - b.id);
      normalItems.sort((a, b) => a.id - b.id);
   }
   data = bookmarkItems.concat(normalItems);
   renderTable();
}
function renderPagination() {
   if(data.length < 1)
      datatable.pageTotal = 1;
   else datatable.pageTotal = Math.ceil(data.length / datatable.pageSize);
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
   data = originData.filter(item => {
      return (!categories || item.type === categories) && (!search || item.name.replace(/\s/g, '').includes(search))
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

$('#crafts-table>tbody').on('click', 'tr>td.bookmark>button', (event) => {
   event.stopPropagation();
   const button = $(event.currentTarget);
   const i = $(event.currentTarget).children('i');
   const id = parseInt(button.val());
   if(!id) return;
   if(i.hasClass('fa-regular')){
      bookmarks.push(id);
      i.removeClass('fa-regular');
      i.addClass('fa-solid');
   } else {
      bookmarks = bookmarks.filter(item => item !== id);
      i.removeClass('fa-solid');
      i.addClass('fa-regular');
   }
   sortTable();
});

$('#crafts-table>tbody').on('click', 'tr', (event) => {
   window.location.href = '/crafts/1';
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


$(document).ready(()=>{
   filterTable('');
   showContent();
});