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
      <Box
        sx={{
          height: 200,
          backgroundImage: `url(${
            imagemFundo || "https://via.placeholder.com/1200x300"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Paper
        elevation={3}
        sx={{
          position: "relative",
          top: -40,
          mx: "auto",
          p: 2,
          borderRadius: 2,
          maxWidth: 600,
          textAlign: "center",
        }}
      >
        <Avatar
          src={logo || "https://via.placeholder.com/80"}
          sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
        />
        <Typography variant="h6">{nome}</Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 1,
            fontSize: 14,
            color: "#666",
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
