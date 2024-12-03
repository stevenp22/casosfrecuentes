import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { signOut } from "@/auth";
export default function Page() {
  return (
    <Box>
      <Link href={"/cerrarFolio"}>
        <Typography variant="h4">Cerrar Folio</Typography>
      </Link>
      <Button
        variant="contained"
        color="error"
        sx={{ padding: "10px 20px" }}
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        Cerrar Sesion
      </Button>
    </Box>
  );
}
