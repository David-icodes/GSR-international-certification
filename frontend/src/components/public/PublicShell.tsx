import { publicApi } from "@/lib/api";
import { Header } from "./Header";
import { Footer } from "./Footer";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const settings = await publicApi.settings().catch(() => undefined);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
