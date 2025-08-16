const BASE_URL = "https://oasisdirect.ae/api/en"
const API_VERSION = "v=b2c3eQE7EgB9KeYP-kRG2"
const PROXY_URL = "/api/proxy"

export interface Product {
  id: string | number
  name: string
  nameAr?: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string
  isNew?: boolean
  discount?: string
  featured?: boolean
  dateAdded?: string
  description?: string
  stock?: number
}

export interface ApiResponse {
  products?: Product[]
  items?: Product[]
  data?: Product[]
  pageData?: { products: Product[] }
  // Handle different possible response structures
  [key: string]: any
}

// Category API endpoints
const categoryEndpoints = {
  water: "water",
  juice: "juice",
  dairy: "dairy",
  accessories: "accessories",
}

// Brand API endpoints
const brandEndpoints = {
  lacnor: "lacnor",
  oasis: "oasis",
  blu: "blu",
  melco: "melco",
  safa: "safa",
}

// Generic fetch function with error handling
async function fetchFromApi(type: string, name: string): Promise<Product[]> {
  try {
    const url = `${PROXY_URL}?type=${type}&name=${name}`
    console.log("[v0] Fetching from proxy:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.log("[v0] Proxy response not ok:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    console.log("[v0] Proxy response received:", data)

    // Handle different response structures
    let products: Product[] = []
    if (data.pageData && data.pageData.products) {
      products = data.pageData.products
    } else if (data.products) {
      products = data.products
    } else if (data.items) {
      products = data.items
    } else if (data.data) {
      products = data.data
    } else if (Array.isArray(data)) {
      products = data
    }

    console.log("[v0] Extracted products count:", products.length)

    // Normalize product data structure
    return products.map((product: any) => ({
      id: product.id || product._id || Math.random().toString(36).substr(2, 9),
      name: product.name || product.title || "Unknown Product",
      nameAr: product.nameAr || product.name_ar || product.arabic_name,
      price: Number.parseFloat(product.price || product.cost || 0),
      originalPrice: product.originalPrice || product.original_price || product.old_price,
      image: product.image || product.thumbnail || product.photo || "/placeholder.svg",
      category: product.category || name || "unknown",
      brand: product.brand || product.manufacturer || "unknown",
      isNew: product.isNew || product.is_new || false,
      discount: product.discount || product.discount_text,
      featured: product.featured || product.is_featured || false,
      dateAdded: product.dateAdded || product.created_at || new Date().toISOString(),
      description: product.description || product.desc,
      stock: product.stock || product.quantity || 0,
    }))
  } catch (error) {
    console.error("[v0] Error fetching from proxy:", error)
    return []
  }
}

// Fetch products by category
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  return fetchFromApi("s", category)
}

// Fetch products by brand
export async function fetchProductsByBrand(brand: string): Promise<Product[]> {
  return fetchFromApi("b", brand)
}

// Fetch all products (combines all categories)
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    console.log("[v0] Fetching all products from all categories")
    const categories = ["water", "juice", "dairy", "accessories"]
    const categoryPromises = categories.map((category) => fetchProductsByCategory(category))

    const categoryResults = await Promise.all(categoryPromises)
    const allProducts = categoryResults.flat()

    console.log("[v0] Total products fetched:", allProducts.length)
    return allProducts
  } catch (error) {
    console.error("[v0] Error fetching all products:", error)
    return []
  }
}

// Search products across all categories
export async function searchProducts(query: string): Promise<Product[]> {
  const allProducts = await fetchAllProducts()

  if (!query.trim()) {
    return allProducts
  }

  const searchTerm = query.toLowerCase()
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      (product.nameAr && product.nameAr.includes(query)) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm),
  )
}
