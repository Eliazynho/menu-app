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
} from "../redux/actions/cartActions"; // Verifique o caminho correto aqui
import { CartItem, AdditionalOption } from "@/types"; // Importe o tipo Additional

interface CartBarProps {
  open: boolean;
  onToggle: () => void;
  userName: string;
  color: string;
  // 1. Adicione a prop para os adicionais mapeados por ID
  flatAdditionals: Record<string, AdditionalOption>;
}

// Remova o objeto precoAdicionais hardcoded
// const precoAdicionais: Record<string, number> = { ... };

function CartBar({
  open,
  onToggle,
  userName,
  color,
  flatAdditionals,
}: CartBarProps) {
  // Receba a prop
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
  // O 'option' aqui é o ID do adicional
  const incrementAdditional = (cartIndex: number, additionalId: string) => {
    const currentItem = cartItems[cartIndex];
    const newOptions = { ...currentItem.additionalOptions };
    newOptions[additionalId] = (newOptions[additionalId] || 0) + 1;
    dispatch(updateAdditionals(cartIndex, newOptions));
  };

  // Decrementa quantidade de adicional, mínimo 0 (remove se 0)
  // O 'option' aqui é o ID do adicional
  const decrementAdditional = (cartIndex: number, additionalId: string) => {
    const currentItem = cartItems[cartIndex];
    const newOptions = { ...currentItem.additionalOptions };
    if (!newOptions[additionalId]) return; // já 0
    newOptions[additionalId] = Math.max(0, newOptions[additionalId] - 1);
    // Remove a chave se quantidade 0
    if (newOptions[additionalId] === 0) delete newOptions[additionalId];
    dispatch(updateAdditionals(cartIndex, newOptions));
  };

  // Calcula o preço total do item (produto + adicionais) * quantidade
  const calcularPrecoItem = (item: CartItem): number => {
    const precoProduto = item.product.price;
    const precoAdicionaisSomados = Object.entries(
      item.additionalOptions || {}
    ).reduce((acc, [additionalId, quantidade]) => {
      // Use additionalId aqui
      // 2. Use flatAdditionals para obter o preço pelo ID
      const additional = flatAdditionals[additionalId];
      const precoOpcao = additional ? additional.price : 0; // Use o preço do dado carregado
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
      {/* ... (seu código do botão) ... */}

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
            width: { xs: "80%", sm: "50%", md: "40%", lg: "30%" }, // Ajuste a largura responsiva
            boxSizing: "border-box",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "100px", // Espaço para o rodapé fixo
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
            position: "sticky", // Fixa o cabeçalho
            top: 0,
            bgcolor: "white",
            zIndex: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{ position: "absolute", left: 8 }}
          >
            <CloseIcon />
          </IconButton>
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
              key={index} // Considere usar um ID único do item do carrinho se disponível, ou uma combinação de product ID + adicionais para uma key mais robusta em cenários complexos. Index funciona para este caso simples.
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
                    style={{ borderRadius: 8, objectFit: "cover" }} // Adicionado objectFit
                  />
                  <Box>
                    <Typography fontWeight="bold">
                      {item.product.name}
                    </Typography>
                    {/* Descrição do produto ou componentes, se houver */}
                    {/* <Typography
                       variant="body2"
                       color="text.secondary"
                       sx={{ whiteSpace: "pre-line" }}
                     >
                       {item.product.components?.join("\n") || ""}
                     </Typography> */}
                  </Box>
                </Box>
                <IconButton onClick={() => removeItem(index)} size="small">
                  <CloseIcon color="error" />
                </IconButton>
              </Box>

              {/* Adicionais */}
              <Box sx={{ mt: 1, mb: 1 }}>
                {/* 3. Iterar usando additionalId e qty */}
                {Object.entries(item.additionalOptions || {}).map(
                  ([additionalId, qty]) => {
                    // 4. Buscar o objeto adicional usando o ID
                    const additional = flatAdditionals
                      ? flatAdditionals[additionalId]
                      : null;

                    // Não renderiza se o adicional não for encontrado (segurança)
                    if (!additional) return null;

                    return (
                      <Box
                        key={additionalId} // Usar o ID como key
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.5,
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {/* 5. Exibir o nome e calcular preço usando o preço do adicional */}
                          {additional.name} x{qty} ( R$
                          {(additional.price * qty).toFixed(2)})
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              decrementAdditional(index, additionalId)
                            } // Passa o ID
                          >
                            <Remove />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              incrementAdditional(index, additionalId)
                            } // Passa o ID
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  }
                )}
              </Box>

              {/* Controles de quantidade do produto e preço total do item */}
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
                    disabled={item.quantity <= 1} // Desabilita se a quantidade for 1 ou menos
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => incrementItem(index)}>
                    <Add />
                  </IconButton>
                </Box>
                <Typography fontWeight="bold">
                  R$ {calcularPrecoItem(item).toFixed(2)}{" "}
                  {/* Já calcula o total do item */}
                </Typography>
              </Box>
            </Box>
          ))}
          {cartItems.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Sua sacola está vazia.
            </Typography>
          )}
        </Box>

        {/* Rodapé fixo com total e botão */}
        {cartItems.length > 0 && ( // Só mostra o rodapé se houver itens
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
              zIndex: 2, // Garante que fique acima do conteúdo rolável
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
              onClickCapture={() =>
                console.log("Finalizando compra...", cartItems)
              }
            >
              Finalizar Compra
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default CartBar;
