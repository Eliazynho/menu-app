import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import LayoutRestaurante from "@/components/LayoutRestaurant";
import RestauranteHeader from "@/components/RestaurantHeader";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

const mockProductsByCategory = [
  {
    categoria: "Especial do Mês",
    produtos: [
      {
        id: "1",
        name: "Majestoso Burger + fritas",
        description:
          "Blend de 180 gramas defumado na lenha frutífera, queijo camembert, crispy de presunto de Parma, geleia de damasco no pão de brioche e molho baconese",
        price: 47.9,
        image_url:
          "https://scontent.fcau18-1.fna.fbcdn.net/v/t51.75761-15/481274160_18487254970027600_6155508512885900558_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6IX7JgwvGBIQ7kNvwHRW_I4&_nc_oc=AdmeE2IJ8t5o9oFvIKfwPltNFyvsIlp4Lz-RO046X7nUb2f4v87-xkKzAFvbMv0roK-m9nsDZGN13VlQCrRCT6es&_nc_zt=23&_nc_ht=scontent.fcau18-1.fna&_nc_gid=FoIKJwETvlXEnDXmWycPNw&oh=00_AfJzWRaCNEwuFnLcWzoe8mzczQX1nj05-9pEZ1wmnpl9Cw&oe=683143FE",
      },
    ],
  },
  {
    categoria: "Burgers",
    produtos: [
      {
        id: "2",
        name: "Plebeu Burger + fritas",
        description:
          "Blend defumado, queijo prato, bacon, batata canoa e onions",
        price: 39.9,
        image_url:
          "https://scontent.fcau18-1.fna.fbcdn.net/v/t51.75761-15/481274160_18487254970027600_6155508512885900558_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6IX7JgwvGBIQ7kNvwHRW_I4&_nc_oc=AdmeE2IJ8t5o9oFvIKfwPltNFyvsIlp4Lz-RO046X7nUb2f4v87-xkKzAFvbMv0roK-m9nsDZGN13VlQCrRCT6es&_nc_zt=23&_nc_ht=scontent.fcau18-1.fna&_nc_gid=FoIKJwETvlXEnDXmWycPNw&oh=00_AfJzWRaCNEwuFnLcWzoe8mzczQX1nj05-9pEZ1wmnpl9Cw&oe=683143FE",
      },
      {
        id: "3",
        name: "Barão Burger + fritas",
        description:
          "180g defumado, cheddar, bacon, cebola caramelizada e batata",
        price: 40.9,
        image_url:
          "https://scontent.fcau18-1.fna.fbcdn.net/v/t51.75761-15/481274160_18487254970027600_6155508512885900558_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6IX7JgwvGBIQ7kNvwHRW_I4&_nc_oc=AdmeE2IJ8t5o9oFvIKfwPltNFyvsIlp4Lz-RO046X7nUb2f4v87-xkKzAFvbMv0roK-m9nsDZGN13VlQCrRCT6es&_nc_zt=23&_nc_ht=scontent.fcau18-1.fna&_nc_gid=FoIKJwETvlXEnDXmWycPNw&oh=00_AfJzWRaCNEwuFnLcWzoe8mzczQX1nj05-9pEZ1wmnpl9Cw&oe=683143FE",
      },
      {
        id: "4",
        name: "Cavaleiro Burger + Fritas",
        description: "Defumado + provolone + jalapeño + batata canoa",
        price: 41.9,
        price_from: true,
        image_url:
          "https://scontent.fcau18-1.fna.fbcdn.net/v/t51.75761-15/481274160_18487254970027600_6155508512885900558_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6IX7JgwvGBIQ7kNvwHRW_I4&_nc_oc=AdmeE2IJ8t5o9oFvIKfwPltNFyvsIlp4Lz-RO046X7nUb2f4v87-xkKzAFvbMv0roK-m9nsDZGN13VlQCrRCT6es&_nc_zt=23&_nc_ht=scontent.fcau18-1.fna&_nc_gid=FoIKJwETvlXEnDXmWycPNw&oh=00_AfJzWRaCNEwuFnLcWzoe8mzczQX1nj05-9pEZ1wmnpl9Cw&oe=683143FE",
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
      },
    ],
  },
  {
    categoria: "Sobremesas",
    produtos: [
      {
        id: "6",
        name: "Sorvete de Chocolate",
        description: "Sorvete de Chocolate",
        price: 8.9,
        image_url:
          "https://images.tcdn.com.br/img/img_prod/1115696/coca_cola_original_lata_350ml_27_1_152c3b66fb7a84db006d3238b116cb50.png",
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

    // Posições de rolagem
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 800; // Duração da animação em ms
    let startTime: number = 0;

    // Função para calcular o progresso da rolagem
    const animation = (currentTime: number) => {
      if (startTime === 0) startTime = currentTime;

      const progress = currentTime - startTime;
      const scroll = easeInOutQuad(progress, startPosition, distance, duration);

      window.scrollTo(0, scroll);

      if (progress < duration) {
        requestAnimationFrame(animation);
      }
    };

    // Inicia a animação
    requestAnimationFrame(animation);
  };

  return (
    <Box>
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

          {filteredProductsByCategory.map((categoria) => (
            <Box
              id={categoria.categoria} // Adicionando um ID para ancoragem
              key={categoria.categoria}
              sx={{ mb: 4 }}
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
                    sx={{
                      width: {
                        xs: "100%", // mobile 1 por linha
                        sm: "48%", // tablet+ 2 por linha
                      },
                    }}
                  >
                    <ProductCard product={product} variant="horizontal" />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </LayoutRestaurante>
      </Box>
    </Box>
  );
}
