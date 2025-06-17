// pages/404.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Grow,
  Zoom,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

export default function Custom404() {
  const [isHungry, setIsHungry] = useState(false);
  const [shake, setShake] = useState(false);
  const theme = useTheme();
  const foodEmojis = ["🍕", "🍔", "🍟", "🌮", "🍗", "🍝", "🥗", "🍜"];
  const [currentEmoji, setCurrentEmoji] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % foodEmojis.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHungryClick = () => {
    setIsHungry(true);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          "#FF1744",
          0.1
        )} 0%, ${alpha("#D32F2F", 0.1)} 50%, ${alpha("#B71C1C", 0.1)} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: { xs: 1, sm: 2 },
      }}
    >
      {/* Floating food elements - Responsivo */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 20, sm: 40 },
          left: { xs: 20, sm: 40 },
          fontSize: { xs: "2rem", sm: "3rem" },
          animation: "bounce 2s infinite",
          display: { xs: "none", sm: "block" }, // Escondido no mobile
        }}
      >
        🍕
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: { xs: 40, sm: 80 },
          right: { xs: 32, sm: 64 },
          fontSize: { xs: "1.5rem", sm: "2rem" },
          animation: "pulse 2s infinite",
          display: { xs: "none", sm: "block" }, // Escondido no mobile
        }}
      >
        🍔
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 40, sm: 80 },
          left: { xs: 40, sm: 80 },
          fontSize: { xs: "2.5rem", sm: "3.5rem" },
          animation: "bounce 2s infinite 1s",
          display: { xs: "none", sm: "block" }, // Escondido no mobile
        }}
      >
        🌮
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 64, sm: 128 },
          right: { xs: 20, sm: 40 },
          fontSize: { xs: "1.5rem", sm: "2rem" },
          animation: "pulse 2s infinite 0.5s",
          display: { xs: "none", sm: "block" }, // Escondido no mobile
        }}
      >
        🍟
      </Box>

      <Container maxWidth="md">
        <Box sx={{ textAlign: "center" }}>
          {/* Animated 404 */}
          <Zoom in timeout={800}>
            <Box sx={{ mb: { xs: 2, sm: 4 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "4rem", sm: "6rem", md: "12rem" },
                  fontWeight: "bold",
                  background: `linear-gradient(45deg, #FF1744, #D32F2F, #B71C1C)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: 0.5, sm: 1 },
                  flexWrap: "wrap",
                }}
              >
                4
                <motion.span
                  animate={{ rotate: shake ? [0, -10, 10, -10, 0] : 0 }}
                  style={{
                    fontSize: "3rem",
                    display: "inline-block",
                  }}
                >
                  {foodEmojis[currentEmoji]}
                </motion.span>
                4
              </Typography>
            </Box>
          </Zoom>

          {/* Main message */}
          <Fade in timeout={1000}>
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  px: { xs: 1, sm: 0 },
                }}
              >
                Ops! Prato não encontrado
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mb: 3,
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  px: { xs: 2, sm: 0 },
                }}
              >
                {!isHungry
                  ? "Parece que você se perdeu no caminho da cozinha... Esta página não existe no nosso cardápio!"
                  : "Que bom que você está com fome! Vamos te levar para pratos deliciosos que realmente existem!"}
              </Typography>
            </Box>
          </Fade>

          {/* Interactive elements */}
          <Grow in timeout={1200}>
            <Box>
              {!isHungry ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleHungryClick}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                    borderRadius: "50px",
                    background: `linear-gradient(45deg, #FF1744, #D32F2F)`,
                    boxShadow: theme.shadows[8],
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.shadows[12],
                      background: `linear-gradient(45deg, #D32F2F, #B71C1C)`,
                    },
                    transition: "all 0.3s ease",
                    ...(shake && { animation: "bounce 0.5s" }),
                  }}
                >
                  🤤 Estou com fome!
                </Button>
              ) : (
                <Fade in timeout={500}>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: "2rem", sm: "3rem" },
                      }}
                    >
                      🎉
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 2, sm: 3 },
                        justifyContent: "center",
                        alignItems: "center",
                        maxWidth: { xs: "100%", sm: 500 },
                        mx: "auto",
                        px: { xs: 1, sm: 0 },
                      }}
                    >
                      <Link
                        href="/"
                        passHref
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            border: `2px solid ${alpha("#FF1744", 0.3)}`,
                            width: "100%",
                            maxWidth: { xs: "100%", sm: 300 },
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: theme.shadows[8],
                              borderColor: "#FF1744",
                              background: `linear-gradient(135deg, ${alpha(
                                "#FF1744",
                                0.05
                              )}, ${alpha("#D32F2F", 0.05)})`,
                            },
                          }}
                        >
                          <CardContent
                            sx={{ textAlign: "center", py: { xs: 2, sm: 3 } }}
                          >
                            <HomeIcon
                              sx={{
                                fontSize: { xs: "2.5rem", sm: "3rem" },
                                color: "#FF1744",
                                mb: 1,
                              }}
                            />
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                            >
                              Marketplace
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                            >
                              Ver todos nossos parceiros
                            </Typography>
                          </CardContent>
                        </Card>
                      </Link>

                      <Link
                        href="/menu"
                        passHref
                        style={{ textDecoration: "none", width: "100%" }}
                      >
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            border: `2px solid ${alpha("#D32F2F", 0.3)}`,
                            width: "100%",
                            maxWidth: { xs: "100%", sm: 300 },
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: theme.shadows[8],
                              borderColor: "#D32F2F",
                              background: `linear-gradient(135deg, ${alpha(
                                "#D32F2F",
                                0.05
                              )}, ${alpha("#B71C1C", 0.05)})`,
                            },
                          }}
                        >
                          <CardContent
                            sx={{ textAlign: "center", py: { xs: 2, sm: 3 } }}
                          >
                            <RestaurantIcon
                              sx={{
                                fontSize: { xs: "2.5rem", sm: "3rem" },
                                color: "#D32F2F",
                                mb: 1,
                              }}
                            />
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                            >
                              Restaurantes
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                            >
                              Pesquise seu restaurante favorito
                            </Typography>
                          </CardContent>
                        </Card>
                      </Link>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>
          </Grow>

          {/* Back link */}
          <Fade in timeout={1500}>
            <Box sx={{ mt: { xs: 4, sm: 6 } }}>
              <Link href="/" passHref style={{ textDecoration: "none" }}>
                <Button
                  startIcon={<ArrowLeftIcon />}
                  color="inherit"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&:hover": {
                      color: "#FF1744",
                    },
                  }}
                >
                  Voltar para o nosso lobby
                </Button>
              </Link>
            </Box>
          </Fade>
        </Box>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
}
