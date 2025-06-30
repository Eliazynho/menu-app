import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (name: string, phone: string, restaurant_id: string) => void;
  restaurantId?: string;
  themeColor?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  onLogin,
  themeColor = "#ff0000", // Cor padrão vermelha
  restaurantId,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleClose = () => {
    // Limpa os campos e erros ao fechar
    setName("");
    setPhone("");
    setNameError(false);
    setPhoneError(false);
    onClose();
  };

  // Agora você pode usar a variável restaurantId
  useEffect(() => {
    if (restaurantId) {
      console.log("ID do restaurante no Redux:", restaurantId);
      // Faça algo com o restaurantId
    } else {
      console.log("ID do restaurante ainda não disponível no Redux.");
    }
  }, [restaurantId]); // Adicione restaurantId como dependência se estiver em useEffect

  // Ou simplesmente use-o no JSX ou em outras partes da lógica
  // if (restaurantId) {
  //   return <SomeComponent restaurantId={restaurantId} />;
  // }

  const handleLoginClick = () => {
    let valid = true;

    // Validação básica: verifica se os campos não estão vazios (após remover espaços em branco)
    if (name.trim() === "") {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (phone.trim() === "") {
      setPhoneError(true);
      valid = false;
    } else {
      setPhoneError(false);
    }

    if (valid) {
      onLogin(name.trim(), phone.trim(), restaurantId || ""); // Passa os valores trimados para onLogin
      // Não fecha o modal aqui, a função onLogin deve decidir se fecha ou não
      // handleClose(); // Remova ou comente esta linha se onLogin for fechar o modal
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Correção do erro de aninhamento H2/H6 */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Coloque o texto do título diretamente aqui. DialogTitle cuidará da tag H2 e do estilo H6 */}
        Login ou Cadastro
        {typeof onClose === "function" ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Informe seu nome e telefone para continuar com o pedido.
        </Typography>

        {/* Campo Nome - Validação e Conversão para Maiúsculas */}
        <TextField
          autoFocus
          margin="dense"
          label="Seu Nome Completo"
          type="text"
          fullWidth
          variant="outlined"
          value={name} // O valor aqui já será maiúsculo devido ao onChange
          onChange={(e) => {
            const newValue = e.target.value;
            // Regex para permitir apenas letras (maiúsculas e minúsculas), espaços e caracteres acentuados comuns.
            const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ ]*$/;

            if (regex.test(newValue)) {
              // Se o novo valor consistir apenas de caracteres permitidos,
              // converte para maiúsculas e atualiza o estado
              setName(newValue.toUpperCase());
            }
            // Se o teste falhar, o estado 'name' não é atualizado, ignorando o caractere inválido.

            // Limpa o erro do nome ao digitar, se ele estava presente
            if (nameError && newValue.trim() !== "") {
              setNameError(false);
            }
          }}
          error={nameError}
          helperText={nameError ? "Nome é obrigatório" : ""}
          sx={{ mb: 2 }}
          // Removido slotProps com textTransform: 'uppercase'
        />

        {/* Campo Telefone */}
        <TextField
          margin="dense"
          label="Seu Telefone (com DDD)"
          type="tel" // Use type="tel" para teclados otimizados em mobile
          fullWidth
          variant="outlined"
          value={phone}
          onChange={(e) => {
            const newValue = e.target.value;
            // Aqui você pode adicionar uma regex para validar telefone se necessário,
            // permitindo números, (), -, +, etc. Por enquanto, apenas atualiza o estado.
            setPhone(newValue);

            // Limpa o erro do telefone ao digitar, se ele estava presente
            if (phoneError && newValue.trim() !== "") {
              setPhoneError(false);
            }
          }}
          error={phoneError}
          helperText={phoneError ? "Telefone é obrigatório" : ""}
          // Removido slotProps com textTransform: 'uppercase' (não aplicável a telefone)
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleLoginClick}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: themeColor,
            "&:hover": {
              bgcolor: themeColor, // Mantém a cor no hover se desejar
              opacity: 0.9, // Adiciona uma pequena opacidade no hover
            },
          }}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
