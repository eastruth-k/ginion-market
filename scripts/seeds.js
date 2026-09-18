import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { hashPassword } from "better-auth/crypto";
import { MongoClient, ObjectId } from "mongodb";

export const DEMO_USER_PASSWORD = "Demo1234!";

export const DEMO_USER_IDS = Object.freeze({
  admin: "66d000000000000000000001",
  minsu: "66d000000000000000000002",
  jiyun: "66d000000000000000000003",
  seojun: "66d000000000000000000004",
  yuna: "66d000000000000000000005",
  interest01: "66d000000000000000000006",
  interest02: "66d000000000000000000007",
  interest03: "66d000000000000000000008",
  interest04: "66d000000000000000000009",
  interest05: "66d00000000000000000000a",
  interest06: "66d00000000000000000000b",
});

export const users = [
  {
    _id: DEMO_USER_IDS.admin,
    email: "admin@daepa.test",
    emailVerified: true,
    nickname: "대파관리자",
    image: null,
    address: "서울특별시 강남구 역삼동",
    createdAt: new Date("2026-03-01T00:00:00.000Z"),
    updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    role: "관리자",
  },
  {
    _id: DEMO_USER_IDS.minsu,
    email: "minsu@daepa.test",
    emailVerified: true,
    nickname: "민수마켓",
    image: null,
    address: "서울특별시 강남구 역삼동",
    createdAt: new Date("2026-04-10T00:00:00.000Z"),
    updatedAt: new Date("2026-04-10T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.jiyun,
    email: "jiyun@daepa.test",
    emailVerified: true,
    nickname: "지윤상점",
    image: null,
    address: "인천광역시 연수구 송도동",
    createdAt: new Date("2026-05-15T00:00:00.000Z"),
    updatedAt: new Date("2026-05-15T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.seojun,
    email: "seojun@daepa.test",
    emailVerified: true,
    nickname: "서준중고",
    image: null,
    address: "서울특별시 마포구 서교동",
    createdAt: new Date("2026-06-20T00:00:00.000Z"),
    updatedAt: new Date("2026-06-20T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.yuna,
    email: "yuna@daepa.test",
    emailVerified: true,
    nickname: "유나마켓",
    image: null,
    address: "경기도 수원시 영통구 광교동",
    createdAt: new Date("2026-07-25T00:00:00.000Z"),
    updatedAt: new Date("2026-07-25T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.interest01,
    email: "interest01@daepa.test",
    emailVerified: true,
    nickname: "관심시연01",
    image: null,
    address: "서울특별시 종로구 청운동",
    createdAt: new Date("2026-08-01T00:00:00.000Z"),
    updatedAt: new Date("2026-08-01T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.interest02,
    email: "interest02@daepa.test",
    emailVerified: true,
    nickname: "관심시연02",
    image: null,
    address: "서울특별시 용산구 이촌동",
    createdAt: new Date("2026-08-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-02T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.interest03,
    email: "interest03@daepa.test",
    emailVerified: true,
    nickname: "관심시연03",
    image: null,
    address: "서울특별시 성동구 성수동",
    createdAt: new Date("2026-08-03T00:00:00.000Z"),
    updatedAt: new Date("2026-08-03T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.interest04,
    email: "interest04@daepa.test",
    emailVerified: true,
    nickname: "관심시연04",
    image: null,
    address: "서울특별시 광진구 자양동",
    createdAt: new Date("2026-08-04T00:00:00.000Z"),
    updatedAt: new Date("2026-08-04T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.interest05,
    email: "interest05@daepa.test",
    emailVerified: true,
    nickname: "관심시연05",
    image: null,
    address: "서울특별시 동작구 사당동",
    createdAt: new Date("2026-08-05T00:00:00.000Z"),
    updatedAt: new Date("2026-08-05T00:00:00.000Z"),
    role: "일반회원",
  },
  {
    _id: DEMO_USER_IDS.interest06,
    email: "interest06@daepa.test",
    emailVerified: true,
    nickname: "관심시연06",
    image: null,
    address: "경기도 고양시 일산동구 백석동",
    createdAt: new Date("2026-08-06T00:00:00.000Z"),
    updatedAt: new Date("2026-08-06T00:00:00.000Z"),
    role: "일반회원",
  },
];

const accountIds = [
  "66c000000000000000000001",
  "66c000000000000000000002",
  "66c000000000000000000003",
  "66c000000000000000000004",
  "66c000000000000000000005",
  "66c000000000000000000006",
  "66c000000000000000000007",
  "66c000000000000000000008",
  "66c000000000000000000009",
  "66c00000000000000000000a",
  "66c00000000000000000000b",
];

export async function createCredentialAccounts(passwordHasher = hashPassword) {
  return Promise.all(
    users.map(async (user, index) => ({
      _id: accountIds[index],
      accountId: user._id,
      providerId: "credential",
      userId: user._id,
      password: await passwordHasher(DEMO_USER_PASSWORD),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  );
}

function getSeedProductImages(imageName) {
  return Array.from(
    { length: 5 },
    (_, index) => `/images/products/seed/${imageName}-${index + 1}.webp`,
  );
}

export const categories = [
  "가구 > 수납가구",
  "가구 > 의자",
  "도서 > 자기계발",
  "반려동물 > 고양이용품",
  "반려동물 > 이동장",
  "뷰티 > 스킨케어",
  "생활 > 주방용품",
  "생활가전 > 청소기",
  "생활가전 > 커피머신",
  "스포츠 > 자전거",
  "스포츠 > 캠핑",
  "스포츠 > 홈트레이닝",
  "식물 > 관엽식물",
  "유아동 > 완구",
  "유아동 > 유모차",
  "전자기기 > 게임기",
  "전자기기 > 스마트폰",
  "전자기기 > 이어폰",
  "전자기기 > 헤드폰",
  "취미 > 보드게임",
  "취미 > 악기",
  "패션 > 가방",
  "패션 > 신발",
  "패션 > 여성의류",
].map((name, index) => ({
  _id: `66b0000000000000000000${(index + 1).toString(16).padStart(2, "0")}`,
  name,
  sortOrder: index + 1,
}));

export const products = [
  {
    _id: "66e000000000000000000001",
    images: [
      "/images/products/seed/airpods-1.webp",
      "/images/products/seed/airpods-2.webp",
      "/images/products/seed/airpods-3.webp",
      "/images/products/seed/airpods-4.webp",
      "/images/products/seed/airpods-5.webp",
    ],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "충전 케이스와 이어팁을 모두 보관하고 있으며 정상 작동합니다.",
    initialPrice: 105000,
    minimumPrice: 70000,
    currentPrice: 94763,
    region: "서울특별시 강남구 역삼동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-01T01:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000002",
    images: [
      "/images/products/seed/iphone13-1.webp",
      "/images/products/seed/iphone13-2.webp",
      "/images/products/seed/iphone13-3.webp",
      "/images/products/seed/iphone13-4.webp",
      "/images/products/seed/iphone13-5.webp",
    ],
    name: "아이폰 13 128GB 미드나이트",
    category: "전자기기 > 스마트폰",
    info: "배터리 성능은 88%이며 액정과 카메라가 정상 작동합니다.",
    initialPrice: 760000,
    minimumPrice: 560000,
    currentPrice: 700340,
    region: "인천광역시 연수구 송도동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-08-25T03:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000003",
    images: [
      "/images/products/seed/switchOled-1.webp",
      "/images/products/seed/switchOled-2.webp",
      "/images/products/seed/switchOled-3.webp",
      "/images/products/seed/switchOled-4.webp",
      "/images/products/seed/switchOled-5.webp",
    ],
    name: "닌텐도 스위치 OLED 화이트",
    category: "전자기기 > 게임기",
    info: "독과 정품 충전기를 포함하며 조이콘 쏠림이 없습니다.",
    initialPrice: 300000,
    minimumPrice: 210000,
    currentPrice: 285000,
    region: "서울특별시 마포구 서교동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-08-29T06:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000004",
    images: [
      "/images/products/seed/armchair-1.webp",
      "/images/products/seed/armchair-2.webp",
      "/images/products/seed/armchair-3.webp",
      "/images/products/seed/armchair-4.webp",
      "/images/products/seed/armchair-5.webp",
    ],
    name: "이케아 POANG 암체어",
    category: "가구 > 의자",
    info: "생활 사용감은 있지만 흔들림 없이 튼튼합니다.",
    initialPrice: 80000,
    minimumPrice: 40000,
    currentPrice: 76000,
    region: "경기도 성남시 분당구 정자동",
    condition: "중",
    status: "판매중",
    createdAt: new Date("2026-09-02T02:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000005",
    images: [
      "/images/products/seed/habitBook-1.webp",
      "/images/products/seed/habitBook-2.webp",
      "/images/products/seed/habitBook-3.webp",
      "/images/products/seed/habitBook-4.webp",
      "/images/products/seed/habitBook-5.webp",
    ],
    name: "아주 작은 습관의 힘",
    category: "도서 > 자기계발",
    info: "한 번 읽었고 필기나 접힌 페이지가 없습니다.",
    initialPrice: 18000,
    minimumPrice: 9000,
    currentPrice: 18000,
    region: "서울특별시 송파구 잠실동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-09-08T20:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000006",
    images: [
      "/images/products/seed/airpods-1.webp",
      "/images/products/seed/airpods-2.webp",
      "/images/products/seed/airpods-3.webp",
      "/images/products/seed/airpods-4.webp",
      "/images/products/seed/airpods-5.webp",
    ],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "생활 흠집이 조금 있지만 배터리와 음질 상태가 좋습니다.",
    initialPrice: 92000,
    minimumPrice: 75000,
    currentPrice: 82000,
    region: "서울특별시 영등포구 당산동",
    condition: "상",
    status: "판매 완료",
    createdAt: new Date("2026-08-18T04:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000007",
    images: [
      "/images/products/seed/airpods-1.webp",
      "/images/products/seed/airpods-2.webp",
      "/images/products/seed/airpods-3.webp",
      "/images/products/seed/airpods-4.webp",
      "/images/products/seed/airpods-5.webp",
    ],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "정품 구성품을 모두 포함하며 케이스에 미세한 사용감이 있습니다.",
    initialPrice: 95000,
    minimumPrice: 78000,
    currentPrice: 84000,
    region: "경기도 수원시 영통구 광교동",
    condition: "상",
    status: "판매 완료",
    createdAt: new Date("2026-08-12T05:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e000000000000000000008",
    images: [
      "/images/products/seed/airpods-1.webp",
      "/images/products/seed/airpods-2.webp",
      "/images/products/seed/airpods-3.webp",
      "/images/products/seed/airpods-4.webp",
      "/images/products/seed/airpods-5.webp",
    ],
    name: "에어팟 프로 2세대 USB-C",
    category: "전자기기 > 이어폰",
    info: "사용 횟수가 적고 외관이 깨끗합니다.",
    initialPrice: 105000,
    minimumPrice: 82000,
    currentPrice: 90000,
    region: "서울특별시 용산구 한남동",
    condition: "최상",
    status: "판매 완료",
    createdAt: new Date("2026-08-05T08:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000009",
    images: [
      "/images/products/seed/headphones-1.webp",
      "/images/products/seed/headphones-2.webp",
      "/images/products/seed/headphones-3.webp",
      "/images/products/seed/headphones-4.webp",
      "/images/products/seed/headphones-5.webp",
    ],
    name: "프리미엄 노이즈 캔슬링 헤드폰",
    category: "전자기기 > 헤드폰",
    info: "전용 케이스와 충전 케이블을 포함하며 이어패드 상태가 좋습니다.",
    initialPrice: 320000,
    minimumPrice: 220000,
    currentPrice: 288000,
    region: "서울특별시 성동구 성수동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-03T04:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e00000000000000000000a",
    images: [
      "/images/products/seed/espresso-1.webp",
      "/images/products/seed/espresso-2.webp",
      "/images/products/seed/espresso-3.webp",
      "/images/products/seed/espresso-4.webp",
      "/images/products/seed/espresso-5.webp",
    ],
    name: "스테인리스 반자동 커피머신",
    category: "생활가전 > 커피머신",
    info: "포터필터와 스팀 피처 등 기본 구성품을 모두 보관하고 있습니다.",
    initialPrice: 190000,
    minimumPrice: 120000,
    currentPrice: 180500,
    region: "서울특별시 광진구 자양동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-04T02:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e00000000000000000000b",
    images: [
      "/images/products/seed/tent-1.webp",
      "/images/products/seed/tent-2.webp",
      "/images/products/seed/tent-3.webp",
      "/images/products/seed/tent-4.webp",
      "/images/products/seed/tent-5.webp",
    ],
    name: "베이지 4인용 돔 캠핑 텐트",
    category: "스포츠 > 캠핑",
    info: "폴대와 전용 가방을 포함하며 우천 사용 없이 세 번 설치했습니다.",
    initialPrice: 160000,
    minimumPrice: 90000,
    currentPrice: 152000,
    region: "경기도 고양시 일산동구 백석동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-05T05:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e00000000000000000000c",
    images: [
      "/images/products/seed/robotVacuum-1.webp",
      "/images/products/seed/robotVacuum-2.webp",
      "/images/products/seed/robotVacuum-3.webp",
      "/images/products/seed/robotVacuum-4.webp",
      "/images/products/seed/robotVacuum-5.webp",
    ],
    name: "라이다 로봇청소기 화이트",
    category: "생활가전 > 청소기",
    info: "충전 도크와 여분 브러시를 포함하며 센서와 흡입 기능이 정상입니다.",
    initialPrice: 280000,
    minimumPrice: 180000,
    currentPrice: 266000,
    region: "경기도 용인시 수지구 죽전동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-06T01:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e00000000000000000000d",
    images: getSeedProductImages("bookshelf"),
    name: "라이트 오크 3단 원목 책장",
    category: "가구 > 수납가구",
    info: "선반 휨이나 흔들림 없이 튼튼하며 모서리에 옅은 생활 흔적만 있습니다.",
    initialPrice: 65000,
    minimumPrice: 35000,
    currentPrice: 65000,
    region: "서울특별시 은평구 불광동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T02:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e00000000000000000000e",
    images: getSeedProductImages("dinnerware"),
    name: "크림 도자기 4인 식기 세트",
    category: "생활 > 주방용품",
    info: "밥공기와 국그릇, 접시, 머그 구성이며 이 빠짐이나 금이 없습니다.",
    initialPrice: 48000,
    minimumPrice: 25000,
    currentPrice: 48000,
    region: "경기도 성남시 수정구 창곡동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-09-07T03:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e00000000000000000000f",
    images: getSeedProductImages("dutch-oven"),
    name: "네이비 무쇠 주물냄비 24cm",
    category: "생활 > 주방용품",
    info: "내부 코팅 상태가 깨끗하고 뚜껑과 손잡이에 파손이 없습니다.",
    initialPrice: 85000,
    minimumPrice: 50000,
    currentPrice: 85000,
    region: "서울특별시 동작구 상도동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T04:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000010",
    images: getSeedProductImages("stroller"),
    name: "베이지 절충형 유모차",
    category: "유아동 > 유모차",
    info: "차양과 안전벨트가 정상이며 세탁 후 실내에서 보관했습니다.",
    initialPrice: 190000,
    minimumPrice: 120000,
    currentPrice: 190000,
    region: "서울특별시 양천구 목동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T05:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000011",
    images: getSeedProductImages("play-kitchen"),
    name: "파스텔 원목 주방놀이 세트",
    category: "유아동 > 완구",
    info: "싱크대와 조리도구 구성이 모두 있으며 낙서 없이 깨끗합니다.",
    initialPrice: 70000,
    minimumPrice: 40000,
    currentPrice: 70000,
    region: "경기도 화성시 동탄동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T06:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e000000000000000000012",
    images: getSeedProductImages("building-blocks"),
    name: "대용량 컬러 조립 블록 세트",
    category: "유아동 > 완구",
    info: "보관함을 포함한 대용량 구성으로 세척과 수량 확인을 마쳤습니다.",
    initialPrice: 35000,
    minimumPrice: 18000,
    currentPrice: 35000,
    region: "인천광역시 남동구 구월동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T07:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000013",
    images: getSeedProductImages("acoustic-guitar"),
    name: "내추럴 통기타와 소프트 케이스",
    category: "취미 > 악기",
    info: "넥 휨이 없고 최근 줄을 교체했으며 이동용 소프트 케이스를 드립니다.",
    initialPrice: 160000,
    minimumPrice: 90000,
    currentPrice: 160000,
    region: "서울특별시 관악구 봉천동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T08:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000014",
    images: getSeedProductImages("dumbbells"),
    name: "무게 조절 덤벨 20kg 한 쌍",
    category: "스포츠 > 홈트레이닝",
    info: "원판과 고정 너트 구성이 모두 있으며 손잡이 그립 상태가 좋습니다.",
    initialPrice: 90000,
    minimumPrice: 50000,
    currentPrice: 90000,
    region: "경기도 수원시 팔달구 인계동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T09:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000015",
    images: getSeedProductImages("mountain-bike"),
    name: "블랙 27.5인치 산악자전거",
    category: "스포츠 > 자전거",
    info: "변속과 브레이크가 정상이며 최근 타이어 공기압과 체인을 점검했습니다.",
    initialPrice: 430000,
    minimumPrice: 280000,
    currentPrice: 430000,
    region: "서울특별시 노원구 중계동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T10:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e000000000000000000016",
    images: getSeedProductImages("camping-wagon"),
    name: "다크그린 접이식 캠핑 웨건",
    category: "스포츠 > 캠핑",
    info: "접이와 바퀴 회전이 부드럽고 전용 커버까지 함께 보관하고 있습니다.",
    initialPrice: 110000,
    minimumPrice: 65000,
    currentPrice: 110000,
    region: "경기도 고양시 덕양구 화정동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-07T11:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e000000000000000000017",
    images: getSeedProductImages("wool-coat"),
    name: "카멜 울 혼방 롱코트",
    category: "패션 > 여성의류",
    info: "드라이클리닝 후 보관했으며 오염이나 보풀 없이 안감도 깨끗합니다.",
    initialPrice: 95000,
    minimumPrice: 55000,
    currentPrice: 95000,
    region: "서울특별시 서대문구 연희동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-09-08T01:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e000000000000000000018",
    images: getSeedProductImages("crossbody-bag"),
    name: "브라운 가죽 크로스백",
    category: "패션 > 가방",
    info: "수납칸과 잠금장치가 정상이며 가죽에 자연스러운 사용감만 있습니다.",
    initialPrice: 78000,
    minimumPrice: 45000,
    currentPrice: 78000,
    region: "서울특별시 성북구 성북동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-08T02:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e000000000000000000019",
    images: getSeedProductImages("white-sneakers"),
    name: "오프화이트 데일리 스니커즈 240",
    category: "패션 > 신발",
    info: "세탁을 마쳤고 밑창 마모가 적어 바로 착용할 수 있습니다.",
    initialPrice: 45000,
    minimumPrice: 25000,
    currentPrice: 45000,
    region: "경기도 안양시 동안구 평촌동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-08T03:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e00000000000000000001a",
    images: getSeedProductImages("skincare-set"),
    name: "미개봉 보습 스킨케어 3종 세트",
    category: "뷰티 > 스킨케어",
    info: "펌프형 로션과 에센스, 크림 구성으로 모두 밀봉된 미사용 제품입니다.",
    initialPrice: 52000,
    minimumPrice: 30000,
    currentPrice: 52000,
    region: "서울특별시 강서구 마곡동",
    condition: "최상",
    status: "판매중",
    createdAt: new Date("2026-09-08T04:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
  {
    _id: "66e00000000000000000001b",
    images: getSeedProductImages("monstera"),
    name: "중형 몬스테라와 세라믹 화분",
    category: "식물 > 관엽식물",
    info: "새잎이 꾸준히 나오는 건강한 개체이며 받침이 있는 화분째 드립니다.",
    initialPrice: 30000,
    minimumPrice: 15000,
    currentPrice: 30000,
    region: "경기도 용인시 기흥구 보정동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-08T05:00:00.000Z"),
    sellerId: DEMO_USER_IDS.jiyun,
  },
  {
    _id: "66e00000000000000000001c",
    images: getSeedProductImages("pet-carrier"),
    name: "베이지 소형견 이동가방",
    category: "반려동물 > 이동장",
    info: "내부 쿠션과 어깨끈을 포함하며 망사와 지퍼에 손상이 없습니다.",
    initialPrice: 40000,
    minimumPrice: 20000,
    currentPrice: 40000,
    region: "인천광역시 부평구 부평동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-08T06:00:00.000Z"),
    sellerId: DEMO_USER_IDS.seojun,
  },
  {
    _id: "66e00000000000000000001d",
    images: getSeedProductImages("cat-tower"),
    name: "라이트우드 3단 캣타워",
    category: "반려동물 > 고양이용품",
    info: "스크래처 기둥과 숨숨집이 튼튼하며 패브릭 부분을 세척했습니다.",
    initialPrice: 70000,
    minimumPrice: 35000,
    currentPrice: 70000,
    region: "서울특별시 중랑구 면목동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-08T07:00:00.000Z"),
    sellerId: DEMO_USER_IDS.yuna,
  },
  {
    _id: "66e00000000000000000001e",
    images: getSeedProductImages("board-games"),
    name: "가족용 보드게임 3종 묶음",
    category: "취미 > 보드게임",
    info: "카드와 말, 주사위 구성품을 모두 확인했으며 설명서도 포함합니다.",
    initialPrice: 42000,
    minimumPrice: 22000,
    currentPrice: 42000,
    region: "경기도 광명시 철산동",
    condition: "상",
    status: "판매중",
    createdAt: new Date("2026-09-08T08:00:00.000Z"),
    sellerId: DEMO_USER_IDS.minsu,
  },
];

export const watchlists = [
  { _id: "66f000000000000000000001", productId: "66e000000000000000000001", userId: DEMO_USER_IDS.jiyun, createdAt: new Date("2026-09-09T01:00:00.000Z") },
  { _id: "66f000000000000000000002", productId: "66e000000000000000000001", userId: DEMO_USER_IDS.seojun, createdAt: new Date("2026-09-08T09:00:00.000Z") },
  { _id: "66f000000000000000000003", productId: "66e000000000000000000002", userId: DEMO_USER_IDS.minsu, createdAt: new Date("2026-09-08T04:00:00.000Z") },
  { _id: "66f000000000000000000004", productId: "66e000000000000000000002", userId: DEMO_USER_IDS.seojun, createdAt: new Date("2026-09-07T03:00:00.000Z") },
  { _id: "66f000000000000000000005", productId: "66e000000000000000000003", userId: DEMO_USER_IDS.yuna, createdAt: new Date("2026-09-06T06:00:00.000Z") },
  { _id: "66f000000000000000000006", productId: "66e000000000000000000004", userId: DEMO_USER_IDS.jiyun, createdAt: new Date("2026-09-05T02:00:00.000Z") },
  { _id: "66f000000000000000000007", productId: "66e000000000000000000005", userId: DEMO_USER_IDS.minsu, createdAt: new Date("2026-09-09T00:30:00.000Z") },
  { _id: "66f000000000000000000008", productId: "66e000000000000000000009", userId: DEMO_USER_IDS.minsu, createdAt: new Date("2026-09-08T23:00:00.000Z") },
  { _id: "66f000000000000000000009", productId: "66e00000000000000000000a", userId: DEMO_USER_IDS.seojun, createdAt: new Date("2026-09-08T22:00:00.000Z") },
  { _id: "66f00000000000000000000a", productId: "66e00000000000000000000b", userId: DEMO_USER_IDS.jiyun, createdAt: new Date("2026-09-08T21:00:00.000Z") },
  { _id: "66f00000000000000000000b", productId: "66e00000000000000000000c", userId: DEMO_USER_IDS.yuna, createdAt: new Date("2026-09-08T20:00:00.000Z") },
];

export const transactions = [
  { _id: "670000000000000000000001", buyerId: DEMO_USER_IDS.jiyun, sellerId: DEMO_USER_IDS.seojun, productId: "66e000000000000000000006", price: 82000, createdAt: new Date("2026-09-04T07:00:00.000Z") },
  { _id: "670000000000000000000002", buyerId: DEMO_USER_IDS.minsu, sellerId: DEMO_USER_IDS.yuna, productId: "66e000000000000000000007", price: 84000, createdAt: new Date("2026-08-28T08:00:00.000Z") },
  { _id: "670000000000000000000003", buyerId: DEMO_USER_IDS.seojun, sellerId: DEMO_USER_IDS.minsu, productId: "66e000000000000000000008", price: 90000, createdAt: new Date("2026-08-20T09:00:00.000Z") },
];

const additionalProductPriceChanges = products.slice(12).map(
  (product, index) => ({
    _id: `6710000000000000000000${(0x1a + index).toString(16)}`,
    productId: product._id,
    changedAt: product.createdAt,
    previousPrice: product.initialPrice,
    newPrice: product.currentPrice,
    seq: 0,
    reason: "상품 최초 등록",
    status: "KEEP",
  }),
);

export const priceChange = [
  { _id: "671000000000000000000001", productId: "66e000000000000000000001", changedAt: new Date("2026-09-01T01:00:00.000Z"), previousPrice: 105000, newPrice: 105000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000002", productId: "66e000000000000000000001", changedAt: new Date("2026-09-05T01:00:00.000Z"), previousPrice: 105000, newPrice: 99750, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000003", productId: "66e000000000000000000001", changedAt: new Date("2026-09-08T01:00:00.000Z"), previousPrice: 99750, newPrice: 94763, seq: 2, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000004", productId: "66e000000000000000000002", changedAt: new Date("2026-08-25T03:00:00.000Z"), previousPrice: 760000, newPrice: 760000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000005", productId: "66e000000000000000000002", changedAt: new Date("2026-09-01T03:00:00.000Z"), previousPrice: 760000, newPrice: 722000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000006", productId: "66e000000000000000000002", changedAt: new Date("2026-09-06T03:00:00.000Z"), previousPrice: 722000, newPrice: 700340, seq: 2, reason: "시장가격보다 비싸고 수요가 낮아 가격을 3% 인하", status: "DOWN" },
  { _id: "671000000000000000000007", productId: "66e000000000000000000003", changedAt: new Date("2026-08-29T06:00:00.000Z"), previousPrice: 300000, newPrice: 300000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000008", productId: "66e000000000000000000003", changedAt: new Date("2026-09-04T06:00:00.000Z"), previousPrice: 300000, newPrice: 285000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000009", productId: "66e000000000000000000004", changedAt: new Date("2026-09-02T02:00:00.000Z"), previousPrice: 80000, newPrice: 80000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000a", productId: "66e000000000000000000004", changedAt: new Date("2026-09-07T02:00:00.000Z"), previousPrice: 80000, newPrice: 76000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "67100000000000000000000b", productId: "66e000000000000000000005", changedAt: new Date("2026-09-08T20:00:00.000Z"), previousPrice: 18000, newPrice: 18000, seq: 0, reason: "등록 후 24시간이 지나지 않아 가격 유지", status: "KEEP" },
  { _id: "67100000000000000000000c", productId: "66e000000000000000000006", changedAt: new Date("2026-08-18T04:00:00.000Z"), previousPrice: 92000, newPrice: 92000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000d", productId: "66e000000000000000000006", changedAt: new Date("2026-09-04T07:00:00.000Z"), previousPrice: 92000, newPrice: 82000, seq: 1, reason: "82,000원에 거래가 성사되어 판매 완료", status: "DOWN" },
  { _id: "67100000000000000000000e", productId: "66e000000000000000000007", changedAt: new Date("2026-08-12T05:00:00.000Z"), previousPrice: 95000, newPrice: 95000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "67100000000000000000000f", productId: "66e000000000000000000007", changedAt: new Date("2026-08-28T08:00:00.000Z"), previousPrice: 95000, newPrice: 84000, seq: 1, reason: "84,000원에 거래가 성사되어 판매 완료", status: "DOWN" },
  { _id: "671000000000000000000010", productId: "66e000000000000000000008", changedAt: new Date("2026-08-05T08:00:00.000Z"), previousPrice: 105000, newPrice: 105000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000011", productId: "66e000000000000000000008", changedAt: new Date("2026-08-20T09:00:00.000Z"), previousPrice: 105000, newPrice: 90000, seq: 1, reason: "90,000원에 거래가 성사되어 판매 완료", status: "DOWN" },
  { _id: "671000000000000000000012", productId: "66e000000000000000000009", changedAt: new Date("2026-09-03T04:00:00.000Z"), previousPrice: 320000, newPrice: 320000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000013", productId: "66e000000000000000000009", changedAt: new Date("2026-09-08T04:00:00.000Z"), previousPrice: 320000, newPrice: 288000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 10% 인하", status: "DOWN" },
  { _id: "671000000000000000000014", productId: "66e00000000000000000000a", changedAt: new Date("2026-09-04T02:00:00.000Z"), previousPrice: 190000, newPrice: 190000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000015", productId: "66e00000000000000000000a", changedAt: new Date("2026-09-08T02:00:00.000Z"), previousPrice: 190000, newPrice: 180500, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000016", productId: "66e00000000000000000000b", changedAt: new Date("2026-09-05T05:00:00.000Z"), previousPrice: 160000, newPrice: 160000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000017", productId: "66e00000000000000000000b", changedAt: new Date("2026-09-08T05:00:00.000Z"), previousPrice: 160000, newPrice: 152000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  { _id: "671000000000000000000018", productId: "66e00000000000000000000c", changedAt: new Date("2026-09-06T01:00:00.000Z"), previousPrice: 280000, newPrice: 280000, seq: 0, reason: "상품 최초 등록", status: "KEEP" },
  { _id: "671000000000000000000019", productId: "66e00000000000000000000c", changedAt: new Date("2026-09-08T01:00:00.000Z"), previousPrice: 280000, newPrice: 266000, seq: 1, reason: "시장가격보다 비싸고 수요가 낮아 가격을 5% 인하", status: "DOWN" },
  ...additionalProductPriceChanges,
];

function validateSeedTarget(databaseName) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("운영 환경에서는 개발용 시드를 실행할 수 없습니다.");
  }

  if (["admin", "config", "local"].includes(databaseName)) {
    throw new Error(`${databaseName} 데이터베이스에는 시드를 실행할 수 없습니다.`);
  }
}

export async function seedProductCategories({
  uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
  databaseName = process.env.MONGODB_DB ?? "daepa_market",
} = {}) {
  validateSeedTarget(databaseName);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const categoryCollection = client.db(databaseName).collection("categories");

    await categoryCollection.createIndex({ name: 1 }, { unique: true });
    await categoryCollection.createIndex({ sortOrder: 1 });

    for (const category of categories) {
      await categoryCollection.updateOne(
        { name: category.name },
        {
          $set: { sortOrder: category.sortOrder },
          $setOnInsert: { _id: new ObjectId(category._id) },
        },
        { upsert: true },
      );
    }

    console.log(`MongoDB ${databaseName} 데이터베이스에 카테고리 ${categories.length}건을 저장했습니다.`);
  } finally {
    await client.close();
  }
}

export async function seedDatabase({
  uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
  databaseName = process.env.MONGODB_DB ?? "daepa_market",
} = {}) {
  validateSeedTarget(databaseName);

  const accounts = await createCredentialAccounts();
  const collections = {
    users,
    account: accounts,
    categories,
    products,
    watchlists,
    transactions,
    priceChange,
  };
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(databaseName);

    for (const collectionName of [
      "session",
      "verification",
      ...Object.keys(collections),
    ]) {
      await database.collection(collectionName).deleteMany({});
    }

    for (const [collectionName, documents] of Object.entries(collections)) {
      await database.collection(collectionName).insertMany(
        documents.map((document) => ({
          ...document,
          _id: new ObjectId(document._id),
          ...(collectionName === "account"
            ? { userId: new ObjectId(document.userId) }
            : {}),
        })),
      );
    }

    await database.collection("users").createIndex({ email: 1 }, { unique: true });
    await database.collection("categories").createIndex({ name: 1 }, { unique: true });
    await database.collection("categories").createIndex({ sortOrder: 1 });
    await database.collection("account").createIndex({ userId: 1 });
    await database
      .collection("account")
      .createIndex({ providerId: 1, accountId: 1 }, { unique: true });
    await database
      .collection("watchlists")
      .createIndex({ userId: 1, productId: 1 }, { unique: true });
    await database.collection("products").createIndex({ status: 1, createdAt: -1 });
    await database.collection("products").createIndex({ category: 1, currentPrice: 1 });
    await database.collection("transactions").createIndex({ createdAt: -1 });
    await database
      .collection("priceChange")
      .createIndex({ productId: 1, seq: 1 }, { unique: true });

    console.log(`MongoDB ${databaseName} 데이터베이스에 초기 데이터를 저장했습니다.`);
    for (const [collectionName, documents] of Object.entries(collections)) {
      console.log(`${collectionName}: ${documents.length}건`);
    }
    console.log(`데모 계정 공통 비밀번호: ${DEMO_USER_PASSWORD}`);
  } finally {
    await client.close();
  }
}

const executedFile = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";

if (import.meta.url === executedFile) {
  if (process.argv.includes("--categories-only")) {
    await seedProductCategories();
  } else {
    await seedDatabase();
  }
}
