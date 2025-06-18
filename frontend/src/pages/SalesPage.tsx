import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import CheckoutModal from "@/components/sales/CheckoutModal";
import api from "@/services/api";

// Removed mockProducts
const API_BASE_URL = "http://localhost:8000";

const SalesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const { items, addItem, updateQuantity, removeItem, total, subtotal, tax } =
    useCart();

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category?.name || "")),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCartItemQuantity = (productId: string) => {
    const item = items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "F1") {
      e.preventDefault();
      setIsCheckoutOpen(true);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      className="h-full flex gap-6"
      onKeyDown={handleKeyPress}
      data-id="8q0iuefkr"
      data-path="src/pages/SalesPage.tsx"
    >
      {/* Products Section */}
      <div
        className="flex-1 space-y-6"
        data-id="tze7vnqn6"
        data-path="src/pages/SalesPage.tsx"
      >
        <div data-id="8r3kr7x0m" data-path="src/pages/SalesPage.tsx">
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-white"
            data-id="5f7rignpf"
            data-path="src/pages/SalesPage.tsx"
          >
            Point of Sale
          </h1>
          <p
            className="text-gray-600 dark:text-gray-400"
            data-id="oh79mc4xe"
            data-path="src/pages/SalesPage.tsx"
          >
            Search and add products to cart
          </p>
        </div>

        {/* Search and Filters */}
        <div
          className="space-y-4"
          data-id="vgnzpvjve"
          data-path="src/pages/SalesPage.tsx"
        >
          <div
            className="relative"
            data-id="6cby8ccq2"
            data-path="src/pages/SalesPage.tsx"
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              data-id="5x4li5dp9"
              data-path="src/pages/SalesPage.tsx"
            />
            <Input
              placeholder="Search products by name or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
              data-id="6mc0t6ucz"
              data-path="src/pages/SalesPage.tsx"
            />
          </div>

          <div
            className="flex flex-wrap gap-2"
            data-id="w4akrhlsv"
            data-path="src/pages/SalesPage.tsx"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-id="6qp5jdf7s"
                data-path="src/pages/SalesPage.tsx"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-id="tjslljtr3"
          data-path="src/pages/SalesPage.tsx"
        >
          {filteredProducts.map((product) => {
            const quantity = getCartItemQuantity(product.id);

            return (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow"
                data-id="344x3il4a"
                data-path="src/pages/SalesPage.tsx"
              >
                <CardContent
                  className="p-4"
                  data-id="v9bvjp6zg"
                  data-path="src/pages/SalesPage.tsx"
                >
                  <div
                    className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100"
                    data-id="vsgkbmowi"
                    data-path="src/pages/SalesPage.tsx"
                  >
                    <img
                      src={
                        product.image
                          ? `${API_BASE_URL}/storage/${product.image}`
                          : ""
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      data-id="lhfd9o7lj"
                      data-path="src/pages/SalesPage.tsx"
                    />
                  </div>

                  <div
                    className="space-y-2"
                    data-id="ahhkyjsck"
                    data-path="src/pages/SalesPage.tsx"
                  >
                    <h3
                      className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2"
                      data-id="zilmahxm7"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      {product.name}
                    </h3>
                    <div
                      className="flex items-center justify-between"
                      data-id="mb1ngsuzf"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        data-id="kudug83z4"
                        data-path="src/pages/SalesPage.tsx"
                      >
                        {product.category?.name || ""}
                      </Badge>
                      <span
                        className="text-xs text-gray-500"
                        data-id="6ci9g2tyc"
                        data-path="src/pages/SalesPage.tsx"
                      >
                        Stock: {product.quantity}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between"
                      data-id="8fdncyu5g"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      <span
                        className="text-lg font-bold text-blue-600"
                        data-id="s3tmz2imf"
                        data-path="src/pages/SalesPage.tsx"
                      >
                        ₱{Number(product.price).toFixed(2)}
                      </span>

                      {quantity === 0 ? (
                        <Button
                          size="sm"
                          onClick={() => addItem(product)}
                          className="h-8"
                          data-id="v9m0rk1hq"
                          data-path="src/pages/SalesPage.tsx"
                        >
                          <Plus
                            className="h-4 w-4"
                            data-id="ly1rxwnky"
                            data-path="src/pages/SalesPage.tsx"
                          />
                        </Button>
                      ) : (
                        <div
                          className="flex items-center space-x-1"
                          data-id="opoov4y5k"
                          data-path="src/pages/SalesPage.tsx"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            className="h-8 w-8 p-0"
                            data-id="kif5wc0nn"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            <Minus
                              className="h-3 w-3"
                              data-id="vmfc8ryh0"
                              data-path="src/pages/SalesPage.tsx"
                            />
                          </Button>
                          <span
                            className="w-8 text-center text-sm font-medium"
                            data-id="en2juqwhd"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            {quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                            data-id="6q29rea0p"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            <Plus
                              className="h-3 w-3"
                              data-id="n2qphw4js"
                              data-path="src/pages/SalesPage.tsx"
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cart Section */}
      <div
        className="w-80 space-y-4"
        data-id="p5ochwp29"
        data-path="src/pages/SalesPage.tsx"
      >
        <Card data-id="yc1vqzwkr" data-path="src/pages/SalesPage.tsx">
          <CardHeader data-id="kds9ynb69" data-path="src/pages/SalesPage.tsx">
            <CardTitle
              className="flex items-center"
              data-id="pu4srmkk1"
              data-path="src/pages/SalesPage.tsx"
            >
              <ShoppingCart
                className="mr-2 h-5 w-5"
                data-id="w8xdif7po"
                data-path="src/pages/SalesPage.tsx"
              />
              Cart ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent
            className="space-y-4"
            data-id="qvv9qvviv"
            data-path="src/pages/SalesPage.tsx"
          >
            {items.length === 0 ? (
              <p
                className="text-center text-gray-500 py-8"
                data-id="4cv95h8g0"
                data-path="src/pages/SalesPage.tsx"
              >
                Cart is empty. Add some products!
              </p>
            ) : (
              <>
                <div
                  className="space-y-3 max-h-80 overflow-y-auto"
                  data-id="qbt5ntktw"
                  data-path="src/pages/SalesPage.tsx"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-2 border rounded-lg"
                      data-id="kvbvvnqrs"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      <img
                        src={
                          item.image
                            ? `${API_BASE_URL}/storage/${item.image}`
                            : ""
                        }
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                        data-id="e9iohe5r2"
                        data-path="src/pages/SalesPage.tsx"
                      />

                      <div
                        className="flex-1 min-w-0"
                        data-id="vwtnhext9"
                        data-path="src/pages/SalesPage.tsx"
                      >
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white truncate"
                          data-id="9negcxdjk"
                          data-path="src/pages/SalesPage.tsx"
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs text-gray-500"
                          data-id="acgktn9n2"
                          data-path="src/pages/SalesPage.tsx"
                        >
                          ₱{Number(item.price).toFixed(2)} each
                        </p>
                        <div
                          className="flex items-center space-x-1 mt-1"
                          data-id="pjy1usi6a"
                          data-path="src/pages/SalesPage.tsx"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-6 w-6 p-0"
                            data-id="ckkg26fq3"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            <Minus
                              className="h-3 w-3"
                              data-id="yliptzbxw"
                              data-path="src/pages/SalesPage.tsx"
                            />
                          </Button>
                          <span
                            className="w-8 text-center text-xs"
                            data-id="77huu1q6j"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-6 w-6 p-0"
                            data-id="1tog5utdu"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            <Plus
                              className="h-3 w-3"
                              data-id="u4o7ognvz"
                              data-path="src/pages/SalesPage.tsx"
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            data-id="xv73d916w"
                            data-path="src/pages/SalesPage.tsx"
                          >
                            <Trash2
                              className="h-3 w-3"
                              data-id="b2rvdpw0r"
                              data-path="src/pages/SalesPage.tsx"
                            />
                          </Button>
                        </div>
                      </div>
                      <div
                        className="text-right"
                        data-id="zv2n1s1il"
                        data-path="src/pages/SalesPage.tsx"
                      >
                        <p
                          className="text-sm font-medium"
                          data-id="2nlanmm7u"
                          data-path="src/pages/SalesPage.tsx"
                        >
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="border-t pt-4 space-y-2"
                  data-id="ngq80svjn"
                  data-path="src/pages/SalesPage.tsx"
                >
                  <div
                    className="flex justify-between"
                    data-id="tqunrwui2"
                    data-path="src/pages/SalesPage.tsx"
                  >
                    <span
                      className="text-sm text-gray-600"
                      data-id="sa7rwhkwc"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      Subtotal:
                    </span>
                    <span
                      className="text-sm font-medium"
                      data-id="at17j1lsm"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      ₱{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between"
                    data-id="aasxz37yw"
                    data-path="src/pages/SalesPage.tsx"
                  >
                    <span
                      className="text-sm text-gray-600"
                      data-id="gwyc81hb6"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      Tax (8%):
                    </span>
                    <span
                      className="text-sm font-medium"
                      data-id="pmlcaaeph"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      ₱{tax.toFixed(2)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-lg font-bold"
                    data-id="bpg9kk09e"
                    data-path="src/pages/SalesPage.tsx"
                  >
                    <span
                      data-id="yuzinwziu"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      Total:
                    </span>
                    <span
                      data-id="r26b23gkt"
                      data-path="src/pages/SalesPage.tsx"
                    >
                      ₱{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-lg"
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={items.length === 0}
                  data-id="zyoqmy6oc"
                  data-path="src/pages/SalesPage.tsx"
                >
                  Checkout (F1)
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card data-id="zfzsb5gtk" data-path="src/pages/SalesPage.tsx">
          <CardHeader data-id="9t2sk3ixl" data-path="src/pages/SalesPage.tsx">
            <CardTitle
              className="text-sm"
              data-id="c25fe87jl"
              data-path="src/pages/SalesPage.tsx"
            >
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent
            className="space-y-1"
            data-id="lcvw0akz9"
            data-path="src/pages/SalesPage.tsx"
          >
            <div
              className="flex justify-between text-xs"
              data-id="hacp96p1y"
              data-path="src/pages/SalesPage.tsx"
            >
              <span data-id="4vrd2q89i" data-path="src/pages/SalesPage.tsx">
                Checkout:
              </span>
              <Badge
                variant="outline"
                data-id="lc5qsws66"
                data-path="src/pages/SalesPage.tsx"
              >
                F1
              </Badge>
            </div>
            <div
              className="flex justify-between text-xs"
              data-id="lt1s5y2ib"
              data-path="src/pages/SalesPage.tsx"
            >
              <span data-id="n6ztgtlyv" data-path="src/pages/SalesPage.tsx">
                Search:
              </span>
              <Badge
                variant="outline"
                data-id="4y0j150c5"
                data-path="src/pages/SalesPage.tsx"
              >
                Ctrl+K
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        data-id="vemgj8c7q"
        data-path="src/pages/SalesPage.tsx"
      />
    </div>
  );
};

export default SalesPage;
