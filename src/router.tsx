import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { MainLayout } from "./layouts/main-layout";
import { NotFoundPage } from "./pages/not-found-page";
import { DocumentPage } from "./pages/document-page";
import { HomePage } from "./pages/home-page";
import { PublicPage } from "./pages/public-page";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/public/:documentId" element={<PublicPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="documents" element={<DocumentsRedirect />} />
          <Route path="documents/:documentId" element={<DocumentPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const DocumentsRedirect = () => {
  const documents = useQuery(api.documents.getSidebar, {});
  const { documentId } = useParams();

  if (documents === undefined) {
    return <div>Loading...</div>;
  }

  if (documents.length === 0) {
    return <Navigate to="/" />;
  }

  if (documentId === undefined) {
    return <Navigate to={`/documents/${documents[0]._id}`} />;
  }

  return <Navigate to={`/documents/${documentId}`} />;
};
