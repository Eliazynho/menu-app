import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

// Definindo a interface para o Produto
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  price_from?: boolean; // Usado quando o preço é "a partir de"
}

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void; // Função opcional para adicionar ao carrinho
  variant?: "vertical" | "horizontal"; // Tipo de layout para o cartão
  onClick?: (product: Product) => void; // Função de clique opcional para abrir o modal
}

export default function ProductCard({
  product,
  onAddToCart,
  onClick, // Função de clique do cartão
  variant = "vertical", // Padrão é 'vertical'
}: Props) {
  // Função para resumir a descrição com quebra de texto
  const shortenDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "..."; // Adiciona elipse
    }
    return description;
  };

  // Renderização no formato horizontal (imagem ao lado do conteúdo)
  if (variant === "horizontal") {
    return (
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          mb: 2,
          borderRadius: 2,
          boxShadow: 2,
          transition: "0.3s ease-in-out",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-5px)",
          },
        }}
        onClick={() => onClick?.(product)} // Torna o cartão clicável
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              mt: 0.5,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {shortenDescription(product.description, 200)}{" "}
            {/* Descrição resumida */}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Alinha os itens horizontalmente no centro
            justifyContent: "center", // Alinha os itens verticalmente no centro
            flexDirection: "column", // Organiza os itens em uma coluna
            alignContent: "center", // Centraliza se houver várias linhas de itens
            ml: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              objectFit: "cover",
            }}
            image={product.image_url}
            alt={product.name}
          />
          <Button
            variant="outlined"
            color="success"
            size="large"
            sx={{ mt: 2 }}
            onClick={(e) => {
              e.stopPropagation(); // Evita que o clique no botão "Adicionar" também dispare o clique do cartão
              onAddToCart?.(product);
            }}
          >
            R$ {product.price.toFixed(2)}
          </Button>
        </Box>
      </Card>
    );
  }

  // Renderização no formato vertical (imagem em cima)
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column", // As cards verticais precisam de flexDirection 'column'
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        transition: "0.3s ease-in-out",
        height: "100%",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-5px)",
        },
      }}
      onClick={() => onClick?.(product)} // Torna o cartão clicável
    >
      <CardMedia
        component="img"
        height="160"
        image={product.image_url}
        alt={product.name}
        sx={{
          borderRadius: 2,
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {shortenDescription(product.description, 100)}{" "}
          {/* Descrição resumida */}
        </Typography>
        <Box></Box>
      </CardContent>
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 3,
            },
          }}
          onClick={(e) => {
            e.stopPropagation(); // Evita que o clique no botão "Adicionar" também dispare o clique do cartão
            onAddToCart?.(product);
          }}
        >
          R$ {product.price.toFixed(2)}
        </Button>
      </Box>
    </Card>
  );
}
