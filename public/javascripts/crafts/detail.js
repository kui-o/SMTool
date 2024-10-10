const cash = {
    data: {},
    updateAt: 0
}

function formatNumber(number) {
    if (-100 < number && number < 100) {
        return parseFloat(number.toFixed(2));
    } else if (-1000 < number && number < 1000) {
        return parseFloat(number.toFixed(1));
    } else {
        return Math.floor(number);
    }
}

$('#back-btn').on('click', (event) => {
    if (document.referrer === `${window.location.origin}/crafts`) {
        history.back();
    } else {
        window.location.href = `/crafts`;
    }

});
$('#refresh-btn').on('click', (event) => {
    if(Date.now() - cash.updateAt > 60000){
        cash.updateAt = Date.now();
        const button = $(event.currentTarget);
        button.prop('disabled', true);
        $.ajax({
            url: url + '/crafts/items/' + itemId,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                cash.data = response.body;
            },
            complete: function () {
                applyCachedData();
                button.prop('disabled', false);
            }
        });
    } else {
        applyCachedData();
    }
});

$('#setting-btn').on('click', (event) => {
    $('#setting-modal').modal('show');
});

function parseNumber(param){
    return parseInt(param) || 0;
}

function applyModifierToRecipe(){
    $('div.recipe-body').each((i, body) =>{
        const bodyElement = $(body);
        const feeType = parseNumber(bodyElement.find('table.material-list td.fee input.fee-type').val()) - 1;
        if(feeType < 0) return;
        const craftedAmountInput = bodyElement.children('input.crafted-amount');
        const bvSpan = bodyElement.find('table.price-table td.title span.bonus-value');
        const originAmount = parseInt(craftedAmountInput.attr('value'));
        const bonusModifier = craftsModifier.bonus[feeType];
        if(!bonusModifier || bonusModifier <= 0){
            bvSpan.text('');
            craftedAmountInput.val(originAmount);
        } else {
            const modifiedAmount = originAmount + (originAmount * (bonusModifier / 100));
            craftedAmountInput.val(modifiedAmount);
            bvSpan.text(`(대성공: ${formatNumber(bonusModifier)}%)`);
        }

        const dvSpan = bodyElement.find('table.material-list td.name span.discount-value');
        const feeInput = bodyElement.find('table.material-list td.fee input.fee-amount');
        const originFee = parseInt(feeInput.attr('value'));
        const feeModifier = craftsModifier.cost[feeType];
        if(!feeModifier || feeModifier <= 0){
            dvSpan.text('');
            feeInput.val(originFee);
        } else {
            const modifiedFee = originFee - Math.ceil(originFee * (feeModifier / 100));
            feeInput.val(modifiedFee);
            dvSpan.text(`(${feeModifier}% 감소)`);
        }
    });
}

function applyCachedData(){
    $('#crafted-price').val(cash.data.craftedItem.itemPrice);
    $('input.item-price').each((i, input)=>{
        const inputElement = $(input);
        const itemId = parseNumber(inputElement.attr('data-item'));
        inputElement.val(cash.data.items.find(item => item.itemId === itemId).itemPrice);
    });
    calculate();
}

function calculate(){
    const craftedPrice = parseNumber($('input#crafted-price').val());
    const craftedUnit = parseNumber($('input#crafted-unit').val());
    $('div.recipe-body').each((i, body) => {
        const bodyElement = $(body);
        const craftedAmount = parseFloat(bodyElement.find('input.crafted-amount').val());
        const tableElement = bodyElement.find('table.material-list');
        let cost = 0;
        tableElement.find('td.price').each((j, td) => {
            const tdElement = $(td);
            const price = parseNumber(tdElement.find('input.item-price').val());
            const unit = parseNumber(tdElement.find('input.item-unit').val());
            const amount = parseNumber(tdElement.find('input.item-amount').val());
            cost += price / unit * amount;
        });

        const feeElement = tableElement.find('td.fee');
        if(feeElement.length && feeElement.find('div.gold').length){
            cost += parseNumber(feeElement.find('input.fee-amount').val());
        }
        cost /= craftedAmount;
        //95% * 2 + 5% * 4 = craftedAmount

        const madeTable = bodyElement.find('table.homemade');
        const salesTable = bodyElement.find('table.sales');
        cost *= craftedUnit;

        const madeCost = cost;
        const madeProfit = craftedPrice - cost;
        const salesCost = madeCost + Math.ceil(craftedPrice * 0.05);
        const salesProfit = craftedPrice - salesCost;

        madeTable.find('span.cost').text(formatNumber(madeCost));
        madeTable.find('span.profit').text(formatNumber(madeProfit));
        salesTable.find('span.cost').text(formatNumber(salesCost));
        salesTable.find('span.profit').text(formatNumber(salesProfit));
    });
}

ajaxRequests.push(
    $.ajax({
        url: url+'/crafts/items/'+itemId,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            try{
                cash.data = response.body;
                cash.updateAt = Date.now();

                const craftedItem = response.body.craftedItem;
                $('.crafted-panel>.icon>span').attr('class', 'slot grade-'+craftedItem.itemTier);
                $('.crafted-panel>.icon>span>img').attr('src', 'https://cdn-lostark.game.onstove.com/'+craftedItem.itemImage);
                $('#crafted-name').text(craftedItem.itemName);
                $('#crafted-price').val(craftedItem.itemPrice);
                $('#crafted-unit').val(craftedItem.itemUnit);

                const recipes = response.body.recipes;
                const items = response.body.items;
                const recipePanel = $('.recipe-panel');
                recipePanel.html('');
                let row;
                for(let i=0; i<recipes.length; i++){
                    if(i % 3 === 0) {
                        row = $('<div class="row">');
                        recipePanel.append(row);
                    }
                    const recipe = recipes[i];
                    const col = $('<div class="col-lg-4">');
                    row.append(col);
                    const recipeDiv = $('<div class="recipe">');
                    col.append(recipeDiv);
                    const materials = JSON.parse(recipe.recipeJson);
                    let recipeTooltip = ['<div class=\'recipe-tooltip\'>'];
                    materials.forEach(material => {
                        const item = items.find(obj => obj.itemId === material.i);
                        recipeTooltip.push(`<p>${item.itemName} ${material.a}개</p>`);
                    });
                    recipeTooltip.push('<hr/>');
                    recipeTooltip.push(`<p>${craftedItem.itemName} ${recipe.craftedAmount}개</p>`);
                    recipeTooltip.push('</div>');
                    recipeDiv.append(`<div class="recipe-head">${recipe.recipeName}<i class="fa-solid fa-circle-question" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="${recipeTooltip.join('')}"></i></div>`);
                    const recipeBody = $('<div class="recipe-body">');
                    recipeDiv.append(recipeBody);
                    recipeBody.append(`<input class="crafted-amount" type="hidden" value="${recipe.craftedAmount}">`);
                    recipeBody.append('<table class="material-list"><tbody></tbody></table>');
                    const matTable = recipeBody.find('.material-list>tbody');
                    materials.forEach(material => {
                        const item = items.find(obj => obj.itemId === material.i);
                        const tr = $('<tr>');
                        matTable.append(tr);
                        tr.append(`<td class="slot icon grade-${item.itemTier}"><img src="https://cdn-lostark.game.onstove.com/${item.itemImage}"></td>`);
                        tr.append(`<td class="name">${item.itemName}</td>`);
                        const priceDiv = $('<td class="price">');
                        tr.append(priceDiv);
                        priceDiv.append(`<div class="money gold"><input class="item-price" type="number" data-item="${item.itemId}" value="${item.itemPrice}"/></div>`);
                        priceDiv.append(`<input class="item-unit" value="${item.itemUnit}" type="hidden">`);
                        priceDiv.append(`<input class="item-amount" value="${material.a}" type="hidden">`);
                    });

                    if(recipe.feeAmount > 0){
                        const tr = $('<tr>');
                        matTable.append(tr);
                        tr.append('<td class="slot icon fee-icon"><i class="fa-solid fa-screwdriver-wrench"></i></td>');
                        tr.append('<td class="name">제작비<span class="discount-value"></span></td>');
                        tr.append(`<td class="fee"><div class="money ${recipe.feeCurrency.toUpperCase() === 'S' ? 'shilling' : 'gold'}"><input class="fee-amount" type="number" value="${recipe.feeAmount}"/><input class="fee-type" type="hidden" value="${recipe.feeType}"/></div></td>`);
                    }

                    recipeBody.append('<hr/>');
                    recipeBody.append('<table class="price-table homemade"><tbody></tbody></table>');
                    const madeTable = recipeBody.find('.price-table.homemade>tbody')
                    madeTable.append(`<tr><td class="unit"><span class="slot grade-${craftedItem.itemTier}"><img src="https://cdn-lostark.game.onstove.com/${craftedItem.itemImage}"/></span><b>[</b>${craftedItem.itemUnit}개당<b>]</b></td></tr>`);
                    madeTable.append('<tr><td class="title">원가(제작)<span class="bonus-value"></span></td><td class="price-td"><div class="money gold"><span class="cost">0</span></div></td></tr>');
                    madeTable.append('<tr><td class="price-title">이윤(제작)</td><td class="price-td"><div class="money gold"><span class="profit">0</span></div></td></tr>');

                    recipeBody.append('<table class="price-table sales"><tbody></tbody></table>');
                    const salesTable = recipeBody.find('.price-table.sales>tbody')
                    salesTable.append('<tr><td class="title">원가(판매)<i class="fa-solid fa-circle-question" data-bs-toggle="tooltip" data-bs-title="원가 + 판매수수료"></i></td><td class="price-td"><div class="money gold"><span class="cost">0</span></div></td></tr>');
                    salesTable.append('<tr><td class="price-title">이윤(판매)</td><td class="price-td"><div class="money gold"><span class="profit">0</span></div></td></tr>');
                }
                applyModifierToRecipe();
                calculate();
                $('input[type="number"]').on('input', (event)=>{
                    calculate();
                    const input = $(event.currentTarget);
                    if(input.hasClass('fee-amount')){
                        input.parent().parent().parent().find('span.discount-value').text('');
                    }
                });
                initTooltips();
            }catch(e){
                console.error(e);
                displayError = true;
            }
        },
        error: function(xhr, status, error) {
            displayError = true;
        }
    })
);