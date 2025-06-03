import { Box, Typography, Avatar, Paper, Button } from "@mui/material";

interface Props {
  nome: string;
  imagemFundo?: string;
  logo?: string;
  tempo?: string;
  minimo?: number;
  status?: string;
  color?: string;
}

export default function RestauranteHeader({
  nome,
  imagemFundo,
  logo,
  tempo,
  minimo,
  color,
  status = "Aberto",
}: Props) {
  const isOpen = status.toLowerCase() === "aberto"; // Verifica se status é "aberto" (case insensitive)

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Imagem de fundo */}
      <Box
        sx={{
          height: { xs: 180, sm: 200 },
          backgroundImage: `url(${
            imagemFundo || "https://via.placeholder.com/1200x300"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative", // Garantir que o overlay fique sobre a imagem
        }}
      >
        {/* Overlay preto semi-transparente somente sobre a imagem */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Preto com 40% de opacidade
          }}
        />
      </Box>

      {/* Paper com o conteúdo do restaurante (Desktop) */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          top: -100,
          mx: "auto",
          p: 2,
          borderRadius: 2,
          maxWidth: 600,
          display: { xs: "none", sm: "block" },
          width: "90%", // Garante que ocupe 90% da largura no mobile
          textAlign: "center",
        }}
      >
        {/* Logo do restaurante (Avatar) */}
        <Avatar
          src={logo || "https://via.placeholder.com/80"}
          sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
        />

        {/* Conteúdo do restaurante (Nome + Informações) */}
        <Box>
          {/* Nome do restaurante */}
          <Typography variant="h6">{nome}</Typography>

          {/* Informações adicionais do restaurante */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row", // Empilha as informações no mobile
              fontSize: 14,
              color: "#666",
              mt: 1,
            }}
          >
            <span>{`Tempo de entrega: ${tempo}`}</span>
            <span>Pedido mínimo: {`R$ ${minimo},00`}</span>
            <span style={{ color: isOpen ? "green" : "red" }}>● {status}</span>
          </Box>
        </Box>
      </Paper>

      {/* Paper com o conteúdo do restaurante (Mobile) */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          top: -100,
          mx: "auto",
          p: 2,
          borderRadius: 2,
          maxWidth: 600,
          width: "90%",
          textAlign: "left", // Alinha o texto à esquerda
          display: { xs: "flex", sm: "none" }, // Faz o conteúdo ficar lado a lado
          alignItems: "center", // Alinha verticalmente o conteúdo
        }}
      >
        {/* Logo do restaurante (Avatar) */}
        <Avatar
          src={logo || "https://via.placeholder.com/80"}
          sx={{
            width: 120,
            height: 120,
            mr: 2, // Espaço à direita do avatar
            border: "4px solid",
            borderColor: `${color}`,
          }}
        />

        {/* Conteúdo do restaurante (Nome + Informações) */}
        <Box>
          {/* Nome do restaurante */}
          <Typography variant="h6">{nome}</Typography>

          {/* Informações adicionais do restaurante */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // Empilha as informações no mobile
              fontSize: 14,
              color: "#666",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1, // espaço entre os itens
              }}
            >
              <span>Min: {`R$ ${minimo},00`}</span>

              <Box
                sx={{
                  width: "1px",
                  height: "16px",
                  backgroundColor: "grey.500",
                }}
              />

              <span>{`${tempo} min`}</span>
            </Box>

            <Button
              variant="contained"
              disabled
              sx={{
                pointerEvents: "none",
                backgroundColor: isOpen ? "green" : "red",
                color: "white",
                mt: 1,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "none",
                cursor: "default",
                "&.Mui-disabled": {
                  backgroundColor: isOpen ? "green" : "red",
                  color: "white",
                  opacity: 1,
                },
              }}
            >
              {status}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
