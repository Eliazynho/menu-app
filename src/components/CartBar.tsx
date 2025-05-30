import React from "react";
import { Drawer, IconButton, Box, Typography, Button } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Product } from "@/types";
import Image from "next/image";

interface CartBarProps {
  open: boolean;
  onToggle: () => void;
  userName: string;
  cartItems: { product: Product; additionalOptions: Record<string, number> }[]; // Lista de itens no carrinho
}

function CartBar({ open, onToggle, userName, cartItems }: CartBarProps) {
  const totalItems = cartItems.length; // Contando o número total de itens no carrinho
  const totalPrice = cartItems
    .reduce((total, item) => total + item.product.price, 0)
    .toFixed(2); // Calculando o total do carrinho

  return (
    <Box sx={{ display: "flex" }}>
      {/* Botão de Menu */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={onToggle}
        sx={{
          marginRight: 2,
          color: "white",
          ...(open && { display: "none" }),
        }}
      />

      {open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
          onClick={onToggle}
        />
      )}

      <Drawer
        sx={{
          width: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "70%",
            boxSizing: "border-box",
            backgroundColor: "white",
            color: "white",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "100px", // Adiciona espaço na parte inferior para o footer fixo
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {/* Cabeçalho da barra lateral */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            backgroundColor: "#fafafa",
            color: "white",
            borderBottom: "1px solid #ccc",
            height: "60px",
          }}
        >
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: 20,
              letterSpacing: 1,
            }}
          >
            Minha Sacola
          </Typography>
        </Box>

        <Box sx={{ padding: 2 }}>
          {/* Exibindo informações do usuário e quantidade de itens no carrinho */}
          <Typography sx={{ color: "black", marginBottom: 2 }}>
            {userName}, sua sacola tem {totalItems}{" "}
            {totalItems === 1 ? "item" : "itens"}.
          </Typography>

          {/* Exibindo os itens do carrinho */}
          <Box sx={{ marginTop: 2 }}>
            {cartItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Image
                    key={index}
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: "20%" }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{ color: "black", fontWeight: "bold", fontSize: 12 }}
                  >
                    {item.product.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: 11,
                      ml: 1,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.product.components?.join(`\n`)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: "primary.main",
                    }}
                  >
                    <DeleteIcon sx={{ color: "white", fontSize: 14 }} />
                  </Button>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    R$ {item.product.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Box fixo para o total e botão */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff", // Cor de fundo branca
            padding: 2,
            borderTop: "1px solid #ccc", // Linha separando do conteúdo
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)", // Adiciona sombra para dar destaque
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                color: "black",
                fontWeight: "1000",
              }}
            >
              Total:
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontWeight: "800",
              }}
            >
              R$ {totalPrice}
            </Typography>
          </Box>

          <Button
            fullWidth
            sx={{ backgroundColor: "#1976d2", color: "white", mt: 2 }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Finalizar Compra
            </Typography>
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

export default CartBar;
