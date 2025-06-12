/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  AccessTime,
  LocationOn,
  Phone,
  Share,
  Download,
  Store,
  LocalShipping,
  Restaurant,
  DeliveryDining,
  ContentCopy,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import Image from "next/image";

interface OrderData {
  id: string;
  status: "confirmed" | "preparing" | "ready" | "delivered";
  estimatedTime: string;
  deliveryType: "delivery" | "pickup";
  total: number;
  paymentMethod: string;
  createdAt: Date;
}

const orderStatuses = {
  confirmed: { label: "Pedido Confirmado", progress: 25, icon: CheckCircle },
  preparing: { label: "Preparando", progress: 50, icon: Restaurant },
  ready: { label: "Pronto", progress: 75, icon: Store },
  delivered: { label: "Entregue", progress: 100, icon: DeliveryDining },
};

export default function OrderSuccessPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { restaurant, items } = useSelector((state: RootState) => state.cart);

  // Dados simulados do pedido - em produção viriam da API
  const [orderData] = useState<OrderData>({
    id: "PED-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    status: "confirmed",
    estimatedTime: "30-45 min",
    deliveryType: "delivery",
    total: 45.9,
    paymentMethod: "Cartão de Crédito",
    createdAt: new Date(),
  });

  const [currentStatus, setCurrentStatus] =
    useState<keyof typeof orderStatuses>("confirmed");
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Simular progressão do status do pedido
    const statusProgression: (keyof typeof orderStatuses)[] = [
      "confirmed",
      "preparing",
      "ready",
      "delivered",
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const color = restaurant?.color || "#ff0000";
  const StatusIcon = orderStatuses[currentStatus].icon;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderData.id);
    // Aqui você poderia adicionar um toast de confirmação
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pedido ${orderData.id}`,
        text: `Meu pedido no ${restaurant?.name} foi confirmado!`,
        url: window.location.href,
      });
    }
  };

  if (!restaurant) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header de Sucesso */}
      <Fade in={showAnimation} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            textAlign: "center",
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            border: `2px solid ${color}20`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <CheckCircle
              sx={{
                fontSize: 80,
                color: "success.main",
                filter: "drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))",
                animation: "pulse 2s infinite",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 2, color: "success.main" }}
          >
            Pedido Confirmado!
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Obrigado pela preferência,{" "}
            {/* Aqui você pode adicionar o nome do usuário */}!
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Número do pedido:
            </Typography>
            <Chip
              label={orderData.id}
              sx={{
                bgcolor: color,
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              onDelete={handleCopyOrderId}
              deleteIcon={<ContentCopy sx={{ color: "white !important" }} />}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Guarde este número para acompanhar seu pedido
          </Typography>
        </Paper>
      </Fade>

      {/* Status do Pedido */}
      <Slide direction="up" in timeout={1200}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <StatusIcon sx={{ fontSize: 32, color: color, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {orderStatuses[currentStatus].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Acompanhe o progresso do seu pedido
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={orderStatuses[currentStatus].progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${color}20`,
                "& .MuiLinearProgress-bar": {
                  bgcolor: color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTime sx={{ fontSize: 20, mr: 1, color: color }} />
              <Typography variant="body2" fontWeight="medium">
                Tempo estimado: {orderData.estimatedTime}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {orderData.deliveryType === "delivery" ? (
                <LocalShipping sx={{ fontSize: 20, mr: 1, color: color }} />
              ) : (
                <Store sx={{ fontSize: 20, mr: 1, color: color }} />
              )}
              <Typography variant="body2" fontWeight="medium">
                {orderData.deliveryType === "delivery" ? "Entrega" : "Retirada"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Informações do Restaurante */}
      <Slide direction="up" in timeout={1400}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={restaurant.logo_url}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {restaurant.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <LocationOn
                  sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {restaurant.address}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => window.open(`tel:${restaurant.phone}`)}
              sx={{ color: color }}
            >
              <Phone />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* Resumo do Pedido */}
      <Slide direction="up" in timeout={1600}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Resumo do Pedido
          </Typography>

          {items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  width={40}
                  height={40}
                  style={{
                    borderRadius: 8,
                    objectFit: "cover",
                    marginRight: 12,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight="medium">
                    {item.quantity}x {item.product.name}
                  </Typography>
                  {Object.keys(item.additionalOptions || {}).length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {Object.entries(item.additionalOptions || {})
                        .map(([option, qty]) => `${option} x${qty}`)
                        .join(", ")}
                    </Typography>
                  )}
                </Box>
                <Typography fontWeight="medium">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
              {index < items.length - 1 && <Divider />}
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Subtotal</Typography>
            <Typography>R$ {(orderData.total * 0.85).toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Taxa de entrega</Typography>
            <Typography>R$ {(orderData.total * 0.1).toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography>Taxa de serviço</Typography>
            <Typography>R$ {(orderData.total * 0.05).toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              R$ {orderData.total.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Pagamento:</strong> {orderData.paymentMethod}
            </Typography>
          </Box>
        </Paper>
      </Slide>

      {/* Ações */}
      <Slide direction="up" in timeout={1800}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={handleShare}
            fullWidth
          >
            Compartilhar
          </Button>

          <Button variant="outlined" startIcon={<Download />} fullWidth>
            Baixar Comprovante
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push("/")}
            fullWidth
            sx={{
              bgcolor: color,
              "&:hover": { bgcolor: color + "dd" },
            }}
          >
            Fazer Novo Pedido
          </Button>
        </Box>
      </Slide>

      {/* Animação CSS */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Container>
  );
}
