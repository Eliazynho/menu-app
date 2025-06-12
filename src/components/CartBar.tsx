/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Drawer, IconButton, Box, Typography, Button } from "@mui/material";
import { CloseOutlined as CloseIcon, Add, Remove } from "@mui/icons-material";
import Image from "next/image";
// Importações do Redux
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  changeCartQuantity,
  removeFromCart,
  updateAdditionals,
} from "../redux/actions/cartActions";
import { CartItem } from "@/types";

interface CartBarProps {
  open: boolean;
  onToggle: () => void;
  userName: string;
  color: string;
}

// Defina os preços dos adicionais aqui também (ou importe do restaurante)
const precoAdicionais: Record<string, number> = {
  "Queijo extra": 3.0,
  "Batata extra": 4.0,
  "Molho especial": 2.5,
  "Cebola caramelizada": 2.0,
  "Molho barbecue": 2.0,
  "Queijo cheddar": 3.0,
  "Molho picante": 2.5,
  "Molho extra": 2.0,
  "Batata canoa": 4.0,
  Bacon: 4.5,
  "Queijo brie extra": 5.0,
};

function CartBar({ open, onToggle, userName, color }: CartBarProps) {
  // Redux hooks
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const router = useRouter();

  // Incrementa quantidade do produto
  const incrementItem = (index: number) => {
    const currentQuantity = cartItems[index].quantity;
    dispatch(changeCartQuantity(index, currentQuantity + 1));
  };

  // Decrementa quantidade do produto, mínimo 1
  const decrementItem = (index: number) => {
    const currentQuantity = cartItems[index].quantity;
    if (currentQuantity > 1) {
      dispatch(changeCartQuantity(index, currentQuantity - 1));
    }
  };

  // Remove o produto do carrinho
  const removeItem = (index: number) => {
    dispatch(removeFromCart(index));
  };

  // Incrementa quantidade de adicional para um produto específico
  const incrementAdditional = (cartIndex: number, option: string) => {
    const currentItem = cartItems[cartIndex];
    const newOptions = { ...currentItem.additionalOptions };
    newOptions[option] = (newOptions[option] || 0) + 1;
    dispatch(updateAdditionals(cartIndex, newOptions));
  };

  // Decrementa quantidade de adicional, mínimo 0 (remove se 0)
  const decrementAdditional = (cartIndex: number, option: string) => {
    const currentItem = cartItems[cartIndex];
    const newOptions = { ...currentItem.additionalOptions };

    if (!newOptions[option]) return; // já 0

    newOptions[option] = Math.max(0, newOptions[option] - 1);
    // Remove a chave se quantidade 0
    if (newOptions[option] === 0) delete newOptions[option];

    dispatch(updateAdditionals(cartIndex, newOptions));
  };

  // Calcula o preço total do item (produto + adicionais) * quantidade
  const calcularPrecoItem = (item: CartItem): number => {
    const precoProduto = item.product.price;
    const precoAdicionaisSomados = Object.entries(
      item.additionalOptions || {}
    ).reduce((acc, [nomeOpcao, quantidade]) => {
      const precoOpcao = precoAdicionais[nomeOpcao] || 0;
      return acc + precoOpcao * quantidade;
    }, 0);
    return (precoProduto + precoAdicionaisSomados) * item.quantity;
  };

  const totalItems = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  const totalPrice = cartItems
    .reduce(
      (total: number, item: CartItem) => total + calcularPrecoItem(item),
      0
    )
    .toFixed(2);

  useEffect(() => {
    if (cartItems.length === 0 && open) {
      onToggle();
    }
  }, [cartItems, open, onToggle]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Botão para abrir/fechar carrinho */}
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
          onClick={onToggle}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        />
      )}

      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            width: "70%",
            boxSizing: "border-box",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "100px",
          },
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #ccc",
            height: 60,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Minha Sacola
          </Typography>
        </Box>

        {/* Conteúdo rolável */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
          }}
        >
          <Typography sx={{ mb: 2 }}>
            {userName}, sua sacola tem {totalItems}{" "}
            {totalItems === 1 ? "item" : "itens"}.
          </Typography>

          {cartItems.map((item: CartItem, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: 3,
                borderBottom: "1px solid #eee",
                pb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Image
                    src={item.product.image_url}
                    alt={
                      typeof item.product.name === "string"
                        ? item.product.name
                        : "Produto"
                    }
                    width={60}
                    height={60}
                    style={{ borderRadius: 8 }}
                  />
                  <Box>
                    <Typography fontWeight="bold">
                      {item.product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {/* {item.product.components?.join("\n") || ""} */}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => removeItem(index)} size="small">
                  <CloseIcon color="error" />
                </IconButton>
              </Box>

              {/* Adicionais */}
              <Box sx={{ mt: 1, mb: 1 }}>
                {Object.entries(item.additionalOptions || {}).map(
                  ([option, qty]) => (
                    <Box
                      key={option}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {option} x{qty} ( R$
                        {(precoAdicionais[option] * qty).toFixed(2)})
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => decrementAdditional(index, option)}
                        >
                          <Remove />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => incrementAdditional(index, option)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                  )
                )}
              </Box>

              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => decrementItem(index)}
                    disabled={item.quantity === 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => incrementItem(index)}>
                    <Add />
                  </IconButton>
                </Box>
                <Typography fontWeight="bold">
                  R$ {calcularPrecoItem(item).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Rodapé fixo com total e botão */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            p: 2,
            borderTop: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight="bold">Total:</Typography>
            <Typography fontWeight="bold">R$ {totalPrice}</Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, backgroundColor: color }}
            onClick={() => router.push("/checkout")}
          >
            Finalizar Compra
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

export default CartBar;
