const XLSX = require("xlsx");

const json = require('./data.json')
const data = json.data

function getArray(data) {
    const ans = ['维度', '问题', '参考答案']
    const res = []
    res.push(ans)
    data.forEach(item => {

        res.push(ans.map(i => {
            return item[i]
        }))
    })
    return res
}

const arr = getArray(data);
// console.info("arr:", arr)


const exportExcelBySheets = (sheets, fileName = 'example1.xlsx') => {
    const SheetNames = [];
    const Sheets = {};
    const workbook = {SheetNames, Sheets};

    sheets.forEach((sheet, i) => {
        const name = `sheet${i + 1}`;
        SheetNames.push(name);
        Sheets[name] = sheet;
    });

    return XLSX.writeFile(workbook, fileName, {type: 'binary'});
};

const exportExcelByDoubleDimensArray = (workSheetData, fileName = 'example2.xlsx') => {
    const ws = XLSX.utils.aoa_to_sheet(workSheetData);
    const workSheetName = 'MySheet';
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, ws, workSheetName);
    return XLSX.writeFile(workbook, fileName, {type: 'binary'});
};

// exportExcelBySheets(JSON.stringify(json.data))
exportExcelByDoubleDimensArray(arr)
