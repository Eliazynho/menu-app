/* eslint-disable @typescript-eslint/no-explicit-any */
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
  AdditionalCategory, // Importe AdditionalCategory também
} from "@/types";
import CartBar from "@/components/CartBar";
import { getProducts } from "@/pages/api/products";
import { getRestaurantBySlug } from "@/pages/api/restaurants";
// Importações do Redux
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { addToCart, clearCart } from "../../redux/actions/cartActions";
import { useAdditionals } from "../../hooks/useAdditionals";
import {
  calculateCartTotal,
  getAdditionalsByCategory,
  createAdditionalsMap,
} from "../../redux/utils/cartUtils";
import {
  fetchRestaurantStart,
  fetchRestaurantSuccess,
  fetchRestaurantFailure,
} from "@/redux/slices/restaurantSlice";
import { RestaurantState } from "@/redux/slices/restaurantSlice";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

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

  // ✅ ALTERADO: Usando a variável 'restaurant' obtida do Redux (corretamente tipada)

  // State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [productsByCategory, setProductsByCategory] = useState<
    ProductByCategory[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  // 🎯 ETAPA 1: Carregar APENAS o restaurante
  useEffect(() => {
    async function fetchRestaurant() {
      if (!query.slug || typeof query.slug !== "string") return;
      dispatch(fetchRestaurantStart());
      try {
        const rest = await getRestaurantBySlug(query.slug as string);
        if (!rest) {
          console.log("Restaurante não encontrado, redirecionando para 404");
          dispatch(fetchRestaurantFailure("Restaurante não encontrado."));
          router.push("/404");
          return;
        }

        setRestaurant(rest);
        console.log("✅ Restaurante encontrado:", rest.name);
        console.log("✅ ID do restaurante:", rest.id);
        async function fetchProducts(restfetch: Restaurant) {
          try {
            // ✅ ALTERADO: Usando 'restaurant?.name' em vez de 'restaurantData?.name'
            console.log("🔄 Carregando produtos para:", restfetch.name);
            // Adiciona verificação de null para restaurant
            if (!restfetch) return;
            // ✅ ALTERADO: Usando 'restaurant.id' em vez de 'restaurantData.id'
            const prods = await getProducts(restfetch.id);
            console.log(prods);
            setProductsByCategory(prods);
            console.log("✅ Produtos carregados:", prods.length, "categorias");
          } catch (err) {
            console.error("❌ Erro ao carregar produtos:", err);
            // Tratar erro de produtos (ex: exibir mensagem, manter lista vazia)
          }
        }
        await fetchProducts(rest);
        dispatch(fetchRestaurantSuccess(rest));
        console.log("✅ Restaurante carregado com sucesso!", rest);
        setLoading(false);
      } catch (err) {
        console.error("❌ Erro ao carregar restaurante:", err);
        dispatch(fetchRestaurantFailure("Erro ao carregar restaurante.")); // Adiciona o erro ao estado Redux
        router.push("/404"); // Redireciona para 404 em caso de erro na API também
      }
    }
    fetchRestaurant();
  }, [query.slug, router, dispatch]); // Dependências: slug do router e o objeto router

  // 🎯 Hook de adicionais (só executa se restaurant.id existir)
  // Este hook já lida com seu próprio estado de loading/error
  // ✅ ALTERADO: Passa o ID do 'restaurant' (obtido do Redux) ou undefined
  const { additionalCategories, additionalsLoading, additionalsError } =
    useAdditionals(restaurant?.id ?? undefined);

  // Processamento dos adicionais para uso nos componentes
  const additionalsByCategory = getAdditionalsByCategory(additionalCategories);

  // Crie o mapa de adicionais para o CartBar usando a nova função
  const additionalsMapForCart: Record<string, AdditionalOption> =
    createAdditionalsMap(additionalCategories);

  // Calcula o total do carrinho
  const totalCarrinho = calculateCartTotal(cartItems, additionalCategories);

  // Verifica o status de abertura
  // ✅ ALTERADO: Usa 'restaurant' para verificar opening_hours em vez de 'restaurantData'
  const isOpen = restaurant?.opening_hours
    ? isRestaurantOpen(restaurant.opening_hours)
    : false;

  // Toggle da barra do carrinho (mantido)
  const toggleCartBar = () => {
    setCartOpen((prev) => !prev);
  };

  // Lógica para adicionar item ao carrinho
  const handleAddToCart = (
    product: Product,
    additionalOptions: Record<string, number> = {},
    quantity: number = 1
  ) => {
    // ✅ ALTERADO: Garante que há dados do 'restaurant' (obtido do Redux) em vez de 'restaurantData'
    if (!restaurant) return;

    // Verifica se o item é de um restaurante diferente
    // ✅ ALTERADO: Usa 'restaurant.id' e 'restaurant.name' em vez de 'restaurantData.id'/'restaurantData.name'
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      const confirmChange = window.confirm(
        `Você já tem itens de ${cartRestaurant.name}. Deseja limpar o carrinho e adicionar itens de ${restaurant.name}?`
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
          // ✅ ALTERADO: Usa propriedades de 'restaurant' em vez de 'restaurantData'
          id: restaurant.id,
          name: restaurant.name,
          logo_url: restaurant.logo_url,
          color: restaurant.color,
          // Inclua outras propriedades do 'restaurant' que o CartRestaurant precisa
          delivery_fee: restaurant.delivery_fee,
          // ... adicione outras propriedades necessárias do restaurante
        },
        product,
        quantity,
        additionalOptions
      )
    );
  };

  // Lógica para abrir o modal de produto
  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  // Lógica para fechar o modal de produto
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setOpenModal(false);
  };

  // Filtragem de produtos por categoria e termo de busca
  const filteredProductsByCategory = productsByCategory
    .map((category) => ({
      ...category,
      produtos: category.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.produtos.length > 0); // Remove categorias vazias após a filtragem

  // Função para scroll suave até a categoria
  const smoothScrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 180; // Ajuste este valor conforme a altura do seu header/filtros fixos
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
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

  // ❌ Se não encontrou restaurante ou houve erro, retorna null (já redirecionou no useEffect)
  // ✅ ALTERADO: Verifica se 'restaurant' é null em vez de 'restaurantData'
  if (!restaurant) {
    return null;
  }

  // Renderização do componente principal
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
          // ✅ ALTERADO: Usa 'restaurant.logo_url' e 'restaurant.name' em vez de 'restaurantData'
          logo={
            restaurant.logo_url ||
            "https://static.ifood-static.com.br/image/upload/t_high/logosgde/c7e768e6-75ae-480d-95dc-c276672066ac/202406242002_DSVk_.jpeg" // Fallback logo
          }
          nome={restaurant.name}
        />
        <CartBar
          open={cartOpen}
          onToggle={toggleCartBar}
          userName="Tiago" // Nome do usuário fixo ou obtido de outro lugar
          // ✅ ALTERADO: Usa 'restaurant.color' em vez de 'restaurantData.color'
          color={restaurant.color || "#1976d2"} // Cor do restaurante ou default
          flatAdditionals={additionalsMapForCart} // Passando o MAPA de adicionais aqui
        />
      </Box>

      {/* Header do Restaurante */}
      <RestauranteHeader
        // ✅ ALTERADO: Usa propriedades de 'restaurant' em vez de 'restaurantData'
        nome={restaurant.name}
        imagemFundo={restaurant.background_url}
        logo={restaurant.logo_url}
        tempo={restaurant.delivery_time}
        minimo={restaurant.minimum_order_value}
        status={isOpen ? "Aberto" : "Fechado"}
        color={restaurant.color}
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
            // ✅ ALTERADO: Usa 'restaurant.color' em vez de 'restaurantData.color'
            color={restaurant.color || "#1976d2"}
          />
          {/* Lista de Produtos */}
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Mais Vendidos
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto", // Scroll horizontal
                  gap: 2,
                  pb: 2, // Padding bottom para scrollbar
                  "&::-webkit-scrollbar": { display: "none" }, // Esconde scrollbar no Webkit
                  msOverflowStyle: "none", // Esconde scrollbar no IE/Edge
                  scrollbarWidth: "none", // Esconde scrollbar no Firefox
                }}
              >
                {productsByCategory
                  .flatMap((cat) => cat.products) // Achata a lista de produtos
                  .slice(0, 5) // Limita a 5, por exemplo
                  .map((product) => (
                    <Box key={product.id} sx={{ minWidth: 200 }}>
                      <ProductCard
                        product={product}
                        variant="vertical" // Layout vertical para mais vendidos
                        onAddToCart={(p) => handleAddToCart(p, {}, 1)}
                        onClick={(p) => handleOpenModal(p)}
                        color={restaurant.color || "#1976d2"} // ✅ ALTERADO: Usa 'restaurant.color'
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
                    id={categoria.name} // ID para scroll suave
                    key={categoria.name}
                    sx={{ mb: 4, mt: 2 }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mb: 2, px: 2 }} // Adiciona padding horizontal
                    >
                      {categoria.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap", // Quebra linha para múltiplos itens
                        gap: 2,
                        justifyContent: "space-between", // Espaço entre os itens
                        px: 2, // Adiciona padding horizontal aos cards
                      }}
                    >
                      {categoria.produtos.map((product) => (
                        <Box
                          key={product.id}
                          sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }} // Largura responsiva, ajustando para o gap
                        >
                          <ProductCard
                            product={product}
                            variant="horizontal" // Layout horizontal
                            onAddToCart={(product) => {
                              // Adiciona ao carrinho diretamente (sem adicionais)
                              handleAddToCart(product, {}, 1);
                            }}
                            onClick={(product) => handleOpenModal(product)} // Abre modal para adicionar com adicionais
                            // ✅ ALTERADO: Usa 'restaurant.color' em vez de 'restaurantData.color'
                            color={restaurant.color || "#1976d2"} // Passa a cor para o ProductCard
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )
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
        // ✅ ALTERADO: Usa 'restaurant.color' em vez de 'restaurantData.color'
        color={restaurant.color || "#1976d2"}
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
              // ✅ ALTERADO: Usa 'restaurant.color' em vez de 'restaurantData.color'
              backgroundColor: `${restaurant.color}`, // Cor do botão
              color: "white",
              "&:hover": {
                backgroundColor: `${restaurant.color}`, // Mantém a cor no hover
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
                // ✅ ALTERADO: Usa 'restaurant.color' em vez de 'restaurantData.color'
                color: `${restaurant.color}`, // Cor do texto do total
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
          {/* ✅ ALTERADO: Usa propriedades de 'restaurant' em vez de 'restaurantData' */}
          <Typography variant="caption" display="block">
            ✅ Restaurant: {restaurant.name}
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
          {/* Adicione mais informações de debug se necessário */}
          {/* <Typography variant="caption" display="block">
            Loading Restaurante: {loading ? "true" : "false"}
          </Typography>
          <Typography variant="caption" display="block">
            Erro Restaurante: {error || "none"}
          </Typography> */}
        </Box>
      )}
    </Box>
  );
}
