"use client";
import { Folio } from "../lib/definitions";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from "@mui/material";

export default function VerFolios({
  folios,
  resultado,
}: {
  folios: Folio[];
  resultado: number[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedFolio, setSelectedFolio] = useState(
    searchParams.get("folio")?.toString() || ""
  );

  const handleChange = (term: string) => {
    setSelectedFolio(term);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (event) {
      params.set("folio", selectedFolio);
    } else {
      params.delete("folio");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  
  useEffect(() => {
    setSelectedFolio(searchParams.get("folio")?.toString() || "");
  }, [searchParams]);
  
  if (resultado.length > 0) {

    return (
      <div>
        {resultado[0] === 1 ? (
          <Typography variant="h3" gutterBottom>
            Folio cerrado correctamente
          </Typography>
        ) : (
            <Typography variant="h3" gutterBottom>
            Error al cerrar el folio
          </Typography>
        )}
      </div>
    );
  }

  return (
    <FormControl>
      {folios.length > 0 && <FormLabel>Folios abiertos</FormLabel>}
      <RadioGroup
        value={selectedFolio}
        name="folio"
        id="folio"
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      >
        {folios &&
          folios.map((folio) => (
            <FormControlLabel
              key={folio.HISCSEC}
              value={folio.HISCSEC}
              control={<Radio />}
              label={folio.HISCSEC}
            />
          ))}
      </RadioGroup>
      {folios.length > 0 && (
        <Button
          variant="contained"
          color="success"
          type="submit"
          onClick={handleSubmit}
        >
          Cerrar folio
        </Button>
      )}
    </FormControl>
  );
}
