// src/components/ProductModal.tsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Product } from "@/types"; // Tipo do produto, defina isso conforme sua estrutura
import { useState } from "react";
import Image from "next/image"; // Importando o Image do Next.js
import { SelectChangeEvent } from "@mui/material"; // Importando o tipo correto para SelectChangeEvent

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, additionalOption: string) => void;
}

const ProductModal = ({
  open,
  onClose,
  product,
  onAddToCart,
}: ProductModalProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Atualizando para usar SelectChangeEvent com tipo string
  const handleSelectOption = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value); // Atualiza a opção selecionada
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, selectedOption); // Adiciona o produto ao carrinho
      onClose(); // Fecha o modal após adicionar o item
    }
  };

  if (!product) return null; // Caso não haja produto, não exibe nada

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product.name}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={product.image_url}
            alt={product.name}
            width={500} // Defina o tamanho desejado (em px)
            height={300} // Defina o tamanho desejado (em px)
            layout="responsive" // Torna a imagem responsiva
            objectFit="contain" // Ajusta a imagem para se comportar dentro do container
          />
          <Box sx={{ marginTop: 2 }}>{product.description}</Box>
          <Box sx={{ marginTop: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Escolha um adicional</InputLabel>
              <Select
                value={selectedOption}
                onChange={handleSelectOption} // Usando o evento correto para o Select
                label="Escolha um adicional"
              >
                {product.additionalOptions?.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Fechar
        </Button>
        <Button onClick={handleAddToCart} color="primary">
          Adicionar ao Carrinho
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
