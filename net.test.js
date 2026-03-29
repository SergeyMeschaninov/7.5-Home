const { clickElement, selectSeats, getText } = require("./lib/commands.js");
const { generateName } = require("./lib/util.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://qamid.tmweb.ru/client/index.php");
});

afterEach(() => {
  page.close();
});

describe("Movie tests", () => {

  test("Buy a ticket to the movie Stalker", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(page, ".movie-seances__time[href='#'][data-seance-id='217']");
    await clickElement(page, "div[class='buying-scheme'] div:nth-child(2) span:nth-child(8)");
    await clickElement(page, ".acceptin-button");


    const expected = "2/8";
    const actual = await getText(page, ".ticket__details.ticket__chairs");

    await expect(actual).toContain(expected);
  });

  test("Buy a ticket to see The Witcher in a modern theater", async () => {

    const mySeats = [
      { row: 10, col: 9},
      { row: 5, col: 6},
      { row: 3, col: 7}
    ];
    await clickElement(page, "a:nth-child(5)");
    await clickElement(page, ".movie-seances__time[data-seance-id='225']");
    await page.waitForSelector(".buying-scheme__wrapper", { visible: true });
    await selectSeats(page, mySeats);
    await clickElement(page, ".acceptin-button");


    const expected1 = "3/7";
    const expected2 = "10/9";
    const expected3 = "5/6";
    const actual = await getText(page, ".ticket__details.ticket__chairs");

    expect(actual).toContain(expected1);
    expect(actual).toContain(expected2);
    expect(actual).toContain(expected3);
  });

  test("Should not book already reserved seat", async () => {

    const buttonSelector = ".acceptin-button";
    

    await clickElement(page, ".page-nav__day:nth-child(1)");
    await clickElement(page, "a[href='#'][data-seance-id='239']");

    await clickElement(page, "div:nth-child(7) span:nth-child(2)");

    const isDisabled = await page.$eval(buttonSelector, (btn) => btn.disabled);
    expect(isDisabled).to.be.true;
  })
});