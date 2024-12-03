import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { signOut } from "@/auth";
export default function Page() {
  return (
    <Box>
      <Link href={"/cerrarFolio"}>
        <Typography variant="h4">Cerrar Folio</Typography>
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button
          variant="contained"
          color="error"
          sx={{ padding: "10px 20px" }}
        >
          Cerrar Sesion
        </Button>
      </form>
    </Box>
  );
}
