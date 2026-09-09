// README.md에 정의된 MongoDB 컬렉션과 필드만 사용한 개발용 시드 데이터입니다.
// 날짜 조건이 필요한 기능을 언제든 테스트할 수 있도록 실행 시점을 기준으로 날짜를 만듭니다.

const now = new Date();

function daysAgo(days, hours = 0) {
  return new Date(now.getTime() - (days * 24 + hours) * 60 * 60 * 1000);
}

function hoursAgo(hours) {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

export const users = [
  {
    _id: "66d000000000000000000001",
    email: "admin@daepa.test",
    nickname: "대파관리자",
    address: "서울특별시 강남구 역삼동",
    passwordHash: "$2b$12$development.seed.admin.password.hash",
    profileImage: "https://placehold.co/200x200?text=Admin",
    createdAt: daysAgo(180),
    role: "관리자",
  },
  {
    _id: "66d000000000000000000002",
    email: "minsu@daepa.test",
    nickname: "민수마켓",
    address: "서울특별시 강남구 역삼동",
    passwordHash: "$2b$12$development.seed.user002.password.hash",
    profileImage: "https://placehold.co/200x200?text=Minsu",
    createdAt: daysAgo(150),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000003",
    email: "jiyun@daepa.test",
    nickname: "지윤상점",
    address: "서울특별시 마포구 서교동",
    passwordHash: "$2b$12$development.seed.user003.password.hash",
    profileImage: "https://placehold.co/200x200?text=Jiyun",
    createdAt: daysAgo(130),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000004",
    email: "seojun@daepa.test",
    nickname: "서준중고",
    address: "경기도 성남시 분당구 정자동",
    passwordHash: "$2b$12$development.seed.user004.password.hash",
    profileImage: "https://placehold.co/200x200?text=Seojun",
    createdAt: daysAgo(120),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000005",
    email: "yuna@daepa.test",
    nickname: "유나네도마",
    address: "인천광역시 연수구 송도동",
    passwordHash: "$2b$12$development.seed.user005.password.hash",
    profileImage: "https://placehold.co/200x200?text=Yuna",
    createdAt: daysAgo(100),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000006",
    email: "dohyun@daepa.test",
    nickname: "도현셀러",
    address: "서울특별시 영등포구 당산동",
    passwordHash: "$2b$12$development.seed.user006.password.hash",
    profileImage: "https://placehold.co/200x200?text=Dohyun",
    createdAt: daysAgo(90),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000007",
    email: "sua@daepa.test",
    nickname: "수아픽",
    address: "서울특별시 송파구 잠실동",
    passwordHash: "$2b$12$development.seed.user007.password.hash",
    profileImage: "https://placehold.co/200x200?text=Sua",
    createdAt: daysAgo(80),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000008",
    email: "junho@daepa.test",
    nickname: "준호거래소",
    address: "경기도 수원시 영통구 광교동",
    passwordHash: "$2b$12$development.seed.user008.password.hash",
    profileImage: "https://placehold.co/200x200?text=Junho",
    createdAt: daysAgo(70),
    role: "일반회원",
  },
  {
    _id: "66d000000000000000000009",
    email: "haneul@daepa.test",
    nickname: "하늘마켓",
    address: "서울특별시 용산구 한남동",
    passwordHash: "$2b$12$development.seed.user009.password.hash",
    profileImage: "https://placehold.co/200x200?text=Haneul",
    createdAt: daysAgo(60),
    role: "일반회원",
  },
  {
    _id: "66d00000000000000000000a",
    email: "jiho@daepa.test",
    nickname: "지호의창고",
    address: "부산광역시 해운대구 우동",
    passwordHash: "$2b$12$development.seed.user010.password.hash",
    profileImage: "https://placehold.co/200x200?text=Jiho",
    createdAt: daysAgo(45),
    role: "일반회원",
  },
];

export const products = [
  {
    _id: "66e000000000000000000001",
    images: [
      "https://placehold.co/600x600?text=AirPods+Pro+2+Front",
      "https://placehold.co/600x600?text=AirPods+Pro+2+Case",
    ],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "충전 케이스와 이어팁을 모두 보관하고 있으며 정상 작동합니다.",
    initialPrice: 105000,
    minimum: 70000,
    region: "서울특별시 강남구 역삼동",
    status: "상",
    createdAt: daysAgo(12),
  },
  {
    _id: "66e000000000000000000002",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+1"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "생활 흠집이 조금 있지만 배터리와 음질 상태가 좋습니다.",
    initialPrice: 92000,
    minimum: 75000,
    region: "서울특별시 마포구 서교동",
    status: "상",
    createdAt: daysAgo(18),
  },
  {
    _id: "66e000000000000000000003",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+2"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "정품 구성품을 모두 포함하며 케이스에 미세한 사용감이 있습니다.",
    initialPrice: 95000,
    minimum: 78000,
    region: "경기도 성남시 분당구 정자동",
    status: "상",
    createdAt: daysAgo(25),
  },
  {
    _id: "66e000000000000000000004",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+3"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "사용 횟수가 적고 외관이 깨끗합니다.",
    initialPrice: 105000,
    minimum: 82000,
    region: "서울특별시 송파구 잠실동",
    status: "최상",
    createdAt: daysAgo(30),
  },
  {
    _id: "66e000000000000000000005",
    images: ["https://placehold.co/600x600?text=AirPods+Sold+4"],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "오래 사용해 외관 사용감이 있지만 기능은 정상입니다.",
    initialPrice: 80000,
    minimum: 60000,
    region: "인천광역시 연수구 송도동",
    status: "중",
    createdAt: daysAgo(52),
  },
  {
    _id: "66e000000000000000000006",
    images: [
      "https://placehold.co/600x600?text=iPhone+13+Front",
      "https://placehold.co/600x600?text=iPhone+13+Back",
      "https://placehold.co/600x600?text=iPhone+13+Battery",
    ],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "배터리 성능 88%이며 액정과 카메라 모두 정상입니다.",
    initialPrice: 760000,
    minimum: 560000,
    region: "인천광역시 연수구 송도동",
    status: "상",
    createdAt: daysAgo(15),
  },
  {
    _id: "66e000000000000000000007",
    images: ["https://placehold.co/600x600?text=iPhone+Sold+1"],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "배터리 성능 86%이며 모서리에 작은 흠집이 있습니다.",
    initialPrice: 680000,
    minimum: 580000,
    region: "서울특별시 강남구 역삼동",
    status: "상",
    createdAt: daysAgo(22),
  },
  {
    _id: "66e000000000000000000008",
    images: ["https://placehold.co/600x600?text=iPhone+Sold+2"],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "배터리 성능 90%이며 전체적으로 깨끗합니다.",
    initialPrice: 700000,
    minimum: 600000,
    region: "서울특별시 영등포구 당산동",
    status: "최상",
    createdAt: daysAgo(35),
  },
  {
    _id: "66e000000000000000000009",
    images: ["https://placehold.co/600x600?text=iPhone+Sold+3"],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "배터리 성능 84%이며 생활 흠집이 있습니다.",
    initialPrice: 660000,
    minimum: 550000,
    region: "경기도 수원시 영통구 광교동",
    status: "중",
    createdAt: daysAgo(42),
  },
  {
    _id: "66e00000000000000000000a",
    images: ["https://placehold.co/600x600?text=iPhone+Sold+4"],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "액정에 잔기스가 있지만 모든 기능은 정상입니다.",
    initialPrice: 650000,
    minimum: 520000,
    region: "부산광역시 해운대구 우동",
    status: "중",
    createdAt: daysAgo(67),
  },
  {
    _id: "66e00000000000000000000b",
    images: [
      "https://placehold.co/600x600?text=Nintendo+Switch+OLED",
      "https://placehold.co/600x600?text=Nintendo+Dock",
    ],
    name: "닌텐도 스위치 OLED 화이트",
    category: "전자기기 > 게임기",
    info: "독과 정품 충전기를 포함하며 조이콘 쏠림이 없습니다.",
    initialPrice: 300000,
    minimum: 210000,
    region: "서울특별시 마포구 서교동",
    status: "상",
    createdAt: daysAgo(10),
  },
  {
    _id: "66e00000000000000000000c",
    images: ["https://placehold.co/600x600?text=Nintendo+Sold+1"],
    name: "닌텐도 스위치 OLED 화이트",
    category: "전자기기 > 게임기",
    info: "구성품이 모두 있고 사용감이 적습니다.",
    initialPrice: 280000,
    minimum: 230000,
    region: "서울특별시 송파구 잠실동",
    status: "상",
    createdAt: daysAgo(48),
  },
  {
    _id: "66e00000000000000000000d",
    images: ["https://placehold.co/600x600?text=Nintendo+Sold+2"],
    name: "닌텐도 스위치 OLED 화이트",
    category: "전자기기 > 게임기",
    info: "박스는 없지만 본체와 독 상태가 좋습니다.",
    initialPrice: 270000,
    minimum: 220000,
    region: "경기도 성남시 분당구 정자동",
    status: "상",
    createdAt: daysAgo(56),
  },
  {
    _id: "66e00000000000000000000e",
    images: ["https://placehold.co/600x600?text=Nintendo+Sold+3"],
    name: "닌텐도 스위치 OLED 화이트",
    category: "전자기기 > 게임기",
    info: "본체 뒷면에 사용감이 있으나 화면은 깨끗합니다.",
    initialPrice: 260000,
    minimum: 200000,
    region: "인천광역시 연수구 송도동",
    status: "중",
    createdAt: daysAgo(63),
  },
  {
    _id: "66e00000000000000000000f",
    images: ["https://placehold.co/600x600?text=IKEA+Chair"],
    name: "이케아 POANG 암체어",
    category: "가구 > 의자",
    info: "생활 사용감은 있지만 흔들림 없이 튼튼합니다.",
    initialPrice: 80000,
    minimum: 40000,
    region: "경기도 성남시 분당구 정자동",
    status: "중",
    createdAt: daysAgo(8),
  },
  {
    _id: "66e000000000000000000010",
    images: ["https://placehold.co/600x600?text=IKEA+Chair+Sold"],
    name: "이케아 POANG 암체어",
    category: "가구 > 의자",
    info: "쿠션에 약간의 사용감이 있지만 프레임은 깨끗합니다.",
    initialPrice: 65000,
    minimum: 40000,
    region: "서울특별시 용산구 한남동",
    status: "중",
    createdAt: daysAgo(28),
  },
  {
    _id: "66e000000000000000000011",
    images: ["https://placehold.co/600x600?text=Atomic+Habits"],
    name: "아주 작은 습관의 힘",
    category: "도서 > 자기계발",
    info: "한 번 읽었고 필기나 접힌 페이지가 없습니다.",
    initialPrice: 18000,
    minimum: 9000,
    region: "서울특별시 송파구 잠실동",
    status: "최상",
    createdAt: hoursAgo(12),
  },
  {
    _id: "66e000000000000000000012",
    images: [
      "https://placehold.co/600x600?text=Nike+Dunk+Panda",
      "https://placehold.co/600x600?text=Nike+Dunk+Sole",
    ],
    name: "나이키 덩크 로우 범고래 270",
    category: "패션 > 신발",
    info: "실착 약 5회이며 밑창과 갑피 상태가 좋습니다.",
    initialPrice: 160000,
    minimum: 100000,
    region: "서울특별시 영등포구 당산동",
    status: "상",
    createdAt: daysAgo(5),
  },
];

export const watchlists = [
  { _id: "66f000000000000000000001", productId: "66e000000000000000000001", userId: "66d000000000000000000003", createdAt: hoursAgo(2) },
  { _id: "66f000000000000000000002", productId: "66e000000000000000000001", userId: "66d000000000000000000004", createdAt: hoursAgo(5) },
  { _id: "66f000000000000000000003", productId: "66e000000000000000000001", userId: "66d000000000000000000005", createdAt: hoursAgo(18) },
  { _id: "66f000000000000000000004", productId: "66e000000000000000000001", userId: "66d000000000000000000006", createdAt: hoursAgo(30) },
  { _id: "66f000000000000000000005", productId: "66e000000000000000000006", userId: "66d000000000000000000002", createdAt: hoursAgo(1) },
  { _id: "66f000000000000000000006", productId: "66e000000000000000000006", userId: "66d000000000000000000003", createdAt: hoursAgo(4) },
  { _id: "66f000000000000000000007", productId: "66e000000000000000000006", userId: "66d000000000000000000004", createdAt: hoursAgo(9) },
  { _id: "66f000000000000000000008", productId: "66e000000000000000000006", userId: "66d000000000000000000006", createdAt: hoursAgo(20) },
  { _id: "66f000000000000000000009", productId: "66e000000000000000000006", userId: "66d000000000000000000007", createdAt: hoursAgo(36) },
  { _id: "66f00000000000000000000a", productId: "66e000000000000000000006", userId: "66d000000000000000000008", createdAt: daysAgo(3) },
  { _id: "66f00000000000000000000b", productId: "66e00000000000000000000b", userId: "66d000000000000000000002", createdAt: hoursAgo(6) },
  { _id: "66f00000000000000000000c", productId: "66e00000000000000000000b", userId: "66d000000000000000000005", createdAt: hoursAgo(15) },
  { _id: "66f00000000000000000000d", productId: "66e00000000000000000000b", userId: "66d000000000000000000007", createdAt: hoursAgo(28) },
  { _id: "66f00000000000000000000e", productId: "66e00000000000000000000b", userId: "66d000000000000000000009", createdAt: daysAgo(4) },
  { _id: "66f00000000000000000000f", productId: "66e00000000000000000000f", userId: "66d000000000000000000002", createdAt: hoursAgo(7) },
  { _id: "66f000000000000000000010", productId: "66e00000000000000000000f", userId: "66d000000000000000000008", createdAt: hoursAgo(40) },
  { _id: "66f000000000000000000011", productId: "66e000000000000000000011", userId: "66d000000000000000000003", createdAt: hoursAgo(3) },
  { _id: "66f000000000000000000012", productId: "66e000000000000000000011", userId: "66d000000000000000000004", createdAt: hoursAgo(8) },
  { _id: "66f000000000000000000013", productId: "66e000000000000000000011", userId: "66d000000000000000000006", createdAt: hoursAgo(10) },
  { _id: "66f000000000000000000014", productId: "66e000000000000000000011", userId: "66d000000000000000000007", createdAt: hoursAgo(11) },
  { _id: "66f000000000000000000015", productId: "66e000000000000000000011", userId: "66d000000000000000000008", createdAt: hoursAgo(12) },
  { _id: "66f000000000000000000016", productId: "66e000000000000000000011", userId: "66d000000000000000000009", createdAt: hoursAgo(12) },
  { _id: "66f000000000000000000017", productId: "66e000000000000000000012", userId: "66d000000000000000000002", createdAt: hoursAgo(14) },
  { _id: "66f000000000000000000018", productId: "66e000000000000000000012", userId: "66d000000000000000000003", createdAt: hoursAgo(24) },
  { _id: "66f000000000000000000019", productId: "66e000000000000000000012", userId: "66d000000000000000000004", createdAt: hoursAgo(47) },
];

export const transactions = [
  { _id: "670000000000000000000001", buyerId: "66d000000000000000000003", sellerId: "66d000000000000000000002", productId: "66e000000000000000000002", price: 82000, createdAt: daysAgo(5) },
  { _id: "670000000000000000000002", buyerId: "66d000000000000000000004", sellerId: "66d000000000000000000003", productId: "66e000000000000000000003", price: 84000, createdAt: daysAgo(12) },
  { _id: "670000000000000000000003", buyerId: "66d000000000000000000005", sellerId: "66d000000000000000000004", productId: "66e000000000000000000004", price: 90000, createdAt: daysAgo(20) },
  { _id: "670000000000000000000004", buyerId: "66d000000000000000000006", sellerId: "66d000000000000000000005", productId: "66e000000000000000000005", price: 70000, createdAt: daysAgo(45) },
  { _id: "670000000000000000000005", buyerId: "66d000000000000000000007", sellerId: "66d000000000000000000005", productId: "66e000000000000000000007", price: 610000, createdAt: daysAgo(4) },
  { _id: "670000000000000000000006", buyerId: "66d000000000000000000008", sellerId: "66d000000000000000000006", productId: "66e000000000000000000008", price: 640000, createdAt: daysAgo(14) },
  { _id: "670000000000000000000007", buyerId: "66d000000000000000000009", sellerId: "66d000000000000000000007", productId: "66e000000000000000000009", price: 590000, createdAt: daysAgo(26) },
  { _id: "670000000000000000000008", buyerId: "66d000000000000000000002", sellerId: "66d000000000000000000008", productId: "66e00000000000000000000a", price: 550000, createdAt: daysAgo(50) },
  { _id: "670000000000000000000009", buyerId: "66d000000000000000000004", sellerId: "66d000000000000000000003", productId: "66e00000000000000000000c", price: 245000, createdAt: daysAgo(35) },
  { _id: "67000000000000000000000a", buyerId: "66d000000000000000000005", sellerId: "66d000000000000000000004", productId: "66e00000000000000000000d", price: 235000, createdAt: daysAgo(46) },
  { _id: "67000000000000000000000b", buyerId: "66d000000000000000000006", sellerId: "66d000000000000000000005", productId: "66e00000000000000000000e", price: 220000, createdAt: daysAgo(58) },
  { _id: "67000000000000000000000c", buyerId: "66d000000000000000000009", sellerId: "66d000000000000000000004", productId: "66e000000000000000000010", price: 48000, createdAt: daysAgo(18) },
];

export const priceChange = [
  { _id: "671000000000000000000001", productId: "66e000000000000000000001", changedAt: daysAgo(12), previousPrice: 105000, newPrice: 105000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000002", productId: "66e000000000000000000001", changedAt: daysAgo(7), previousPrice: 105000, newPrice: 99750, seq: 1, reason: "시장가격보다 10% 이상 비싸고 수요가 LOW여서 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000003", productId: "66e000000000000000000001", changedAt: daysAgo(3), previousPrice: 99750, newPrice: 94763, seq: 2, reason: "시장가격보다 10% 이상 비싸고 수요가 LOW여서 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000004", productId: "66e000000000000000000001", changedAt: daysAgo(1), previousPrice: 94763, newPrice: 94763, seq: 3, reason: "시장가격 범위 안에 있어 가격 유지", status: "KEEP" },

  { _id: "671000000000000000000005", productId: "66e000000000000000000002", changedAt: daysAgo(18), previousPrice: 92000, newPrice: 92000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000006", productId: "66e000000000000000000002", changedAt: daysAgo(5), previousPrice: 92000, newPrice: 82000, seq: 1, reason: "판매자와 구매자의 거래가 82,000원에 성사", status: "DOWN" },
  { _id: "671000000000000000000007", productId: "66e000000000000000000003", changedAt: daysAgo(25), previousPrice: 95000, newPrice: 95000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000008", productId: "66e000000000000000000003", changedAt: daysAgo(12), previousPrice: 95000, newPrice: 84000, seq: 1, reason: "판매자와 구매자의 거래가 84,000원에 성사", status: "DOWN" },
  { _id: "671000000000000000000009", productId: "66e000000000000000000004", changedAt: daysAgo(30), previousPrice: 105000, newPrice: 105000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000a", productId: "66e000000000000000000004", changedAt: daysAgo(20), previousPrice: 105000, newPrice: 90000, seq: 1, reason: "판매자와 구매자의 거래가 90,000원에 성사", status: "DOWN" },
  { _id: "67100000000000000000000b", productId: "66e000000000000000000005", changedAt: daysAgo(52), previousPrice: 80000, newPrice: 80000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000c", productId: "66e000000000000000000005", changedAt: daysAgo(45), previousPrice: 80000, newPrice: 70000, seq: 1, reason: "판매자와 구매자의 거래가 70,000원에 성사", status: "DOWN" },

  { _id: "67100000000000000000000d", productId: "66e000000000000000000006", changedAt: daysAgo(15), previousPrice: 760000, newPrice: 760000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000e", productId: "66e000000000000000000006", changedAt: daysAgo(8), previousPrice: 760000, newPrice: 722000, seq: 1, reason: "시장가격보다 10% 이상 비싸고 수요가 LOW여서 5% 인하", status: "DOWN" },
  { _id: "67100000000000000000000f", productId: "66e000000000000000000006", changedAt: daysAgo(4), previousPrice: 722000, newPrice: 700340, seq: 2, reason: "시장가격보다 5% 초과 10% 미만 비싸고 수요가 LOW여서 3% 인하", status: "DOWN" },
  { _id: "671000000000000000000010", productId: "66e000000000000000000006", changedAt: daysAgo(1), previousPrice: 700340, newPrice: 686333, seq: 3, reason: "시장가격보다 5% 초과로 비싸고 수요가 NORMAL이어서 2% 인하", status: "DOWN" },

  { _id: "671000000000000000000011", productId: "66e000000000000000000007", changedAt: daysAgo(22), previousPrice: 680000, newPrice: 680000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000012", productId: "66e000000000000000000007", changedAt: daysAgo(4), previousPrice: 680000, newPrice: 610000, seq: 1, reason: "판매자와 구매자의 거래가 610,000원에 성사", status: "DOWN" },
  { _id: "671000000000000000000013", productId: "66e000000000000000000008", changedAt: daysAgo(35), previousPrice: 700000, newPrice: 700000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000014", productId: "66e000000000000000000008", changedAt: daysAgo(14), previousPrice: 700000, newPrice: 640000, seq: 1, reason: "판매자와 구매자의 거래가 640,000원에 성사", status: "DOWN" },
  { _id: "671000000000000000000015", productId: "66e000000000000000000009", changedAt: daysAgo(42), previousPrice: 660000, newPrice: 660000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000016", productId: "66e000000000000000000009", changedAt: daysAgo(26), previousPrice: 660000, newPrice: 590000, seq: 1, reason: "판매자와 구매자의 거래가 590,000원에 성사", status: "DOWN" },
  { _id: "671000000000000000000017", productId: "66e00000000000000000000a", changedAt: daysAgo(67), previousPrice: 650000, newPrice: 650000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000018", productId: "66e00000000000000000000a", changedAt: daysAgo(50), previousPrice: 650000, newPrice: 550000, seq: 1, reason: "판매자와 구매자의 거래가 550,000원에 성사", status: "DOWN" },

  { _id: "671000000000000000000019", productId: "66e00000000000000000000b", changedAt: daysAgo(10), previousPrice: 300000, newPrice: 300000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000001a", productId: "66e00000000000000000000b", changedAt: daysAgo(5), previousPrice: 300000, newPrice: 285000, seq: 1, reason: "시장가격보다 10% 이상 비싸고 수요가 LOW여서 5% 인하", status: "DOWN" },
  { _id: "67100000000000000000001b", productId: "66e00000000000000000000b", changedAt: daysAgo(1), previousPrice: 285000, newPrice: 285000, seq: 2, reason: "최근 30일 거래가 없어 60일 거래가격을 확인한 뒤 수요가 HIGH여서 가격 유지", status: "KEEP" },
  { _id: "67100000000000000000001c", productId: "66e00000000000000000000c", changedAt: daysAgo(48), previousPrice: 280000, newPrice: 280000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000001d", productId: "66e00000000000000000000c", changedAt: daysAgo(35), previousPrice: 280000, newPrice: 245000, seq: 1, reason: "판매자와 구매자의 거래가 245,000원에 성사", status: "DOWN" },
  { _id: "67100000000000000000001e", productId: "66e00000000000000000000d", changedAt: daysAgo(56), previousPrice: 270000, newPrice: 270000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000001f", productId: "66e00000000000000000000d", changedAt: daysAgo(46), previousPrice: 270000, newPrice: 235000, seq: 1, reason: "판매자와 구매자의 거래가 235,000원에 성사", status: "DOWN" },
  { _id: "671000000000000000000020", productId: "66e00000000000000000000e", changedAt: daysAgo(63), previousPrice: 260000, newPrice: 260000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000021", productId: "66e00000000000000000000e", changedAt: daysAgo(58), previousPrice: 260000, newPrice: 220000, seq: 1, reason: "판매자와 구매자의 거래가 220,000원에 성사", status: "DOWN" },

  { _id: "671000000000000000000022", productId: "66e00000000000000000000f", changedAt: daysAgo(8), previousPrice: 80000, newPrice: 80000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000023", productId: "66e00000000000000000000f", changedAt: daysAgo(3), previousPrice: 80000, newPrice: 76000, seq: 1, reason: "시장가격보다 10% 이상 비싸고 수요가 LOW여서 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000024", productId: "66e000000000000000000010", changedAt: daysAgo(28), previousPrice: 65000, newPrice: 65000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000025", productId: "66e000000000000000000010", changedAt: daysAgo(18), previousPrice: 65000, newPrice: 48000, seq: 1, reason: "판매자와 구매자의 거래가 48,000원에 성사", status: "DOWN" },

  { _id: "671000000000000000000026", productId: "66e000000000000000000011", changedAt: hoursAgo(12), previousPrice: 18000, newPrice: 18000, seq: 0, reason: "등록 후 24시간이 지나지 않아 가격 유지", status: "KEEP" },
  { _id: "671000000000000000000027", productId: "66e000000000000000000012", changedAt: daysAgo(5), previousPrice: 160000, newPrice: 160000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000028", productId: "66e000000000000000000012", changedAt: daysAgo(1), previousPrice: 160000, newPrice: 160000, seq: 1, reason: "유사 거래 데이터가 없어 가격 유지", status: "KEEP" },
];

function validateUniqueIds(collectionName, documents) {
  const ids = documents.map((document) => document._id);
  const uniqueIds = new Set(ids);

  if (uniqueIds.size !== ids.length) {
    throw new Error(`${collectionName} 컬렉션에 중복된 _id가 있습니다.`);
  }
}

function validateSeedData() {
  validateUniqueIds("users", users);
  validateUniqueIds("products", products);
  validateUniqueIds("watchlists", watchlists);
  validateUniqueIds("transactions", transactions);
  validateUniqueIds("priceChange", priceChange);

  const userIds = new Set(users.map((user) => user._id));
  const productIds = new Set(products.map((product) => product._id));
  const watchlistRelations = new Set();

  for (const product of products) {
    if (product.images.length > 5) {
      throw new Error(`${product._id}: 상품 이미지는 최대 5개까지 허용됩니다.`);
    }

    if (product.minimum > product.initialPrice) {
      throw new Error(`${product._id}: 최저 판매 가격이 판매 시작 가격보다 높습니다.`);
    }
  }

  for (const watchlist of watchlists) {
    if (!userIds.has(watchlist.userId) || !productIds.has(watchlist.productId)) {
      throw new Error(`${watchlist._id}: 존재하지 않는 회원 또는 상품을 참조합니다.`);
    }

    const relation = `${watchlist.userId}:${watchlist.productId}`;
    if (watchlistRelations.has(relation)) {
      throw new Error(`${watchlist._id}: 중복된 관심목록 관계입니다.`);
    }
    watchlistRelations.add(relation);
  }

  for (const transaction of transactions) {
    if (!userIds.has(transaction.buyerId) || !userIds.has(transaction.sellerId)) {
      throw new Error(`${transaction._id}: 존재하지 않는 구매자 또는 판매자를 참조합니다.`);
    }

    if (!productIds.has(transaction.productId)) {
      throw new Error(`${transaction._id}: 존재하지 않는 상품을 참조합니다.`);
    }

    if (transaction.buyerId === transaction.sellerId) {
      throw new Error(`${transaction._id}: 구매자와 판매자가 같습니다.`);
    }
  }

  const priceChangesByProduct = new Map();

  for (const change of priceChange) {
    if (!productIds.has(change.productId)) {
      throw new Error(`${change._id}: 존재하지 않는 상품을 참조합니다.`);
    }

    if (!priceChangesByProduct.has(change.productId)) {
      priceChangesByProduct.set(change.productId, []);
    }
    priceChangesByProduct.get(change.productId).push(change);
  }

  for (const product of products) {
    const changes = priceChangesByProduct.get(product._id) ?? [];

    if (changes.length === 0) {
      throw new Error(`${product._id}: 가격변동 데이터가 없습니다.`);
    }

    changes.sort((first, second) => first.seq - second.seq);

    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];

      if (change.seq !== index) {
        throw new Error(`${product._id}: 가격변동 seq가 순서대로 이어지지 않습니다.`);
      }

      if (change.newPrice > product.initialPrice || change.newPrice < product.minimum) {
        throw new Error(`${change._id}: 변경 가격이 판매 가격 범위를 벗어났습니다.`);
      }

      if (index > 0 && change.previousPrice !== changes[index - 1].newPrice) {
        throw new Error(`${change._id}: 이전 가격과 앞선 변경 가격이 일치하지 않습니다.`);
      }
    }
  }
}

validateSeedData();

export const seedData = {
  users,
  products,
  watchlists,
  transactions,
  priceChange,
};
