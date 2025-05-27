import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import LayoutRestaurante from "@/components/LayoutRestaurant";
import RestauranteHeader from "@/components/RestaurantHeader";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import ProductModal from "@/components/ProductModal";
import Sidebar from "@/components/Sidebar";
import { Product } from "@/types";

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
        additionalOptions: ["Queijo extra", "Batata extra", "Molho especial"], // Opções adicionais para o produto
      },
      {
        id: "2",
        name: "Plebeu Burger + fritas",
        description:
          "Blend defumado, queijo prato, bacon, batata canoa e onions.",
        price: 39.9,
        image_url: "https://example.com/image2.jpg", // Imagem do produto
        price_from: true,
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
        image_url: "https://example.com/image3.jpg", // Imagem do produto
        price_from: false,
        additionalOptions: ["Queijo cheddar", "Molho picante"], // Opções adicionais para o produto
      },
      {
        id: "4",
        name: "Cavaleiro Burger + Fritas",
        description: "Defumado + provolone + jalapeño + batata canoa.",
        price: 41.9,
        price_from: true,
        image_url: "https://example.com/image4.jpg", // Imagem do produto
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

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  let x = t / (d / 2);
  if (x < 1) return (c / 2) * x * x + b;
  x--;
  return (-c / 2) * (x * (x - 2) - 1) + b;
}

export default function RestaurantePage() {
  const { query } = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false); // Controle do modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Produto selecionado
  const [cart, setCart] = useState<
    { product: Product; additionalOptions: Record<string, number> }[]
  >([]); // Estado para o carrinho

  // Função para adicionar ao carrinho
  const handleAddToCart = (
    product: Product,
    additionalOptions: Record<string, number>
  ) => {
    setCart((prevCart) => [...prevCart, { product, additionalOptions }]);
  };

  // Função para abrir o modal
  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product); // Define o produto selecionado
    setOpenModal(true); // Abre o modal
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setOpenModal(false); // Fecha o modal
    setSelectedProduct(null); // Limpa o produto selecionado
  };

  useEffect(() => {
    if (query.slug) {
      setRestaurantName(String(query.slug).replace("-", " ").toUpperCase());
    }
  }, [query.slug]);

  const filteredProductsByCategory = mockProductsByCategory.map((cat) => ({
    categoria: cat.categoria,
    produtos: cat.produtos.filter((prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  // Função para rolar até a categoria com navegação suave
  const smoothScrollToCategory = (categoria: string) => {
    const targetElement = document.getElementById(categoria);

    if (!targetElement) return;

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime: number = 0;

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
          top: 0, // Você pode ajustar a posição conforme necessário
          left: 0, // Você pode ajustar a posição conforme necessário
        }}
      >
        <Sidebar
          logo="https://static.ifood-static.com.br/image/upload/t_high/logosgde/c7e768e6-75ae-480d-95dc-c276672066ac/202406242002_DSVk_.jpeg"
          nome={restaurantName || "Carregando..."}
        />
      </Box>
      <RestauranteHeader
        nome={restaurantName || "Carregando..."}
        imagemFundo="https://images.dailyhive.com/20190920101433/burg1.jpeg"
        logo="https://static.ifood-static.com.br/image/upload/t_high/logosgde/c7e768e6-75ae-480d-95dc-c276672066ac/202406242002_DSVk_.jpeg"
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
              smoothScrollToCategory(category); // Chama o scroll suave
            }}
            onSearch={setSearchTerm}
          />
          <Box
            sx={{
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Box
              sx={{
                padding: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Mais Vendidos
              </Typography>

              {/* Container do Carrossel */}
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto", // Permite a rolagem horizontal
                  gap: 2,
                  paddingBottom: 2,
                  scrollSnapType: "x mandatory", // Para "encaixar" os itens no final da rolagem
                  "&::-webkit-scrollbar": { display: "none" }, // Oculta a barra de rolagem
                  msOverflowStyle: "none",
                  scrollbarWidth: "none", // Para esconder a barra de rolagem
                }}
              >
                {mockProductsByCategory
                  .flatMap((cat) => cat.produtos)
                  .map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        flex: "0 0 auto", // Garante que os itens não se expandam e tenham tamanho fixo
                        width: { xs: "60%", sm: "35%", md: "18%" }, // Ajusta a largura dependendo da tela, menor no mobile
                      }}
                    >
                      <ProductCard
                        product={product}
                        variant="vertical" // Usando variant vertical]
                        onClick={(product) => handleOpenModal(product)} // Passando a função handleOpenModal com o produt
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
                          handleAddToCart(product, {}); // Passa as opções adicionais aqui
                        }}
                        onClick={(product) => handleOpenModal(product)} // Passando a função handleOpenModal com o produto
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </LayoutRestaurante>
      </Box>

      {/* Modal do Produto */}
      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={handleAddToCart} // Passando a função de adicionar ao carrinho
      />
      {/* Button Carrinho */}
      {cart.length > 0 && ( // O botão só será exibido quando houver produtos no carrinho
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            padding: 2,
            zIndex: 2,
            opacity: 0, // Começa invisível
            visibility: "hidden", // Começa invisível
            transition: "opacity 1s ease-in-out, visibility 1s ease-in-out", // Transição suave para opacidade e visibilidade
            "&.show": {
              opacity: 1, // Fica visível
              visibility: "visible", // Torna visível
            },
          }}
          className={cart.length > 0 ? "show" : ""}
        >
          <Button
            onClick={() =>
              console.log(`Ir para o carrinho ${JSON.stringify(cart)}`)
            }
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              fontSize: "1rem",
              fontWeight: "bold",
              width: "100%",
              padding: "8px 16px",
            }}
          >
            Ir para o carrinho
            {/* Box para o valor total */}
            <Box
              sx={{
                color: "primary.main",
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "2px 8px",
                fontWeight: "bold",
              }}
            >
              {/* Calcular o total apenas com os preços dos produtos */}
              R$ {""}
              {cart
                .reduce(
                  (total, item) => total + item.product.price, // Somando apenas o preço do produto
                  0
                )
                .toFixed(2)}{" "}
              {/* Exibe o total */}
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  );
}
