import { AppRouter } from "./router";
import { ModalProvider } from "./providers/modal-provider";

export default function App() {
  return (
    <>
      <ModalProvider />
      <AppRouter />
    </>
  );
}
