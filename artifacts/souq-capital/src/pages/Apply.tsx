import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Apply() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar tone="light" />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-black/8 pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Apply for Funding</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#14181A] leading-tight mb-6">
              Grow your business without<br />debt or dilution.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              This quick form helps us understand your business and financing needs. Takes ~3 minutes.
            </p>
          </div>
        </section>

        {/* Fillout embed */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="border border-black/10 rounded-2xl overflow-hidden bg-white shadow-sm">
              <iframe
                src="https://forms.fillout.com/t/994nY5LU8Wus"
                width="100%"
                height="700"
                frameBorder="0"
                title="Souq Capital Application Form"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
