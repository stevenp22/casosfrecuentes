"use client";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form
          noValidate
          autoComplete="off"
          action={formAction}
          className="space-y-3"
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="documento"
            label="Numero de documento"
            name="documento"
            autoComplete="documento"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="contraseña"
            label="Contraseña"
            type="password"
            id="contraseña"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            aria-disabled={isPending}
          >
            Iniciar Sesión
          </Button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </form>
      </Box>
    </Container>
  );
}
