import foodkeeperData from '../../assets/data/foodkeeper.json';

const METRIC_TO_DAYS = {
    Days: 1,
    Weeks: 7,
    Months: 30,
    Year: 365,
    Years: 365,
};

function parseRow(row) {
    const obj = {};
    for (const cell of row) {
        const key = Object.keys(cell)[0];
        obj[key] = cell[key];
    }
    return obj;
}

function bestDefaultDays(p) {
    const options = [
        [p.DOP_Refrigerate_Min, p.DOP_Refrigerate_Max, p.DOP_Refrigerate_Metric],
        [p.Refrigerate_After_Opening_Min, p.Refrigerate_After_Opening_Max, p.Refrigerate_After_Opening_Metric],
        [p.Refrigerate_Min, p.Refrigerate_Max, p.Refrigerate_Metric],
        [p.DOP_Pantry_Min, p.DOP_Pantry_Max, p.DOP_Pantry_Metric],
        [p.Pantry_After_Opening_Min, p.Pantry_After_Opening_Max, p.Pantry_After_Opening_Metric],
        [p.Pantry_Min, p.Pantry_Max, p.Pantry_Metric],
    ];
    for (const [min, max, metric] of options) {
        if (!metric) continue;
        const val = max ?? min;
        if (!val) continue;
        const multiplier = METRIC_TO_DAYS[metric] ?? 1;
        return Math.round(val * multiplier);
    }
    return 21;
}

// Maps FoodKeeper Category_IDs to our 5 app categories.
const CATEGORY_MAP = {
    7:  'Dairy',
    18: 'Produce', 19: 'Produce',
    10: 'Protein', 11: 'Protein', 12: 'Protein', 13: 'Protein',   // Meat
    14: 'Protein', 15: 'Protein', 16: 'Protein', 17: 'Protein',   // Poultry
    20: 'Protein', 21: 'Protein', 22: 'Protein',                  // Seafood
    24: 'Protein',                                                // Vegetarian Proteins
    2:  'Grains',  3:  'Grains',  4:  'Grains',                   // Baked Goods
    9:  'Grains',                                                 // Grains, Beans & Pasta
    1:  'Other',   5:  'Other',   6:  'Other',                    // Baby Food, Beverages, Condiments
    8:  'Other',   23: 'Other',   25: 'Other',                    // Frozen, Shelf Stable, Deli
};

const productSheet = foodkeeperData.sheets.find(s => s.name === 'Product');

export const foodkeeperItems = productSheet.data
    .map(parseRow)
    .map(p => ({
        id: p.ID,
        name: p.Name,
        subtitle: p.Name_subtitle ?? null,
        keywords: p.Keywords ?? '',
        defaultDays: bestDefaultDays(p),
        category: CATEGORY_MAP[p.Category_ID] ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
