module.exports = {


  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } 
    
    catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },


  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (link) => link.textContent);
    } 
    
    catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },


  selectSeats: async function (page, seats) {
  // seats — это массив вида [{row: 1, col: 1}, {row: 1, col: 2}]
  for (const seat of seats) {
    const selector = `.buying-scheme__wrapper > div:nth-child(${seat.row}) > span:nth-child(${seat.col})`;
    
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
      await new Promise(resolve => setTimeout(resolve, 300));
    } 
    
    catch (error) {
      throw new Error(`Не удалось выбрать место: ряд ${seat.row}, место ${seat.col}`);
    }
  }
  }
};
