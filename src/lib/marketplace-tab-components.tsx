import { SpotlightTab } from "@/components/marketplace/spotlight-tab"
import { ShopTab } from "@/components/marketplace/shop-tab"
import { FavoritesTab } from "@/components/marketplace/favorites-tab"
import { SalesTab } from "@/components/marketplace/sales-tab"
import { PurchasesTab } from "@/components/marketplace/purchases-tab"
import { ListsTab } from "@/components/marketplace/lists-tab"
import { ProductsTab } from "@/components/marketplace/products-tab"
import { ServicesTab } from "@/components/marketplace/services-tab"
import { VendorsTab } from "@/components/marketplace/vendors-tab"
import { ReviewsTab } from "@/components/marketplace/reviews-tab"

interface MarketplaceTabProps {
  data?: any[]
  loading?: boolean
}

export const MARKETPLACE_TAB_COMPONENTS: Record<string, React.ComponentType<MarketplaceTabProps>> = {
  "spotlight": SpotlightTab,
  "shop": ShopTab,
  "favorites": FavoritesTab,
  "sales": SalesTab,
  "purchases": PurchasesTab,
  "lists": ListsTab,
  "products": ProductsTab,
  "services": ServicesTab,
  "vendors": VendorsTab,
  "reviews": ReviewsTab,
}

export function getMarketplaceTabComponent(tabSlug: string): React.ComponentType<MarketplaceTabProps> | undefined {
  return MARKETPLACE_TAB_COMPONENTS[tabSlug]
}
