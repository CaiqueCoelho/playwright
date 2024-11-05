const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcel(searchText, replaceText, change, excelFilePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(
    output.row + change.rowChange,
    output.column + change.colChange
  );
  console.log(cell.value);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(excelFilePath);
}

async function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  await worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        console.log(
          `Column ${colNumber} row ${rowNumber} has value ${cell.value}.`
        );
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

test('Upload download excel validation', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/upload-download-test/');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();

  const download = await downloadPromise;
  await download.saveAs(
    '/Users/caiquecoelho/Documents/Personal/playwright/tests/downloads/' +
      download.suggestedFilename()
  );

  // const [ download ] = await Promise.all([
  //   page.waitForEvent('download'), // wait for download to start
  //   await page.getByRole('button', { name: 'Download' }).click()
  // ]);
  // // save into the desired path
  // await download.saveAs('/Users/caiquecoelho/Documents/Personal/playwright/tests/downloads');

  const updatePrice = '3150';
  await writeExcel(
    'Mango',
    updatePrice,
    { rowChange: 0, colChange: 2 },
    '/Users/caiquecoelho/Documents/Personal/playwright/tests/downloads/download.xlsx'
  );

  await page.locator('#fileinput').click();
  await page
    .locator('#fileinput')
    .setInputFiles(
      '/Users/caiquecoelho/Documents/Personal/playwright/tests/downloads/download.xlsx'
    );
  await page.getByText(updatePrice).isVisible();
  const textLocator = page.getByText('Mango');
  const desiredRow = page.getByRole('row').filter({ has: textLocator });
  await expect(desiredRow.locator('#cell-4-undefined')).toHaveText(updatePrice);
  await page.screenshot({ path: 'screeenshots/upload-xlsx.png' });
});
