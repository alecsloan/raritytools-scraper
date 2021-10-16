const playwright = require('playwright');
var fs = require('fs');

//TODO: drop these in favor of waiting for components to load
const catalogLoadTime = 6000
const detailLoadTime = 5000

async function scrapeVox() {
    const browser = await playwright.chromium.launch({ headless: true });

    //Get a list of for sale vox
    console.log("### Gathering a list of VOX for sale ###")

    const page = await browser.newPage();

    await page.goto('https://rarity.tools/collectvox?filters=%24buyNow%24On%3Atrue');

    let buyableVOX = []

    while (true) {
      await new Promise(function (resolve) {
        setTimeout(resolve, catalogLoadTime)
      });

      const buyableVOXURLs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div.overflow-hidden.rounded-md > a')).map(item => item.href);
      });

      buyableVOX = buyableVOX.concat(buyableVOXURLs)

      const nextPage = await page.locator('text=Next >').first();

      const foundVOX = await page.locator('text=Matching').first().innerText()

      console.log(buyableVOX.length + " of " + foundVOX.match(/\d/g).join("") + " in list");

      if (buyableVOX.length >= foundVOX.match(/\d/g).join("")) {
        break
      }

      nextPage.click();
    }

    page.close();

    //Visit each VOX's detail page to gather info

    console.log("### Visiting each VOX's detail page to gather specific info ###")

    const date = new Date().toLocaleDateString('en-US').replace(/\//g, '-')

    const voxFileName = __dirname + '/src/data/VOX-' + date + '.json'

    for (let i = 0; i < buyableVOX.length; i++) {
      const page = await browser.newPage()

      const voxURL = buyableVOX[i]

      await page.goto(voxURL).catch(() => console.log("Failed to access page for VOX " + voxURL))

      await new Promise(function (resolve) {
          setTimeout(resolve, detailLoadTime)
      });

      const price = await page.$eval('div.h-full.font-bold.text-green-500', div => {
          return div.innerText.replace(' ETH','')
      }).catch(() => console.log("Failed to get price for VOX " + voxURL))
      const id = await page.$eval('div.flex-grow.text-sm.text-right.text-gray-400', div => {
        return div.innerText.replace('ID ', '')
      }).catch(() => console.log("Failed to get name for VOX " + voxURL))
      const image = await page.$eval('img.block.p-0', img => {
        return img.src
      }).catch(() => console.log("Failed to get name for VOX " + voxURL))
      const name = await page.$eval('div.text-lg.font-bold.text-left.text-pink-700', div => {
          return div.innerText
      }).catch(() => console.log("Failed to get name for VOX " + voxURL))
      const opensea = await page.$eval('a.bgInput', a => {
          return a.href
      }).catch(() => console.log("Failed to get opensea link for VOX " + voxURL))
      const rank = await page.$eval('span.font-bold.whitespace-nowrap', span => {
          return span.innerText.replace('Rarity Rank #', '')
      }).catch(() => console.log("Failed to get rank for VOX " + voxURL))
      const rarity = await page.$eval('div.px-2.mx-1.mb-0.text-lg.font-extrabold.text-green-500.bg-white.rounded-md', div => {
          return div.innerText
      }).catch(() => console.log("Failed to get rarity for VOX " + voxURL))

      page.close()

      let vox = {
        id: id,
        image: image,
        price: price,
        name:  name,
        opensea: opensea,
        rank: rank,
        rarity: rarity,
        ethPerRarity: price / rarity
      }

      console.log(vox)

      if (vox.ethPerRarity > 0) {
        fs.readFile(voxFileName, function (err, data) {
          if (!data) {
            data = '[]'
          }

          var json = JSON.parse(data)
          json.push(vox)

          fs.writeFile(voxFileName, JSON.stringify(json, undefined, 4), (error) => {
            if (error) {
              console.log(error)
            } else {
              console.log("VOX " + (i + 1) + " of " + buyableVOX.length + " saved.")
            }
          })
        })
      }
    }

    browser.close()
}

scrapeVox()