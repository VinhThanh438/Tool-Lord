// XSS
const xssScipt = async (page) => {
    // Thử chèn mã JavaScript vào trường nhập liệu
    await page.evaluate(() => {
        document.getElementById('inputField').value =
            '<script>alert("XSS")</script>';
    });

    // Tiến hành kiểm tra xem có xuất hiện cảnh báo XSS hay không
    await page.waitForNavigation();
};

// SQL Ijection
const sqlIjection = async (page) => {
    // Thử nhập câu truy vấn SQL độc hại vào trường nhập liệu
    await page.evaluate(() => {
        document.getElementById('inputField').value = "'; DROP TABLE users; --";
    });

    // Tiến hành kiểm tra xem có sự xáo trộn dữ liệu trong cơ sở dữ liệu hay không
    await page.waitForNavigation();
};

// CSRF
const csrf = async (page, url) => {
    // Thử tạo yêu cầu HTTP giả mạo để thực hiện hành động không mong muốn
    await page.evaluate(() => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        document.body.appendChild(form);
        form.submit();
    });

    // Kiểm tra xem hành động không mong muốn đã được thực hiện hay không
    await page.waitForNavigation();
};

// RCE (Remote Code Execution)
const rce = async (page) => {
    // Thử chèn payload RCE vào trường nhập liệu để thực thi mã từ xa
    await page.evaluate(() => {
        document.getElementById('inputField').value =
            '"; require("child_process").exec("malicious-command");"';
    });

    // Tiến hành kiểm tra xem lỗ hổng RCE có được khai thác hay không
    await page.waitForNavigation();
};

//  Brute Force
const bruteForce = async (page) => {
    // Thử đăng nhập với danh sách từ khóa phổ biến
    const usernameList = ['admin', 'administrator', 'root'];
    const passwordList = ['password', '123456', 'admin123'];

    for (const username of usernameList) {
        for (const password of passwordList) {
            await page.evaluate(
                (username, password) => {
                    document.getElementById('usernameField').value = username;
                    document.getElementById('passwordField').value = password;
                    document.getElementById('loginButton').click();
                },
                username,
                password
            );

            // Kiểm tra xem việc đăng nhập thành công hay không
            const loggedIn = await page.evaluate(() => {
                return document.getElementById('loggedInIndicator') !== null;
            });

            if (loggedIn) {
                console.log('Đăng nhập thành công:', username, password);
                break;
            } else {
                console.log('Đăng nhập thất bại:', username, password);
            }
        }
    }
};

const fileInclusion = async (page, url) => {
    const fileInclusionUrl = url + 'included-file?file=../config/database.json';
    await page.goto(fileInclusionUrl);
};

module.exports = {
    xssScipt,
    sqlIjection,
    csrf,
    rce,
    bruteForce,
    fileInclusion,
};
