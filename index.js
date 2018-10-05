const winston = require("winston");
const rp = require("request-promise");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const baseUrl = "https://na.finalfantasyxiv.com";
const searchServer = "Zodiark";
const outputFile = "ZodiarkHuntingLinkshells.csv"

const DEBUG = process.env.DEBUG;

// spread requests over a random amount of milliseconds. Avoids running into Error 429
const requestSpread = 60000;

// global helper variables
let abort = false;

// Initialize Logger
winston.level = DEBUG ? "debug" : "info";
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {"timestamp": true});

// Initialize CSV Writer
const csvWriter = createCsvWriter({
  path: outputFile,
  append: true,
  header: [
    {id: "linkshell", title: "Linkshell"},
    {id: "name", title: "Player name"},
    {id: "fc", title: "Free company"},
    {id: "rank", title: "Linkshell Rank"}
  ]
});

/**
 * Loads a lodestone list page, parses the content through cheerio and returns it as promise
 * @param  {string} uri  lodestone page url
 * @param  {number} page number of page to lookup
 * @return {Object}      promise returning a cheerio object
 */
function load(uri, page) {
  const pageParameter = uri.endsWith("/") ? "?page=" + page : "&page=" + page;
  const requestUrl = baseUrl + uri + pageParameter;
  winston.log("debug", "Request URL: " + requestUrl);
  const options = {
    uri: requestUrl,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
  return rp(options);
}

/**
 * extracts linkshells from page into an array of objects
 * @param  {Object} $     cheerio document of linkshell search result page
 * @return {Array.Object} array of objects with url, name and count properties
 */
function extractLinkshells($) {
  const linkshells = [];
  $(".ldst__window .entry").each(function() {
    const entry = $(this);
    linkshells.push({
      url: entry.find("a").first().attr("href"),
      name: entry.find(".entry__name").text(),
      count: entry.find(".entry__linkshell__member > span").text()
    });
  });
  winston.log("info", "Found " + linkshells.length + " linkshells");
  return linkshells;
}

/**
 * extracts users from a linkshell page into an array of objects
 * @param  {Object} $     cheerio document of a linkshell details page
 * @return {Array.Object} array of objects with name, fc and rank properties
 */
function extractUsers($) {
  const users = [];
  $(".ldst__window .entry").each(function() {
    const entry = $(this);
    users.push({
      name: entry.find(".entry__name").text(),
      fc: entry.find(".entry__freecompany__link > span").text(),
      rank: entry.find(".entry__chara_info__linkshell > span").text()
    });
  });
  return users;
}

/**
 * loads a linkshell page, extracts the users and appends the result to the csv
 * @param  {string} linkshell url of linkshell page
 * @param  {number} page      result page number
 * @return {undefined}        will not return anything
 */
function lookupLinkshellPage(linkshell, page) {
  winston.log("info", "Looking up " + linkshell.name + ", page " + page);
  load(linkshell.url, page)
    .then(extractUsers)
    .then(result => {
    // add linkshell name to each result row
      result.forEach(row => {
        row.linkshell = linkshell.name;
      });
      csvWriter.writeRecords(result)
        .then(() => {
          winston.log("debug", "processed page " + page + " of " + linkshell.name);
        });
    })
    .catch((err) => {
      winston.log("error", err);
    });
}

/**
 * Iterates linkshell pages and triggers lookupLinkshellPage for each page
 * @param  {Object} linkshell Linkshell Object as returned by extractLinkshells method
 * @return {undefined}        Will not return anything
 */
function lookupLinkshell(linkshell) {
  if (abort === true) {
    return;
  }
  abort = DEBUG; // in Debug mode only do 1 run, suppress all others to not stress the server

  winston.log("info", "Looking up linkshell " + linkshell.name + " (" + linkshell.count + " members)");
  const pageCount = Math.ceil(linkshell.count / 50);
  for(let page = 1; page <= pageCount; page++) {
    const randomDelay = Math.floor(Math.random() * requestSpread) + 100;
    setTimeout(lookupLinkshellPage, randomDelay, linkshell, page);
  }
}

/**
 * gets and parses a single linkshell search result page
 * @param  {string} query   searchterm to lookup in linkshell search ("Hunt")
 * @param  {string} server  FFXIV Server
 * @param  {number} page    number of the resultpage to lookup
 * @return {undefined}      returns nothing
 */
function searchLinkshells(query, server, page) {
  winston.log("info", "Parsing linkshell search result page " + page)
  load("/lodestone/linkshell/?q=" + query + "&order=&worldname=" + server, page)
    .then(extractLinkshells)
    .then(linkshells => {
      linkshells.forEach((ls) => {
        const randomDelay = Math.floor(Math.random() * requestSpread) + 100;
        setTimeout(function() {
          lookupLinkshell(ls);
        }, randomDelay);
      });
    })
    .catch((err) => {
      winston.log("error", err);
    });
}

/**
 * looks up the number of pages a search for a certain term would yield
 * @param  {string} query   searchterm to lookup in linkshell search ("Hunt")
 * @param  {string} server  FFXIV Server
 * @return {Object}         Returns a promise that will return the number of pages
 */
function getSearchResultPageCount(query, server) {
  return load("/lodestone/linkshell/?q=" + query + "&order=&worldname=" + server, 1)
    .then(($) => {
      const pageCount = $(".btn__pager__current")
        .first()
        .text()
        .replace(/Page . of /, "");

      return pageCount === "" ? 0 : pageCount;
    });
}

/*
   Logic:
  - lookup how many pages a certain searchterm will yield
  - lookup each page of search result
  - iterate through all linkshells of each result page
  - iterate through all pages of each linkshell
  - extract user, fc and linkshell rank from each linkshell page
  - output linkshell name, user, fc and rank into a CSV File
  - spread requests randomly across a configurable amount of time
 */

// Check arguments for searchTerm
if (process.argv.length !== 3) {
  winston.log("error", "Usage: node index.js <searchterm>");
  return;
}
const searchTerm = process.argv[2];

// do the magic!
getSearchResultPageCount(searchTerm, searchServer)
  .then(pageCount => {
    winston.log("info", "Lodestone linkshell dump started. Parsing " + pageCount + " pages");
    for (let resultPage = 1; resultPage <= pageCount; resultPage++) {
    // random delay will mix and spread the calls across a set amount of time
    // Otherwise the lodestone server might return Error 429 - too many requests
      const randomDelay = Math.floor(Math.random() * requestSpread) + 100;
      setTimeout(searchLinkshells, randomDelay, searchTerm, searchServer, resultPage);
    }
  })
