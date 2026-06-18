import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import { FloatingNav } from "@/components/FloatingNav";

import { OverviewPage } from "@/pages/OverviewPage";
import { HealthMapPage } from "@/pages/HealthMapPage";
import { LearnPage } from "@/pages/LearnPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { OrganisationPage } from "@/pages/OrganisationPage";
import { FrameworkBuilderPage } from "@/pages/FrameworkBuilderPage";
import { AssessmentsPage } from "@/pages/AssessmentsPage";
import { DataInventoryPage } from "@/pages/DataInventoryPage";
import { AiInventoryPage } from "@/pages/AiInventoryPage";
import { RisksPage } from "@/pages/RisksPage";
import { ControlsPage } from "@/pages/ControlsPage";
import { PoliciesPage } from "@/pages/PoliciesPage";
import { EvidencePage } from "@/pages/EvidencePage";
import { RoadmapPage } from "@/pages/RoadmapPage";
import { DecisionsPage } from "@/pages/DecisionsPage";
import { IncidentsPage } from "@/pages/IncidentsPage";
import { VendorsPage } from "@/pages/VendorsPage";
import { MetricsPage } from "@/pages/MetricsPage";
import { AuditPage } from "@/pages/AuditPage";
import { FrameworkLibraryPage } from "@/pages/FrameworkLibraryPage";
import { SettingsPage } from "@/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider delayDuration={150}>
        <AppShell>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/health-map" element={<HealthMapPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/organisation" element={<OrganisationPage />} />
            <Route path="/builder" element={<FrameworkBuilderPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/data" element={<DataInventoryPage />} />
            <Route path="/ai" element={<AiInventoryPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/controls" element={<ControlsPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/decisions" element={<DecisionsPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/library" element={<FrameworkLibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
        <FloatingNav position="bottom-right" />
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
