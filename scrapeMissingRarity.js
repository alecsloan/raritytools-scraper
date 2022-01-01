const playwright = require('playwright');
var fs = require('fs');

const offset = 0

async function scrapeNFTs() {
  console.log("Scrape started: " + new Date().toLocaleTimeString('en-US'))

  const fileName = __dirname + '/src/data/Mirandus-VOX-rarity.json'

  const browser = await playwright.chromium.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto('https://rarity.tools/collectvoxmirandus/')

  fs.readFile(fileName, async function (err, data) {
    let vox = JSON.parse(data)

    let missing = []

    for (let i = 0; i < 8888; i++) {
      if (vox.filter(v=>v.id === i.toString()).length === 0 && i > offset) {
        missing.push(i)
      }
    }

    console.log(`Trying to find ${missing.length} missing VOX`)

    for (const voxId of missing) {
      await page.goto('https://rarity.tools/collectvoxmirandus/view/' + voxId);

      await new Promise(function (resolve) {
        setTimeout(resolve, 3000)
      })

      const id = await page.$eval('div.flex-grow.text-sm.text-right.text-gray-400', div => {
        return div.innerText.replace('ID ', '')
      }).catch(() => console.log("Failed to get id for NFT"))
      const rank = await page.$eval('span.font-bold.whitespace-nowrap', span => {
        return span.innerText.replace('Rarity Rank #', '')
      }).catch(() => console.log("Failed to get rank for NFT"))
      const rarity = await page.$eval('div.px-2.mx-1.mb-0.text-lg.font-extrabold.text-green-500.bg-white.rounded-md', div => {
        return div.innerText
      }).catch(() => console.log("Failed to get rarity for NFT"))

      let nft = {
        id: id,
        rank: rank,
        rarity: rarity,
      }

      if (nft.id && nft.rank && nft.rarity) {
        console.log(nft)

        vox.push(nft)

        fs.writeFile(fileName, JSON.stringify(vox, undefined, 4), (error) => {
          if (error) {
            console.log(error)
          }
        })
      }
      else {
        console.log(`Couldn't get id: ${voxId}`)
      }
    }

    browser.close()
  })

  console.log("Scrape started: " + new Date().toLocaleDateString('en-US'))

}

scrapeNFTs()