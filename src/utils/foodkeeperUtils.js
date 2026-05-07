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

const productSheet = foodkeeperData.sheets.find(s => s.name === 'Product');

export const foodkeeperItems = productSheet.data
    .map(parseRow)
    .map(p => ({
        id: p.ID,
        name: p.Name,
        subtitle: p.Name_subtitle ?? null,
        keywords: p.Keywords ?? '',
        defaultDays: bestDefaultDays(p),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
