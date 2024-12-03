import Link from 'next/link';
import Button from '@mui/material/Button';

const regresarInicio = () => {
  return (
    <Link href="/inicio" passHref>
      <Button variant="contained" color="success" sx={{ padding: '10px 20px' }}>
        Regresar a Inicio
      </Button>
    </Link>
  );
};

export default regresarInicio;