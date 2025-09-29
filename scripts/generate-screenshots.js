const { chromium } = require('playwright');

async function generateScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Generating screenshots for UberPhatLewtz games...');
    
    // Homepage
    console.log('📸 Taking homepage screenshot...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: './screenshots/homepage.png', 
      fullPage: true 
    });
    
    // Snake Game
    console.log('📸 Taking Snake Game screenshots...');
    await page.goto('http://localhost:3000/game/snake');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/snake-main.png', 
      fullPage: true 
    });
    
    // Start snake game and take gameplay screenshot
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/snake-gameplay.png', 
      fullPage: true 
    });
    
    // Text Adventure
    console.log('📸 Taking Text Adventure screenshots...');
    await page.goto('http://localhost:3000/game/text-adventure');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/text-adventure-main.png', 
      fullPage: true 
    });
    
    // Interact with text adventure
    await page.fill('input[placeholder="Enter command..."]', 'look');
    await page.click('button:has-text("Enter")');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: './screenshots/text-adventure-gameplay.png', 
      fullPage: true 
    });
    
    // Resource Manager
    console.log('📸 Taking Resource Manager screenshots...');
    await page.goto('http://localhost:3000/game/resource-manager');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/resource-manager-main.png', 
      fullPage: true 
    });
    
    // Start resource manager and build something
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Build Lumber Mill")');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: './screenshots/resource-manager-gameplay.png', 
      fullPage: true 
    });
    
    // Tic Tac Toe
    console.log('📸 Taking Tic Tac Toe screenshots...');
    await page.goto('http://localhost:3000/game/tic-tac-toe');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/tic-tac-toe-main.png', 
      fullPage: true 
    });
    
    // Join a game
    await page.fill('input[placeholder="Enter your name"]', 'Player1');
    await page.fill('input[placeholder="Enter game room ID"]', 'demo-room');
    await page.click('button:has-text("Join Game")');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/tic-tac-toe-gameplay.png', 
      fullPage: true 
    });
    
    // Connect Four
    console.log('📸 Taking Connect Four screenshots...');
    await page.goto('http://localhost:3000/game/connect-four');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/connect-four-main.png', 
      fullPage: true 
    });
    
    // Join a game
    await page.fill('input[placeholder="Enter your name"]', 'Player1');
    await page.fill('input[placeholder="Enter game room ID"]', 'demo-room');
    await page.click('button:has-text("Join Game")');
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: './screenshots/connect-four-gameplay.png', 
      fullPage: true 
    });
    
    console.log('✅ All screenshots generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot generation
generateScreenshots();