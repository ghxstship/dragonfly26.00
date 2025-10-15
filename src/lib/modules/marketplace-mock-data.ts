import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateMarketplaceMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'spotlight':
      return generateSpotlightData(count)
    case 'shop':
      return generateShopData(count)
    case 'favorites':
      return generateFavoritesData(count)
    case 'sales':
      return generateSalesData(count)
    case 'purchases':
      return generatePurchasesData(count)
    case 'lists':
      return generateListsData(count)
    case 'products':
      return generateProductsData(count)
    case 'services':
      return generateServicesData(count)
    case 'vendors':
      return generateVendorsData(count)
    case 'reviews':
      return generateReviewsData(count)
    default:
      return generateGenericData(count)
  }
}

function generateSpotlightData(count: number): DataItem[] {
  const contentTypes = ["Featured Product", "Sponsored Service", "Curated Collection", "Industry Spotlight", "Vendor Feature"]
  const categories = ["Equipment", "Services", "Training", "Software", "Gear"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `spotlight-${i + 1}`,
    name: `${contentTypes[i % contentTypes.length]}: ${categories[i % categories.length]} Showcase`,
    description: "Premium curated content featuring the best products and services in the industry. Sponsored and verified by our team.",
    status: i % 4 === 0 ? "sponsored" : i % 4 === 1 ? "featured" : i % 4 === 2 ? "curated" : "trending",
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: i % 5 === 0 ? "ProAudio Solutions" : i % 5 === 1 ? "Stage Tech Inc" : i % 5 === 2 ? "Event Gear Pro" : i % 5 === 3 ? "Production Experts" : "Creative Services Ltd",
    assignee_name: i % 5 === 0 ? "ProAudio Solutions" : i % 5 === 1 ? "Stage Tech Inc" : i % 5 === 2 ? "Event Gear Pro" : i % 5 === 3 ? "Production Experts" : "Creative Services Ltd",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    tags: ["spotlight", contentTypes[i % contentTypes.length].toLowerCase(), categories[i % categories.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 50) + 10,
    attachments_count: Math.floor(Math.random() * 8) + 2,
    price: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }))
}

function generateShopData(count: number): DataItem[] {
  const productNames = ["LED Par Light", "Wireless Audio System", "Stage Truss Section", "DMX Controller", "Portable PA System", "4K Video Projector", "Fog Machine Pro", "Cable Kit", "Lighting Console", "Stage Monitor"]
  const categories = ["Lighting", "Audio", "Rigging", "Control", "Video", "Effects", "Accessories"]
  const vendors = ["company-1", "company-2", "company-3", "company-4"]
  const statuses = ["active", "out_of_stock", "discontinued"]
  const pricingModels = ["one_time", "recurring", "usage_based"]
  
  // Generate variants for products with options
  const generateVariants = (productId: string, basePrice: number, hasVariants: boolean) => {
    if (!hasVariants) return undefined
    
    const colors = ["Black", "Silver", "White"]
    const sizes = ["Small", "Medium", "Large"]
    const variants = []
    
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      for (let sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
        const variantPrice = basePrice + (colorIndex * 50) + (sizeIndex * 30)
        variants.push({
          id: `${productId}-var-${colorIndex}-${sizeIndex}`,
          title: `${colors[colorIndex]} / ${sizes[sizeIndex]}`,
          option1: colors[colorIndex],
          option2: sizes[sizeIndex],
          option3: null,
          price: variantPrice,
          compare_at_price: Math.random() > 0.7 ? variantPrice + 100 : null,
          sku: `SKU-${productId}-${colorIndex}${sizeIndex}`,
          barcode: null,
          inventory_quantity: Math.floor(Math.random() * 50),
          available_for_sale: true,
          image_url: null
        })
      }
    }
    return variants
  }
  
  const generateOptions = (hasVariants: boolean) => {
    if (!hasVariants) return undefined
    return [
      { id: 'opt-1', name: 'Color', position: 1, values: ["Black", "Silver", "White"] },
      { id: 'opt-2', name: 'Size', position: 2, values: ["Small", "Medium", "Large"] }
    ]
  }
  
  return Array.from({ length: count }, (_, i) => {
    const basePrice = parseFloat((Math.random() * 5000 + 100).toFixed(2))
    const hasVariants = i % 3 === 0 // Every 3rd product has variants
    const productId = `product-${i + 1}`
    
    return {
      id: productId,
      vendor_id: vendors[i % vendors.length],
      name: productNames[i % productNames.length],
      description: `Professional ${productNames[i % productNames.length].toLowerCase()} with industry-leading specifications`,
      category: categories[i % categories.length],
      subcategory: null,
      price: basePrice,
      compare_at_price: Math.random() > 0.8 ? basePrice + 200 : undefined,
      currency: "USD",
      pricing_model: pricingModels[i % pricingModels.length],
      sku: `SKU-${String(10000 + i).padStart(6, '0')}`,
      stock_quantity: Math.floor(Math.random() * 100),
      low_stock_threshold: 10,
      images: [`https://example.com/images/product-${i + 1}-1.jpg`, `https://example.com/images/product-${i + 1}-2.jpg`],
      status: statuses[i % statuses.length],
      rating_avg: parseFloat((Math.random() * 2 + 3).toFixed(2)),
      review_count: Math.floor(Math.random() * 50),
      tags: [categories[i % categories.length].toLowerCase(), "marketplace"],
      created_at: getRandomPastDate(180),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 20),
      attachments_count: Math.floor(Math.random() * 5),
      // New Shopify-compatible fields
      variants: generateVariants(productId, basePrice, hasVariants),
      options: generateOptions(hasVariants),
      handle: productNames[i % productNames.length].toLowerCase().replace(/\s+/g, '-'),
      published: true,
      requires_shipping: true,
      is_taxable: true
    }
  })
}

function generateFavoritesData(count: number): DataItem[] {
  const itemTypes = ["Sound System", "Lighting Rig", "Video Package", "Stage Equipment", "Production Service"]
  const categories = ["Equipment", "Services", "Software", "Training"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `favorite-${i + 1}`,
    name: `${itemTypes[i % itemTypes.length]} - Premium Package`,
    description: "Saved to your favorites for quick access. Perfect for your upcoming production needs.",
    status: i % 3 === 0 ? "available" : i % 3 === 1 ? "low-stock" : "watchlist",
    priority: i % 2 === 0 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Production Rentals" : i % 4 === 1 ? "Tech Solutions" : i % 4 === 2 ? "Event Services" : "Pro Gear Shop",
    assignee_name: i % 4 === 0 ? "Production Rentals" : i % 4 === 1 ? "Tech Solutions" : i % 4 === 2 ? "Event Services" : "Pro Gear Shop",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(5),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["favorite", categories[i % categories.length].toLowerCase(), "saved"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 6),
    price: `$${(Math.random() * 8000 + 200).toFixed(2)}`,
    rating: (Math.random() * 1 + 4).toFixed(1),
  }))
}

function generateSalesData(count: number): DataItem[] {
  const saleTypes = ["Equipment Rental", "Service Contract", "Product Sale", "Package Deal", "Subscription"]
  const statuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sale-${i + 1}`,
    name: `${saleTypes[i % saleTypes.length]} #${1000 + i}`,
    description: "Sales transaction as a vendor. Track your revenue, customer details, and fulfillment status.",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 5 === 0 ? "ABC Productions" : i % 5 === 1 ? "XYZ Events" : i % 5 === 2 ? "Creative Studios" : i % 5 === 3 ? "Festival Management" : "Corporate Events Co",
    assignee_name: i % 5 === 0 ? "ABC Productions" : i % 5 === 1 ? "XYZ Events" : i % 5 === 2 ? "Creative Studios" : i % 5 === 3 ? "Festival Management" : "Corporate Events Co",
    due_date: getRandomFutureDate(45),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["sale", "vendor", saleTypes[i % saleTypes.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 8),
    price: `$${(Math.random() * 25000 + 1000).toFixed(2)}`,
    payment_status: i % 4 === 0 ? "paid" : i % 4 === 1 ? "pending" : i % 4 === 2 ? "partial" : "overdue",
  }))
}

function generatePurchasesData(count: number): DataItem[] {
  const purchaseTypes = ["Marketplace Purchase", "Product Order", "Service Order", "Equipment Rental", "Software License"]
  const statuses = ["pending", "processing", "shipped", "delivered", "completed", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `purchase-${i + 1}`,
    name: `${purchaseTypes[i % purchaseTypes.length]} #MP-${2024000 + i}`,
    description: "Your marketplace purchases and orders. Track shipping, delivery, and order status.",
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 6 === 0 ? "Sound & Light Rentals" : i % 6 === 1 ? "Stage Equipment Co" : i % 6 === 2 ? "AV Solutions" : i % 6 === 3 ? "Production Services" : i % 6 === 4 ? "Tech Rentals Inc" : "Event Supply Pro",
    assignee_name: i % 6 === 0 ? "Sound & Light Rentals" : i % 6 === 1 ? "Stage Equipment Co" : i % 6 === 2 ? "AV Solutions" : i % 6 === 3 ? "Production Services" : i % 6 === 4 ? "Tech Rentals Inc" : "Event Supply Pro",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(5),
    created_at: getRandomPastDate(15),
    updated_at: new Date().toISOString(),
    tags: ["purchase", "marketplace", purchaseTypes[i % purchaseTypes.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 10),
    price: `$${(Math.random() * 50000 + 500).toFixed(2)}`,
    payment_status: i % 3 === 0 ? "paid" : i % 3 === 1 ? "pending" : "processing",
  }))
}

function generateListsData(count: number): DataItem[] {
  const listTypes = ["Shopping Cart", "Wishlist", "Project List", "Comparison List", "Equipment Package"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `list-${i + 1}`,
    name: `${listTypes[i % listTypes.length]} - ${i % 2 === 0 ? "Summer Tour 2024" : i % 3 === 0 ? "Festival Package" : "Corporate Event"}`,
    description: "Curated list of products and services for quick reference and bulk ordering.",
    status: i % 4 === 0 ? "active" : i % 4 === 1 ? "saved" : i % 4 === 2 ? "shared" : "archived",
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: "You",
    assignee_name: "You",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(3),
    created_at: getRandomPastDate(20),
    updated_at: new Date().toISOString(),
    tags: ["list", listTypes[i % listTypes.length].toLowerCase(), "collection"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: 0,
    items_count: Math.floor(Math.random() * 25) + 3,
    total_value: `$${(Math.random() * 75000 + 5000).toFixed(2)}`,
  }))
}

function generateProductsData(count: number): DataItem[] {
  const categories = ["Audio", "Lighting", "Video", "Staging", "Rigging", "Accessories", "Software", "Cables"]
  const productTypes = [
    "Professional Microphone",
    "LED Moving Head",
    "4K Camera System",
    "Truss System",
    "Chain Hoist",
    "Flight Case",
    "Show Control Software",
    "Multi-Core Cable",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `${productTypes[i % productTypes.length]} - ${categories[i % categories.length]}`,
    description: "Premium production equipment and gear for rent or purchase. Fully inspected and certified.",
    status: i % 4 === 0 ? "available" : i % 4 === 1 ? "rented" : i % 4 === 2 ? "maintenance" : "reserved",
    priority: i % 2 === 0 ? "featured" : "standard",
    assignee: i % 5 === 0 ? "ProGear Rentals" : i % 5 === 1 ? "Stage Solutions" : i % 5 === 2 ? "Production Warehouse" : i % 5 === 3 ? "Event Equipment" : "Tech Supply Co",
    assignee_name: i % 5 === 0 ? "ProGear Rentals" : i % 5 === 1 ? "Stage Solutions" : i % 5 === 2 ? "Production Warehouse" : i % 5 === 3 ? "Event Equipment" : "Tech Supply Co",
    due_date: getRandomFutureDate(120),
    start_date: getRandomPastDate(180),
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: [categories[i % categories.length].toLowerCase(), "equipment", "certified"],
    comments_count: Math.floor(Math.random() * 40),
    attachments_count: Math.floor(Math.random() * 12) + 4,
    price: `$${(Math.random() * 15000 + 300).toFixed(2)}`,
    rental_rate: `$${(Math.random() * 500 + 50).toFixed(2)}/day`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
  }))
}

function generateServicesData(count: number): DataItem[] {
  const serviceTypes = [
    "Audio Engineering",
    "Lighting Design",
    "Video Production",
    "Stage Management",
    "Technical Direction",
    "Event Coordination",
    "Equipment Installation",
    "Training & Consultation",
  ]
  const levels = ["Entry Level", "Professional", "Expert", "Master"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `${serviceTypes[i % serviceTypes.length]} - ${levels[i % levels.length]}`,
    description: "Professional production services from certified experts. Book for your next project or event.",
    status: i % 3 === 0 ? "available" : i % 3 === 1 ? "busy" : "limited-availability",
    priority: i % 3 === 0 ? "premium" : i % 3 === 1 ? "standard" : "basic",
    assignee: i % 6 === 0 ? "John Smith" : i % 6 === 1 ? "Sarah Johnson" : i % 6 === 2 ? "Mike Chen" : i % 6 === 3 ? "Emma Davis" : i % 6 === 4 ? "Alex Rivera" : "Chris Taylor",
    assignee_name: i % 6 === 0 ? "John Smith" : i % 6 === 1 ? "Sarah Johnson" : i % 6 === 2 ? "Mike Chen" : i % 6 === 3 ? "Emma Davis" : i % 6 === 4 ? "Alex Rivera" : "Chris Taylor",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(200),
    updated_at: new Date().toISOString(),
    tags: ["service", serviceTypes[i % serviceTypes.length].toLowerCase(), "professional"],
    comments_count: Math.floor(Math.random() * 35),
    attachments_count: Math.floor(Math.random() * 8),
    price: `$${(Math.random() * 3000 + 500).toFixed(2)}/day`,
    rating: (Math.random() * 1 + 4).toFixed(1),
    experience_years: Math.floor(Math.random() * 20) + 1,
  }))
}

function generateVendorsData(count: number): DataItem[] {
  const vendorTypes = ["Equipment Rental", "Production Services", "Audio/Visual", "Staging", "Lighting", "Catering", "Transportation", "Security"]
  const ratings = ["5-star", "4-star", "3-star"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `vendor-${i + 1}`,
    name: `${vendorTypes[i % vendorTypes.length]} Specialists ${String.fromCharCode(65 + (i % 26))}`,
    description: "Trusted marketplace vendor offering quality products and services. Verified and rated by the community.",
    status: i % 4 === 0 ? "verified" : i % 4 === 1 ? "certified" : i % 4 === 2 ? "featured" : "active",
    priority: i % 3 === 0 ? "premium" : "standard",
    assignee: `Contact: ${i % 2 === 0 ? "Sales Team" : "Account Manager"}`,
    assignee_name: `Contact: ${i % 2 === 0 ? "Sales Team" : "Account Manager"}`,
    due_date: getRandomFutureDate(365),
    start_date: getRandomPastDate(730),
    created_at: getRandomPastDate(1000),
    updated_at: new Date().toISOString(),
    tags: [vendorTypes[i % vendorTypes.length].toLowerCase(), "vendor", ratings[i % ratings.length]],
    comments_count: Math.floor(Math.random() * 100),
    attachments_count: Math.floor(Math.random() * 15) + 5,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    total_sales: Math.floor(Math.random() * 500) + 50,
    response_time: `${Math.floor(Math.random() * 24) + 1} hours`,
  }))
}

function generateReviewsData(count: number): DataItem[] {
  const itemTypes = ["Equipment", "Service", "Vendor", "Product"]
  const ratings = [5, 5, 5, 4, 4, 4, 3, 2, 1]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `review-${i + 1}`,
    name: `Review for ${itemTypes[i % itemTypes.length]} - ${i % 2 === 0 ? "Excellent" : i % 3 === 0 ? "Good" : "Satisfactory"}`,
    description: i % 3 === 0 
      ? "Outstanding quality and service! Highly recommend for professional productions."
      : i % 3 === 1
      ? "Good experience overall. Met expectations and delivered on time."
      : "Decent service but could improve communication and response time.",
    status: i % 4 === 0 ? "verified" : i % 4 === 1 ? "pending" : i % 4 === 2 ? "flagged" : "published",
    priority: "normal",
    assignee: i % 7 === 0 ? "Michael Brown" : i % 7 === 1 ? "Jessica White" : i % 7 === 2 ? "David Lee" : i % 7 === 3 ? "Amanda Green" : i % 7 === 4 ? "Robert Kim" : i % 7 === 5 ? "Lisa Martinez" : "Kevin Anderson",
    assignee_name: i % 7 === 0 ? "Michael Brown" : i % 7 === 1 ? "Jessica White" : i % 7 === 2 ? "David Lee" : i % 7 === 3 ? "Amanda Green" : i % 7 === 4 ? "Robert Kim" : i % 7 === 5 ? "Lisa Martinez" : "Kevin Anderson",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(60),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["review", itemTypes[i % itemTypes.length].toLowerCase(), `${ratings[i % ratings.length]}-star`],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 5),
    rating: ratings[i % ratings.length].toString(),
    helpful_count: Math.floor(Math.random() * 50),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "pending", "completed", "archived"]
  const priorities = ["urgent", "high", "normal", "low"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `marketplace-${i + 1}`,
    name: `Marketplace Item ${i + 1}`,
    description: "Generic marketplace listing with standard features and options.",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: "Marketplace Vendor",
    assignee_name: "Marketplace Vendor",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["marketplace", "general"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}
