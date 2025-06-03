/* eslint-disable @next/next/no-img-element */
import { Button, Box, Typography, TextField } from "@mui/material";
import { Product } from "@/types"; // Tipo do produto, defina isso conforme sua estrutura
import { useState } from "react";
import { darken } from "@mui/system";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  color: string;
  onAddToCart: (
    product: Product,
    additionalOptions: Record<string, number>
  ) => void;
}

const ProductModal = ({
  open,
  onClose,
  product,
  onAddToCart,
  color,
}: ProductModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number>
  >({});

  const handleChangeQuantity = (option: string, action: "add" | "remove") => {
    setSelectedOptions((prevState) => {
      const currentCount = prevState[option] || 0;
      const newCount =
        action === "add" ? currentCount + 1 : Math.max(currentCount - 1, 0);
      return { ...prevState, [option]: newCount };
    });
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, selectedOptions); // Adiciona o produto ao carrinho com as opções adicionais
      onClose(); // Fecha o modal após adicionar o item
    }
  };

  if (!product) return null; // Caso não haja produto, não exibe nada

  return (
    <Box
      sx={{
        display: open ? "block" : "none", // Exibe o modal quando 'open' for true
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Cor do fundo do modal
        zIndex: 1300, // Ajuste o zIndex para garantir que o modal esteja acima dos outros componentes
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
          overflowY: "auto", // Adiciona rolagem para o modal
          borderRadius: "8px",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Botão de Fechar sticky no canto superior direito */}
        <Box
          sx={{
            position: "sticky",
            top: "10px", // Fixa o botão no topo
            left: "30px", // Centraliza horizontalmente
            transform: "translateX(-50%)", // Ajuste para centralização precisa
            zIndex: 3, // Garantir que o botão de fechamento fique acima de tudo
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
            onClick={onClose}
            sx={{
              fontSize: "1.2rem",
              fontWeight: "1000",
              color: "white",
            }}
          >
            X
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
              zIndex: 1, // A imagem deve estar abaixo do conteúdo
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
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            <Typography variant="body1">{product.description}</Typography>
          </Box>
        </Box>

        {/* Opções adicionais do produto */}
        <Box sx={{ width: "100%" }}>
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
            Adicionais:
          </Typography>
          {product.additionalOptions?.map((option, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 1,
                ml: 2,
              }}
            >
              <Typography sx={{ marginRight: 2 }} variant="body1">
                {option}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleChangeQuantity(option, "add")}
                  style={{
                    backgroundColor: `${color}`,
                    color: "white",
                  }}
                >
                  +1
                </Button>
                <Typography sx={{ margin: "0 10px" }} variant="body1">
                  {selectedOptions[option] || 0}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleChangeQuantity(option, "remove")}
                  disabled={(selectedOptions[option] || 0) === 0}
                >
                  -1
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Campo de observações */}
        <Box sx={{ padding: 2, display: "flex", flexDirection: "column" }}>
          <TextField
            label="Observação"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Botão para adicionar ao carrinho sticky no final */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            backgroundColor: "white",
            padding: 2,
            zIndex: 2,
          }}
        >
          <Button
            onClick={handleAddToCart}
            sx={{
              backgroundColor: `${color}`,
              color: "white",
              "&:hover": {
                backgroundColor: darken(color, 0.5),
              },
              fontSize: "1rem",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Adicionar ao Carrinho
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductModal;
