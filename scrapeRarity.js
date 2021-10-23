const playwright = require('playwright');
var fs = require('fs');

const collectionMax = 8888
const offset = 7728

async function scrapeNFTs() {
  console.log("Scrape started: " + new Date().toLocaleTimeString('en-US'))

  const browser = await playwright.chromium.launch({ headless: true });

  const date = new Date().toLocaleDateString('en-US').replace(/\//g, '-')

  const fileName = __dirname + '/src/data/' + date + '.json'

  const page = await browser.newPage();

  await page.goto('https://rarity.tools/collectvox');

  await new Promise(function (resolve) {
    setTimeout(resolve, 5000)
  });

  let scrapedNFTs = 0;

  if (offset !== 0) {
    scrapedNFTs += offset

    for (let i = 1; i < offset / 48; i++) {
      const nextPage = await page.locator('text=Next >').first();

      nextPage.click();

      await new Promise(function (resolve) {
        setTimeout(resolve, 500)
      });
    }

    await new Promise(function (resolve) {
      setTimeout(resolve, 5000)
    });
  }

  while (true) {
    await new Promise(function (resolve) {
      setTimeout(resolve, 1000)
    });

    const nfts = await page.$$('div.overflow-hidden.rounded-md > a');

    for (const nftElement of nfts) {
      await new Promise(function (resolve) {
        setTimeout(resolve, 500)
      })

      nftElement.click();

      await new Promise(function (resolve) {
        setTimeout(resolve, 500)
      })

      const id = await page.$eval('div.flex-grow.text-sm.text-right.text-gray-400', div => {
        return div.innerText.replace('ID ', '')
      }).catch(() => console.log("Failed to get name for NFT"))
      const name = await page.$eval('div.text-lg.font-bold.text-left.text-pink-700', div => {
        return div.innerText
      }).catch(() => console.log("Failed to get name for NFT"))
      const rank = await page.$eval('span.font-bold.whitespace-nowrap', span => {
        return span.innerText.replace('Rarity Rank #', '')
      }).catch(() => console.log("Failed to get rank for NFT"))
      const rarity = await page.$eval('div.px-2.mx-1.mb-0.text-lg.font-extrabold.text-green-500.bg-white.rounded-md', div => {
        return div.innerText
      }).catch(() => console.log("Failed to get rarity for NFT"))

      let nft = {
        id: id,
        name: name,
        rank: rank,
        rarity: rarity,
      }

      console.log(nft)

      if ((offset === 0 || (rank > offset)) && (nft.id && nft.name && nft.rank && nft.rarity)) {
        fs.readFile(fileName, function (err, data) {
          if (!data) {
            data = '[]'
          }

          var json = JSON.parse(data)
          json.push(nft)

          fs.writeFile(fileName, JSON.stringify(json, undefined, 4), (error) => {
            if (error) {
              console.log(error)
            }
          })
        })

        scrapedNFTs++
      }

      page.goBack()
    }

    const nextPage = await page.locator('text=Next >').first();

    if (scrapedNFTs >= collectionMax) {
      break
    }

    nextPage.click();
  }

  browser.close()

  console.log("Scrape started: " + new Date().toLocaleDateString('en-US'))

}

scrapeNFTs()