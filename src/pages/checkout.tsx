/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react"; // Importe useMemo
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  Collapse,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  CreditCard,
  LocalShipping,
  Store,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  ArrowBack,
  Add,
  Remove,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/reducers";
import { CartItem } from "@/types"; // Importe AdditionalCategory
import {
  changeCartQuantity,
  // Você precisará de uma action para atualizar a quantidade de adicional
  // Ex: updateCartItemAdditionalQuantity
} from "@/redux/actions/cartActions";

// Estrutura para um adicional (assumindo que você terá um ID agora)
interface AdditionalOption {
  id: string;
  name: string;
  price: number;
  // Outras propriedades do adicional, se houver
}

interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

interface PaymentMethod {
  type: "credit" | "pix" | "cash";
}

const steps = [
  "Revisão do Pedido",
  "Endereço de Entrega",
  "Pagamento",
  "Confirmação",
];

export default function CheckoutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const dispatch = useDispatch();

  // Obtém o estado do carrinho
  const { restaurant, items } = useSelector((state: RootState) => state.cart);

  const additionalCategories = useSelector(
    (state: RootState) => state.additionals.categories
  );

  // Isso garante que o mapa só seja reconstruído se as categorias mudarem
  const flatAdditionals: Record<string, AdditionalOption> = useMemo(() => {
    const map: Record<string, AdditionalOption> = {};
    additionalCategories.forEach((category) => {
      category.additional_options.forEach((option) => {
        map[option.id] = option;
      });
    });
    return map;
  }, [additionalCategories]);

  const [activeStep, setActiveStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [expandedItems, setExpandedItems] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados para endereço
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    zipCode: "",
  });

  // Estados para pagamento
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "credit",
  });

  // Estados para observações e tempo estimado
  const [observations, setObservations] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("30-45 min"); // Pode vir do restaurante ou ser calculado

  const color = restaurant?.color || "#ff0000";

  // Função para calcular o preço do item (agora usando o mapa flatAdditionals construído das categorias)
  function calcularPrecoItem(item: CartItem): number {
    const precoProduto = item.product.price;
    const precoAdicionaisSomados = Object.entries(
      item.additionalOptions || {}
    ).reduce((acc, [additionalId, quantidade]) => {
      // Usa o mapa flatAdditionals construído a partir dos dados reais das categorias
      const additional = flatAdditionals[additionalId];
      if (!additional) {
        // Este aviso agora indica que um adicional no carrinho não foi encontrado
        // na lista de adicionais carregada (situação incomum, pode indicar erro de dados)
        console.warn(
          `Adicional com ID ${additionalId} não encontrado na lista de adicionais carregada.`
        );
        return acc; // Se não encontrar, não adiciona ao preço (ou trate como erro)
      }
      return acc + additional.price * quantidade;
    }, 0);
    return (precoProduto + precoAdicionaisSomados) * item.quantity;
  }

  if (!restaurant || items.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Seu carrinho está vazio
          </Alert>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.back()}
              startIcon={<ArrowBack />}
              sx={{ mt: 2, backgroundColor: color }}
            >
              Voltar ao Cardápio
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const subtotal = items.reduce(
    (acc, item) => acc + calcularPrecoItem(item),
    0
  );

  const deliveryFee =
    deliveryType === "delivery" ? restaurant.delivery_fee || 5.0 : 0;
  const total = subtotal + deliveryFee;

  // Função para incrementar a quantidade de um adicional
  const incrementAdditional = (itemIndex: number, additionalId: string) => {
    // *** IMPORTANTE: Substitua esta lógica de simulação pela sua action Redux real ***
    console.log(
      `Simulando: Incrementar adicional ${additionalId} no item ${itemIndex}`
    );
    // Exemplo (assumindo que você tem uma action updateCartItemAdditionalQuantity):
    // dispatch(updateCartItemAdditionalQuantity(itemIndex, additionalId, currentQuantity + 1));
    // Lembre-se de que a action deve atualizar o estado Redux, que por sua vez
    // acionará a re-renderização e a atualização dos cálculos.
  };

  // Função para decrementar a quantidade de um adicional
  const decrementAdditional = (itemIndex: number, additionalId: string) => {
    // *** IMPORTANTE: Substitua esta lógica de simulação pela sua action Redux real ***
    console.log(
      `Simulando: Decrementar adicional ${additionalId} no item ${itemIndex}`
    );
    // Exemplo (assumindo que você tem uma action updateCartItemAdditionalQuantity):
    // const currentQuantity = items[itemIndex].additionalOptions?.[additionalId] || 0;
    // if (currentQuantity > 0) {
    //   dispatch(updateCartItemAdditionalQuantity(itemIndex, additionalId, currentQuantity - 1));
    // }
    // Lembre-se de que a action deve atualizar o estado Redux, que por sua vez
    // acionará a re-renderização e a atualização dos cálculos.
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Lógica de finalização do pedido
      setLoading(true);
      console.log("Finalizando pedido...");
      console.log("Itens:", items);
      console.log("Tipo de entrega:", deliveryType);
      if (deliveryType === "delivery") {
        console.log("Endereço:", address);
      }
      console.log("Pagamento:", paymentMethod);
      console.log("Observações:", observations);
      console.log("Total:", total);

      // Simula envio para API
      setTimeout(() => {
        setLoading(false);
        // Redirecionar para tela de confirmação/status do pedido
        router.push("/order-status"); // Exemplo
      }, 2000);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderOrderReview = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Itens do Pedido
        </Typography>
        <Button size="small" onClick={() => setExpandedItems(!expandedItems)}>
          {expandedItems ? <ExpandLess /> : <ExpandMore />}
          {expandedItems ? "Ocultar" : "Mostrar"}
        </Button>
      </Box>
      <Collapse in={expandedItems}>
        {items.map((item: CartItem, index: number) => {
          // Busca o produto completo para ter a imagem, nome, etc.
          // Assumindo que item.product já tem todos os detalhes necessários
          const product = item.product;

          return (
            <Box
              key={index} // Considere usar um ID único do item do carrinho se disponível
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
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name || "Produto"}
                      width={60}
                      height={60}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                  )}
                  <Box>
                    <Typography fontWeight="bold">{product.name}</Typography>
                    {/* Renderiza componentes/descrição se houver */}
                  </Box>
                </Box>
                {/* Botão de remover item inteiro (opcional no checkout review) */}
                {/* <IconButton onClick={() => dispatch(removeFromCart(index))} size="small">
                    <CloseIcon color="error" />
                  </IconButton> */}
              </Box>

              {/* Adicionais do item */}
              <Box sx={{ mt: 1, mb: 1, pl: 8 }}>
                {" "}
                {/* Adiciona padding para alinhar com a imagem */}
                {Object.entries(item.additionalOptions || {}).map(
                  ([additionalId, qty]) => {
                    // Busca o objeto adicional usando o ID no mapa flatAdditionals
                    const additional = flatAdditionals[additionalId];

                    // Não renderiza se o adicional não for encontrado (deve ser raro com o mapa correto)
                    if (!additional) return null;

                    return (
                      <Box
                        key={additionalId} // Usar o ID do adicional como key
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.5,
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {additional.name} x{qty} ( R$
                          {(additional.price * qty).toFixed(2)})
                        </Typography>
                      </Box>
                    );
                  }
                )}
              </Box>

              {/* Controles de quantidade do produto principal e preço total do item */}
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pl: 8, // Adiciona padding para alinhar com a imagem
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatch(changeCartQuantity(index, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1} // Desabilita se a quantidade for 1 ou menos
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatch(changeCartQuantity(index, item.quantity + 1))
                    }
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Typography fontWeight="bold">
                  R$ {calcularPrecoItem(item).toFixed(2)}{" "}
                  {/* Já calcula o total do item */}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Collapse>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Tipo de Entrega
        </Typography>
        <RadioGroup
          row
          value={deliveryType}
          onChange={(e) =>
            setDeliveryType(e.target.value as "delivery" | "pickup")
          }
        >
          <FormControlLabel
            value="delivery"
            control={<Radio />}
            label="Entrega"
          />
          <FormControlLabel
            value="pickup"
            control={<Radio />}
            label="Retirada no Local"
          />
        </RadioGroup>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Observações
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Adicione alguma observação ao seu pedido..."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
      </Box>
    </Paper>
  );

  const renderAddressForm = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Endereço de Entrega
      </Typography>
      <TextField
        fullWidth
        label="Rua"
        variant="outlined"
        margin="normal"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="Número"
        variant="outlined"
        margin="normal"
        value={address.number}
        onChange={(e) => setAddress({ ...address, number: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="Complemento (Opcional)"
        variant="outlined"
        margin="normal"
        value={address.complement}
        onChange={(e) => setAddress({ ...address, complement: e.target.value })}
      />
      <TextField
        fullWidth
        label="Bairro"
        variant="outlined"
        margin="normal"
        value={address.neighborhood}
        onChange={(e) =>
          setAddress({ ...address, neighborhood: e.target.value })
        }
        required
      />
      <TextField
        fullWidth
        label="Cidade"
        variant="outlined"
        margin="normal"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="CEP"
        variant="outlined"
        margin="normal"
        value={address.zipCode}
        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
        required
      />
    </Paper>
  );

  const renderPaymentForm = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Forma de Pagamento
      </Typography>
      <RadioGroup
        value={paymentMethod.type}
        onChange={(e) =>
          setPaymentMethod({ type: e.target.value as PaymentMethod["type"] })
        }
      >
        <FormControlLabel
          value="credit"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CreditCard sx={{ mr: 1 }} /> Cartão de Crédito/Débito
            </Box>
          }
        />
        <FormControlLabel
          value="pix"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Ícone de PIX, se tiver */} PIX
            </Box>
          }
        />
        <FormControlLabel
          value="cash"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Ícone de Dinheiro, se tiver */} Dinheiro na Entrega
            </Box>
          }
        />
      </RadioGroup>
      {/* Adicionar campos específicos para cada método, se necessário (ex: troco para dinheiro) */}
      {paymentMethod.type === "cash" && (
        <TextField
          fullWidth
          label="Precisa de troco para quanto?"
          variant="outlined"
          margin="normal"
          placeholder="Ex: Preciso de troco para R$ 50,00"
        />
      )}
    </Paper>
  );

  const renderConfirmation = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">
          Confirmar Pedido
        </Typography>
        <Typography color={color}>
          Revise os dados antes de finalizar
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Resumo do Pedido
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Subtotal</Typography>
          <Typography>R$ {subtotal.toFixed(2)}</Typography>
        </Box>
        {deliveryType === "delivery" && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Taxa de Entrega</Typography>
            <Typography>R$ {deliveryFee.toFixed(2)}</Typography>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            R$ {total.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {deliveryType === "delivery" && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Endereço de Entrega:
          </Typography>
          <Typography variant="body2">
            {address.street}, {address.number}
            {address.complement && `, ${address.complement}`}
          </Typography>
          <Typography variant="body2">
            {address.neighborhood}, {address.city} - {address.zipCode}
          </Typography>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Forma de Pagamento:
        </Typography>
        <Typography variant="body2">
          {paymentMethod.type === "credit" && "Cartão"}
          {paymentMethod.type === "pix" && "PIX"}
          {paymentMethod.type === "cash" && "Dinheiro na Entrega"}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Tempo Estimado:
        </Typography>
        <Typography variant="body2">{estimatedTime}</Typography>
      </Box>
    </Paper>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderOrderReview();
      case 1:
        return deliveryType === "delivery" ? (
          renderAddressForm()
        ) : (
          <Alert severity="info">
            Seu pedido estará pronto para retirada em {estimatedTime}
          </Alert>
        );
      case 2:
        return renderPaymentForm();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          Voltar
        </Button>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Finalizar Pedido
        </Typography>
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Conteúdo Principal */}
        <Box sx={{ flex: 1 }}>{getStepContent(activeStep)}</Box>

        {/* Resumo Lateral */}
        <Box
          sx={{
            width: { xs: "100%", md: "350px" },
            flexShrink: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              position: { xs: "static", md: "sticky" },
              top: 20,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Resumo
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  R$ {subtotal.toFixed(2)}
                </Typography>
              </Box>
              {deliveryType === "delivery" && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Entrega</Typography>
                  <Typography variant="body2">
                    R$ {deliveryFee.toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  R$ {total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: { xs: "column", sm: "row", md: "column" },
              }}
            >
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  fullWidth
                  disabled={loading}
                >
                  Voltar
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  loading ||
                  (activeStep === 1 &&
                    deliveryType === "delivery" &&
                    (!address.street ||
                      !address.number ||
                      !address.neighborhood ||
                      !address.city ||
                      !address.zipCode)) ||
                  (activeStep === 0 && items.length === 0) // Desabilita botão "Continuar" se carrinho vazio na revisão
                }
                fullWidth
                size="large"
                sx={{
                  bgcolor: restaurant?.color || "primary.main", // Usa a cor do restaurante
                  "&:hover": {
                    bgcolor: restaurant?.color || "primary.dark", // Usa a cor do restaurante
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  "Finalizar Pedido"
                ) : (
                  "Continuar"
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
