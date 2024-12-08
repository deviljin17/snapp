import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { StoreProduct } from './types';

export class StoreScraper {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scrapeProduct(url: string): Promise<StoreProduct> {
    if (!this.browser) await this.initialize();
    
    const page = await this.browser!.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      const html = await page.content();
      const $ = cheerio.load(html);

      // Generic selectors that work for most e-commerce sites
      const name = $('h1').first().text().trim();
      const priceText = $('.price, [class*="price"]').first().text().trim();
      const price = this.extractPrice(priceText);
      const inStock = !html.toLowerCase().includes('out of stock');

      return {
        id: url,
        name,
        price,
        currency: 'USD',
        url,
        store: this.extractStoreName(url),
        inStock
      };
    } finally {
      await page.close();
    }
  }

  private extractPrice(text: string): number {
    const match = text.match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  }

  private extractStoreName(url: string): string {
    const hostname = new URL(url).hostname;
    return hostname.split('.')[1] || hostname;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}