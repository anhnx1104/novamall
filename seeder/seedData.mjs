import dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env.local" });

let url = process.env.NEXT_PUBLIC_URL;

const seedData = {
  settings: {
    name: "CLOVER",
    title: "CLOVER",
    address: "1605 Bottom Lane, Tonawanda, New York 14151",
    shortAddress: "12 Swanson St. New York",
    email: "MONEY BACK GUARANTEE",
    description: "소개",
    currency: { name: "KRW", symbol: "₩", exchangeRate: 0.00099998 },
    social: {
      facebook: "https://www.facebook.com",
      instagram: "https://www.instagram.com",
      twitter: "https://www.twitter.com",
      youtube: "https://www.youtube.com",
      pinterest: "https://www.pinterest.com",
    },
    phoneFooter: "Lorem ipsum dolor sit amet consectetur",
    phoneHeader: "info@gmail.com",
    copyright: "© 시네버스 2025 All Rights Reserved",
    favicon: [
      {
        name: "3333134ctvvept1494443knvgyfplogo transparent.png",
        url: `https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/3333134ctvvept1494443knvgyfplogo%20transparent.png`,
      },
    ],
    gatewayImage: [
      {
        name: "1181884maulazc2121122nhfrrdglogo transaprent.png",
        url: `https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/1181884maulazc2121122nhfrrdglogo%20transaprent.png`,
      },
    ],
    logo: [
      {
        name: "7744487nhiycku8744588vhpxzzmlogo transaprent.png",
        url: `https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/7744487nhiycku8744588vhpxzzmlogo%20transaprent.png`,
      },
    ],
    seo: {
      title: "CLOVER",
      description: "CLOVER",
      keyword: "demo,demo,demo",
      image: [
        {
          name: "fav.png",
          url: `${url}/fav.png`,
        },
      ],
    },
    footerCustomScript: "",
    headerCustomScript: "",
    footerBanner: {
      security: {
        title: "https://www.facebook.com",
        description: "https://www.instagram.com",
      },
      support: {
        title: "https://www.twitter.com",
        description: "https://www.youtube.com",
      },
      delivery: {
        title: "https://www.pinterest.com",
        description: "Lorem ipsum dolor sit amet consectetur",
      },
    },
    color: {
      primary: "#7F39FB",
      primary_hover: "#a583e1",
      secondary: "#FF0080",
      body_gray: "#d9e0e5",
      body_gray_contrast: "#333333",
      primary_contrast: "#ffffff",
      primary_hover_contrast: "#ffffff",
      secondary_contrast: "#ffffff",
    },
    paymentGateway: {
      cod: true,
      paypal: false,
      stripe: false,
      sslCommerz: false,
      razorpay: false,
    },
    login: {
      facebook: false,
      google: false,
    },
    security: {
      loginForPurchase: true,
    },
    script: {
      googleSiteVerificationId: "",
      facebookAppId: "",
      googleAnalyticsId: "",
      facebookPixelId: "",
      messengerPageId: "",
    },
  },
  product: [
    {
      name: "Starbucks Vanilla Latte",
      slug: "starbucks-vanilla-latte-4147iycj1117rjzr",
      productId: "P5550OFYH6546ITHQ",
      unit: "lb",
      unitValue: "2",
      price: 40,
      discount: 40,
      description:
        '<h1><span style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-strokeWidth: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; font-size: 18px; display: inline !important;">Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species.&nbsp;</span></h1><h2><span style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;; font-size: 13px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-strokeWidth: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><strong>The genus Coffea is native to tropical Africa (specifically having its origin in Ethiopia and Sudan) and Madagascar, the Comoros, Mauritius, and Réunion in the Indian Ocean.</strong></span></h2>',
      type: "simple",
      image: [
        {
          name: "starbucks_vanilla_latte.jpg",
          url: `${url}/starbucks_vanilla_latte.jpg`,
        },
      ],
      gallery: [
        {
          name: "starbucks_vanilla_latte.jpg",
          url: `${url}/starbucks_vanilla_latte.jpg`,
        },
      ],
      categories: ["beverage"],
      subcategories: ["coffee"],
      trending: true,
      quantity: 100,
      sku: "Starbucks-Vanilla-Latte",
      colors: [],
      attributes: [],
      variants: [],
      bestSelling: true,
      new: false,
      seo: {
        title: "",
        description: "",
        image: [],
      },
      shortDescription:
        "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species. The genus Coffea is native to tropical Africa (specifically having its origin in Ethiopia and Sudan) and Madagascar, the Comoros, Mauritius, and Réunion in the Indian Ocean.",
    },
    {
      name: "Febreze Air Bora Bora Water",
      slug: "febreze-air-bora-bora-water-6333rgzs8333fzef",
      productId: "P3383SUSU3330EFNG",
      unit: "oz",
      unitValue: "8.8",
      price: 60,
      discount: 58.8,
      description: "<p><br></p>",
      type: "variable",
      image: [
        {
          name: "fabreze.jpg",
          url: `${url}/fabreze.jpg`,
        },
      ],
      gallery: [
        {
          name: "fabreze.jpg",
          url: `${url}/fabreze.jpg`,
        },
      ],
      categories: ["home-and-cleaning"],
      subcategories: ["air-freshener"],
      trending: false,
      new: true,
      bestSelling: true,
      colors: [
        {
          label: "Turquoise",
          value: "#40e0d0",
        },
        {
          label: "Lemon Yellow",
          value: "#Fff44f",
        },
        {
          label: "Spring Green",
          value: "#00ff7f",
        },
      ],
      attributes: [],
      variants: [
        {
          color: "Turquoise",
          attr: null,
          price: "0",
          sku: "101",
          qty: "100",
        },
        {
          color: "Lemon Yellow",
          attr: null,
          price: "0",
          sku: "102",
          qty: "100",
        },
        {
          color: "Spring Green",
          attr: null,
          price: "1",
          sku: "103",
          qty: "-1",
        },
      ],
      attributeIndex: "",
      seo: {
        title: "Febreze Air Bora Bora Water",
        description:
          "Air fresheners are consumer products that typically emit fragrance and are used in homes or commercial interiors such as restrooms, foyers, hallways, vestibules and other smaller indoor areas, as well as larger areas such as hotel lobbies, auto dealerships, medical facilities, public arenas and other large interior spaces.",
        image: [
          {
            name: "fabreze.jpg",
            url: `${url}/fabreze.jpg`,
          },
        ],
      },
      shortDescription:
        "Air fresheners are consumer products that typically emit fragrance and are used in homes or commercial interiors such as restrooms, foyers, hallways, vestibules and other smaller indoor areas, as well as larger areas such as hotel lobbies, auto dealerships, medical facilities, public arenas and other large interior spaces.",
    },
    {
      name: "Cloetta Choco Waffle Crispy",
      slug: "cloetta-choco-waffle-crispy-4850ciny4488oaqb",
      productId: "P2339DBGU3332BLKI",
      unit: "pc(s)",
      unitValue: "1",
      price: 22,
      discount: 21.5,
      description: "<p><br></p>",
      type: "simple",
      image: [
        {
          name: "Cloetta.jpg",
          url: `${url}/Cloetta.jpg`,
        },
      ],
      gallery: [
        {
          name: "Cloetta.jpg",
          url: `${url}/Cloetta.jpg`,
        },
      ],
      categories: ["snacks"],
      subcategories: ["chocolates"],
      trending: true,
      new: true,
      bestSelling: true,
      quantity: 8,
      sku: "Cloetta-110",
      colors: [],
      attributes: [],
      variants: [],
      seo: {
        title: "",
        description: "",
        image: [],
      },
      shortDescription:
        "Chocolate is a usually sweet, brown food preparation of roasted and ground cacao seeds that is made in the form of a liquid, paste, or in a block, or used as a flavouring ingredient in other foods.",
    },
    {
      name: "Magnetic Designs Women Printed Fit And Flare Dress",
      slug: "magnetic-designs-women-printed-fit-and-flare-dress-2599zfmm5905rtuy",
      productId: "P3080ZOBV4343OEQP",
      unit: "pc(s)",
      unitValue: "1",
      price: 350,
      discount: 350,
      description: "",
      type: "variable",
      image: [
        {
          name: "Magnetic.jpg",
          url: `${url}/Magnetic.jpg`,
        },
      ],
      gallery: [
        {
          name: "Magnetic.jpg",
          url: `${url}/Magnetic.jpg`,
        },
      ],
      categories: ["clothing-and-fashion"],
      subcategories: ["women-clothing"],
      trending: true,
      new: true,
      bestSelling: false,
      colors: [
        {
          label: "Blue Violet",
          value: "#8a2be2",
        },
        {
          label: "Electric Purple",
          value: "#Bf00ff",
        },
        {
          label: "Rose Pink",
          value: "#e8909c",
        },
      ],
      attributes: [
        {
          label: "XL",
          value: "XL",
          for: "Size",
        },
        {
          label: "L",
          value: "L",
          for: "Size",
        },
        {
          label: "M",
          value: "M",
          for: "Size",
        },
      ],
      variants: [
        {
          color: "Blue Violet",
          attr: "XL",
          price: "0",
          sku: "101",
          qty: 96,
        },
        {
          color: "Blue Violet",
          attr: "L",
          price: "0",
          sku: "102",
          qty: "100",
        },
        {
          color: "Blue Violet",
          attr: "M",
          price: "0",
          sku: "103",
          qty: "100",
        },
        {
          color: "Electric Purple",
          attr: "XL",
          price: "1",
          sku: "104",
          qty: "10",
        },
        {
          color: "Electric Purple",
          attr: "L",
          price: "1",
          sku: "105",
          qty: "11",
        },
        {
          color: "Electric Purple",
          attr: "M",
          price: "2",
          sku: "106",
          qty: "15",
        },
        {
          color: "Rose Pink",
          attr: "XL",
          price: "3",
          sku: "107",
          qty: 10,
        },
        {
          color: "Rose Pink",
          attr: "L",
          price: "4",
          sku: "108",
          qty: 19,
        },
        {
          color: "Rose Pink",
          attr: "M",
          price: "1",
          sku: "109",
          qty: "22",
        },
      ],
      attributeIndex: "0",
      seo: {
        title: "Magnetic Designs Women Printed Fit And Flare Dress",
        description:
          "Mauve printed knitted fit and flare dress, has a round neck, three-quarter sleeves, concealed zip closure,, flared hem",
        image: [
          {
            name: "Magnetic.jpg",
            url: `${url}/Magnetic.jpg`,
          },
        ],
      },
      shortDescription:
        "Mauve printed knitted fit and flare dress, has a round neck, three-quarter sleeves, concealed zip closure. flared hem",
    },
    {
      name: "Jammie Dodgers",
      slug: "jammie-dodgers-6555nvio0665otyj",
      productId: "P4444HNVC9272ZDLV",
      unit: "pc(s)",
      unitValue: "1",
      price: 12,
      discount: 12,
      description: "",
      type: "simple",
      image: [
        {
          name: "Jammie.jpg",
          url: `${url}/Jammie.jpg`,
        },
      ],
      gallery: [
        {
          name: "Jammie.jpg",
          url: `${url}/Jammie.jpg`,
        },
      ],
      categories: ["snacks"],
      subcategories: ["biscuits"],
      trending: true,
      new: true,
      bestSelling: true,
      quantity: 80,
      sku: "101",
      colors: [],
      attributes: [],
      variants: [],
      seo: {
        title: "Jammie Dodgers Biscuit",
        description:
          "Jammie Dodgers biscuit is a flour-based baked food product. This article covers the type of biscuit found in Africa, Asia, and Europe, which is typically hard, flat, and unleavened.",
        image: [
          {
            name: "Jammie.jpg",
            url: `${url}/Jammie.jpg`,
          },
        ],
      },
      shortDescription:
        "A biscuit is a flour-based baked food product. This article covers the type of biscuit found in Africa, Asia, and Europe, which is typically hard, flat, and unleavened.",
    },
  ],
  category: [
    {
      categoryId: "77xg33sf",
      name: "식품 (농수산물)",
      icon: [
        {
          name: "7078700enixyuj8887877gjfgvdz023-corn.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/7078700enixyuj8887877gjfgvdz023-corn.png",
          type: "image/png",
        },
      ],
      slug: "식품-농수산물",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "36yp43he",
      name: "건강기능식품",
      icon: [
        {
          name: "3554299sgufeqm3452925yjrzxlq039-nutrient.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/3554299sgufeqm3452925yjrzxlq039-nutrient.png",
          type: "image/png",
        },
      ],
      slug: "건강기능식품",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "55rm25lg",
      name: "화장품",
      icon: [
        {
          name: "2642642rarzyit6222626ipmmnqy001-lipstick.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/2642642rarzyit6222626ipmmnqy001-lipstick.png",
          type: "image/png",
        },
      ],
      slug: "화장품",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "00ct44cu",
      name: "남성 의류",
      icon: [
        {
          name: "0171061ozphvnq0400444apngqci004-pajamas.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/0171061ozphvnq0400444apngqci004-pajamas.png",
          type: "image/png",
        },
      ],
      slug: "남성-의류",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "38pg33fh",
      name: "반려동물 식품",
      icon: [
        {
          name: "7444545eolodqb7774547ainpmls027-collar.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/7444545eolodqb7774547ainpmls027-collar.png",
          type: "image/png",
        },
      ],
      slug: "반려동물-식품",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "07re07bx",
      name: "생활용품",
      icon: [
        {
          name: "0072322xfqmclt4702072biqfcqx039-gloves.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/0072322xfqmclt4702072biqfcqx039-gloves.png",
          type: "image/png",
        },
      ],
      slug: "생활용품",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "62be22io",
      name: "스포츠 레저",
      icon: [
        {
          name: "0060002mrcvjdu0006110elzllmz004-tennis.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/0060002mrcvjdu0006110elzllmz004-tennis.png",
          type: "image/png",
        },
      ],
      slug: "스포츠-레저",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "03en36qt",
      name: "신발",
      icon: [
        {
          name: "8884748esmvqod8818887eegybht010-shoes.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/8884748esmvqod8818887eegybht010-shoes.png",
          type: "image/png",
        },
      ],
      slug: "신발",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "10zl99ex",
      name: "여성 의류",
      icon: [
        {
          name: "1549977efnjupl1554177gkgjhqh002-gown.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/1549977efnjupl1554177gkgjhqh002-gown.png",
          type: "image/png",
        },
      ],
      slug: "여성-의류",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "76dj76dt",
      name: "인테리어",
      icon: [
        {
          name: "6688626icxelyz8556252urzfohk007-lamp.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/6688626icxelyz8556252urzfohk007-lamp.png",
          type: "image/png",
        },
      ],
      slug: "인테리어",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "51yt66ve",
      name: "키덜트 취미",
      icon: [
        {
          name: "1338851rtjmadl5558333ajqmcmb009-billiard.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/1338851rtjmadl5558333ajqmcmb009-billiard.png",
          type: "image/png",
        },
      ],
      slug: "키덜트-취미",
      topCategory: true,
      subCategories: [],
    },
    {
      categoryId: "83mp33hh",
      name: "패션잡화",
      icon: [
        {
          name: "7488557lkbzydx5577885ahxgprp009-hat.png",
          url: "https://ecommerce-bucket-seoul-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/7488557lkbzydx5577885ahxgprp009-hat.png",
          type: "image/png",
        },
      ],
      slug: "패션잡화",
      topCategory: true,
      subCategories: [],
    },
  ],
  attribute: [
    {
      name: "Size",
      values: [
        { name: "S", value: "S" },
        { name: "M", value: "M" },
        { name: "L", value: "L" },
      ],
    },
    {
      name: "사이즈",
      values: [
        { name: "100", value: "100" },
        { name: "105", value: "105" },
        { name: "110", value: "110" },
      ],
    },
  ],
  color: [
    {
      name: "White",
      value: "#ffffff",
    },
    {
      name: "Black",
      value: "#000000",
    },
    {
      name: "Red",
      value: "#FF0000",
    },
    {
      name: "Green",
      value: "#008000",
    },
    {
      name: "Orange",
      value: "#FFA500",
    },
  ],
  shippingCharge: {
    area: [
      { name: "Korea", price: 3000 },
      { name: "제주도", price: 5000 },
    ],
    internationalCost: 10,
  },
  user: {
    hash: "$2b$06$M95iUsbIWVwAqJFrPlYi1eso6nT20akshHFdYa0zwb1.Fi6gyfNrm",
    salt: "$2b$06$M95iUsbIWVwAqJFrPlYi1e",
    isAdmin: true,
    email: "demo@admin.com",
    name: "Admin",
  },
  webpage: {
    aboutPage: {
      content:
        "<p>📦 About Us<br><br>저희는 고객의 삶을 더 편리하고 즐겁게 만들기 위해 노력하는 이커머스 플랫폼입니다.  <br>다양한 상품을 합리적인 가격에 제공하며, 빠른 배송과 친절한 고객 서비스를 통해 신뢰를 쌓아가고 있습니다.<br><br>고객의 소중한 의견을 반영해 항상 발전하는 기업이 되겠습니다.  <br>늘 고객의 입장에서 생각하며, 더 좋은 서비스를 제공할 수 있도록 최선을 다하겠습니다.<br><br>당신의 일상 속 가장 가까운 쇼핑 파트너, 저희와 함께하세요!<br><br></p>",
    },
    faqPage: {
      content: "",
    },
    termsPage: {
      content:
        "<p>📃 이용약관<br><br>1. 목적  <br>본 약관은 당사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br><br>2. 회원가입  <br>회원은 정확한 정보를 제공하여 가입해야 하며, 허위 정보로 인한 불이익은 책임지지 않습니다.<br><br>3. 주문 및 결제  <br>상품 주문은 결제 완료 시 효력이 발생하며, 당사는 주문 확인 후 배송을 진행합니다.<br><br>4. 배송  <br>당사는 통상적으로 영업일 기준 2~5일 이내에 배송을 완료하며, 천재지변 등의 사유로 지연될 수 있습니다.<br><br>5. 반품 및 환불  <br>관련 정책은 '반품 및 교환 정책'을 따르며, 상품 하자 시 당사가 배송비 포함하여 전액 책임집니다.<br><br>6. 이용 제한  <br>회원이 본 약관을 위반하거나 부정한 목적으로 서비스를 이용할 경우, 이용을 제한하거나 해지할 수 있습니다.<br><br>7. 분쟁 해결  <br>서비스 이용 중 발생한 분쟁은 상호 협의를 통해 해결하며, 해결되지 않을 경우 관할 법원의 판단에 따릅니다.<br><br>본 약관은 수시로 변경될 수 있으며, 변경 시 홈페이지를 통해 사전 공지합니다.<br><br></p>",
    },
    privacyPage: {
      content:
        "<p>🔒 개인정보 처리방침<br><br>당사는 고객님의 개인정보를 소중하게 생각하며, 아래와 같이 안전하게 관리하고 있습니다.<br><br>1. 수집 항목: 이름, 연락처, 주소, 이메일, 결제 정보 등<br>2. 수집 목적: 상품 배송, 고객 상담, 서비스 제공, 마케팅 활용 (동의 시)<br>3. 보유 기간: 수집 목적 달성 시까지, 관련 법령에 따라 일정 기간 보관<br>4. 제3자 제공: 고객 동의 없이 외부에 제공하지 않음<br>5. 개인정보 보호 책임자: 고객센터를 통해 언제든 문의 가능<br><br>고객님의 정보를 보호하기 위해 최선을 다하고 있으며, 관련 법령을 철저히 준수합니다.<br></p><p><br></p>",
    },
    returnPolicyPage: {
      content:
        "<p>🛍️ 반품 및 교환 정책<br><br>고객님의 만족을 최우선으로 생각합니다. 제품에 문제가 있거나 마음에 들지 않으실 경우, 아래 안내에 따라 반품 및 교환이 가능합니다.<br><br>✅ 반품 및 교환이 가능한 경우<br>- 상품 수령일로부터 7일 이내<br>- 제품이 미사용 상태이며, 훼손되지 않은 경우<br>- 포장, 택(Tag), 구성품(사은품 포함)이 모두 원래 상태로 있는 경우<br>- 상품 자체에 하자가 있거나 오배송된 경우<br><br>❌ 반품 및 교환이 불가능한 경우<br>- 상품 수령일로부터 7일이 경과한 경우<br>- 고객님의 부주의로 인해 상품이 훼손되거나 가치가 감소된 경우<br>- 사용 또는 세탁한 흔적이 있는 경우<br>- 시간의 경과로 다시 판매하기 곤란할 정도로 상품의 가치가 감소된 경우 (예: 식품, 화장품 등)<br>- 주문 제작 상품 또는 맞춤형 제품인 경우<br><br>💸 반품 배송비 안내<br>- 단순 변심: 왕복 배송비 고객 부담<br>- 상품 불량 또는 오배송: 배송비 전액 당사 부담<br><br>*배송비는 환불금액에서 차감되거나, 별도로 입금 요청드릴 수 있습니다.*<br><br>📦 반품 신청 방법<br>1. 마이페이지 &gt; 주문내역 &gt; 반품/교환 신청<br>2. 고객센터(전화 또는 채팅)를 통해 접수<br>3. 안내에 따라 상품 포장 후 반품<br><br>※ 지정 택배사를 이용해주셔야 원활한 처리가 가능합니다.<br><br>🕒 환불 처리 안내<br>- 반품 상품 도착 및 검수 완료 후 영업일 기준 3~5일 이내 환불 처리됩니다.<br>- 결제 수단에 따라 환불 시점은 상이할 수 있습니다.<br><br>📞 고객센터 문의<br>운영시간: 평일 10:00 ~ 17:00 (점심시간 12:30 ~ 13:30)<br>이메일: help@yourstore.com / 전화: 1234-5678<br></p>",
    },
    homePage: {
      carousel: {
        background: [],
        carouselData: [],
      },
      banner: {
        image: [],
      },
      collection: {
        scopeA: {
          title: "hello",
          url: "Test",
          image: [],
        },
        scopeB: {
          image: [],
        },
        scopeC: {
          image: [],
        },
        scopeD: {
          image: [],
        },
      },
    },
  },
};

export default seedData;
