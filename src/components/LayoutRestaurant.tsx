import { Container, Typography, AppBar } from "@mui/material";

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function LayoutRestaurante({ children, title }: Props) {
  return (
    <>
      <AppBar position="static" color="primary">
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </AppBar>

      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
}
