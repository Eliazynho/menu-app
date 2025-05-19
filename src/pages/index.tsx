import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { Container, Typography } from "@mui/material";

export default function Home() {
  const [message, setMessage] = useState("Testando conexão...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const testarConexao = async () => {
      const { data, error } = await supabase.from("restaurants").select("*");

      if (error) {
        setMessage("❌ Erro na conexão ou na tabela");
        console.error(error);
      } else {
        setMessage("✅ Conexão bem-sucedida com Supabase!");
        setData(data);
      }
    };

    testarConexao();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5">{message}</Typography>
      {data.length > 0 && (
        <Typography sx={{ mt: 2 }}>
          Primeiro restaurante: {data[0]?.name}
        </Typography>
      )}
    </Container>
  );
}
