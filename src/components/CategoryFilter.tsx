import { Box, Button, TextField, Stack } from "@mui/material";
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
        py: 2,
        px: { xs: 2, sm: 3 },
        mb: 4,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
        sx={{ overflow: "visible" }}
      >
        <Box
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            maxWidth: "100vw",
            WebkitOverflowScrolling: "touch",
            boxSizing: "border-box",
            "&::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
          }}
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "contained" : "outlined"}
              onClick={() => onSelectCategory(cat)}
              sx={{
                display: "inline-block",
                minWidth: 80,
                mr: 2,
                mb: { xs: 2, sm: 0 },
              }}
            >
              {cat}
            </Button>
          ))}
          <Button
            variant={selectedCategory === "" ? "contained" : "outlined"}
            onClick={() => onSelectCategory("")}
            sx={{
              display: "inline-block",
              minWidth: 80,
              mr: 2,
              mb: { xs: 2, sm: 0 },
            }}
          >
            Todas
          </Button>
        </Box>

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
