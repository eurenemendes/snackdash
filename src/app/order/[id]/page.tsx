import OrderTracker from "@/components/OrderTracker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary/50">
          <CardTitle className="text-2xl font-headline">Oba, seu pedido foi confirmado!</CardTitle>
          <CardDescription>
            ID do Pedido: <span className="font-mono font-medium text-primary">{params.id}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Acompanhe seu lanche:</h3>
          <OrderTracker />
        </CardContent>
      </Card>
    </div>
  );
}
