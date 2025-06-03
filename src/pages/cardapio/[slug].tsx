import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LayoutRestaurante from "@/components/LayoutRestaurant";
import RestauranteHeader from "@/components/RestaurantHeader";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import ProductModal from "@/components/ProductModal";
import Sidebar from "@/components/Sidebar";
import { Product, Restaurant } from "@/types";
import CartBar from "@/components/CartBar";

import { getRestaurantBySlug } from "@/pages/api/restaurants";

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
  // Adicione mais conforme necessidade
};

const mockProductsByCategory = [
  {
    categoria: "Burgers",
    produtos: [
      {
        id: "1",
        name: "Majestoso Burger + fritas",
        description:
          "Blend de 180 gramas defumado na lenha frutífera, queijo camembert, crispy de presunto de Parma, geleia de damasco no pão de brioche e molho baconese.",
        price: 47.9,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsz6s7eTffKTOsh_JMgHK0TPAgZvkVGD9CdQ&s", // Imagem do produto
        price_from: false,
        components: ["1x Majestoso Burger", "1x Fritas"],
        additionalOptions: ["Queijo extra", "Batata extra", "Molho especial"], // Opções adicionais para o produto
      },
      {
        id: "2",
        name: "Plebeu Burger + fritas",
        description:
          "Blend defumado, queijo prato, bacon, batata canoa e onions.",
        price: 39.9,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsz6s7eTffKTOsh_JMgHK0TPAgZvkVGD9CdQ&s", // Imagem do produto
        price_from: true,
        components: ["1x Majestoso Burger", "1x Fritas"],

        additionalOptions: [
          "Queijo extra",
          "Cebola caramelizada",
          "Molho barbecue",
        ], // Opções adicionais para o produto
      },
      {
        id: "3",
        name: "Barão Burger + fritas",
        description:
          "180g defumado, cheddar, bacon, cebola caramelizada e batata.",
        price: 40.9,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsz6s7eTffKTOsh_JMgHK0TPAgZvkVGD9CdQ&s", // Imagem do produto
        price_from: false,
        components: ["1x Majestoso Burger", "1x Fritas"],

        additionalOptions: ["Queijo cheddar", "Molho picante"], // Opções adicionais para o produto
      },
      {
        id: "4",
        name: "Cavaleiro Burger + Fritas",
        description: "Defumado + provolone + jalapeño + batata canoa.",
        price: 41.9,
        price_from: true,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsz6s7eTffKTOsh_JMgHK0TPAgZvkVGD9CdQ&s", // Imagem do produto
        additionalOptions: ["Molho extra", "Batata canoa"], // Opções adicionais para o produto
      },
    ],
  },
  {
    categoria: "Bebidas",
    produtos: [
      {
        id: "5",
        name: "Coca-Cola 2L",
        description: "Coca-Cola 2L",
        price: 8.9,
        image_url:
          "https://images.tcdn.com.br/img/img_prod/1115696/coca_cola_original_lata_350ml_27_1_152c3b66fb7a84db006d3238b116cb50.png",
        price_from: false,
        additionalOptions: ["Sem gelo", "Com gelo"], // Opções adicionais para o produto
      },
      {
        id: "6",
        name: "Guaraná Antarctica 2L",
        description: "Guaraná Antarctica 2L",
        price: 9.5,
        image_url:
          "https://images.tcdn.com.br/img/img_prod/1115696/guarana_antarctica_original_lata_350ml_27_1_152c3b66fb7a84db006d3238b116cb50.png",
        price_from: false,
        additionalOptions: ["Sem gelo", "Com gelo"], // Opções adicionais para o produto
      },
    ],
  },
  {
    categoria: "Sobremesas",
    produtos: [
      {
        id: "7",
        name: "Sorvete de Chocolate",
        description: "Sorvete de Chocolate",
        price: 8.9,
        image_url: "https://example.com/sorvete-chocolate.jpg", // Imagem do produto
        price_from: false,
        additionalOptions: ["Cobertura de calda de chocolate", "Granulado"], // Opções adicionais para o produto
      },
      {
        id: "8",
        name: "Pudim de Leite",
        description: "Delicioso pudim de leite condensado",
        price: 7.5,
        image_url: "https://example.com/pudim.jpg", // Imagem do produto
        price_from: true,
        additionalOptions: ["Cobertura de caramelo", "Sem cobertura"], // Opções adicionais para o produto
      },
    ],
  },
  {
    categoria: "Especial do Mês",
    produtos: [
      {
        id: "9",
        name: "Burger Especial do Mês",
        description:
          "Burger exclusivo do mês, com blend de carne especial, cebola roxa caramelizada e queijo brie.",
        price: 55.0,
        image_url: "https://example.com/burger-especial.jpg", // Imagem do produto
        price_from: false,
        additionalOptions: ["Bacon", "Queijo brie extra"], // Opções adicionais para o produto
      },
    ],
  },
];

interface CartItem {
  product: Product;
  additionalOptions: Record<string, number>;
  quantity: number;
}

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  let x = t / (d / 2);
  if (x < 1) return (c / 2) * x * x + b;
  x--;
  return (-c / 2) * (x * (x - 2) - 1) + b;
}

export default function RestaurantePage() {
  const { query } = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const isOpen = restaurantData?.opening_hours
    ? isRestaurantOpen(restaurantData.opening_hours)
    : false;

  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [fetchError, setFetchError] = useState<string | null>(null); // Renomeado para fetchError

  function isRestaurantOpen(openingHours: string): boolean {
    const [opening, closing] = openingHours.split("-");
    const [openingHour, openingMinute] = opening.split(":").map(Number);
    const [closingHour, closingMinute] = closing.split(":").map(Number);

    const now = new Date();

    // Definindo a hora de abertura e fechamento com os minutos
    const openTime = new Date(now.setHours(openingHour, openingMinute, 0, 0));
    const closeTime = new Date(now.setHours(closingHour, closingMinute, 0, 0));

    // Comparando diretamente a hora atual com os horários de abertura e fechamento
    return now >= openTime && now <= closeTime;
  }

  const toggleCartBar = () => {
    setCartOpen((prev) => !prev);
  };

  // Função para adicionar ao carrinho, agora com adicionais e quantidade inicial 1
  const handleAddToCart = (
    product: Product,
    additionalOptions: Record<string, number>
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.additionalOptions) ===
            JSON.stringify(additionalOptions)
      );

      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }

      return [...prevCart, { product, additionalOptions, quantity: 1 }];
    });
  };

  // Calcula o preço total considerando produto + adicionais e quantidade
  const calcularPrecoItem = (item: CartItem) => {
    const precoProduto = item.product.price;
    const precoAdicionaisSomados = Object.entries(
      item.additionalOptions
    ).reduce((acc, [nomeOpcao, quantidade]) => {
      const precoOpcao = precoAdicionais[nomeOpcao] || 0;
      return acc + precoOpcao * quantidade;
    }, 0);
    return (precoProduto + precoAdicionaisSomados) * item.quantity;
  };

  // Calcula total do carrinho somando todos os itens com adicionais
  const totalCarrinho = cart.reduce(
    (acc, item) => acc + calcularPrecoItem(item),
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
    async function fetchRestaurant() {
      if (query.slug) {
        try {
          setLoading(true); // Começar o loading

          const data = await getRestaurantBySlug(query.slug as string);
          setLoading(false); // Finalizar o loading
          if (data) {
            setRestaurantData(data);
            setRestaurantName(
              data.name || String(query.slug).replace("-", " ").toUpperCase()
            );
          } else {
            setRestaurantName(
              String(query.slug).replace("-", " ").toUpperCase()
            );
          }
        } catch (err) {
          setFetchError("Erro ao carregar restaurante"); // Renomeado para fetchError
          console.error(err);
          setRestaurantName(String(query.slug).replace("-", " ").toUpperCase());
          setLoading(false);
        }
      }
    }
    fetchRestaurant();
  }, [query.slug]);

  const filteredProductsByCategory = mockProductsByCategory.map((cat) => ({
    categoria: cat.categoria,
    produtos: cat.produtos.filter((prod) =>
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

  // Se estiver carregando, exibe o spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress /> {/* Spinner de carregamento */}
      </Box>
    );
  }

  // Se houve um erro ao buscar os dados
  if (fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {fetchError}
        </Typography>
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
          cartItems={cart}
          setCartItems={setCart}
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
            categories={mockProductsByCategory.map((c) => c.categoria)}
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
                {mockProductsByCategory
                  .flatMap((cat) => cat.produtos)
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
                        onClick={(product) => handleOpenModal(product)}
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
                          handleAddToCart(product, {}); // Passa adicionais vazios por padrão
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

      {cart.length > 0 && (
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
          className={cart.length > 0 ? "show" : ""}
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
