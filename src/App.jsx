import React, { useState } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ComparativeAnalysisPage from "./pages/ComparativeAnalysisPage";
import FAQsPage from "./pages/FAQsPage";

const PAGES = {
  home: HomePage,
  comparative: ComparativeAnalysisPage,
  faqs: FAQsPage,
};

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const PageComponent = PAGES[currentPage] ?? HomePage;

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <PageComponent />
    </Layout>
  );
}

export default App;
