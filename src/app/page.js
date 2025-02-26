import Home1 from "@/components/layout/main/Home1";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <PageWrapper>
      <main>
        <Home1/>
      </main>
      <Analytics />
      <SpeedInsights />
    </PageWrapper>
  );
}
