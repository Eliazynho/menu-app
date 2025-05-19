import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  price_from?: boolean;
}

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  variant?: "vertical" | "horizontal";
}

export default function ProductCard({
  product,
  onAddToCart,
  variant = "vertical",
}: Props) {
  const priceColor = product.price_from ? "green" : "black";

  if (variant === "horizontal") {
    return (
      <Card
        sx={{ display: "flex", justifyContent: "space-between", p: 1, mb: 2 }}
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
            onClick={() => onAddToCart?.(product)}
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

  // Estilo vertical (cartão padrão com imagem em cima)
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: 1,
        mb: 2,
        height: "100%",
      }}
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
          onClick={() => onAddToCart?.(product)}
        >
          Adicionar
        </Button>
      </Box>
    </Card>
  );
}
