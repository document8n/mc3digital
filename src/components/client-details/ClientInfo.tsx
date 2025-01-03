import { Mail, Phone, MapPin, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientInfoProps {
  client: {
    business_name: string;
    contact_name: string;
    email?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}

export const ClientInfo = ({ client }: ClientInfoProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6 text-indigo-500" />
          {client.business_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Contact Information</h3>
            <p className="text-lg font-medium">{client.contact_name}</p>
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Address</h3>
            {client.address_line1 && (
              <p>{client.address_line1}</p>
            )}
            {client.address_line2 && (
              <p>{client.address_line2}</p>
            )}
            {(client.city || client.state || client.postal_code) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>
                  {[
                    client.city,
                    client.state,
                    client.postal_code
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};