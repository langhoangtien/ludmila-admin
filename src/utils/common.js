import { HOST_API } from 'src/config-global';

export const convertImagePathToUrl = (filePath, dimension) => {
  if (!filePath) return undefined;
  if (dimension === 'originals') return `${HOST_API}/api/v1/files/originals/${filePath}`;
  return `${HOST_API}/api/v1/files${dimension ? `/${dimension}x${dimension}` : ''}/${filePath}`;
};

export const convertImageUrlToPath = (url = '') => {
  if (!url) return undefined;
  const paths = url.split('/');
  return paths[paths.length - 1];
};
export const randomProductCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let result = '';

  // Thêm 3 ký tự viết hoa ngẫu nhiên
  for (let i = 0; i < 2; i += 1) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomIndex];
  }

  // Thêm 5 chữ số ngẫu nhiên
  for (let i = 0; i < 8; i += 1) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    result += digits[randomIndex];
  }

  return result;
};
export function makeProductVariantsFromAttributes(attributes) {
  // if (attributes.length === 1)
  //   return attributes[0].values.map((i) => [{ name: attributes[0].name, value: i }]);
  return attributes.reduce(
    (acc, item) =>
      acc.flatMap((variant) =>
        item.values.map((value) =>
          Array.isArray(variant)
            ? [...variant, { name: item.name, value }]
            : [
                { name: variant.name, value: variant.value },
                { name: item.name, value },
              ]
        )
      ),
    [[]]
  );
}

function randomTenDigitNumber() {
  const number = Math.floor(1000000000 + Math.random() * 9000000000);
  return number;
}

const generateData = () => {
  const firstName = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Hoàng',
    'Huỳnh',
    'Phan',
    'Vũ',
    'Võ',
    'Đặng',
    'Bùi',
    'Đỗ',
    'Hồ',
    'Ngô',
    'Dương',
    'Lý',
  ];
  const lastName = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Hoàng',
    'Huỳnh',
    'Phan',
    'Vũ',
    'Võ',
    'Đặng',
    'Bùi',
    'Đỗ',
    'Hồ',
    'Ngô',
    'Dương',
    'Lý',
    'An',
    'Bạch',
    'Bành',
    'Cao',
    'Chu',
    'Châu',
    'Cù',
    'Dịch',
    'Diệp',
    'Doãn',
    'Đàm',
    'Điền',
    'Điệp',
    'Đinh',
    'Điểu',
    'Đới',
    'Đôn',
    'Đồng',
    'Đỗ',
    'Đới',
    'Đồng',
    'Đông',
    'Đồng',
    'Đinh',
    'Điều',
    'Đan',
    'Giang',
    'Giao',
    'Giang',
    'Hà',
    'Hàn',
    'Hạ',
    'Hán',
    'Hàng',
    'Hánh',
    'Hạo',
    'Hạc',
    'Hạch',
    'Hạc',
    'Hảo',
    'Hữu',
    'Hiên',
    'Hiền',
    'Hiếu',
    'Hoa',
    'Hồng',
    'Hùng',
    'Hưng',
    'Hướng',
    'Huy',
    'Húc',
    'Huyền',
    'Hường',
    'Hương',
    'Huyền',
    'Kha',
    'Khoa',
    'Khuê',
    'Khuê',
    'Khuyên',
    'Khuynh',
    'Khánh',
    'Khoa',
    'Khúc',
    'Khâm',
    'Khôi',
    'Kiên',
    'Kiệt',
    'Kim',
    'Lâm',
    'Lãm',
    'Lân',
    'Lệ',
    'Liên',
    'Liêu',
    'Liên',
    'Liên',
    'Linh',
    'Long',
    'Luân',
    'Luận',
    'Luận',
    'Lương',
    'Lưu',
    'Lý',
    'Ly',
    'Ly',
    'Lý',
    'Mạc',
    'Mạch',
    'Mạch',
    'Mai',
    'Mẫn',
    'Mai',
    'Mai',
    'Mẫn',
    'Mỹ',
    'Mỹ',
    'Mỹ',
    'Minh',
    'Minh',
    'Minh',
    'Mi',
    'Mai',
    'Mỹ',
    'Nghiêm',
    'Ngô',
    'Ngưu',
    'Nguyệt',
    'Nguyệt',
    'Nguyệt',
    'Nguyệt',
    'Nguyên',
    'Nguyên',
    'Nguyên',
    'Nhung',
    'Nhu',
    'Nhuận',
    'Nhược',
    'Nhược',
    'Nhục',
    'Nhụy',
    'Như',
    'Như',
    'Nhược',
    'Nhược',
    'Nghi',
    'Ngọc',
    'Như',
    'Ninh',
    'Nông',
    'Nương',
    'Oanh',
    'Oanh',
    'Ôn',
    'Ôn',
    'Phi',
    'Phong',
    'Phong',
    'Phương',
    'Phương',
    'Phương',
    'Phương',
    'Phượng',
    'Phượng',
    'Phước',
    'Quách',
    'Quách',
    'Quang',
    'Quang',
    'Quảng',
    'Quyên',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Quỳnh',
    'Sơn',
    'Sơn',
    'Sinh',
    'Sinh',
    'Sinh',
    'Sinh',
    'Sương',
    'Sương',
    'Sương',
    'Sương',
    'Tài',
    'Tài',
    'Thảo',
    'Thảo',
    'Thảo',
    'Thảo',
    'Thảo',
    'Thi',
    'Thiên',
    'Thiên',
    'Thiện',
    'Thiện',
    'Thu',
    'Thu',
    'Thu',
    'Thu',
    'Thu',
    'Thủy',
    'Thủy',
    'Thủy',
    'Thủy',
    'Thủy',
    'Thủy',
    'Thục',
    'Thục',
    'Thư',
    'Thư',
    'Thương',
    'Thương',
    'Thương',
    'Thương',
    'Thường',
    'Tiên',
    'Tiên',
    'Tiến',
    'Tiến',
    'Tiến',
    'Tiến',
    'Tiên',
    'Tiên',
    'Tiên',
    'Tiên',
    'Tiền',
    'Tiền',
    'Tĩnh',
    'Tĩnh',
    'Tĩnh',
    'Toàn',
    'Toàn',
    'Toàn',
    'Trang',
    'Trang',
    'Trang',
    'Trinh',
    'Trâm',
    'Trâm',
    'Trân',
    'Trân',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
    'Trúc',
  ];
  const middleName = ['Thị', 'Văn', 'Tiến'];
  const randomFirstName = firstName[Math.floor(Math.random() * firstName.length)];
  const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];
  const randomMiddleName = middleName[Math.floor(Math.random() * middleName.length)];
  const fullName = `${randomFirstName} ${randomMiddleName} ${randomLastName}`;

  const gender = randomMiddleName === 'Thị' ? 'female' : 'male';
  const phoneNumber = randomTenDigitNumber();
  return { fullName, gender, phoneNumber };
};

export const generateCustomers = (number) => {
  const customers = [];
  for (let i = 0; i < number; i += 1) {
    const customer = generateData();
    customers.push(customer);
  }
  return customers;
};
