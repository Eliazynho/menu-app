import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
  const [isSticky, setIsSticky] = useState(false); // Controle para o sticky
  const filterRef = useRef<HTMLDivElement>(null); // Referência para o filtro
  const filterHeight = useRef<number>(0); // Para armazenar a altura do filtro

  useEffect(() => {
    const handleScroll = () => {
      const filterElement = filterRef.current;
      if (!filterElement) return;

      // Se o filtro for visível, salva a altura
      if (filterHeight.current === 0) {
        filterHeight.current = filterElement.offsetHeight;
      }

      const rect = filterElement.getBoundingClientRect();

      // Verifica se a parte superior do filtro atingiu o topo da tela
      if (rect.top <= 0) {
        setIsSticky(true); // Fixa o filtro no topo
      } else {
        setIsSticky(false); // Volta ao fluxo normal
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <Box
      ref={filterRef}
      sx={{
        position: "relative",
        height: filterHeight.current > 0 ? filterHeight.current : "auto", // Mantém a altura do filtro
      }}
    >
      {/* Box adicional para garantir que o espaço sempre seja mantido */}
      <Box
        sx={{
          position: isSticky ? "fixed" : "relative", // Fica fixo quando atingido o topo
          top: 0,
          zIndex: 1100,
          backgroundColor: "white",
          mb: 2,
          borderBottom: "1px solid #ddd",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          width: isSticky ? "100vw" : "100%", // Quando fixo, ocupa 100% da largura da tela
          left: 0, // Para garantir que o filtro esteja alinhado com a tela
          padding: "10px", // Ajuste o padding conforme necessário
          transition: "top 0.3s ease-in-out", // Transição suave para o sticky
          height: filterHeight.current > 0 ? filterHeight.current : "auto", // Mantém a altura do filtro
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
              msOverflowStyle: "none", // Esconde a scrollbar no IE
              scrollbarWidth: "none", // Esconde a scrollbar no Firefox
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
                color:
                  selectedCategory === "" ? "primary.main" : "text.primary",
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
            sx={{
              width: { xs: "100%", sm: 280 },
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 8px 2px #1976d2",
                  backgroundColor: "#fff",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
