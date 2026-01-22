import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCheck, Edit } from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role:string
  
}

interface CustomerProfileProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomerUpdate?:any
}

        
export function CustomerProfile({ customer, isOpen, onClose, onCustomerUpdate}: CustomerProfileProps) {
  if (!customer) return null;

  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-lg p-6">
    <DialogHeader>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src="/placeholder.svg" alt={customer.firstName} />
            <AvatarFallback className="text-lg font-medium">
              {customer.firstName?.[0]}
              {customer.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold">
              {customer.firstName} {customer.lastName}
            </DialogTitle>

            <p className="text-sm text-muted-foreground">
              {customer.email}
            </p>
            <p className="text-sm text-muted-foreground">
              role : {customer.role}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>ID: {customer.id}</span>
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-green-600" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={()=>onCustomerUpdate(customer)}
        >
          <Edit className="w-4 h-4"  />
          Edit
        </Button>
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>

  );
}
