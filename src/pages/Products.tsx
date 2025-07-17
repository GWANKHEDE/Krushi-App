import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Package,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react";
import { mockProducts, categories, brands } from "@/data/mockData";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;

      return (
        matchesSearch && matchesCategory && matchesBrand && product.isActive
      );
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock":
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, sortBy]);

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        status: "Out of Stock",
        variant: "destructive" as const,
        icon: AlertCircle,
      };
    if (stock <= 10)
      return {
        status: "Low Stock",
        variant: "destructive" as const,
        icon: AlertCircle,
      };
    return {
      status: "In Stock",
      variant: "default" as const,
      icon: CheckCircle,
    };
  };

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Our Products</h1>
        <p className="text-muted-foreground">
          Browse collection of agricultural products
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger>
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
            <SelectItem value="stock">Stock Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of{" "}
          {mockProducts.filter((p) => p.isActive).length} products
        </p>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockInfo = getStockStatus(product.stock);
          const StockIcon = stockInfo.icon;

          return (
            <Card
              key={product.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Background image with blur and low opacity */}
              <div
                className="absolute top-10 bottom-10 left-10 right-10 bg-center bg-cover opacity-40 pointer-events-none rounded-md"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
                aria-hidden="true"
              />

              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {product.brand} • {product.category}
                    </CardDescription>
                  </div>
                  <Badge variant={stockInfo.variant} className="ml-2 -mr-4 -mt-4">
                    <StockIcon className="h-3 w-3 mr-1" />
                    {stockInfo.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Price:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{product.unit}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Available:
                    </span>
                    <span className="font-medium">
                      {product.stock} {product.unit}
                    </span>
                  </div>
                </div>

                {product.usageInstructions && (
                  <div className="p-3 bg-accent/10 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <strong>Usage:</strong> {product.usageInstructions}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-success text-sm -mb-10">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Quality Assured
                  </div>
                  <Button
                    disabled={product.stock === 0}
                    variant={product.stock === 0 ? "secondary" : "default"}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {product.stock === 0
                      ? "Out of Stock"
                      : "Contact for Purchase"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse our categories
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedBrand("All");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
