# Marketplace: Mock Data → Supabase Migration Guide

**Quick Reference for Converting Mock Data to Live Database Queries**

---

## 📋 Overview

All marketplace components currently work with **mock data** (no setup required). This guide shows how to optionally migrate to **live Supabase data** when ready.

---

## 🔄 Migration Strategy

### Current: Mock Data (Default)
```typescript
// Auto-generated mock data - works immediately
const products = generateShopData(20)
```

### Future: Supabase Data (Optional)
```typescript
// Live database queries - when ready
const { variants, options } = useProductVariants(productId)
```

---

## 🎯 Component Migration Examples

### 1. Product Variants

**BEFORE (Mock - Current):**
```typescript
// In product detail drawer
const product = {
  id: 'product-1',
  name: 'LED Par Light',
  variants: [
    { id: 'var-1', option1: 'Black', option2: 'Small', price: 299 },
    { id: 'var-2', option1: 'Black', option2: 'Medium', price: 329 }
  ],
  options: [
    { id: 'opt-1', name: 'Color', values: ['Black', 'Silver'] },
    { id: 'opt-2', name: 'Size', values: ['Small', 'Medium', 'Large'] }
  ]
}

// Component receives mock data directly
<VariantSelector
  productId={product.id}
  variants={product.variants}
  options={product.options}
/>
```

**AFTER (Supabase):**
```typescript
// Import the hook
import { useProductVariants } from '@/hooks/use-marketplace-variants'

function ProductDetailPage({ productId }: { productId: string }) {
  // Hook fetches from Supabase
  const { variants, options, loading, error } = useProductVariants(productId)
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  // Component receives live database data
  return (
    <VariantSelector
      productId={productId}
      variants={variants}
      options={options}
      onVariantChange={(variant) => {
        // Handle variant selection
      }}
    />
  )
}
```

---

### 2. Discount Codes

**BEFORE (Mock - Current):**
```typescript
// Mock validation in component
const mockDiscounts = {
  'SAVE20': { type: 'percentage', value: 20, min: 100 },
  'WELCOME10': { type: 'fixed_amount', value: 10, min: 50 }
}

const validateDiscountCode = async (code: string) => {
  return mockDiscounts[code] || null
}
```

**AFTER (Supabase):**
```typescript
// Import the hook
import { useDiscountValidation } from '@/hooks/use-marketplace-discounts'

function CartDrawer({ cartTotal, cartItems }: CartProps) {
  const { validateDiscount, recordDiscountUsage, loading } = useDiscountValidation()
  
  const handleApplyDiscount = async (code: string) => {
    try {
      // Validates against discount_codes table
      const discount = await validateDiscount(
        code,
        cartTotal,
        cartItems.map(item => item.product_id)
      )
      
      // Discount is valid, apply it
      setAppliedDiscount(discount)
    } catch (error) {
      // Show error message
      setError(error.message)
    }
  }
  
  return <DiscountInput onApply={handleApplyDiscount} />
}
```

---

### 3. Product Reviews

**BEFORE (Mock - Current):**
```typescript
// Mock reviews in product data
const product = {
  reviews: [
    { id: '1', author: 'John', rating: 5, comment: 'Great!' },
    { id: '2', author: 'Jane', rating: 4, comment: 'Good product' }
  ]
}

<ReviewForm onSubmit={(review) => console.log('Mock submit', review)} />
```

**AFTER (Supabase):**
```typescript
// Import the hook
import { useProductReviews } from '@/hooks/use-marketplace-reviews'

function ProductDetailPage({ productId }: { productId: string }) {
  const { reviews, submitReview, loading } = useProductReviews(productId)
  
  const handleReviewSubmit = async (reviewData) => {
    try {
      // Submits to product_reviews table
      await submitReview({
        product_id: productId,
        rating: reviewData.rating,
        title: reviewData.title,
        body: reviewData.body,
        photos: reviewData.photos,
        is_verified_purchase: !!orderId
      })
      
      toast.success('Review submitted! Pending moderation.')
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  return (
    <>
      {/* Display existing reviews */}
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
      
      {/* Submit new review */}
      <ReviewForm
        productId={productId}
        onSubmit={handleReviewSubmit}
      />
    </>
  )
}
```

---

### 4. Wishlists

**BEFORE (Mock - Current):**
```typescript
// Mock wishlists
const mockWishlists = [
  { id: '1', name: 'My Wishlist', item_count: 5 },
  { id: '2', name: 'Production Gear', item_count: 12 }
]

// Local state for wishlist membership
const [isInWishlists, setIsInWishlists] = useState(new Set())
```

**AFTER (Supabase):**
```typescript
// Import the hook
import { useWishlists } from '@/hooks/use-marketplace-wishlists'

function ProductCard({ product }: { product: Product }) {
  const {
    wishlists,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  } = useWishlists()
  
  const [productWishlistIds, setProductWishlistIds] = useState<string[]>([])
  
  // Check which wishlists contain this product
  useEffect(() => {
    isInWishlist(product.id).then(setProductWishlistIds)
  }, [product.id])
  
  const handleWishlistToggle = async (wishlistId: string) => {
    if (productWishlistIds.includes(wishlistId)) {
      await removeFromWishlist(wishlistId, product.id)
    } else {
      await addToWishlist(wishlistId, product.id)
    }
    
    // Refresh wishlist status
    const updated = await isInWishlist(product.id)
    setProductWishlistIds(updated)
  }
  
  return (
    <WishlistButton
      productId={product.id}
      wishlists={wishlists}
      productWishlistIds={productWishlistIds}
      onWishlistUpdate={handleWishlistToggle}
    />
  )
}
```

---

### 5. Gift Cards

**BEFORE (Mock - Current):**
```typescript
// Mock gift cards
const mockGiftCards = {
  'GIFT-100': { balance: 100 },
  'GIFT-50': { balance: 35.50 }
}
```

**AFTER (Supabase):**
```typescript
// Import the hook
import { useGiftCardValidation } from '@/hooks/use-marketplace-gift-cards'

function CartDrawer({ cartTotal }: CartProps) {
  const { validateGiftCard, applyGiftCard, loading } = useGiftCardValidation()
  
  const handleApplyGiftCard = async (code: string) => {
    try {
      // Validates against gift_cards table
      const giftCard = await validateGiftCard(code)
      
      // Calculate amount to apply
      const amountToApply = Math.min(giftCard.current_balance, cartTotal)
      
      setAppliedGiftCard({
        code: giftCard.code,
        balance: giftCard.current_balance,
        amount_applied: amountToApply
      })
    } catch (error) {
      setError(error.message)
    }
  }
  
  return <GiftCardInput onApply={handleApplyGiftCard} />
}
```

---

### 6. Collections

**BEFORE (Mock - Current):**
```typescript
// Mock collections
const mockCollections = [
  { id: '1', title: 'Audio Equipment', product_count: 45 },
  { id: '2', title: 'Lighting Solutions', product_count: 38 }
]
```

**AFTER (Supabase):**
```typescript
// Import the hook
import { useCollections } from '@/hooks/use-marketplace-collections'

function ShopPage({ workspaceId }: { workspaceId: string }) {
  const {
    collections,
    getCollectionProducts,
    loading
  } = useCollections(workspaceId)
  
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [products, setProducts] = useState([])
  
  const handleCollectionSelect = async (collection) => {
    setSelectedCollection(collection)
    
    if (collection) {
      // Fetch products in this collection from Supabase
      const collectionProducts = await getCollectionProducts(collection.id)
      setProducts(collectionProducts)
    } else {
      // Show all products
      setProducts(allProducts)
    }
  }
  
  if (loading) return <LoadingSpinner />
  
  return (
    <>
      <CollectionBrowser
        collections={collections}
        onCollectionSelect={handleCollectionSelect}
      />
      
      <ProductGrid products={products} />
    </>
  )
}
```

---

## 🛠️ Helper: Gradual Migration Wrapper

Create a wrapper hook that supports both mock and Supabase:

```typescript
// src/hooks/use-marketplace-data-source.ts

import { generateShopData } from '@/lib/modules/marketplace-mock-data'
import { useProductVariants } from './use-marketplace-variants'

export function useProductData(productId: string, useLiveData = false) {
  // Supabase hook
  const supabaseData = useProductVariants(productId)
  
  // Mock data generator
  const mockData = useMemo(() => {
    const products = generateShopData(1)
    const product = products[0]
    return {
      variants: product.variants || [],
      options: product.options || [],
      loading: false,
      error: null
    }
  }, [productId])
  
  // Return based on mode
  return useLiveData ? supabaseData : mockData
}

// Usage in component:
const USE_LIVE_DATA = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'
const { variants, options } = useProductData(productId, USE_LIVE_DATA)
```

---

## 📋 Migration Checklist

### Phase 1: Preparation
- [ ] Verify Supabase project configured
- [ ] Apply migration 065
- [ ] Set up environment variables
- [ ] Test database connection

### Phase 2: Hook Integration (Start with low-risk features)
- [ ] Collections (read-only, low risk)
- [ ] Reviews (read-only display, then submit)
- [ ] Wishlists (user-specific, isolated)
- [ ] Inventory (read-only, high value)
- [ ] Variants (read-only, core feature)

### Phase 3: Transaction Features (Higher risk)
- [ ] Discount codes (validation)
- [ ] Gift cards (balance tracking)
- [ ] Order processing (with discounts/gift cards)

### Phase 4: Testing
- [ ] Unit tests for hooks
- [ ] Integration tests
- [ ] Load testing
- [ ] User acceptance testing

### Phase 5: Deployment
- [ ] Deploy to staging
- [ ] Monitor performance
- [ ] Gradual rollout (10% → 50% → 100%)
- [ ] Monitor errors and rollback if needed

---

## 🚨 Important Notes

### Data Consistency
- Mock data is random every page load
- Supabase data is persistent
- Test data migrations carefully

### Authentication
- Mock data: No auth required
- Supabase data: User must be authenticated
- Handle auth errors gracefully

### Performance
- Mock data: Instant (client-side)
- Supabase data: Network latency (~50-200ms)
- Add loading states

### Error Handling
- Mock data: No errors
- Supabase data: Network, auth, validation errors
- Show user-friendly error messages

---

## 🎯 Quick Start: First Migration

**Recommended first feature to migrate: Product Reviews (read-only)**

```typescript
// 1. Keep mock review submission (low risk)
// 2. Show real reviews from database (high value)

import { useProductReviews } from '@/hooks/use-marketplace-reviews'

function ReviewsTab({ productId }: { productId: string }) {
  const { reviews, loading, error, fetchReviews } = useProductReviews(productId)
  
  // First load reviews from Supabase
  useEffect(() => {
    fetchReviews()
  }, [productId])
  
  // Still use mock for submission (for now)
  const handleSubmit = async (reviewData) => {
    console.log('Review submitted (mock):', reviewData)
    // TODO: Later, call submitReview() from hook
  }
  
  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
      
      <ReviewForm onSubmit={handleSubmit} />
    </>
  )
}
```

**Result:** 
- ✅ Real reviews displayed from database
- ✅ Mock submission still works
- ✅ Zero risk, high value
- ✅ Easy to complete later

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query + Supabase](https://tanstack.com/query/latest)
- [Migration 065 Documentation](./features/MARKETPLACE_SHOPIFY_OPTIMIZATION.md)
- [Hook API Reference](./MARKETPLACE_FINAL_INTEGRATION_VERIFICATION.md)

---

**Bottom Line:** Start with mock data (works now), migrate to Supabase incrementally (when ready). Both paths fully supported.
