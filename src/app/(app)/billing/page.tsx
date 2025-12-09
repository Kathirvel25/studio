import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <CreditCard className="w-16 h-16 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>Billing Page Coming Soon</CardTitle>
          <CardDescription>
            Manage your subscription and payment methods here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You'll be able to view your invoices, upgrade or downgrade your plan, and update your payment details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
