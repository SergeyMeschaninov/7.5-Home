const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { putText, getText } = require("../../lib/commands.js");

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
  await this.page.goto("https://tmweb.ru");
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

When('user selects multiple seats: 10/9, 5/6, 3/7', async function () {
  const mySeats = [
    { row: 10, col: 9 },
    { row: 5, col: 6 },
    { row: 3, col: 7 }
  ];
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

Then('the ticket should contain all seats: {string}, {string}, {string}', async function (s1, s2, s3) {
  const actual = await getText(this.page, ".ticket__details.ticket__chairs");
  expect(actual).to.contain(s1);
  expect(actual).to.contain(s2);
  expect(actual).to.contain(s3);
});

Then('the booking button should be disabled', async function () {
  const isDisabled = await this.page.$eval(".acceptin-button", (btn) => btn.disabled);
  expect(isDisabled).to.be.true;
});