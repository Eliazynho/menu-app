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
  const priceColor = product.price_from ? "green" : "black"; // Definindo a cor do preço

  // Renderização no formato horizontal (imagem ao lado do conteúdo)
  if (variant === "horizontal") {
    return (
      <Card
        sx={{ display: "flex", justifyContent: "space-between", p: 1, mb: 2 }}
        onClick={() => onClick?.(product)} // Torna o cartão clicável
      >
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight="bold">{product.name}</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, mt: 0.5 }}
          >
            {product.description}
          </Typography>
          <Typography fontWeight="bold" color={priceColor}>
            {product.price_from && "A partir de: "}
            R$ {product.price.toFixed(2)}
          </Typography>
          <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{ mt: 1 }}
            onClick={(e) => {
              e.stopPropagation(); // Evita que o clique no botão "Adicionar" também dispare o clique do cartão
              onAddToCart?.(product);
            }}
          >
            Adicionar
          </Button>
        </Box>
        <CardMedia
          component="img"
          sx={{
            width: 100,
            height: 100,
            borderRadius: 1,
            objectFit: "cover",
            ml: 2,
          }}
          image={product.image_url}
          alt={product.name}
        />
      </Card>
    );
  }

  // Renderização no formato vertical (imagem em cima)
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column", // As cards verticais precisam de flexDirection 'column'
        p: 1,
        mb: 2,
        height: "100%",
      }}
      onClick={() => onClick?.(product)} // Torna o cartão clicável
    >
      <CardMedia
        component="img"
        height="140"
        image={product.image_url}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography fontWeight="bold">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.description}
        </Typography>
        <Typography fontWeight="bold" color={priceColor} sx={{ mt: 1 }}>
          {product.price_from && "A partir de: "}
          R$ {product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={(e) => {
            e.stopPropagation(); // Evita que o clique no botão "Adicionar" também dispare o clique do cartão
            onAddToCart?.(product);
          }}
        >
          Adicionar
        </Button>
      </Box>
    </Card>
  );
}
