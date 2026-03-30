const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { clickElement, getText, selectSeats } = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});


Given('user is on the cinema home page', async function () {
  await this.page.goto("https://qamid.tmweb.ru/client/index.php");
});

When('user selects day {string}', async function (dayIndex) {
  await clickElement(this.page, `.page-nav__day:nth-child(${dayIndex})`);
});

When('user selects seance with id {string}', async function (seanceId) {
  await clickElement(this.page, `.movie-seances__time[data-seance-id='${seanceId}']`);
  await this.page.waitForSelector(".buying-scheme__wrapper", { visible: true });
});

When('user selects single seat: row {int}, chair {int}', async function (row, col) {
  const seatSelector = `.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${col})`;
  await clickElement(this.page, seatSelector);
});

When('user selects multiple seats: {string}', async function (seatsString) {
  const mySeats = seatsString.split(',').map(seat => {
    const [row, col] = seat.trim().split('/');
    return { row: parseInt(row), col: parseInt(col) };
  });

  await selectSeats(this.page, mySeats);
});

When('user selects a reserved seat', async function () {
  await clickElement(this.page, ".buying-scheme__chair_taken");
});

When('user clicks the booking button', async function () {
  await clickElement(this.page, ".acceptin-button");
});

Then('the ticket should contain seat {string}', async function (expectedSeat) {
  const actual = await getText(this.page, ".ticket__details.ticket__chairs");
  expect(actual).to.contain(expectedSeat);
});

Then('the ticket should contain all seats: {string}', async function (allSeats) {
  await this.page.waitForSelector(".ticket__details.ticket__chairs", { visible: true });
  
  const actual = await getText(this.page, ".ticket__details.ticket__chairs");
  const expectedSeats = allSeats.split(',').map(s => s.trim());

  expectedSeats.forEach(seat => {
    expect(actual).to.contain(seat);
  });
});

Then('the booking button should be disabled', async function () {
  const isDisabled = await this.page.$eval(".acceptin-button", (btn) => btn.disabled);
  expect(isDisabled).to.be.true;
});