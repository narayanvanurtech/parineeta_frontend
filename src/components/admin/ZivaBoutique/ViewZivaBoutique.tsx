import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  AlertTriangle,
  Package,
  IndianRupee,
  Palette,
  Calendar,
} from "lucide-react";

interface ViewZivaBoutiqueProps {
  isOpen: boolean;
  ziva: any;
  onClose: () => void;
}

export function ViewZivaBoutique({
  isOpen,
  ziva,
  onClose,
}: ViewZivaBoutiqueProps) {
  if (!isOpen || !ziva) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-elegant">
        
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{ziva.fullname}</CardTitle>
              <CardDescription>
                Email: {ziva.email}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {/* Subject */}
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{ziva.subject?.name || ziva.subject}</Badge>

                {ziva.message?.length < 20 && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Short Message
                  </Badge>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={IndianRupee}
                  label="Subject"
                  value={ziva.subject?.name || ziva.subject}
                />
                <InfoItem
                  icon={Package}
                  label="Message Length"
                  value={`${ziva.message?.length || 0} chars`}
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <Section title="Customer Message">
            <p className="text-muted-foreground">
              {ziva.message || "No message provided"}
            </p>
          </Section>

          {/* Metadata */}
          <Section title="Additional Information">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Attribute
                label="Created At"
                value={new Date(ziva.createdAt).toLocaleString()}
                icon={Calendar}
              />
              <Attribute
                label="Updated At"
                value={new Date(ziva.updatedAt).toLocaleString()}
                icon={Calendar}
              />
            </div>
          </Section>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}



function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-accent/40 rounded-lg p-4">{children}</div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Attribute({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
