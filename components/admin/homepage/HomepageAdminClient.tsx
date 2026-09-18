"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";
import { HeroDialog } from "@/components/admin/homepage/HeroDialog";
import { AboutDialog } from "@/components/admin/homepage/AboutDialog";
import { CtaDialog } from "@/components/admin/homepage/CtaDialog";
import { ContactDialog } from "@/components/admin/homepage/ContactDialog";
import { IntroDialog } from "@/components/admin/homepage/IntroDialog";
import { TrustStripManager } from "@/components/admin/homepage/TrustStripManager";
import { FeatureManager } from "@/components/admin/homepage/FeatureManager";
import { ProcessStepManager } from "@/components/admin/homepage/ProcessStepManager";
import { StatisticManager } from "@/components/admin/homepage/StatisticManager";
import { toggleSectionVisibility, reorderSections } from "@/app/admin/homepage/actions";
import type {
  PageSection,
  TrustStripItem,
  WhyChooseUsFeature,
  ProcessStep,
  Statistic,
} from "@prisma/client";

const SECTION_LABELS: Record<string, string> = {
  HERO: "Hero",
  TRUST: "Trust Strip",
  ABOUT: "About",
  SERVICES: "Services (intro text)",
  FEATURES: "Why Choose Us",
  PROCESS: "Process",
  INDUSTRIES: "Industries (intro text)",
  STATS: "Statistics",
  TEAM: "Team (intro text)",
  LOGOS: "Client Logos (intro text)",
  TESTIMONIALS: "Testimonials (intro text)",
  BLOGS: "Insights (intro text)",
  CTA: "CTA",
  CONTACT: "Contact",
};

export function HomepageAdminClient({
  sections,
  trustItems,
  features,
  steps,
  stats,
}: {
  sections: PageSection[];
  trustItems: TrustStripItem[];
  features: WhyChooseUsFeature[];
  steps: ProcessStep[];
  stats: Statistic[];
}) {
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);

  return (
    <Tabs defaultValue="layout">
      <TabsList>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="trust">Trust Strip</TabsTrigger>
        <TabsTrigger value="features">Why Choose Us</TabsTrigger>
        <TabsTrigger value="process">Process</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="layout" className="mt-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Drag to reorder sections on the homepage. Use the switch to show or hide a section, and
          the pencil to edit its content.
        </p>
        <SortableList
          items={sections}
          onReorder={reorderSections}
          renderItem={(section) => (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {SECTION_LABELS[section.type] ?? section.type}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <Switch
                  defaultChecked={section.isVisible}
                  onCheckedChange={(checked) => {
                    toggleSectionVisibility(section.id, checked).then((result) => {
                      if (!result.success) toast.error("Failed to update.");
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingSection(section)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      </TabsContent>

      <TabsContent value="trust" className="mt-6">
        <TrustStripManager items={trustItems} />
      </TabsContent>
      <TabsContent value="features" className="mt-6">
        <FeatureManager features={features} />
      </TabsContent>
      <TabsContent value="process" className="mt-6">
        <ProcessStepManager steps={steps} />
      </TabsContent>
      <TabsContent value="stats" className="mt-6">
        <StatisticManager stats={stats} />
      </TabsContent>

      {editingSection?.type === "HERO" && (
        <HeroDialog open onOpenChange={() => setEditingSection(null)} section={editingSection} />
      )}
      {editingSection?.type === "ABOUT" && (
        <AboutDialog open onOpenChange={() => setEditingSection(null)} section={editingSection} />
      )}
      {editingSection?.type === "CTA" && (
        <CtaDialog open onOpenChange={() => setEditingSection(null)} section={editingSection} />
      )}
      {editingSection?.type === "CONTACT" && (
        <ContactDialog open onOpenChange={() => setEditingSection(null)} section={editingSection} />
      )}
      {editingSection &&
        !["HERO", "ABOUT", "CTA", "CONTACT"].includes(editingSection.type) && (
          <IntroDialog
            open
            onOpenChange={() => setEditingSection(null)}
            section={editingSection}
            title={`Edit ${SECTION_LABELS[editingSection.type] ?? editingSection.type}`}
          />
        )}
    </Tabs>
  );
}
