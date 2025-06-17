/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Product } from "@/types";
import { AdditionalCategory } from "@/types";
import { useState } from "react";
import { darken } from "@mui/system";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  color: string;
  additionalCategories: AdditionalCategory[];
  additionalsByCategory: Array<{
    category: string;
    categoryId: string;
    additionals: Array<{
      id: string;
      name: string;
      price: number;
      created_at: string;
      restaurant_id: string;
      add_categories_id: string;
    }>;
  }>;
  additionalsLoading: boolean;
  onAddToCart: (
    product: Product,
    additionalOptions: Record<string, number>,
    quantity: number
  ) => void;
}

const ProductModal = ({
  open,
  onClose,
  product,
  onAddToCart,
  color,
  additionalCategories,
  additionalsByCategory,
  additionalsLoading,
}: ProductModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");

  const handleChangeQuantity = (optionId: string, action: "add" | "remove") => {
    setSelectedOptions((prevState) => {
      const currentCount = prevState[optionId] || 0;
      const newCount =
        action === "add" ? currentCount + 1 : Math.max(currentCount - 1, 0);
      return { ...prevState, [optionId]: newCount };
    });
  };

  const handleProductQuantityChange = (action: "add" | "remove") => {
    if (action === "add") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const calculateAdditionalPrice = () => {
    return Object.entries(selectedOptions).reduce((total, [optionId, qty]) => {
      const option = additionalsByCategory
        .flatMap((cat) => cat.additionals)
        .find((add) => add.id === optionId);
      return total + (option ? option.price * qty : 0);
    }, 0);
  };

  const totalPrice = product
    ? (product.price + calculateAdditionalPrice()) * quantity
    : 0;

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, selectedOptions, quantity);
      setSelectedOptions({});
      setQuantity(1);
      setObservation("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedOptions({});
    setQuantity(1);
    setObservation("");
    onClose();
  };

  if (!product) return null;

  return (
    <Box
      sx={{
        display: open ? "block" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          position: "relative",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "600px",
          height: "80%",
          overflowY: "auto",
          borderRadius: "8px",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Botão de Fechar */}
        <Box
          sx={{
            position: "sticky",
            top: "10px",
            left: "30px",
            transform: "translateX(-50%)",
            zIndex: 3,
            backgroundColor: `${color}`,
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              fontSize: "1.2rem",
              fontWeight: "1000",
              color: "white",
              minWidth: "auto",
              padding: 0,
            }}
          >
            ×
          </Button>
        </Box>

        {/* Imagem do produto */}
        <Box sx={{ width: "100%", height: "50%", mt: -8 }}>
          <img
            src={product.image_url || "/caminho/para/imagem/fallback.jpg"}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
            }}
          />
        </Box>

        {/* Conteúdo do modal */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: `${color}`,
              color: "white",
              padding: 1,
              width: "100%",
            }}
          >
            {product.name}
          </Typography>
          <Box sx={{ marginTop: 1, textAlign: "center", px: 2 }}>
            <Typography variant="body1">{product.description}</Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
              R$ {product.price.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Quantidade do produto */}
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Quantidade:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleProductQuantityChange("remove")}
              disabled={quantity === 1}
              sx={{ minWidth: "40px", height: "40px" }}
            >
              -
            </Button>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {quantity}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => handleProductQuantityChange("add")}
              sx={{ minWidth: "40px", height: "40px" }}
            >
              +
            </Button>
          </Box>
        </Box>

        {/* Opções adicionais do produto */}
        <Box sx={{ width: "100%", px: 2 }}>
          {additionalsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Carregando adicionais...</Typography>
            </Box>
          ) : additionalsByCategory.length > 0 ? (
            additionalsByCategory.map((categoryGroup) => (
              <Box key={categoryGroup.categoryId} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: 1,
                    backgroundColor: `${color}`,
                    width: "100%",
                    color: "white",
                    padding: 1,
                    fontWeight: "bold",
                  }}
                >
                  {categoryGroup.category}:
                </Typography>
                {categoryGroup.additionals.map((option) => (
                  <Box
                    key={option.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 1,
                      padding: 1,
                      border: "1px solid #eee",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: "500" }}>
                        {option.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        R$ {option.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleChangeQuantity(option.id, "remove")
                        }
                        disabled={(selectedOptions[option.id] || 0) === 0}
                        sx={{ minWidth: "32px", height: "32px" }}
                      >
                        -
                      </Button>
                      <Typography
                        variant="body1"
                        sx={{ minWidth: "20px", textAlign: "center" }}
                      >
                        {selectedOptions[option.id] || 0}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleChangeQuantity(option.id, "add")}
                        sx={{
                          minWidth: "32px",
                          height: "32px",
                          borderColor: color,
                          color: color,
                          "&:hover": {
                            backgroundColor: color,
                            color: "white",
                          },
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
            >
              Nenhum adicional disponível para este produto.
            </Typography>
          )}
        </Box>

        {/* Campo de observações */}
        <Box sx={{ padding: 2, display: "flex", flexDirection: "column" }}>
          <TextField
            label="Observação"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Botão para adicionar ao carrinho */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            backgroundColor: "white",
            padding: 2,
            zIndex: 2,
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            onClick={handleAddToCart}
            sx={{
              backgroundColor: `${color}`,
              color: "white",
              "&:hover": {
                backgroundColor: darken(color, 0.2),
              },
              fontSize: "1rem",
              fontWeight: "bold",
              width: "100%",
              py: 1.5,
            }}
          >
            Adicionar ao Carrinho - R$ {totalPrice.toFixed(2)}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductModal;
