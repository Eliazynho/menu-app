import { Box, Typography, Avatar, Paper } from "@mui/material";

interface Props {
  nome: string;
  imagemFundo?: string;
  logo?: string;
  tempo?: string;
  minimo?: string;
  status?: string;
}

export default function RestauranteHeader({
  nome,
  imagemFundo,
  logo,
  tempo = "40–60 min",
  minimo = "R$ 15,00",
  status = "Fechado",
}: Props) {
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Imagem de fundo */}
      <Box
        sx={{
          height: { xs: 180, sm: 200 }, // Ajusta a altura da imagem dependendo da tela
          backgroundImage: `url(${
            imagemFundo || "https://via.placeholder.com/1200x300"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Paper com o conteúdo do restaurante */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          top: -100,
          mx: "auto",
          p: 2,
          borderRadius: 2,
          maxWidth: 600, // Limita a largura no desktop
          width: "90%", // Garante que ocupe 90% da largura no mobile
          textAlign: "center",
        }}
      >
        {/* Logo do restaurante */}
        <Avatar
          src={logo || "https://via.placeholder.com/80"}
          sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
        />

        {/* Nome do restaurante */}
        <Typography variant="h6">{nome}</Typography>

        {/* Informações adicionais do restaurante */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 1,
            fontSize: 14,
            color: "#666",
            flexDirection: { xs: "column", sm: "row" }, // No mobile, empilha as informações
          }}
        >
          <span>{tempo}</span>
          <span>Pedido mínimo: {minimo}</span>
          <span style={{ color: "red" }}>● {status}</span>
        </Box>
      </Paper>
    </Box>
  );
}
