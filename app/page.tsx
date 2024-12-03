
import LoginPage from "./login/page";
//import { buscarUsuario, buscarUsuarios } from "./lib/actions";

export default function Home() {
  /*const handleClick = () => {
    buscarUsuario("123456");
  };*/

  return (
    <div>
      <LoginPage />
      {/*<button onClick={handleClick}>Buscar Usuarios</button>*/}
    </div>
  );
}
