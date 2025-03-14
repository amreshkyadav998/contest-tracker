import puppeteer from "puppeteer";
import Contest from "../models/Contest.js";

const fetchContests = async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    const contests = [];

    // Scrape Codeforces Contests
    await page.goto("https://codeforces.com/contests", { waitUntil: "domcontentloaded" });
    const cfContests = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".contests-table tr"))
        .slice(1) // Skip table headers
        .map(row => {
          const cells = row.querySelectorAll("td");
          if (cells.length < 4) return null;
          return {
            platform: "Codeforces",
            name: cells[0].innerText.trim(),
            startTime: new Date(cells[2].innerText.trim()),
            duration: cells[3].innerText.trim(),
            url: "https://codeforces.com" + cells[0].querySelector("a")?.getAttribute("href"),
          };
        })
        .filter(Boolean);
    });
    contests.push(...cfContests);

    // Scrape LeetCode Contests
    await page.goto("https://leetcode.com/contest/", { waitUntil: "domcontentloaded" });
    const lcContests = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".contest-card"))
        .map(card => {
          const name = card.querySelector(".text-label-1")?.innerText.trim();
          const startTime = card.querySelector(".text-label-2")?.innerText.trim();
          const duration = card.querySelector(".text-label-3")?.innerText.trim();
          const url = "https://leetcode.com" + card.querySelector("a")?.getAttribute("href");
          return name && startTime && duration ? { platform: "LeetCode", name, startTime, duration, url } : null;
        })
        .filter(Boolean);
    });
    contests.push(...lcContests);

    await browser.close();

    // Update database
    await Contest.deleteMany({});
    await Contest.insertMany(contests);
    
    console.log(`✅ ${contests.length} contests scraped and saved.`);
  } catch (error) {
    console.error("❌ Puppeteer Scraping Error:", error.message);
  }
};

export default fetchContests;
