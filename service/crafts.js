const db = require("../config/db");
const axios = require("axios");
const cash = {
    itemList: [],
    lastUpdate: 0
}


async function sendPostForItemPrice(code, word = ''){
    const itemData = [];
    try {
        const url = 'https://developer-lostark.game.onstove.com/markets/items';
        const headers = {
            'Authorization': `Bearer ${process.env.LOA_API_TOKEN}`,
            'Accept': 'application/json',
        }
        const data = {
            'Sort': 'GRADE',
            'CategoryCode': code,
            'ItemName': word,
            "PageNo": 1,
            "SortCondition": "ASC"
        }

        let response = await axios.post(url, data,{headers: headers});
        if(response.status === 429){
            console.error("LOA_POST_ITEM_API_LIMIT");
            return {
                success: true,
                body: []
            };
        } else if(response.status !== 200){
            return {
                success: false,
                code: "CSGIP_POST_ST"
            }
        }
        if(!response.data.TotalCount){
            return {
                success: false,
                code: "CSGIP_POST_ND"
            }
        }
        itemData.push(...response.data.Items.map(item=>({
            itemId: item.Id,
            itemPrice: item.RecentPrice
        })));

        const totalPage = Math.ceil(response.data.TotalCount / response.data.PageSize);
        for(let i=2; i<=totalPage; i++){
            data.PageNo = i;
            response = await axios.post(url, data,{headers: headers});
            if(response.status === 429){
                break;
            } else if(response.status === 200){
                itemData.push(...response.data.Items.map(item=>({
                    itemId: item.Id,
                    itemPrice: item.RecentPrice
                })));
            }
        }
        return {
            success: true,
            body: itemData
        }

    } catch(e){
        return {
            success: false,
            code: "CSGIP_POST_TC"
        }
    }
}
async function refreshItemPrice(){
    try {
        const items = await db.query('SELECT item_id, item_price, category, search_word FROM items');
        const itemPrices = [];
        const completedIds = [];

        let tryCount = 0;
        for(const item of items){
            if(completedIds.includes(item.itemId)) continue;

            tryCount++;
            if(tryCount > 10) {
                console.error("INF_LOOP_DETECT")
                break;
            }

            const fetchData = await sendPostForItemPrice(item.category, item.searchWord);
            if(!fetchData.success) return fetchData;
            for(const data of fetchData.body){
                const oldItem = items.find(obj => obj.itemId === data.itemId);
                if(!oldItem) continue;
                completedIds.push(data.itemId);
                if(oldItem.itemPrice !== data.itemPrice)
                    itemPrices.push(data);
            }
        }

        if(itemPrices.length){
            const updateQuery = `
                UPDATE items 
                SET item_price = CASE item_id 
                    ${itemPrices.map(item => `WHEN ${item.itemId} THEN ${item.itemPrice}`).join(' ')}
                    ELSE item_price 
                END
                WHERE item_id IN (${itemPrices.map(item => item.itemId).join(',')});
            `;
            await db.queryAll([{sql: updateQuery, params:[]}]);
        }

        return {success: true};
    } catch(err) {
        return {
            success: false,
            code: "CSGIP_RIP_TC"
        }
    }
}

function calculateCost(items, json){
    let cost = 0;
    try{
        const materials = JSON.parse(json);
        for(const material of materials){
            const item = items.find(obj => obj.itemId === material.i);
            if(!item) return -1;
            cost += item.itemPrice / item.itemUnit * material.a;
        }
        return cost;
    } catch(err) {
        return -1;
    }
}

function getItemType(category) {
    const categoryMap = {
        60000: '배틀',
        70000: '요리',
        90000: '생활',
        50000: '특수'
    };
    return categoryMap[category] || '기타';
}

async function refreshData(){
    const now = new Date();
    if(now - cash.lastUpdate < 6000 * 1000) return {success: true};
    cash.lastUpdate = now;
    try {
        /*const refreshPrice = await refreshItemPrice();
        if(!refreshPrice.success){
            return refreshPrice;
        }*/

        const items = await db.query('SELECT item_id, item_name, item_price, item_unit, item_image, item_tier, category FROM items');
        const recipes = await db.query('SELECT crafted_item, crafted_amount, recipe_json, fee_amount, fee_currency, fee_type, energy_amount FROM recipes');

        const result = [];

        for(const recipe of recipes){
            const costMat = calculateCost(items, recipe.recipeJson);
            if(costMat < 0){
                return {
                    success: false,
                    code: "CSGRR_CC_ZR"
                }
            }
            const craftedItem = items.find(obj => obj.itemId === recipe.craftedItem);
            if(!craftedItem) {
                return {
                    success: false,
                    code: "CSGRR_CI_ND"
                }
            }

            const fee = recipe.feeCurrency.toUpperCase() === 'G' ? recipe.feeAmount : 0;
            const cost = ((costMat + fee) / recipe.craftedAmount * craftedItem.itemUnit) + Math.ceil(craftedItem.itemPrice * 0.05);
            const profit = craftedItem.itemPrice - cost;
            const energyValue = recipe.energyAmount <= 0 ? 0 : 100 / recipe.energyAmount * (profit / craftedItem.itemUnit * recipe.craftedAmount);

            const oldResult = result.find(obj => obj.itemId === craftedItem.itemId);
            if(!oldResult){
                result.push({
                    itemId: craftedItem.itemId,
                    itemName: craftedItem.itemName,
                    itemPrice: craftedItem.itemPrice,
                    itemUnit: craftedItem.itemUnit,
                    itemImage: craftedItem.itemImage,
                    itemTier: craftedItem.itemTier,
                    itemType: getItemType(craftedItem.category),
                    itemProfit: profit,
                    materialCost: costMat,
                    craftedAmount: recipe.craftedAmount,
                    feeAmount: fee,
                    feeType: recipe.feeType,
                    energy: recipe.energyAmount,
                    energyValue: energyValue,
                })
            } else if(oldResult.itemProfit < profit){
                oldResult.itemProfit = profit;
                oldResult.materialCost = costMat;
                oldResult.craftedAmount = recipe.craftedAmount;
                oldResult.feeAmount = fee;
                oldResult.feeType = recipe.feeType;
                oldResult.energy = recipe.energyAmount;
                oldResult.energyValue = energyValue;
            }
        }
        cash.itemList = result;
        return {success: true};
    }catch(error){
        return {
            success: false,
            code: "CSGRR_RD_TC"
        }
    }
}

module.exports = {
    getCrafts: async (id)=>{
        const refresh = await refreshData();
        if(!refresh.success) return refresh;
        try{
            const [output] = await db.query('SELECT item_id, item_name, item_image, item_price, item_unit, item_tier FROM items WHERE item_id=?', id);
            if(!output){
                return {
                    success: false,
                    code: "CSGC_DT_ND"
                }
            }
            const recipes = await db.query('SELECT recipe_name, crafted_amount, recipe_json, fee_amount, fee_currency, fee_type FROM recipes WHERE crafted_item=?', output.itemId);
            if(!recipes.length){
                return {
                    success: false,
                    code: "CSGC_DT_NR"
                }
            }
            const materials = [];
            recipes.map(obj => obj.recipeJson).forEach((item, i) =>{
                const json = JSON.parse(item);
                json.map(obj => obj.i).forEach((item, i) => {
                    if(!materials.includes(item)) materials.push(item);
                })
            });
            const items = await db.queryArray('SELECT item_id, item_name, item_image, item_price, item_price, item_unit, item_tier FROM items WHERE item_id IN (?)', materials);
            if(materials.length !== items.length){
                return {
                    success: false,
                    code: "CSGC_DT_IVM",
                    msg: "해당 아이템 제작법에 이상이 있습니다.\n관리자에게 문의해 주세요."
                }
            }
            return {
                success: true,
                body: {
                    craftedItem: output,
                    recipes: recipes,
                    items: items
                }
            }
        }catch(err){
            console.error(err);
            return {
                success: false,
                code: "CSGC_DT_TC"
            }
        }
    },
    getCraftsList: async ()=>{
        const refresh = await refreshData();
        if(!refresh.success) return refresh;
        return {
            success: true,
            body: cash.itemList
        }
    },
    updatePreference: async (id, data) => {
        try {
            await db.queryAll([{
                sql: 'UPDATE preferences SET crafts=? WHERE user_id=?',
                params: [data, id],
            }]);
            return {success: true};
        }catch(err){
            return {
                success: false,
                code: "CSGUP_POST_TC"
            }
        }
    }
}