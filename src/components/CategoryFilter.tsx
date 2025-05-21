import {
  Box,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSearch: (term: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearch,
}: CategoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: "white",
        mb: 2,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ overflow: "visible" }}
      >
        {/* Mobile - Rolagem Horizontal para as categorias */}
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            width: "100%", // Ocupa todo o espaço do container
            overflowX: "auto", // Permite rolagem horizontal
            whiteSpace: "nowrap", // Garante que os itens fiquem em uma linha
            maxWidth: "100%", // Garante que o Box não ultrapasse o container
            boxSizing: "border-box",
            "&::-webkit-scrollbar": { display: "none" }, // Esconde a scrollbar no mobile
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
          }}
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              href={`#${cat}`} // Link para a categoria
              sx={{
                display: "inline-block",
                fontWeight: 600,
                color:
                  selectedCategory === cat ? "primary.main" : "text.primary",
                borderBottom:
                  selectedCategory === cat
                    ? "2px solid primary.main"
                    : "2px solid transparent",
                "&:hover": {
                  borderBottom: "2px solid primary.dark",
                },
                transition: "border-bottom 0.3s ease", // Animação suave na linha
              }}
            >
              {cat}
            </Button>
          ))}
          <Button
            onClick={() => onSelectCategory("")}
            href="#all"
            sx={{
              display: "inline-block",
              fontWeight: 600,
              color: selectedCategory === "" ? "primary.main" : "text.primary",
              borderBottom:
                selectedCategory === ""
                  ? "2px solid primary.main"
                  : "2px solid transparent",
              "&:hover": {
                borderBottom: "2px solid primary.dark",
              },
              transition: "border-bottom 0.3s ease",
            }}
          >
            Todas
          </Button>
        </Box>

        {/* Desktop - Select para categorias */}
        <Box sx={{ display: { xs: "none", sm: "block" }, width: "100%" }}>
          <FormControl fullWidth>
            <InputLabel>Selecionar Categoria</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              label="Selecionar Categoria"
              sx={{
                borderRadius: "12px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                "& .MuiSelect-select": {
                  padding: "12px 20px",
                  fontSize: "1rem",
                },
                width: "100%",
                maxWidth: "100%",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: selectedCategory ? "primary.main" : "grey.400",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.dark",
                },
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Campo de busca */}
        <TextField
          size="small"
          placeholder="Buscar item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: 240 } }}
        />
      </Stack>
    </Box>
  );
}
