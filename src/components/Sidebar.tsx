import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  Divider,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Login as LoginIcon,
  ShoppingCartCheckout as CartIcon,
  LocationOn as LocationIcon,
  ContactSupport as SupportIcon,
} from "@mui/icons-material";

import Image from "next/image";

interface SidebarProps {
  logo: string;
  nome: string;
}

function Sidebar({ logo, nome }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Botão de Menu */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={toggleDrawer}
        sx={{
          marginRight: 2,
          color: "white",
          ...(open && { display: "none" }), // Esconde o ícone quando a barra lateral estiver aberta
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Overlay escuro quando a barra lateral está aberta */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escuro semi-transparente
            zIndex: 1, // Para ficar acima do conteúdo da página, abaixo da barra lateral
          }}
          onClick={toggleDrawer} // Fecha o Drawer ao clicar no overlay
        />
      )}

      {/* Barra Lateral (Drawer) */}
      <Drawer
        sx={{
          width: "70%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "60%",
            boxSizing: "border-box",
            backgroundColor: "white", // Cor de fundo escura para um visual moderno
            color: "white", // Texto em branco
            transition: "all 0.3s ease",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        {/* Conteúdo da barra lateral */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            backgroundColor: "#fafafa",
            color: "white",
            borderBottom: "1px solid #ccc",
            height: "60px",
          }}
        >
          <Image
            src={logo || "https://via.placeholder.com/80"}
            alt="Logo"
            width={40}
            height={40}
            style={{
              borderRadius: "10%", // Para manter a imagem circular
              marginRight: "10px",
            }}
          />
          <Typography
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
            {nome}
          </Typography>
        </Box>
        <List>
          <ListItem
            component="a"
            href="#Login"
            sx={{ color: "black", padding: 2 }}
          >
            <LoginIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Entrar
            </Typography>
          </ListItem>
          <ListItem
            component="a"
            href="#Cart"
            sx={{ color: "black", padding: 2 }}
          >
            <CartIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Carrinho
            </Typography>
          </ListItem>
          <ListItem
            component="a"
            href="#Endereco"
            sx={{ color: "black", padding: 2 }}
          >
            <LocationIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Endereço
            </Typography>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            component="a"
            href="#FaleConosco"
            sx={{ color: "black", padding: 2 }}
          >
            <SupportIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Fale Conosco
            </Typography>
          </ListItem>
        </List>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={
              "https://static.vecteezy.com/ti/vetor-gratis/p1/25943773-editavel-icone-funcao-configuracoes-ilustracao-placa-automatizado-sistema-simbolo-desenvolvimento-logotipo-vetor.jpg"
            }
            alt="Logo"
            width={100}
            height={100}
          />
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Version 1.0.0
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Desenvolvido por NOSSA MARCA
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            &copy; 2023 NOSSA MARCA. Todos os direitos reservados.
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
