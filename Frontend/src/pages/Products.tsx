import { useState, useMemo, useEffect } from "react";
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
import Loader from "@/services/Loader";
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
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { productsAPI, categoriesAPI } from "@/services/api";
import { Product, Category } from "@/services/api";
import AddProductDialog from "../components/AddProductDialog";
import EditProductDialog from "../components/EditProductDialog";
import DeleteProductDialog from "../components/DeleteProductDialog";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Load products and categories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAllProducts({ limit: 1000 }),
        categoriesAPI.getAllCategories(),
      ]);

      setProducts(productsResponse.data.data.products || []);
      setCategories(categoriesResponse.data.data.categories || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.name === selectedCategory;

      const matchesStockStatus =
        selectedStockStatus === "All" ||
        (selectedStockStatus === "In Stock" &&
          product.currentStock > product.lowStockAlert) ||
        (selectedStockStatus === "Low Stock" &&
          product.currentStock <= product.lowStockAlert &&
          product.currentStock > 0) ||
        (selectedStockStatus === "Out of Stock" && product.currentStock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStockStatus &&
        product.isActive
      );
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.sellingPrice - b.sellingPrice;
        case "price-high":
          return b.sellingPrice - a.sellingPrice;
        case "stock":
          return b.currentStock - a.currentStock;
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedStockStatus, sortBy]);

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0)
      return {
        status: "Out of Stock",
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-red-600",
      };
    if (product.currentStock <= product.lowStockAlert)
      return {
        status: "Low Stock",
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-orange-600",
      };
    return {
      status: "In Stock",
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
    };
  };

  const handleProductAdded = () => {
    loadData();
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const handleProductUpdated = () => {
    loadData();
    setEditingProduct(null);
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  const handleProductDeleted = () => {
    loadData();
    setDeletingProduct(null);
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStockStatus("All");
    setSortBy("name");
  };

   if (loading) {
    return <Loader message="Please wait..." />;
  }

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Browse collection of agricultural products
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg mb-6">
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
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedStockStatus}
          onValueChange={setSelectedStockStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="In Stock">In Stock</SelectItem>
            <SelectItem value="Low Stock">Low Stock</SelectItem>
            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
            <SelectItem value="stock">Stock Level</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            In Stock:{" "}
            {products.filter((p) => p.currentStock > p.lowStockAlert).length}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Low Stock:{" "}
            {
              products.filter(
                (p) => p.currentStock <= p.lowStockAlert && p.currentStock > 0
              ).length
            }
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Out of Stock: {products.filter((p) => p.currentStock === 0).length}
          </Badge>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockInfo = getStockStatus(product);
          const StockIcon = stockInfo.icon;

          return (
            <Card
              key={product.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="border-b border-border pb-2 mb-1">            
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      SKU: {product.sku} • {product.category?.name}
                    </CardDescription>
                  </div>
                  <Badge variant={stockInfo.variant} className="ml-2">
                    <StockIcon className="h-3 w-3 mr-1" />
                    {stockInfo.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Cost Price:
                    </span>
                    <span className="text-sm font-medium">
                      ₹{product.costPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Selling Price:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ₹{product.sellingPrice.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{product.unit}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Available Stock:
                    </span>
                    <span className={`font-medium ${stockInfo.color}`}>
                      {product.currentStock} {product.unit}
                    </span>
                  </div>

                  {product.currentStock <= product.lowStockAlert && (
                    <div className="p-2 bg-orange-50 rounded-md">
                      <p className="text-xs text-orange-700">
                        <strong>Low Stock Alert:</strong> Reorder when stock
                        reaches {product.lowStockAlert} {product.unit}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingProduct(product)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
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
            Try adjusting your search criteria or add a new product
          </p>
          <Button variant="outline" onClick={clearFilters} className="mr-2">
            Clear All Filters
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onProductAdded={handleProductAdded}
        categories={categories}
      />

      <EditProductDialog
        product={editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        onProductUpdated={handleProductUpdated}
        categories={categories}
      />

      <DeleteProductDialog
        product={deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}
