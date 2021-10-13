const playwright = require('playwright');
var fs = require('fs');
var schedule = require('node-schedule');

const intervalMin = 240
const loadTime = 2500
const buyThreshold = 0.01
const voxStartingPoint = 0

async function main() {
    const jobs = {};

    console.log('\n Searching VOX ')

    console.log('First job on ' + new Date().toLocaleString("en-US") + '\n')

    jobs['rarityCheckerJob'] = schedule.scheduleJob(Date.now() + 1000, async () => {
        await runJob().catch(e => console.log('Error -> scheduling a new Job' + e)).then(() => {
            var nextSchedule = new Date(new Date().getTime() + 60 * intervalMin * 1000);
            console.log('Reschedule rarityCheckerJob at ' + nextSchedule.toLocaleString("en-US"));
            jobs['rarityCheckerJob'].reschedule(nextSchedule);
        })

    });

}

async function runJob() {
    const browser = await playwright.chromium.launch({ headless: true });

    const date = new Date().toLocaleDateString('en-US').replace(/\//g, '-')

    const buyVoxFileName = __dirname + '/data/buyVox-' + date + '.json'

    for (let voxNumber = 0 + voxStartingPoint; voxNumber < 8887 - voxStartingPoint; voxNumber++) {
      const page = await browser.newPage();

      await page.goto('https://rarity.tools/collectvox/view/' + voxNumber);

      await new Promise(function (resolve) {
          setTimeout(resolve, loadTime)
      });

      const price = await page.$eval('div.h-full.font-bold.text-green-500', div => {
          return div.innerText.replace(' ETH','')
      }).catch(() => console.log("Failed to get price for VOX " + voxNumber));

      if (price != '') {
        const name = await page.$eval('div.text-lg.font-bold.text-left.text-pink-700', div => {
            return div.innerText
        }).catch(() => console.log("Failed to get name for VOX " + voxNumber));
        const opensea = await page.$eval('a.bgInput', a => {
            return a.href
        }).catch(() => console.log("Failed to get opensea link for VOX " + voxNumber));
        const rank = await page.$eval('span.font-bold.whitespace-nowrap', span => {
            return span.innerText.replace('Rarity Rank #', '')
        }).catch(() => console.log("Failed to get rank for VOX " + voxNumber));
        const rarity = await page.$eval('div.px-2.mx-1.mb-0.text-lg.font-extrabold.text-green-500.bg-white.rounded-md', div => {
            return div.innerText
        }).catch(() => console.log("Failed to get rarity for VOX " + voxNumber));

        page.close()

        let vox = {
          price: price,
          name:  name,
          opensea: opensea,
          rank: rank,
          rarity: rarity,
          ethPerTC: price / rarity
        }

        if ((price / rarity) <= buyThreshold) {
          fs.readFile(buyVoxFileName, function (err, data) {
            if (!data) {
              data = '[]'
            }

            var json = JSON.parse(data)
            json.push(vox)

            fs.writeFile(buyVoxFileName, JSON.stringify(json, undefined, 4), (error) => {
              if (error) {
                console.log(error)
              }
              else {
                console.log("Buy VOX saved.")
              }
            })
          })
        }

        console.log(vox)
      } else {
        console.log("VOX " + voxNumber + " not for sale.")
      }
    }

    browser.close()
};

main()