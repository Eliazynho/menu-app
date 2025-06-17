/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LayoutRestaurante from "@/components/LayoutRestaurant";
import RestauranteHeader from "@/components/RestaurantHeader";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import ProductModal from "@/components/ProductModal";
import Sidebar from "@/components/Sidebar";
import {
  Restaurant,
  Product,
  ProductByCategory,
  AdditionalOption,
} from "@/types"; // Importe AdditionalOption se necessário para tipagem local, mas o Record já o usa
import CartBar from "@/components/CartBar";
import { getProducts } from "@/pages/api/products";
import { getRestaurantBySlug } from "@/pages/api/restaurants";
// Importações do Redux
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { addToCart, clearCart } from "../../redux/actions/cartActions";
import { useAdditionals } from "../../hooks/useAdditionals";
import {
  calculateCartTotal,
  // flattenAdditionals, // <-- Remova esta importação, pois não será mais usada diretamente aqui
  getAdditionalsByCategory,
  createAdditionalsMap, // <-- Importe a nova função
} from "../../redux/utils/cartUtils";

// Função auxiliar para scroll suave
function easeInOutQuad(t: number, b: number, c: number, d: number) {
  let x = t / (d / 2);
  if (x < 1) return (c / 2) * x * x + b;
  x--;
  return (-c / 2) * (x * (x - 2) - 1) + b;
}

// Função para verificar se o restaurante está aberto (mantida)
function isRestaurantOpen(openingHours: string): boolean {
  const [opening, closing] = openingHours.split("-");
  const [openingHour, openingMinute] = opening.split(":").map(Number);
  const [closingHour, closingMinute] = closing.split(":").map(Number);
  const now = new Date();
  const openTime = new Date(now.setHours(openingHour, openingMinute, 0, 0));
  const closeTime = new Date(now.setHours(closingHour, closingMinute, 0, 0));
  // Ajuste para lidar com horários que passam da meia-noite, se necessário
  // Por simplicidade, assume que o fechamento é no mesmo dia ou no dia seguinte cedo.
  if (closeTime < openTime) {
    // Se o horário de fechamento for menor que o de abertura, significa que fecha no dia seguinte
    if (now >= openTime || now <= closeTime) {
      return true;
    }
  } else {
    // Horário de fechamento no mesmo dia
    if (now >= openTime && now <= closeTime) {
      return true;
    }
  }
  return false;
}

export default function RestaurantePage() {
  const router = useRouter();
  const { query } = router;

  // Redux hooks
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartRestaurant = useAppSelector((state) => state.cart.restaurant);

  // State
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsByCategory, setProductsByCategory] = useState<
    ProductByCategory[]
  >([]);

  // 🎯 ETAPA 1: Carregar APENAS o restaurante
  useEffect(() => {
    async function fetchRestaurant() {
      if (!query.slug) return;
      try {
        setLoading(true);
        const rest = await getRestaurantBySlug(query.slug as string);
        if (!rest) {
          console.log("Restaurante não encontrado, redirecionando para 404");
          router.push("/404");
          return;
        }
        console.log("✅ Restaurante encontrado:", rest.name);
        setRestaurantData(rest);
      } catch (err) {
        console.error("❌ Erro ao carregar restaurante:", err);
        router.push("/404"); // Redireciona para 404 em caso de erro na API também
      } finally {
        // O loading geral só termina quando o restaurante é carregado.
        // O loading de produtos e adicionais é tratado pelos hooks/estados específicos.
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [query.slug, router]); // Dependências: slug do router e o objeto router

  // 🎯 ETAPA 2: Carregar produtos (só se restaurante existir)
  useEffect(() => {
    // Só busca produtos se o restaurantData estiver carregado
    if (!restaurantData) return;

    async function fetchProducts() {
      try {
        console.log("🔄 Carregando produtos para:", restaurantData?.name);
        if (!restaurantData) return;
        const prods = await getProducts(restaurantData.id);
        setProductsByCategory(prods);
        console.log("✅ Produtos carregados:", prods.length, "categorias");
      } catch (err) {
        console.error("❌ Erro ao carregar produtos:", err);
        // Tratar erro de produtos (ex: exibir mensagem, manter lista vazia)
      }
    }
    fetchProducts();
  }, [restaurantData]); // Dependência: restaurantData

  // 🎯 Hook de adicionais (só executa se restaurantData.id existir)
  // Este hook já lida com seu próprio estado de loading/error
  const { additionalCategories, additionalsLoading, additionalsError } =
    useAdditionals(restaurantData?.id ?? undefined); // Passa o ID do restaurante ou undefined

  // Processamento dos adicionais para uso nos componentes
  const additionalsByCategory = getAdditionalsByCategory(additionalCategories);

  // 🚨 Crie o mapa de adicionais para o CartBar usando a nova função
  const additionalsMapForCart = createAdditionalsMap(additionalCategories); // <-- Use a nova função aqui

  // Calcula o total do carrinho (a função calculateCartTotal já usa o mapa internamente agora)
  const totalCarrinho = calculateCartTotal(cartItems, additionalCategories);

  // Verifica o status de abertura (mantido)
  const isOpen = restaurantData?.opening_hours
    ? isRestaurantOpen(restaurantData.opening_hours)
    : false;

  // Toggle da barra do carrinho (mantido)
  const toggleCartBar = () => {
    setCartOpen((prev) => !prev);
  };

  // Lógica para adicionar item ao carrinho (mantida)
  const handleAddToCart = (
    product: Product,
    additionalOptions: Record<string, number> = {},
    quantity: number = 1
  ) => {
    if (!restaurantData) return; // Garante que há dados do restaurante

    // Verifica se o item é de um restaurante diferente
    if (cartRestaurant && cartRestaurant.id !== restaurantData.id) {
      const confirmChange = window.confirm(
        `Você já tem itens de ${cartRestaurant.name}. Deseja limpar o carrinho e adicionar itens de ${restaurantData.name}?`
      );
      if (confirmChange) {
        dispatch(clearCart()); // Limpa o carrinho se confirmado
      } else {
        return; // Não adiciona se o usuário cancelar
      }
    }

    // Dispatch da ação para adicionar ao carrinho
    dispatch(
      addToCart(
        {
          id: restaurantData.id,
          name: restaurantData.name,
          logo_url: restaurantData.logo_url,
          color: restaurantData.color,
          // Inclua outras propriedades do restaurante que o CartRestaurant precisa
          delivery_fee: restaurantData.delivery_fee, // Exemplo
        },
        product,
        quantity,
        additionalOptions
      )
    );
  };

  // Lógica para abrir a modal de produto (mantida)
  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  // Lógica para fechar a modal de produto (mantida)
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  // Filtra produtos por termo de busca (mantido)
  const filteredProductsByCategory = productsByCategory.map((categoria) => ({
    categoria: categoria.name,
    produtos: categoria.products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  // Scroll suave para a categoria (mantido)
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

  // 🔄 Loading inicial (enquanto carrega o restaurante)
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>Carregando restaurante...</Typography>
      </Box>
    );
  }

  // ❌ Se não encontrou restaurante, retorna null (já redirecionou no useEffect)
  if (!restaurantData) {
    return null;
  }

  // Renderização do componente
  return (
    <Box>
      {/* Sidebar e CartBar posicionados absolutamente */}
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
          logo={
            restaurantData.logo_url ||
            "https://static.ifood-static.com.br/image/upload/t_high/logosgde/c7e768e6-75ae-480d-95dc-c276672066ac/202406242002_DSVk_.jpeg" // Fallback logo
          }
          nome={restaurantData.name}
        />
        <CartBar
          open={cartOpen}
          onToggle={toggleCartBar}
          userName="Tiago" // Nome do usuário fixo ou obtido de outro lugar
          color={restaurantData.color || "#1976d2"} // Cor do restaurante ou default
          flatAdditionals={additionalsMapForCart} // <-- Passando o MAPA de adicionais aqui
        />
      </Box>

      {/* Header do Restaurante */}
      <RestauranteHeader
        nome={restaurantData.name}
        imagemFundo={restaurantData.background_url}
        logo={restaurantData.logo_url}
        tempo={restaurantData.delivery_time}
        minimo={restaurantData.minimum_order_value}
        status={isOpen ? "Aberto" : "Fechado"}
        color={restaurantData.color}
      />

      {/* Conteúdo principal (filtros, produtos) */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          mt: -15, // Ajusta a sobreposição com o header
          width: "100%",
          overflow: "hidden",
        }}
      >
        <LayoutRestaurante title="">
          {" "}
          {/* Layout interno */}
          {/* Filtro de Categorias e Busca */}
          <CategoryFilter
            categories={productsByCategory.map((c) => c.name)}
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              smoothScrollToCategory(category); // Scroll ao selecionar categoria
            }}
            onSearch={setSearchTerm} // Atualiza termo de busca
            color={restaurantData.color || "#1976d2"}
          />
          {/* Lista de Produtos */}
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            {/* Loading de produtos */}
            {productsByCategory.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
                <Typography sx={{ ml: 2 }}>Carregando produtos...</Typography>
              </Box>
            ) : (
              <>
                {/* Seção de Mais Vendidos (Exemplo) */}
                <Box sx={{ padding: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Mais Vendidos
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      overflowX: "auto", // Permite scroll horizontal
                      gap: 2,
                      paddingBottom: 2,
                      scrollSnapType: "x mandatory",
                      "&::-webkit-scrollbar": { display: "none" }, // Esconde scrollbar no Webkit
                      msOverflowStyle: "none", // Esconde scrollbar no IE/Edge
                      scrollbarWidth: "none", // Esconde scrollbar no Firefox
                    }}
                  >
                    {productsByCategory
                      .flatMap((cat) => cat.products) // Achata todos os produtos
                      .slice(0, 5) // Pega os 5 primeiros como "Mais Vendidos"
                      .map((product) => (
                        <Box
                          key={product.id}
                          sx={{
                            flex: "0 0 auto", // Impede o item de crescer/diminuir
                            width: { xs: "60%", sm: "35%", md: "18%" }, // Largura responsiva
                          }}
                        >
                          <ProductCard
                            product={product}
                            variant="vertical" // Layout vertical
                            onClick={() => handleOpenModal(product)} // Abre modal ao clicar
                            color={restaurantData.color || "#1976d2"}
                          />
                        </Box>
                      ))}
                  </Box>
                </Box>

                {/* Listagem de Produtos por Categoria */}
                {filteredProductsByCategory.map(
                  (categoria) =>
                    // Renderiza categorias apenas se tiverem produtos filtrados
                    categoria.produtos.length > 0 && (
                      <Box
                        id={categoria.categoria} // ID para scroll suave
                        key={categoria.categoria}
                        sx={{ mb: 4, mt: 2 }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 2 }}
                        >
                          {categoria.categoria}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap", // Quebra linha para múltiplos itens
                            gap: 2,
                            justifyContent: "space-between", // Espaço entre os itens
                          }}
                        >
                          {categoria.produtos.map((product) => (
                            <Box
                              key={product.id}
                              sx={{ width: { xs: "100%", sm: "48%" } }} // Largura responsiva
                            >
                              <ProductCard
                                product={product}
                                variant="horizontal" // Layout horizontal
                                onAddToCart={(product) => {
                                  // Adiciona ao carrinho diretamente (sem adicionais)
                                  handleAddToCart(product, {}, 1);
                                }}
                                onClick={(product) => handleOpenModal(product)} // Abre modal para adicionar com adicionais
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )
                )}
              </>
            )}
          </Box>
        </LayoutRestaurante>
      </Box>

      {/* Modal de Produto (para selecionar adicionais) */}
      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        product={selectedProduct} // Produto selecionado na lista
        additionalCategories={additionalCategories} // Passa categorias originais
        additionalsByCategory={additionalsByCategory} // Passa adicionais agrupados (útil para a modal)
        additionalsLoading={additionalsLoading} // Passa status de loading dos adicionais
        onAddToCart={handleAddToCart} // Função para adicionar ao carrinho (com adicionais)
        color={restaurantData.color || "#1976d2"}
      />

      {/* Botão "Ir para o carrinho" (sticky na parte inferior) */}
      {cartItems.length > 0 && ( // Só mostra se houver itens no carrinho
        <Box
          sx={{
            position: "sticky", // Posição fixa na tela
            bottom: 0,
            width: "100%",
            padding: 2,
            zIndex: 2, // Z-index para ficar acima de outros conteúdos
            opacity: cartItems.length > 0 ? 1 : 0, // Animação de opacidade
            visibility: cartItems.length > 0 ? "visible" : "hidden", // Animação de visibilidade
            transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
          }}
        >
          <Button
            onClick={toggleCartBar} // Abre/fecha o CartBar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: `${restaurantData.color}`, // Cor do botão
              color: "white",
              "&:hover": {
                backgroundColor: `${restaurantData.color}`, // Mantém a cor no hover
                opacity: 0.9, // Pequena opacidade no hover
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
                color: `${restaurantData.color}`, // Cor do texto do total
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "2px 8px",
                fontWeight: "bold",
              }}
            >
              R$ {totalCarrinho.toFixed(2)} {/* Exibe o total do carrinho */}
            </Box>
          </Button>
        </Box>
      )}

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === "development" && (
        <Box
          sx={{
            position: "fixed",
            top: 100,
            left: 20,
            p: 2,
            bgcolor: "rgba(0,0,0,0.8)",
            color: "white",
            borderRadius: 1,
            fontSize: "0.8rem",
            maxWidth: 300,
            zIndex: 9999,
          }}
        >
          <Typography variant="caption" display="block">
            ✅ Restaurant: {restaurantData.name}
          </Typography>
          <Typography variant="caption" display="block">
            📦 Products: {productsByCategory.length} categorias
          </Typography>
          <Typography variant="caption" display="block">
            🧩 Adicionais: {additionalCategories.length} categorias
          </Typography>
          <Typography variant="caption" display="block">
            ⏳ Loading Adicionais: {additionalsLoading ? "true" : "false"}
          </Typography>
          <Typography variant="caption" display="block">
            🛒 Itens no carrinho: {cartItems.length}
          </Typography>
          <Typography variant="caption" display="block">
            💰 Total Carrinho: R$ {totalCarrinho.toFixed(2)}
          </Typography>
          <Typography variant="caption" display="block">
            CartBar flatAdditionals Type: Record&lt;string, AdditionalOption&gt;
          </Typography>
        </Box>
      )}
    </Box>
  );
}
