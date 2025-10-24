import mongoose from "mongoose";

export const settings = {
  name: String,
  title: String,
  address: String,
  shortAddress: String,
  email: String,
  description: String,
  phoneHeader: String,
  phoneFooter: String,
  copyright: String,
  logo: Array,
  favicon: Array,
  gatewayImage: Array,
  headerCustomScript: String,
  footerCustomScript: String,
  language: { type: String, default: "en" },
  footerBanner: {
    security: {
      title: String,
      description: String,
    },
    support: {
      title: String,
      description: String,
    },
    delivery: {
      title: String,
      description: String,
    },
  },
  seo: {
    title: String,
    description: String,
    keyword: String,
    image: Array,
  },
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    pinterest: String,
  },
  currency: {
    name: { type: String, default: "USD" },
    symbol: { type: String, default: "$" },
    exchangeRate: { type: Number, default: 1 },
  },
  color: {
    primary: String,
    primary_hover: String,
    secondary: String,
    body_gray: String,
    body_gray_contrast: String,
    primary_contrast: String,
    primary_hover_contrast: String,
    secondary_contrast: String,
  },
  script: {
    googleSiteVerificationId: String,
    facebookAppId: String,
    googleAnalyticsId: String,
    facebookPixelId: String,
    messengerPageId: String,
  },
  paymentGateway: {
    cod: { type: Boolean, default: true },
    paypal: { type: Boolean, default: false },
    stripe: { type: Boolean, default: false },
    sslCommerz: { type: Boolean, default: false },
    razorpay: { type: Boolean, default: false },
  },
  login: {
    facebook: { type: Boolean, default: false },
    google: { type: Boolean, default: false },
  },
  security: {
    loginForPurchase: { type: Boolean, default: true },
  },
};

export const attribute = {
  name: String,
  values: Array,
};

export const category = {
  categoryId: String,
  name: String,
  icon: Array,
  slug: String,
  subCategories: [
    {
      id: String,
      name: String,
      slug: String,
      child: [
        {
          name: String,
          slug: String,
        },
      ],
    },
  ],
  topCategory: { type: Boolean, default: false },
};

export const form = {
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  label: { type: String, required: true }, // ex. material, size, color
  type: { type: String, required: true }, // input, select, textarea, radio, checkbox
  options: [String], // for select, radio, checkbox
};

export const group = {
  name: String,
  price: Number,
  user_limit: Number,
};

export const groupRanking = {
  group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  status: {
    type: String,
    enum: ["progress", "pending", "completed"],
    default: "pending",
  },
  endAt: { type: Date }, // 지급 종료일
};

export const brand = {
  brandId: String,
  name: String,
  image: Array,
  slug: String,
  topBrand: { type: Boolean, default: false },
};

export const color = {
  name: String,
  value: String,
};

export const coupon = {
  code: { type: String, unique: true },
  amount: Number,
  active: Date,
  expired: Date,
};

export const newsletter = {
  subscribers: [
    {
      email: String,
      username: String,
      phone: String,
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
};

export const order = {
  orderId: String,
  orderDate: { type: Date, default: Date.now },
  products: Array,
  status: String,
  paymentStatus: String,
  billingInfo: Object,
  shippingInfo: Object,
  deliveryInfo: Object,
  paymentMethod: String,
  paymentId: String,
  totalPrice: Number,
  payAmount: Number,
  coupon: Object,
  orderStatus: String,
  paymentStatus: String,
  vat: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  new: { type: Boolean, default: true },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
};

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    type: String, // image, video
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    userName: String,
    email: String,
    rating: Number,
    comment: String,
    media: [mediaSchema],
  },
  { _id: false }
);

export const product = {
  date: { type: Date, default: Date.now },
  name: String,
  slug: String,
  productId: String,
  unit: String,
  unitValue: String,
  price: Number,
  discount: Number,
  description: String,
  shortDescription: String,
  type: String,
  image: Array,
  gallery: Array,
  categories: Array,
  subcategories: Array,
  childCategories: Array,
  brand: String,
  currency: String,
  trending: { type: Boolean, default: false },
  new: { type: Boolean, default: false },
  bestSelling: { type: Boolean, default: false },
  quantity: Number,
  sku: String,
  colors: Array,
  attributes: Array,
  variants: Array,
  attributeIndex: String,
  seo: {
    title: String,
    description: String,
    image: Array,
  },
  review: [reviewSchema],
  question: [
    {
      date: { type: Date, default: Date.now },
      userName: String,
      email: String,
      question: String,
      answer: String,
    },
  ],
  vat: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },

  // 추가된 필드
  isSpecial: { type: Boolean, default: false }, // 스페셜 상품 여부
  group: { type: mongoose.Schema.Types.ObjectId, ref: "group" }, // 스페셜 상품 그룹
  withdrawablePointRate: { type: Number }, // 출금 가능 포인트 비율 (%)
  shoppingPointRate: { type: Number }, // 쇼핑 포인트 비율 (%)
  rebateRate: { type: Number }, // 리베이트 비율 (%)
  pointLimitRate: { type: Number }, // 포인트 지급 비율 (%)
  pointLimit: { type: Number }, // 포인트 최대 지급량
  option: [
    {
      optionId: String,
      name: String,
      values: [String],
    },
  ],
  noticeInfo: [
    {
      title: String,
      description: String,
      _id: false,
    },
  ],
};

export const shippingCharge = {
  area: [
    {
      name: String,
      price: Number,
    },
  ],
  internationalCost: Number,
};

export const pointHistory = {
  pointType: {
    type: String,
    enum: ["shopping", "withdrawable"],
    required: true,
  },
  point: Number, // 포인트 양
  pointUsage: {
    // 포인트 사용 용도
    type: String,
    enum: ["purchase", "withdrawal", "voucher", "earned", "send"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // 사용자
  order: { type: mongoose.Schema.Types.ObjectId, ref: "order" }, // 주문 ID
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, // 상품 ID
  groupRanking: { type: mongoose.Schema.Types.ObjectId, ref: "groupRanking" }, // 그룹 랭킹 ID
  status: {
    type: String,
    enum: ["progress", "completion"],
    default: "progress",
  },
  createAt: { type: Date, default: Date.now }, // 생성일
};

export const user = {
  name: String,
  email: { type: String, unique: true },
  phone: String,
  house: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  image: String,
  hash: String,
  salt: String,
  isAdmin: { type: Boolean, default: false },
  isStaff: {
    status: { type: Boolean, default: false },
    surname: String,
    permissions: Array,
  },
  emailVerified: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  refundRequest: [
    { type: mongoose.Schema.Types.ObjectId, ref: "refundRequest" },
  ],
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],

  // 새롭게 추가
  withdrawablePoint: { type: Number, default: 0 }, // 출금 가능 포인트
  shoppingPoint: { type: Number, default: 0 }, // 쇼핑몰 포인트
  totalWithdrawablePoint: { type: Number, default: 0 }, // 총 출금 가능 포인트
  totalShoppingPoint: { type: Number, default: 0 }, // 총 쇼핑몰 포인트
  level: { type: Number, default: 0 }, // 레벨
  level_exp: { type: Number, default: 0 }, // 레벨 경험치
  status: {
    // 일반 상품 구매 가능 상태
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  isDeleted: { type: Boolean, default: false }, // 삭제 여부
};

export const webpage = {
  homePage: {
    carousel: {
      background: Array,
      carouselData: Array,
    },
    banner: {
      title: String,
      subTitle: String,
      description: String,
      url: String,
      image: Array,
    },
    collection: {
      scopeA: {
        title: String,
        url: String,
        image: Array,
      },
      scopeB: {
        title: String,
        url: String,
        image: Array,
      },
      scopeC: {
        title: String,
        url: String,
        image: Array,
      },
      scopeD: {
        title: String,
        url: String,
        image: Array,
      },
    },
  },
  aboutPage: {
    content: String,
  },
  privacyPage: {
    content: String,
  },
  termsPage: {
    content: String,
  },
  returnPolicyPage: {
    content: String,
  },
  faqPage: {
    content: String,
  },
};

export const faq = {
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
};

export const notification = {
  message: String,
  createdAt: { type: Date, expires: 604800, default: Date.now },
};

export const refundRequest = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  product: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    name: String,
    color: String,
    attribute: String,
    price: Number,
    qty: Number,
    vat: Number,
    tax: Number,
  },
  refundReason: String,
  status: String,
  attachments: [],
  refundAmount: Number,
  orderId: String,
  note: String,
  date: { type: Date, default: Date.now },
};

export const address = {
  name: String,
  email: String,
  phone: String,
  house: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  addressType: String,
  addressTitle: String,
};
