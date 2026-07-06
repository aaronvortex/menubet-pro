import { LanguageCode } from '../types/menu'

// ── Category name translations (keyed by category ID) ─────────────────────
export const categoryNameTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {
    mains: 'Mains', grill: 'Grill', specials: 'Specials',
    drinks: 'Drinks', alcohol: 'Alcohol',
  },
  am: {
    mains: 'ዋና ምግቦች', grill: 'ግሪሎ', specials: 'ልዩ ምግቦች',
    drinks: 'መጠጦች', alcohol: 'አልኮሆል',
  },
  om: {
    mains: 'Nyaata Gurguddaa', grill: 'Giriila', specials: 'Addaa',
    drinks: 'Dhugaatii', alcohol: 'Alkoolii',
  },
  ti: {
    mains: 'ዋና መግቢ', grill: 'ግሪሎ', specials: 'ፍሉይ',
    drinks: 'መስተዋዶ', alcohol: 'ኣልኮሆል',
  },
  ar: {
    mains: 'الأطباق الرئيسية', grill: 'المشويات', specials: 'الأطباق الخاصة',
    drinks: 'المشروبات', alcohol: 'الكحوليات',
  },
  fr: {
    mains: 'Plats Principaux', grill: 'Grill', specials: 'Spécialités',
    drinks: 'Boissons', alcohol: 'Alcools',
  },
  zh: {
    mains: '主菜', grill: '烧烤', specials: '特色菜',
    drinks: '饮品', alcohol: '酒水',
  },
  es: {
    mains: 'Platos Principales', grill: 'Parrilla', specials: 'Especiales',
    drinks: 'Bebidas', alcohol: 'Alcohol',
  },
  ja: {
    mains: 'メインディッシュ', grill: 'グリル', specials: 'スペシャル',
    drinks: '飲み物', alcohol: 'アルコール',
  },
  he: {
    mains: 'מנות עיקריות', grill: 'גריל', specials: 'מיוחדים',
    drinks: 'משקאות', alcohol: 'אלכוהול',
  },
  de: {
    mains: 'Hauptgerichte', grill: 'Grill', specials: 'Spezialitäten',
    drinks: 'Getränke', alcohol: 'Alkohol',
  },
  ru: {
    mains: 'Основные блюда', grill: 'Гриль', specials: 'Особые блюда',
    drinks: 'Напитки', alcohol: 'Алкоголь',
  },
  pt: {
    mains: 'Pratos Principais', grill: 'Grill', specials: 'Especiais',
    drinks: 'Bebidas', alcohol: 'Álcool',
  },
  it: {
    mains: 'Piatti Principali', grill: 'Griglia', specials: 'Speciali',
    drinks: 'Bevande', alcohol: 'Alcolici',
  },
}

// ── Sub-category name translations (keyed by sub-category string) ─────────
export const subCategoryNameTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {
    Soup: 'Soup', Spaghetti: 'Spaghetti', Rice: 'Rice', Traditional: 'Traditional',
    Pizza: 'Pizza', Burger: 'Burger', Fish: 'Fish', Beef: 'Beef',
    Chicken: 'Chicken', Sandwich: 'Sandwich', Salad: 'Salad', Breakfast: 'Breakfast',
    'Hot Drinks': 'Hot Drinks', Juice: 'Juice', 'Soft Drinks': 'Soft Drinks', 'Mineral Water': 'Mineral Water',
    Beer: 'Beer', Wine: 'Wine', Spirits: 'Spirits', Rum: 'Rum',
  },
  am: {
    Soup: 'ሾርባ', Spaghetti: 'ስፓጌቲ', Rice: 'ሩዝ', Traditional: 'ባህላዊ',
    Pizza: 'ፒዛ', Burger: 'በርገር', Fish: 'ዓሣ', Beef: 'የበሬ ሥጋ',
    Chicken: 'ዶሮ', Sandwich: 'ሳንድዊች', Salad: 'ሰላጣ', Breakfast: 'ቁርስ',
    'Hot Drinks': 'ሞቅ ያሉ መጠጦች', Juice: 'ጁስ', 'Soft Drinks': 'ለስላሳ', 'Mineral Water': 'ማዕድን ውሃ',
    Beer: 'ቢራ', Wine: 'ወይን', Spirits: 'ጠንካራ መጠጥ', Rum: 'ሮም',
  },
  om: {
    Soup: 'Suupii', Spaghetti: 'Ispaageetii', Rice: 'Qamadii', Traditional: 'Aadaa',
    Pizza: 'Piizaa', Burger: 'Burgarii', Fish: 'Qurxummii', Beef: 'Foon Sa\'a',
    Chicken: 'Lama', Sandwich: 'Saanidwich', Salad: 'Salaaxii', Breakfast: 'Quraansaa',
    'Hot Drinks': 'Dhugaatii Ho\'aa', Juice: 'Juusii', 'Soft Drinks': 'Dhugaatii Laafaa', 'Mineral Water': 'Bishaani',
    Beer: 'Biiraa', Wine: 'Waayin', Spirits: 'Alkoolii Jabaataa', Rum: 'Rami',
  },
  ti: {
    Soup: 'ሾርባ', Spaghetti: 'ስፓጌቲ', Rice: 'ሩዝ', Traditional: 'ባህላዊ',
    Pizza: 'ፒዛ', Burger: 'በርገር', Fish: 'ዓሳ', Beef: 'ስጋ ኣብዑር',
    Chicken: 'ዶሮ', Sandwich: 'ሳንዱዊች', Salad: 'ሰላጣ', Breakfast: 'ቁርሲ',
    'Hot Drinks': 'ሙቑ መስተዋዶ', Juice: 'ጁስ', 'Soft Drinks': 'ለስላሳ', 'Mineral Water': 'ካብ ወርቂ ዝወጸ ማይ',
    Beer: 'ቢራ', Wine: 'ወይኒ', Spirits: 'ጽኑዕ መስተ', Rum: 'ሩም',
  },
  ar: {
    Soup: 'الشوربة', Spaghetti: 'السباغيتي', Rice: 'الأرز', Traditional: 'التقليدي',
    Pizza: 'البيتزا', Burger: 'البرغر', Fish: 'السمك', Beef: 'اللحم البقري',
    Chicken: 'الدجاج', Sandwich: 'الساندويش', Salad: 'السلطة', Breakfast: 'الإفطار',
    'Hot Drinks': 'المشروبات الساخنة', Juice: 'العصائر', 'Soft Drinks': 'المشروبات الغازية', 'Mineral Water': 'المياه المعدنية',
    Beer: 'البيرة', Wine: 'النبيذ', Spirits: 'الأرواح', Rum: 'الروم',
  },
  fr: {
    Soup: 'Soupe', Spaghetti: 'Spaghetti', Rice: 'Riz', Traditional: 'Traditionnel',
    Pizza: 'Pizza', Burger: 'Burger', Fish: 'Poisson', Beef: 'Bœuf',
    Chicken: 'Poulet', Sandwich: 'Sandwich', Salad: 'Salade', Breakfast: 'Petit-déjeuner',
    'Hot Drinks': 'Boissons Chaudes', Juice: 'Jus', 'Soft Drinks': 'Sodas', 'Mineral Water': 'Eau Minérale',
    Beer: 'Bière', Wine: 'Vin', Spirits: 'Spiritueux', Rum: 'Rhum',
  },
  zh: {
    Soup: '汤类', Spaghetti: '意面', Rice: '米饭', Traditional: '传统菜',
    Pizza: '披萨', Burger: '汉堡', Fish: '鱼类', Beef: '牛肉',
    Chicken: '鸡肉', Sandwich: '三明治', Salad: '沙拉', Breakfast: '早餐',
    'Hot Drinks': '热饮', Juice: '果汁', 'Soft Drinks': '汽水', 'Mineral Water': '矿泉水',
    Beer: '啤酒', Wine: '葡萄酒', Spirits: '烈酒', Rum: '朗姆酒',
  },
  es: {
    Soup: 'Sopa', Spaghetti: 'Espagueti', Rice: 'Arroz', Traditional: 'Tradicional',
    Pizza: 'Pizza', Burger: 'Hamburguesa', Fish: 'Pescado', Beef: 'Carne de Res',
    Chicken: 'Pollo', Sandwich: 'Sándwich', Salad: 'Ensalada', Breakfast: 'Desayuno',
    'Hot Drinks': 'Bebidas Calientes', Juice: 'Jugo', 'Soft Drinks': 'Refrescos', 'Mineral Water': 'Agua Mineral',
    Beer: 'Cerveza', Wine: 'Vino', Spirits: 'Licores', Rum: 'Ron',
  },
  ja: {
    Soup: 'スープ', Spaghetti: 'スパゲッティ', Rice: 'ライス', Traditional: '伝統料理',
    Pizza: 'ピザ', Burger: 'バーガー', Fish: '魚料理', Beef: 'ビーフ',
    Chicken: 'チキン', Sandwich: 'サンドイッチ', Salad: 'サラダ', Breakfast: '朝食',
    'Hot Drinks': 'ホットドリンク', Juice: 'ジュース', 'Soft Drinks': 'ソフトドリンク', 'Mineral Water': 'ミネラルウォーター',
    Beer: 'ビール', Wine: 'ワイン', Spirits: 'スピリッツ', Rum: 'ラム',
  },
  he: {
    Soup: 'מרק', Spaghetti: 'ספגטי', Rice: 'אורז', Traditional: 'מסורתי',
    Pizza: 'פיצה', Burger: 'המבורגר', Fish: 'דגים', Beef: 'בקר',
    Chicken: 'עוף', Sandwich: 'כריך', Salad: 'סלט', Breakfast: 'ארוחת בוקר',
    'Hot Drinks': 'משקאות חמים', Juice: 'מיץ', 'Soft Drinks': 'משקאות קלים', 'Mineral Water': 'מים מינרלים',
    Beer: 'בירה', Wine: 'יין', Spirits: 'משקאות חריפים', Rum: 'רום',
  },
  de: {
    Soup: 'Suppe', Spaghetti: 'Spaghetti', Rice: 'Reis', Traditional: 'Traditionell',
    Pizza: 'Pizza', Burger: 'Burger', Fish: 'Fisch', Beef: 'Rindfleisch',
    Chicken: 'Hähnchen', Sandwich: 'Sandwich', Salad: 'Salat', Breakfast: 'Frühstück',
    'Hot Drinks': 'Heiße Getränke', Juice: 'Saft', 'Soft Drinks': 'Softdrinks', 'Mineral Water': 'Mineralwasser',
    Beer: 'Bier', Wine: 'Wein', Spirits: 'Spirituosen', Rum: 'Rum',
  },
  ru: {
    Soup: 'Суп', Spaghetti: 'Спагетти', Rice: 'Рис', Traditional: 'Традиционное',
    Pizza: 'Пицца', Burger: 'Бургер', Fish: 'Рыба', Beef: 'Говядина',
    Chicken: 'Курица', Sandwich: 'Сэндвич', Salad: 'Салат', Breakfast: 'Завтрак',
    'Hot Drinks': 'Горячие напитки', Juice: 'Сок', 'Soft Drinks': 'Безалкогольные', 'Mineral Water': 'Минеральная вода',
    Beer: 'Пиво', Wine: 'Вино', Spirits: 'Крепкие напитки', Rum: 'Ром',
  },
  pt: {
    Soup: 'Sopa', Spaghetti: 'Esparguete', Rice: 'Arroz', Traditional: 'Tradicional',
    Pizza: 'Pizza', Burger: 'Hambúrguer', Fish: 'Peixe', Beef: 'Carne de Vaca',
    Chicken: 'Frango', Sandwich: 'Sandes', Salad: 'Salada', Breakfast: 'Pequeno-almoço',
    'Hot Drinks': 'Bebidas Quentes', Juice: 'Sumo', 'Soft Drinks': 'Refrigerantes', 'Mineral Water': 'Água Mineral',
    Beer: 'Cerveja', Wine: 'Vinho', Spirits: 'Licores', Rum: 'Rum',
  },
  it: {
    Soup: 'Zuppa', Spaghetti: 'Spaghetti', Rice: 'Riso', Traditional: 'Tradizionale',
    Pizza: 'Pizza', Burger: 'Burger', Fish: 'Pesce', Beef: 'Manzo',
    Chicken: 'Pollo', Sandwich: 'Panino', Salad: 'Insalata', Breakfast: 'Colazione',
    'Hot Drinks': 'Bevande Calde', Juice: 'Succo', 'Soft Drinks': 'Bibite', 'Mineral Water': 'Acqua Minerale',
    Beer: 'Birra', Wine: 'Vino', Spirits: 'Distillati', Rum: 'Rum',
  },
}

// ── Helper function ────────────────────────────────────────────────────────

export const translateCategory = (
  categoryId: string,
  fallback: string,
  language: LanguageCode
): string => {
  return categoryNameTranslations[language]?.[categoryId] || fallback
}

export const translateSubCategory = (
  subCategory: string,
  language: LanguageCode
): string => {
  return subCategoryNameTranslations[language]?.[subCategory] || subCategory
}
