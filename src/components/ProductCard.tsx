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
  onAddToCart?: (product: Product) => void;
  variant?: "vertical" | "horizontal";
  onClick?: (product: Product) => void;
  color?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onClick,
  variant = "vertical",
  color,
}: Props) {
  const shortenDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const cardStyles = {
    display: "flex",
    flexDirection: variant === "vertical" ? "column" : "row",
    p: 1,
    mb: 1,
    borderRadius: 2,
    boxShadow: 2,
    transition: "0.3s ease-in-out",
    "&:hover": {
      boxShadow: 4,
      transform: "translateY(-5px)",
    },
    height: variant === "vertical" ? 300 : "auto",
  };

  // Layout Horizontal
  if (variant === "horizontal") {
    return (
      <Card sx={cardStyles} onClick={() => onClick?.(product)}>
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
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            alignContent: "center",
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
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            R$ {product.price.toFixed(2)}
          </Button>
        </Box>
      </Card>
    );
  }

  // Layout Vertical
  return (
    <Card sx={cardStyles} onClick={() => onClick?.(product)}>
      <CardMedia
        component="img"
        height="140"
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
            fontSize: "1rem",
          }}
        >
          {product.name}
        </Typography>
      </CardContent>
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: color,
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 3,
            },
            fontSize: "0.875rem",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
        >
          R$ {product.price.toFixed(2)}
        </Button>
      </Box>
    </Card>
  );
}
