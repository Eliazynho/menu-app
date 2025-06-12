import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  CreditCard,
  LocalShipping,
  Store,
  Edit,
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
import { CartItem } from "@/types";
import {
  changeCartQuantity,
  removeFromCart,
} from "@/redux/actions/cartActions";

// Preços dos adicionais
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

interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

interface PaymentMethod {
  type: "credit" | "debit" | "pix" | "cash";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  name?: string;
}

const steps = [
  "Revisão do Pedido",
  "Endereço de Entrega",
  "Pagamento",
  "Confirmação",
];

function calcularPrecoItem(item: CartItem): number {
  const precoProduto = item.product.price;
  const precoAdicionaisSomados = Object.entries(
    item.additionalOptions || {}
  ).reduce((acc, [nomeOpcao, quantidade]) => {
    const precoOpcao = precoAdicionais[nomeOpcao] || 0;
    return acc + precoOpcao * quantidade;
  }, 0);
  return (precoProduto + precoAdicionaisSomados) * item.quantity;
}

export default function CheckoutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const dispatch = useDispatch();

  const { restaurant, items } = useSelector((state: RootState) => state.cart);

  const [activeStep, setActiveStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [expandedItems, setExpandedItems] = useState(false);
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
  const [estimatedTime, setEstimatedTime] = useState("30-45 min");

  if (!restaurant || items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Seu carrinho está vazio
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.back()}
          startIcon={<ArrowBack />}
        >
          Voltar ao Cardápio
        </Button>
      </Container>
    );
  }

  const subtotal = items.reduce(
    (acc, item) => acc + calcularPrecoItem(item),
    0
  );
  const deliveryFee =
    deliveryType === "delivery" ? restaurant.delivery_fee || 5.0 : 0;
  const serviceFee = subtotal * 0.05; // Taxa de serviço de 5%
  const total = subtotal + deliveryFee + serviceFee;

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleFinishOrder();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinishOrder = async () => {
    setLoading(true);
    // Simular chamada da API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Aqui você faria a chamada real para sua API
    const orderData = {
      restaurant: restaurant.id,
      items,
      deliveryType,
      address: deliveryType === "delivery" ? address : null,
      paymentMethod,
      observations,
      total,
    };

    console.log("Pedido enviado:", orderData);
    setLoading(false);

    // Redirecionar para página de sucesso
    router.push("/order-success");
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(index));
    } else {
      dispatch(changeCartQuantity(index, newQuantity));
    }
  };

  const renderOrderReview = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={restaurant.logo_url}
          sx={{ width: 60, height: 60, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {restaurant.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <AccessTime
              sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
            />
            <Typography variant="body2" color="text.secondary">
              {estimatedTime}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <RadioGroup
          value={deliveryType}
          onChange={(e) =>
            setDeliveryType(e.target.value as "delivery" | "pickup")
          }
          row
        >
          <FormControlLabel
            value="delivery"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalShipping sx={{ mr: 1 }} />
                Entrega
              </Box>
            }
          />
          <FormControlLabel
            value="pickup"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Store sx={{ mr: 1 }} />
                Retirada
              </Box>
            }
          />
        </RadioGroup>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setExpandedItems(!expandedItems)}
        >
          <Typography variant="h6">Seus Itens ({items.length})</Typography>
          <IconButton>
            {expandedItems ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={expandedItems}>
          <Box sx={{ mt: 2 }}>
            {items.map((item, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold">
                        {item.product.name}
                      </Typography>

                      {/* Adicionais */}
                      {Object.entries(item.additionalOptions || {}).length >
                        0 && (
                        <Box sx={{ mt: 1 }}>
                          {Object.entries(item.additionalOptions).map(
                            ([option, qty]) => (
                              <Chip
                                key={option}
                                label={`${option} x${qty}`}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            )
                          )}
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography fontWeight="bold">
                          R$ {calcularPrecoItem(item).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Collapse>
      </Box>

      <TextField
        label="Observações (opcional)"
        multiline
        rows={3}
        fullWidth
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        placeholder="Alguma observação sobre seu pedido?"
        sx={{ mb: 3 }}
      />
    </Paper>
  );

  const renderAddressForm = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
        Endereço de Entrega
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Rua"
            fullWidth
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Número"
            fullWidth
            required
            value={address.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
            sx={{ flex: 1 }}
          />
        </Box>

        <TextField
          label="Complemento (opcional)"
          fullWidth
          value={address.complement}
          onChange={(e) =>
            setAddress({ ...address, complement: e.target.value })
          }
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Bairro"
            fullWidth
            required
            value={address.neighborhood}
            onChange={(e) =>
              setAddress({ ...address, neighborhood: e.target.value })
            }
          />
          <TextField
            label="Cidade"
            fullWidth
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="CEP"
            fullWidth
            required
            value={address.zipCode}
            onChange={(e) =>
              setAddress({ ...address, zipCode: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <Box sx={{ flex: 1 }} /> {/* Espaço vazio para balanceamento */}
        </Box>
      </Box>
    </Paper>
  );

  const renderPaymentForm = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        <CreditCard sx={{ mr: 1, verticalAlign: "middle" }} />
        Forma de Pagamento
      </Typography>

      <RadioGroup
        value={paymentMethod.type}
        onChange={(e) =>
          setPaymentMethod({ ...paymentMethod, type: e.target.value as any })
        }
      >
        <FormControlLabel
          value="credit"
          control={<Radio />}
          label="Cartão de Crédito"
        />
        <FormControlLabel
          value="debit"
          control={<Radio />}
          label="Cartão de Débito"
        />
        <FormControlLabel value="pix" control={<Radio />} label="PIX" />
        <FormControlLabel
          value="cash"
          control={<Radio />}
          label="Dinheiro na Entrega"
        />
      </RadioGroup>

      {(paymentMethod.type === "credit" || paymentMethod.type === "debit") && (
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nome no Cartão"
            fullWidth
            required
            value={paymentMethod.name || ""}
            onChange={(e) =>
              setPaymentMethod({ ...paymentMethod, name: e.target.value })
            }
          />

          <TextField
            label="Número do Cartão"
            fullWidth
            required
            placeholder="1234 5678 9012 3456"
            value={paymentMethod.cardNumber || ""}
            onChange={(e) =>
              setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })
            }
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Data de Validade"
              fullWidth
              required
              placeholder="MM/AA"
              value={paymentMethod.expiryDate || ""}
              onChange={(e) =>
                setPaymentMethod({
                  ...paymentMethod,
                  expiryDate: e.target.value,
                })
              }
            />
            <TextField
              label="CVV"
              fullWidth
              required
              placeholder="123"
              value={paymentMethod.cvv || ""}
              onChange={(e) =>
                setPaymentMethod({ ...paymentMethod, cvv: e.target.value })
              }
            />
          </Box>
        </Box>
      )}

      {paymentMethod.type === "pix" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Você receberá o código PIX após confirmar o pedido.
        </Alert>
      )}

      {paymentMethod.type === "cash" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Pagamento será realizado na entrega.
        </Alert>
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
        <Typography color="text.secondary">
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Taxa de Serviço</Typography>
          <Typography>R$ {serviceFee.toFixed(2)}</Typography>
        </Box>
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
          {paymentMethod.type === "credit" && "Cartão de Crédito"}
          {paymentMethod.type === "debit" && "Cartão de Débito"}
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

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Taxa de Serviço</Typography>
                <Typography variant="body2">
                  R$ {serviceFee.toFixed(2)}
                </Typography>
              </Box>

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
                <Button variant="outlined" onClick={handleBack} fullWidth>
                  Voltar
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                fullWidth
                size="large"
                sx={{
                  bgcolor: restaurant.color || "primary.main",
                  "&:hover": {
                    bgcolor: restaurant.color || "primary.dark",
                  },
                }}
              >
                {loading
                  ? "Processando..."
                  : activeStep === steps.length - 1
                  ? "Finalizar Pedido"
                  : "Continuar"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
