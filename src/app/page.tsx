import SnackMenu from '@/components/SnackMenu';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
          Cardápio SnackDash
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Escolha seu lanche favorito e mate sua fome!
        </p>
      </header>
      <SnackMenu />
    </div>
  );
}
