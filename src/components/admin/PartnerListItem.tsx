import { Partner, STAGE_CONFIG, PARTNER_TYPES, isAtRisk } from "@/hooks/admin/usePartnersData";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, AlertTriangle } from "lucide-react";

interface Props {
  partner: Partner;
  onClick: () => void;
}

export function PartnerListItem({ partner, onClick }: Props) {
  const initials = partner.company_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const stage = STAGE_CONFIG[partner.status] || STAGE_CONFIG.prospect;
  const type = PARTNER_TYPES.find(t => t.value === partner.partner_type)?.label || partner.partner_type;
  const atRisk = isAtRisk(partner);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border border-transparent ${atRisk ? "border-amber-500/30 bg-amber-500/5" : ""}`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
          {initials}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${stage.dotColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{partner.company_name}</p>
          {atRisk && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground truncate">{partner.contact_name || "No contact"}</p>
      </div>

      <Badge variant="outline" className="text-[10px] hidden sm:flex">{type}</Badge>
      <span className="text-xs text-muted-foreground tabular-nums">{partner.total_referrals} refs</span>

      <div className="flex gap-1">
        {partner.phone && (
          <a href={`tel:${partner.phone}`} onClick={e => e.stopPropagation()} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
        {partner.email && (
          <a href={`mailto:${partner.email}`} onClick={e => e.stopPropagation()} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
            <Mail className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
