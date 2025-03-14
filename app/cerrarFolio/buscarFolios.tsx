"use client";
import {
  FormControl,
  TextField,
  Stack,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Folios() {
  const [tipoDocumento, setTipoDocumento] = useState("CC");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setTipoDocumento(event.target.value as string);
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    const documento = (
      document.getElementById("documento") as HTMLInputElement
    ).value.trim();
    if (documento) {
      params.set("tipoDocumento", tipoDocumento);
      params.set("documento", documento);
    } else {
      params.delete("tipoDocumento");
      params.delete("documento");
    }
    params.delete("folio");
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <form onSubmit={onSubmit}>
      <FormControl>
      <Typography variant="h4" component="h1" gutterBottom>
        Cerrar folio
      </Typography>
        <Stack direction="row" spacing={2} style={{ marginTop: "16px" }}>
          <Select
            id="tipoDocumento"
            name="tipoDocumento"
            label="Tipo de Documento"
            value={tipoDocumento}
            onChange={handleSelectChange}
            defaultValue={searchParams.get("tipoDocumento")?.toString()}
          >
            <MenuItem value={"CC"}>Cedula de ciudadania</MenuItem>
            <MenuItem value={"TI"}>Tarjeta de identidad</MenuItem>
          </Select>
          <TextField
            required
            id="documento"
            name="documento"
            label="Documento"
            defaultValue={searchParams.get("documento")?.toString()}
          />
        </Stack>
        <Button variant="contained" type="submit" style={{ marginTop: "16px" }}>
          Buscar folio
        </Button>
      </FormControl>
    </form>
  );
}
