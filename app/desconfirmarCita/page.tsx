"use client";
import { useState } from "react";
import { desconfirmarCita, consultarCitas } from "../lib/actions";
import {
  Button,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import RegresarInicio from "../componentes/regresarInicio";
import { Cita } from "../lib/definitions";

export default function Page() {
  const [documento, setDocumento] = useState("");
  const [cita, setCita] = useState(0);
  const [citProcedimiento, setCitProcedimiento] = useState("");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [resultado, setResultado] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleDesconfirmarCita = async () => {
    try {
      if (documento.trim() !== "" && cita !== 0 && citProcedimiento.trim() !== "") {
        const resultado = await desconfirmarCita(
          documento.trim(),
          cita,
          citProcedimiento
        );
        console.log("Resultado de desconfirmarCita", resultado);
      } else {
        setError("Todos los campos son obligatorios.");
      }
      setResultado(resultado);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCitas = async () => {
    if (documento !== "") {
      const citas = await consultarCitas(documento.trim());
      console.log("Resultado de consultarCitas", resultado);
      setCitas(citas);
    } else {
      setError("El documento es obligatorio.");
    }
  };
  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const selectedCita = citas.find((c) => c.NumCitPac === event.target.value);
    if (selectedCita) {
      setCita(selectedCita.NumCitPac);
      setCitProcedimiento(String(selectedCita.CodProCit));
    }
  };

  return (
    <Container>
      <RegresarInicio />
      <Typography variant="h4" component="h1" gutterBottom>
        Desconfirmar Cita
      </Typography>
      <TextField
        label="documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        onBlur={handleCitas}
        fullWidth
        margin="normal"
        required
      />
      <Select value={cita} onChange={handleSelectChange} displayEmpty fullWidth>
        <MenuItem value={0} disabled>
          Seleccione una cita
        </MenuItem>
        {citas.map((cita) => (
          <MenuItem key={cita.NumCitPac} value={cita.NumCitPac}>
            {cita.NumCitPac} -{" "}
            {new Date(cita.FchCitPac).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })} {" "}
            - {cita.NomProCit}
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDesconfirmarCita}
      >
        Desconfirmar Cita
      </Button>
      {resultado && (
        <Typography variant="body1" color="textPrimary">
          {resultado}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
    </Container>
  );
}
