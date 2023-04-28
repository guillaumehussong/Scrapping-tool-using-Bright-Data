import puppeteer from "puppeteer-core";

const auth = 'brd-customer-hl_5546d77f-zone-scraping_browser:nxbtno1ia6jm';
const proxy = 'zproxy.lum-superproxy.io:22225';

async function run() {
    let browser;

    try {
        
        (async () => {
            const browser = await puppeteer.connect({
                browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
            });
        
            const page = await browser.newPage();
            await page.goto('http://amazon.com/Best-Sellers/zgbs');
        
            const products = await page.evaluate(() => {
                const productElements = Array.from(document.querySelectorAll('li.a-carousel-card'));
                return productElements.map(product => {
                    const name = product.querySelector('span > div.p13n-sc-truncate').innerText.trim();
                    const price = product.querySelector('span._cDEzb_p13n-sc-price_3mJ9Z').innerText.trim();
                    return { name, price };
                });
            });
        
            console.log(products);
            
            await browser.close();
        })();
    } catch (error) {
        console.log('Scrapping error', error);
    }
    finally {
        await browser?.close();
    }
}

run();