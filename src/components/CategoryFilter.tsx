import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  FormControl,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReactSelect from "react-select"; // Import React Select

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
  const [isSticky, setIsSticky] = useState(false);
  const [isClient, setIsClient] = useState(false); // Para garantir que o código será executado apenas no cliente
  const filterRef = useRef<HTMLDivElement>(null);
  const filterHeight = useRef<number>(0);

  // Efetua a atualização apenas no cliente
  useEffect(() => {
    setIsClient(true); // Garante que ReactSelect só será usado no cliente

    const handleScroll = () => {
      const filterElement = filterRef.current;
      if (!filterElement) return;

      if (filterHeight.current === 0) {
        filterHeight.current = filterElement.offsetHeight;
      }

      const rect = filterElement.getBoundingClientRect();

      if (rect.top <= 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
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

  // Mapeia categories para opções do react-select
  const options = [
    { value: "", label: "Selecione uma categorias" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // Encontra o objeto option selecionado pelo value
  const selectedOption =
    options.find((option) => option.value === selectedCategory) || options[0];

  return (
    <Box
      ref={filterRef}
      sx={{
        position: "relative",
        height: filterHeight.current > 0 ? filterHeight.current : "auto",
      }}
    >
      <Box
        sx={{
          position: isSticky ? "fixed" : "relative",
          top: 0,
          zIndex: 1100,
          backgroundColor: "primary.main",
          borderRadius: isSticky ? "0 0 8px 8px" : "8px", // Apenas bordas inferiores arredondadas quando fixo
          mb: 2,
          borderBottom: "1px solid #ddd",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          width: isSticky ? "100vw" : "100%",
          left: 0,
          padding: "10px",
          transition: "top 0.3s ease-in-out",
          height: "auto",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ overflow: "visible" }}
        >
          {/* Mobile - botões para categorias */}
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
              width: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              boxSizing: "border-box",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              backgroundColor: "primary.dark",
              padding: 1,
              borderRadius: "12px",
            }}
          >
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                href={`#${cat}`}
                sx={{
                  display: "inline-block",
                  fontWeight: 600,
                  color: selectedCategory === cat ? "white" : "text.primary",
                  padding: "4px 8px",
                  borderBottom:
                    selectedCategory === cat
                      ? "2px solid primary.main"
                      : "2px solid transparent",
                  "&:hover": {
                    borderBottom: "2px solid primary.dark",
                  },
                  transition: "border-bottom 0.3s ease",
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
                color: selectedCategory === "" ? "white" : "text.primary",
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

          {/* Desktop - React Select para categorias, apenas se for no cliente */}
          {isClient && (
            <Box sx={{ display: { xs: "none", sm: "block" }, width: "300px" }}>
              <FormControl fullWidth>
                {/* Label customizado acima */}
                <ReactSelect
                  options={options}
                  value={selectedOption}
                  onChange={(option) =>
                    onSelectCategory(option ? option.value : "")
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 12,
                      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      borderColor: selectedCategory ? "#1976d2" : "#bdbdbd",
                      padding: "2px",
                      "&:hover": {
                        borderColor: "#115293",
                      },
                      minHeight: "20px",
                      minWidth: "300px",
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: 12,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#1976d2" : "white",
                      color: state.isFocused ? "white" : "black",
                      cursor: "pointer",
                    }),
                  }}
                  isSearchable={false}
                  placeholder="Selecione uma categoria"
                />
              </FormControl>
            </Box>
          )}

          {/* Campo de busca */}
          <TextField
            size="small"
            placeholder="Buscar item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "300%" },
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
                  boxShadow: "0 0 8px 2px primary.main",
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
