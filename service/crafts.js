const db = require("../config/db");
const cash = {
    itemList: [],
    lastUpdate: 0
}

async function refreshData(){
    const now = new Date();
    if(now - data.lastUpdate < 6000 * 1000) return;
    data.lastUpdate = now;
}

module.exports = {
    getCrafts: async (id)=>{
        await refreshData();
        try{
            const output = await db.query('SELECT item_id, item_name, item_image, item_price, item_unit, item_tier FROM items WHERE item_id=?', id);
            if(!output){
                return {
                    success: false,
                    code: "CSGC_DT_ND"
                }
            }
            const recipes = await db.query('SELECT')
        }catch(err){
            return {
                success: false,
                code: "CSGC_DT_TC"
            }
        }
    }
}