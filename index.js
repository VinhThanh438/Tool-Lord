const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const saveData = (links) => {
    // Chuyển đổi dữ liệu thành chuỗi JSON
    const jsonData = JSON.stringify(links);

    // Ghi chuỗi JSON vào tệp
    fs.writeFile('data.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Lỗi khi ghi tệp JSON:', err);
        } else {
            console.log('Dữ liệu đã được ghi vào tệp JSON thành công.');
        }
    });
};

const findLink = (url, html) => {
    const links = [];
    const $ = cheerio.load(html);

    // Tìm tất cả các thẻ <a> và lấy giá trị thuộc tính href
    $('a').each((index, element) => {
        const href = $(element).attr('href');
        links.push(href);
    });

    $('button').each((index, element) => {
        const href = $(element).attr('href');
        links.push(href);
    });

    // Với các đường dẫn chỉ có / sẽ thêm domain ở đầu
    for (let i = 0; i < links.length; i++) {
        if (!links[i]) continue;
        if (links[i][0] === '/') links[i] = url + links[i];
        if (links[i] === '#' || links[i] === '') links.splice(i, 1);
    }
    console.log('hehe', links);
    saveData(links);
};

const clonePage = async (url) => {
    // Khởi tạo trình duyệt Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });

    // Tạo một trang mới
    const page = await browser.newPage();

    // Điều hướng đến URL của trang web cần cào
    await page.goto(url);

    // Lấy nội dung HTML của trang
    const html = await page.content();

    findLink(url, html);

    // Lấy các đường dẫn đến file CSS
    const cssFiles = await page.$$eval('link[rel="stylesheet"]', (links) =>
        links.map((link) => link.href)
    );

    // Lấy nội dung CSS từ các file
    const cssContent = [];
    for (const cssFile of cssFiles) {
        const response = await page.goto(cssFile);
        const css = await response.text();
        cssContent.push(css);
    }

    let cssData = '';
    cssContent.map((e) => (cssData += e));

    // Tạo tệp HTML
    fs.writeFile('cloneStorage/index.html', html, (err) => {
        if (err) throw err;
        console.log('Tệp HTML đã được tạo thành công!');
    });

    // Tạo tệp CSS
    fs.writeFile('cloneStorage/styles.css', cssData, (err) => {
        if (err) throw err;
        console.log('Tệp CSS đã được tạo thành công!');
    });

    // Đóng trình duyệt
    await browser.close();
};

module.exports = clonePage;
