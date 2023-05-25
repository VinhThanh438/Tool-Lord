import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const requestDuration = new Trend('request_duration');
const errorRate = new Rate('errors');

export let options = {
    vus: 10000, // Số lượng người dùng ảo
    duration: '10s', // Thời gian chạy kiểm thử
};

export default function () {
    const link = [
        'https://itc.haui.edu.vn/vn/vn/ung-dung',
        'https://itc.haui.edu.vn/vn/vn/quy-trinh-bieu-mau',
        'https://itc.haui.edu.vn/vn/thong-bao/ke-hoach-to-chuc-thi-cap-chung-chi-thi-ket-thuc-hoc-phan-va-danh-gia-chuan-dau-ra-knsd-cntt-cho-sinh-vien-thang-4-5-6-2023/63675',
        'https://lms.haui.edu.vn',
        'https://itc.haui.edu.vn/vn/thong-bao/ke-hoach-to-chuc-thi-cap-chung-chi-thi-ket-thuc-hoc-phan-va-danh-gia-chuan-dau-ra-knsd-cntt-cho-sinh-vien-thang-4-5-6-2023/63675',
        'https://lms.haui.edu.vn',
        'https://itc.haui.edu.vn/vn/thong-bao/ke-hoach-to-chuc-thi-cap-chung-chi-thi-ket-thuc-hoc-phan-va-danh-gia-chuan-dau-ra-knsd-cntt-cho-sinh-vien-thang-4-5-6-2023/63675',
        'https://lms.haui.edu.vn',
        'https://itc.haui.edu.vn/vn/vn/tin-tuc/hoi-thao-an-toan-bao-mat-thong-tin-tren-khong-gian-mang-danh-cho-sinh-vien-nam-thu-nhat-tai-co-so-ha-nam/63678',
        'https://itc.haui.edu.vn/vn//itc.haui.edu.vn/vn/khai-thac-ha-tang/huong-dan-cai-dat-su-dung-an-toan-thong-tin-tren-may-tinh-ca-nhan/63656',
        'https://itc.haui.edu.vn/vn//itc.haui.edu.vn/vn/ung-dung/so-tay-van-hanh-he-thong-dao-tao-danh-cho-sinh-vien/63651',
        'https://itc.haui.edu.vn/vn//itc.haui.edu.vn/vn/ung-dung/huong-dan-su-dung-email-truong-dai-hoc-cong-nghiep-ha-noi-haui/63649',
        'https://itc.haui.edu.vn/vn/vn/html/co-so-vat-chat',
        'https://itc.haui.edu.vn/vn/vn/html/ke-hoach-dao-tao',
        'https://itc.haui.edu.vn/vn/vn/html/chuong-trinh-dao-tao',
        'https://itc.haui.edu.vn/vn/vn/html/ke-hoach-dao-tao',
    ];
    // Gửi yêu cầu GET đến trang chủ
    let homePage = http.get('https://www.haui.edu.vn/vn');
    link.map((e) => {
        let response = http.get(e);
        // Thu thập thời gian phản hồi và tỷ lệ lỗi
        if (response.status === 200) {
            console.log(`Truy cập thành công: ${link}`);
        } else {
            console.log(`Truy cập thất bại: ${link}`);
        }
        check(response, { 'status is 200': (r) => r.status === 200 });
        sleep(1);
    });
}
