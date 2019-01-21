/* leave first line blank for cq */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { shallow, configure } from "enzyme";
const puppeteer = require("puppeteer");

const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });

const appUrlBase = "http://localhost:3000";
const QUICK_TEST = true;
// how slow actions should be
// This slows down Puppeteer operations by the specified amount of milliseconds
// to help see what's going on.
const slowMoSpeedMiliseconds = QUICK_TEST ? undefined : 250;

//create global variables to be used in the beforeAll function
let browser;
let page;

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: false, // headless mode set to false so browser opens up with visual feedback
    slowMo: slowMoSpeedMiliseconds
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

describe("Searching subreddits", () => {
  test("Users can search a subreddit", async () => {
    await page.goto(appUrlBase);
    await page.waitForSelector(".ant-form");

    await page.click("input");
    await page.type("input", "news");
    await page.click("button[type=submit]");
    // await page.waitForSelector(".ant-list-item");
  }, 16000);

  test("Display result for a valid subreddit", async () => {
    await page.goto(appUrlBase);
    await page.waitForSelector(".ant-form");

    await page.click("input");
    await page.type("input", "news");
    await page.click("button[type=submit]");
    await page.waitForSelector(".ant-list-item");

    // Check if the top post is actually displayed
    const linkHandlers = await page.$x(
      "//a[contains(text(), 'Scientist Stephen Hawking has died aged 76')]"
    );
    expect(linkHandlers.length).toBe(1);

    // Random stuff shouldn't be displayed
    const linkHandlers2 = await page.$x(
      "//a[contains(text(), 'tertertretretretertretretertertret')]"
    );
    expect(linkHandlers2.length).toBe(0);
  }, 16000);

  test("Should not allow to search illegal subreddit name", async () => {
    await page.goto(appUrlBase);
    await page.waitForSelector(".ant-form");

    await page.click("input");
    await page.type("input", "st");
    // await page.click("button[type=submit]");
    await page.waitForSelector(".ant-form-explain");
  }, 32000);

  test("Should show an error on non-existent subreddit", async () => {
    await page.goto(appUrlBase);
    await page.waitForSelector(".ant-form");

    await page.click("input");
    await page.type("input", "123213");
    await page.click("button[type=submit]");
    await page.waitForSelector(".ant-alert-message");
  }, 16000);

  test("Should show an error on private subreddit", async () => {
    await page.goto(appUrlBase);
    await page.waitForSelector(".ant-form");

    await page.click("input");
    await page.type("input", "test123");
    await page.click("button[type=submit]");
    await page.waitForSelector(".ant-alert-message");
  }, 16000);

  test("Should show an error on banned subreddit", async () => {
    await page.goto(appUrlBase);
    await page.waitForSelector(".ant-form");

    await page.click("input");
    await page.type("input", "12345");
    await page.click("button[type=submit]");
    await page.waitForSelector(".ant-alert-message");
  }, 16000);
});

// This function occurs after the result of each tests, it closes the browser
afterAll(() => {
  browser.close();
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
