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
    for (const seat of seats) {
      const selector = `.buying-scheme__wrapper > div:nth-of-type(${seat.row}) > span:nth-of-type(${seat.col})`;
    
      try {
        await page.waitForSelector(selector, { visible: true, timeout: 5000});
        const element = await page.$(selector);
        await page.click(selector);
        await new Promise(resolve => setTimeout(resolve, 500));
      } 
    
      catch (error) {
        throw new Error(`Не удалось выбрать место: ряд ${seat.row}, место ${seat.col}`);
      }
    }
  }
};
