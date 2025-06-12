/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LayoutRestaurante from "@/components/LayoutRestaurant";
import RestauranteHeader from "@/components/RestaurantHeader";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import ProductModal from "@/components/ProductModal";
import Sidebar from "@/components/Sidebar";
import { Restaurant, Product, ProductByCategory } from "@/types";
import CartBar from "@/components/CartBar";
import { getProducts } from "@/pages/api/products";
import { getRestaurantBySlug } from "@/pages/api/restaurants";
// Importações do Redux
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { addToCart, clearCart } from "../../redux/actions/cartActions";

const precoAdicionais: Record<string, number> = {
  "Queijo extra": 3.0,
  "Batata extra": 4.0,
  "Molho especial": 2.5,
  "Cebola caramelizada": 2.0,
  "Molho barbecue": 2.0,
  "Queijo cheddar": 3.0,
  "Molho picante": 2.5,
  "Molho extra": 2.0,
  "Batata canoa": 4.0,
  Bacon: 4.5,
  "Queijo brie extra": 5.0,
};

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  let x = t / (d / 2);
  if (x < 1) return (c / 2) * x * x + b;
  x--;
  return (-c / 2) * (x * (x - 2) - 1) + b;
}

export default function RestaurantePage() {
  const { query } = useRouter();

  // Redux hooks
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartRestaurant = useAppSelector((state) => state.cart.restaurant);

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Removido o estado local do cart - agora usa Redux

  const isOpen = restaurantData?.opening_hours
    ? isRestaurantOpen(restaurantData.opening_hours)
    : false;

  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [prodFetchError, setProdFetchError] = useState<string | null>(null);
  const [prodLoading, setProdLoading] = useState<boolean>(true);
  const [productsByCategory, setProductsByCategory] = useState<
    ProductByCategory[]
  >([]);

  function isRestaurantOpen(openingHours: string): boolean {
    const [opening, closing] = openingHours.split("-");
    const [openingHour, openingMinute] = opening.split(":").map(Number);
    const [closingHour, closingMinute] = closing.split(":").map(Number);
    const now = new Date();
    const openTime = new Date(now.setHours(openingHour, openingMinute, 0, 0));
    const closeTime = new Date(now.setHours(closingHour, closingMinute, 0, 0));
    return now >= openTime && now <= closeTime;
  }

  const toggleCartBar = () => {
    setCartOpen((prev) => !prev);
  };

  // Função atualizada para usar Redux
  const handleAddToCart = (
    product: Product,
    additionalOptions: Record<string, number> = {},
    quantity: number = 1
  ) => {
    if (!restaurantData) return;

    // Verifica se é um restaurante diferente
    if (cartRestaurant && cartRestaurant.id !== restaurantData.id) {
      const confirmChange = window.confirm(
        `Você já tem itens de ${cartRestaurant.name}. Deseja limpar o carrinho e adicionar itens de ${restaurantData.name}?`
      );
      if (confirmChange) {
        dispatch(clearCart());
      } else {
        return;
      }
    }

    dispatch(
      addToCart(
        {
          id: restaurantData.id,
          name: restaurantData.name,
          logo_url: restaurantData.logo_url,
          color: restaurantData.color,
        },
        product,
        quantity,
        additionalOptions
      )
    );
  };

  // Função para calcular preço do item (adaptada para Redux)
  const calcularPrecoItem = (item: any) => {
    const precoProduto = item.product.price;
    const precoAdicionaisSomados = Object.entries(
      item.additionalOptions || {}
    ).reduce((acc, [nomeOpcao, quantidade]) => {
      const precoOpcao = precoAdicionais[nomeOpcao] || 0;
      return acc + precoOpcao * (quantidade as number);
    }, 0);
    return (precoProduto + precoAdicionaisSomados) * item.quantity;
  };

  // Calcula total do carrinho usando Redux
  const totalCarrinho = cartItems.reduce(
    (acc: number, item: any) => acc + calcularPrecoItem(item),
    0
  );

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    async function fetchAll() {
      if (!query.slug) return;
      try {
        setLoading(true);
        setProdLoading(true);
        const rest = await getRestaurantBySlug(query.slug as string);
        setRestaurantData(rest);
        setRestaurantName(rest?.name ?? "Restaurante");
        const prods = await getProducts(rest.id as string);
        setProductsByCategory(prods);
        setProdFetchError(null);
      } catch (err) {
        console.error(err);
        setFetchError("Erro ao carregar restaurante");
        setProdFetchError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
        setProdLoading(false);
      }
    }
    fetchAll();
  }, [query.slug]);

  const filteredProductsByCategory = productsByCategory.map((cat) => ({
    categoria: cat.name,
    produtos: cat.products.filter((prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const smoothScrollToCategory = (categoria: string) => {
    const targetElement = document.getElementById(categoria);
    if (!targetElement) return;
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = 0;
    const animation = (currentTime: number) => {
      if (startTime === 0) startTime = currentTime;
      const progress = currentTime - startTime;
      const scroll = easeInOutQuad(progress, startPosition, distance, duration);
      window.scrollTo(0, scroll);
      if (progress < duration) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  };

  if (loading || prodLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (fetchError || prodFetchError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">{fetchError || prodFetchError}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          borderRadius: 3,
          zIndex: 1000,
          width: "100%",
          overflow: "hidden",
          padding: 2,
          top: 0,
          left: 0,
        }}
      >
        <Sidebar
          logo="https://static.ifood-static.com.br/image/upload/t_high/logosgde/c7e768e6-75ae-480d-95dc-c276672066ac/202406242002_DSVk_.jpeg"
          nome={restaurantName || "Carregando..."}
        />
        <CartBar
          open={cartOpen}
          onToggle={toggleCartBar}
          userName="alo"
          color={restaurantData?.color || "#1976d2"}
        />
      </Box>

      <RestauranteHeader
        nome={restaurantName || "Carregando..."}
        imagemFundo={restaurantData?.background_url}
        logo={restaurantData?.logo_url}
        tempo={restaurantData?.delivery_time}
        minimo={restaurantData?.minimum_order_value}
        status={isOpen ? "Aberto" : "Fechado"}
        color={restaurantData?.color}
      />

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          mt: -15,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <LayoutRestaurante title="">
          <CategoryFilter
            categories={productsByCategory.map((c) => c.name)}
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              smoothScrollToCategory(category);
            }}
            onSearch={setSearchTerm}
            color={restaurantData?.color || "#1976d2"}
          />

          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Mais Vendidos
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 2,
                  paddingBottom: 2,
                  scrollSnapType: "x mandatory",
                  "&::-webkit-scrollbar": { display: "none" },
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {productsByCategory
                  .flatMap((cat) => cat.products)
                  .map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        flex: "0 0 auto",
                        width: { xs: "60%", sm: "35%", md: "18%" },
                      }}
                    >
                      <ProductCard
                        product={product}
                        variant="vertical"
                        onClick={() => handleOpenModal(product)}
                        color={restaurantData?.color || "#1976d2"}
                      />
                    </Box>
                  ))}
              </Box>
            </Box>

            {filteredProductsByCategory.map((categoria) => (
              <Box
                id={categoria.categoria}
                key={categoria.categoria}
                sx={{ mb: 4, mt: 2 }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  {categoria.categoria}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  {categoria.produtos.map((product) => (
                    <Box
                      key={product.id}
                      sx={{ width: { xs: "100%", sm: "48%" } }}
                    >
                      <ProductCard
                        product={product}
                        variant="horizontal"
                        onAddToCart={(product) => {
                          handleAddToCart(product, {}, 1);
                        }}
                        onClick={(product) => handleOpenModal(product)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </LayoutRestaurante>
      </Box>

      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        color={restaurantData?.color || "#1976d2"}
      />

      {cartItems.length > 0 && ( // Usando Redux
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            padding: 2,
            zIndex: 2,
            opacity: 0,
            visibility: "hidden",
            transition: "opacity 1s ease-in-out, visibility 1s ease-in-out",
            "&.show": {
              opacity: 1,
              visibility: "visible",
            },
          }}
          className={cartItems.length > 0 ? "show" : ""}
        >
          <Button
            onClick={toggleCartBar}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: `${restaurantData?.color}`,
              color: "white",
              "&:hover": {
                backgroundColor: `${restaurantData?.color}`,
              },
              fontSize: "1rem",
              fontWeight: "bold",
              width: "100%",
              padding: "8px 16px",
            }}
          >
            Ir para o carrinho
            <Box
              sx={{
                color: `${restaurantData?.color}`,
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "2px 8px",
                fontWeight: "bold",
              }}
            >
              R$ {totalCarrinho.toFixed(2)}
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  );
}
