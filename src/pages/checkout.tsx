/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
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
  Modal,
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
  Close as CloseIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/reducers";
import { CartItem, CepAddress, Order, userCreate } from "@/types";
import {
  changeCartQuantity,
  // Você precisará de uma action para atualizar a quantidade de adicional
  // Ex: updateCartItemAdditionalQuantity
} from "@/redux/actions/cartActions";

// Importe o componente LoginModal
import LoginModal from "@/components/ModalLogin"; // Ajuste o caminho conforme a localização do seu arquivo
import { LOGIN_SUCCESS } from "@/redux/actions/authActions";
import { createClient, validateUser } from "./api/auth";
import { getAddressByCep } from "./api/cep";
import { createNewOrder } from "./api/orders";

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
  type: "credit" | "pix" | "money";
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

  // Obtém o estado do carrinho e adicionais do Redux
  const { restaurant, items } = useSelector((state: RootState) => state.cart);
  const additionalCategories = useSelector(
    (state: RootState) => state.additionals.categories
  );

  // *** ESTADOS LOCAIS PARA SIMULAR O LOGIN (APENAS PARA TESTE) ***
  // Inicialize isLoggedIn como false para que o modal abra na carga
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  // *** FIM ESTADOS LOCAIS PARA SIMULAR O LOGIN ***

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

  // Estado para controlar a visibilidade do modal de login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Estado para garantir que o modal só abra automaticamente uma vez ao carregar
  const [hasShownLoginModalOnLoad, setHasShownLoginModalOnLoad] =
    useState(false);

  // Estados para endereço (inicialize com dados do usuário logado se disponíveis)
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

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const validate = await validateUser(token);
        if (validate) {
          console.log("✅ Token valido", validate);
          localStorage.setItem("user", JSON.stringify(validate));
          setIsLoggedIn(true);
          setUserPhone(validate.phone);
          setUserName(validate.name);
          return; // já está logado, não abre modal
        }
      }

      // Se não está logado, abrir modal uma vez
      setIsLoginModalOpen(true);
      setHasShownLoginModalOnLoad(true);
    };

    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // só roda uma vez no mount

  useEffect(() => {
    const cepLimpo = address?.zipCode.replace(/\D/g, "");

    const fetchAddress = async () => {
      if (cepLimpo.length === 8) {
        try {
          const data = await getAddressByCep(cepLimpo);

          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
          }));
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
        }
      }
    };

    fetchAddress();
  }, [address?.zipCode]);

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

  // Função para lidar com o "login" bem-sucedido no modal (APENAS PARA TESTE)
  const handleUserLogin = async (
    name: string,
    phone: string,
    restaurant_id: string
  ) => {
    console.log("Simulando login/cadastro com:", { name, phone });

    // ✅ Remova o set de estado local para nome e telefone, pois o Redux vai gerenciar
    // setUserName(name); // REMOVER
    // setUserPhone(phone); // REMOVER

    const data: userCreate = { name, phone, restaurant_id };

    if (name !== "" && phone !== "") {
      try {
        const res = await createClient(data); // Assuma que res contém os dados do usuário logado/criado

        // ✅ Verifique se a API retornou os dados do usuário esperados
        // A estrutura exata de 'res' depende da sua API.
        // Exemplo: Se a API retorna { success: true, user: { id: '...', name: '...', phone: '...' } }
        if (res && res.client) {
          // Ajuste esta condição conforme a resposta real da sua API
          console.log("Usuário criado/logado com sucesso:", res.client);
          // ✅ Dispara a action LOGIN_SUCCESS com os dados do usuário como payload
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res,
          });

          // ✅ Remove o set de estado local de login, pois agora é gerenciado pelo Redux
          setIsLoggedIn(true); // REMOVER
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.client));

          // ✅ Mantém o set de estado local para fechar o modal, se o modal for local
          setIsLoginModalOpen(false);

          // Opcional: Você pode querer armazenar o ID do usuário ou outros dados localmente
          // (ex: localStorage) se precisar persistir o login entre sessões,
          // mas o estado principal de login e dados do usuário está no Redux.
        } else {
          console.error("Erro ou resposta inesperada da API:", res);
          // Opcional: Tratar erro (ex: exibir mensagem para o usuário)
          // Você pode ter uma action LOGIN_FAIL para isso
        }
      } catch (error: any) {
        console.error("Erro na chamada da API createClient:", error);
        // Opcional: Tratar erro (ex: exibir mensagem para o usuário)
        // Você pode ter uma action LOGIN_FAIL para isso
      }
    } else {
      console.warn("Nome e telefone não podem ser vazios.");
      // Opcional: Tratar erro (ex: exibir mensagem para o usuário)
    }
  };

  // Função para fechar o modal de login
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    // Opcional: Se quiser forçar o login, você pode redirecionar o usuário
    // ou mostrar uma mensagem aqui se o usuário fechar sem logar.
    // router.push('/'); // Exemplo: redirecionar para a home
  };

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
    deliveryType === "delivery" ? restaurant?.delivery_fee || 0 : 0; // Assumindo que a taxa de entrega está no objeto do restaurante
  const total = subtotal + deliveryFee;

  const handleNext = async () => {
    if (!isLoggedIn && activeStep < steps.length - 1) {
      setIsLoginModalOpen(true);
      return;
    }

    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        const clientData = JSON.parse(localStorage.getItem("user") || "{}");

        const orderPayload = {
          restaurant_id: restaurant?.id,
          client_id: clientData?.id,
          status: "Novo",
          total: total,
          description: items
            .map((item) => {
              const desc = `${item.quantity}x ${item.product.name}`;
              const adds = Object.entries(item.additionalOptions || {})
                .map(([id, qtd]) => {
                  const add = flatAdditionals[id];
                  return add ? ` ${qtd}x ${add.name}` : "";
                })
                .join(",");
              return `${desc}${adds ? "," + adds : ""}`;
            })
            .join(", "),
          payment_method: paymentMethod.type,
          client_address_id:
            deliveryType === "delivery"
              ? "4c8a85b9-5a0e-4eab-bf30-85575513e354"
              : "", // ou null, dependendo da API
          items: items.map((item) => {
            const additionals = Object.entries(
              item.additionalOptions || {}
            ).map(([additionalId, quantity]) => ({
              additional_option_id: additionalId,
              quantity,
            }));

            return {
              product_id: item.product.id,
              quantity: item.quantity,
              ...(additionals.length > 0 ? { additionals } : {}),
            };
          }),
        };

        console.log(orderPayload);

        const res = await createNewOrder(orderPayload, token);
        if (res?.id) {
          router.push(`/order-success?id=${res.id}`);
        } else {
          throw new Error("Erro ao criar pedido.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao finalizar pedido.");
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Encontrar o índice do item no array 'items' do carrinho
    const itemIndex = items.findIndex((item) => item.product.id === itemId);

    // Verificar se o item foi encontrado
    if (itemIndex === -1) {
      console.warn(`Item com ID ${itemId} não encontrado no carrinho.`);
      return; // Sair da função se o item não for encontrado
    }

    if (newQuantity <= 0) {
      // Opcional: remover item se a quantidade for 0 ou menos
      // Você precisaria de uma action para remover por index ou id
      // Ex: dispatch(removeItemFromCart(itemIndex)); // Se a action remove por index
      // Ou dispatch(removeItemFromCart(itemId)); // Se a action remove por id
      // Por enquanto, vamos apenas não permitir quantidade <= 0
      console.warn("Quantidade não pode ser menor ou igual a zero.");
      return;
    } else {
      // Chamar a action creator com o index e a nova quantidade
      dispatch(changeCartQuantity(itemIndex, newQuantity));
    }
  };

  // Você precisará de uma função para lidar com a mudança de quantidade de adicional,
  // similar a handleQuantityChange, mas que atualize o additionalOptions do item no Redux.
  // Ex: handleAdditionalQuantityChange = (itemId: string, additionalId: string, newQuantity: number) => { ... }

  const renderOrderReview = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Revisão do Pedido
      </Typography>

      {/* Tipo de Entrega */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Como você quer receber seu pedido?
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
            control={<Radio size="small" />}
            label="Entrega"
          />
          <FormControlLabel
            value="pickup"
            control={<Radio size="small" />}
            label="Retirada no Local"
          />
        </RadioGroup>
      </Box>

      {/* Itens do Pedido */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => setExpandedItems(!expandedItems)}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Itens ({items.length})
          </Typography>
          {expandedItems ? <ExpandLess /> : <ExpandMore />}
        </Box>
        <Collapse in={expandedItems}>
          {items.map((item) => (
            <Box
              key={item.product.id}
              sx={{ display: "flex", py: 2, borderBottom: "1px solid #eee" }}
            >
              <Image
                src={item.product.image_url || "/placeholder.png"} // Use uma imagem placeholder se não houver
                alt={item.product.name}
                width={60}
                height={60}
                style={{
                  objectFit: "cover",
                  borderRadius: theme.shape.borderRadius,
                  marginRight: theme.spacing(2),
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {item.product.name}
                </Typography>
                {/* Renderizar adicionais */}
                {item.additionalOptions &&
                  Object.keys(item.additionalOptions).length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      {Object.entries(item.additionalOptions).map(
                        ([additionalId, quantity]) => {
                          const additional = flatAdditionals[additionalId];
                          if (!additional || quantity === 0) return null;
                          return (
                            <Typography
                              key={additionalId}
                              variant="body2"
                              color="text.secondary"
                            >
                              + {quantity}x {additional.name} (R${" "}
                              {(additional.price * quantity).toFixed(2)})
                            </Typography>
                          );
                        }
                      )}
                    </Box>
                  )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  R$ {calcularPrecoItem(item).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleQuantityChange(item.product.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 1 }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleQuantityChange(item.product.id, item.quantity + 1)
                  }
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Collapse>
      </Box>

      {/* Observações */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Observações
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Alguma observação sobre o pedido?"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          variant="outlined"
        />
      </Box>
    </Paper>
  );

  const renderAddressForm = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Endereço de Entrega
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "grid", gap: 2 }}
      >
        <TextField
          label="CEP"
          fullWidth
          value={address?.zipCode}
          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
          // Adicionar lógica para buscar endereço pelo CEP
        />
        <TextField
          label="Rua"
          fullWidth
          value={address?.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          required
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Número"
            fullWidth
            value={address?.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
            required
          />
          <TextField
            label="Complemento (Opcional)"
            fullWidth
            value={address?.complement}
            onChange={(e) =>
              setAddress({ ...address, complement: e.target.value })
            }
          />
        </Box>
        <TextField
          label="Bairro"
          fullWidth
          value={address?.neighborhood}
          onChange={(e) =>
            setAddress({ ...address, neighborhood: e.target.value })
          }
          required
        />
        <TextField
          label="Cidade"
          fullWidth
          value={address?.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
        />
        {/* Adicionar campo para Estado se necessário */}
      </Box>
    </Paper>
  );

  const renderPaymentForm = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Forma de Pagamento
      </Typography>
      <RadioGroup
        value={paymentMethod.type}
        onChange={(e) => setPaymentMethod({ type: e.target.value as any })}
      >
        <FormControlLabel
          value="credit"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CreditCard sx={{ mr: 1 }} /> Cartão (Crédito/Débito)
            </Box>
          }
        />
        <FormControlLabel
          value="pix"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Ícone de PIX */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
                style={{ marginRight: theme.spacing(1) }}
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              PIX
            </Box>
          }
        />
        <FormControlLabel
          value="money"
          control={<Radio />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Ícone de Dinheiro */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
                style={{ marginRight: theme.spacing(1) }}
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Dinheiro na Entrega
            </Box>
          }
        />
      </RadioGroup>
      {paymentMethod.type === "money" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Prepare o valor em dinheiro. O troco será calculado na entrega.
        </Alert>
      )}
    </Paper>
  );

  const renderConfirmation = () => (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Resumo Final do Pedido
      </Typography>
      <Box sx={{ mb: 2 }}>
        {/* Usando estados locais para exibir nome e telefone (APENAS PARA TESTE) */}
        <Typography variant="subtitle2" fontWeight="bold">
          Cliente:
        </Typography>
        <Typography variant="body2">
          {userName || "Nome não informado"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {userPhone || "Telefone não informado"}
        </Typography>

        <Typography variant="subtitle2" fontWeight="bold">
          Tipo de Entrega:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {deliveryType === "delivery" ? "Entrega" : "Retirada no Local"}
        </Typography>
      </Box>
      {deliveryType === "delivery" && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Endereço de Entrega:
          </Typography>
          <Typography variant="body2">
            {address?.street}, {address?.number}
            {address?.complement && `, ${address.complement}`}
          </Typography>
          <Typography variant="body2">
            {address?.neighborhood}, {address?.street} - {address?.zipCode}
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
          {paymentMethod.type === "money" && "Dinheiro na Entrega"}
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
                  // Desabilita se não estiver logado E não estiver no passo de confirmação (onde o modal é forçado)
                  (!isLoggedIn && activeStep < steps.length - 1) ||
                  // Desabilita botão "Continuar" se carrinho vazio na revisão
                  (activeStep === 0 && items.length === 0) ||
                  // Desabilita se for entrega e o endereço não estiver completo
                  (activeStep === 1 &&
                    deliveryType === "delivery" &&
                    (!address?.street ||
                      !address.neighborhood ||
                      !address.city ||
                      !address.zipCode ||
                      !address.number))
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

      {/* Adicione o componente LoginModal aqui */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLogin={handleUserLogin} // Esta função agora apenas atualiza estados locais
        restaurantId={restaurant?.id}
        themeColor={restaurant?.color || "#ff0000"}
      />
    </Container>
  );
}
