/**
 * Commodity Visual Catalog Helper
 * Maps product names and categories to real-world, high-resolution wholesale commodity imagery.
 * Provides consistent default image strips and metadata across all item cards.
 */

const COMMODITY_IMAGES = {
  // Grains & Rice
  rice: {
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Grains & Rice',
    commodityType: 'Mandi Staple',
    defaultUnit: '25kg Bag'
  },
  basmati: {
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Grains & Rice',
    commodityType: 'Premium Basmati',
    defaultUnit: '25kg Bag'
  },
  atta: {
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Flour & Atta',
    commodityType: 'Whole Wheat',
    defaultUnit: '10kg Bag'
  },

  // Oils
  oil: {
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Edible Oils',
    commodityType: 'Refined Oil',
    defaultUnit: '15L Tin'
  },
  sunflower: {
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Edible Oils',
    commodityType: 'Sunflower Oil',
    defaultUnit: '15L Tin'
  },

  // Spices & Chilli
  chilli: {
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Spices',
    commodityType: 'Guntur Chilli',
    defaultUnit: '5kg Pack'
  },
  spices: {
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Spices & Masalas',
    commodityType: 'Direct APMC',
    defaultUnit: 'Carton'
  },

  // Pulses & Dal
  dal: {
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Pulses & Dals',
    commodityType: 'Desi Toor Dal',
    defaultUnit: '50kg Bag'
  },
  pulses: {
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Pulses & Dals',
    commodityType: 'Premium Pulses',
    defaultUnit: '50kg Bag'
  },

  // Essentials (Sugar, Salt)
  sugar: {
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Essentials',
    commodityType: 'Grade M-30 Sugar',
    defaultUnit: '50kg Bag'
  },
  salt: {
    image: 'https://images.unsplash.com/photo-1518110903416-83a31c518b26?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Essentials',
    commodityType: 'Iodized Salt',
    defaultUnit: '1kg x 25'
  },

  // Beverages & Tea
  tea: {
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80',
    categoryName: 'Beverages',
    commodityType: 'Assam Tea Master Pack',
    defaultUnit: '1kg x 12'
  },

  // Cleaning & FMCG
  surf: {
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80',
    categoryName: 'FMCG & Home Care',
    commodityType: 'Detergent Carton',
    defaultUnit: '20kg Carton'
  },
  fmcg: {
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80',
    categoryName: 'FMCG & Personal Care',
    commodityType: 'Wholesale Carton',
    defaultUnit: 'Carton'
  }
};

const DEFAULT_COMMODITY = {
  image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80',
  categoryName: 'Wholesale Commodity',
  commodityType: 'Direct Mandi Stock',
  defaultUnit: 'Bulk Unit'
};

/**
 * Returns commodity image & metadata based on product name or category
 */
export function getCommodityVisual(name = '', category = '') {
  const query = `${name} ${category}`.toLowerCase();

  if (query.includes('rice') || query.includes('sona') || query.includes('grain')) {
    return COMMODITY_IMAGES.rice;
  }
  if (query.includes('oil') || query.includes('sunflower') || query.includes('freedom') || query.includes('fortune')) {
    return COMMODITY_IMAGES.oil;
  }
  if (query.includes('chilli') || query.includes('chili') || query.includes('spice') || query.includes('guntur') || query.includes('mirchi')) {
    return COMMODITY_IMAGES.chilli;
  }
  if (query.includes('dal') || query.includes('pulse') || query.includes('toor') || query.includes('moong') || query.includes('chana')) {
    return COMMODITY_IMAGES.dal;
  }
  if (query.includes('atta') || query.includes('wheat') || query.includes('flour') || query.includes('aashirvaad')) {
    return COMMODITY_IMAGES.atta;
  }
  if (query.includes('sugar') || query.includes('shakkar') || query.includes('m-30')) {
    return COMMODITY_IMAGES.sugar;
  }
  if (query.includes('salt') || query.includes('tata salt')) {
    return COMMODITY_IMAGES.salt;
  }
  if (query.includes('tea') || query.includes('chai') || query.includes('coffee') || query.includes('beverage')) {
    return COMMODITY_IMAGES.tea;
  }
  if (query.includes('surf') || query.includes('soap') || query.includes('fmcg') || query.includes('wash') || query.includes('care')) {
    return COMMODITY_IMAGES.surf;
  }

  // Category based fallbacks
  const cat = (category || '').toLowerCase();
  if (cat.includes('grain')) return COMMODITY_IMAGES.rice;
  if (cat.includes('oil')) return COMMODITY_IMAGES.oil;
  if (cat.includes('spice')) return COMMODITY_IMAGES.chilli;
  if (cat.includes('pulse')) return COMMODITY_IMAGES.dal;
  if (cat.includes('beverage')) return COMMODITY_IMAGES.tea;
  if (cat.includes('personal') || cat.includes('fmcg')) return COMMODITY_IMAGES.fmcg;
  if (cat.includes('essential')) return COMMODITY_IMAGES.sugar;

  return DEFAULT_COMMODITY;
}
