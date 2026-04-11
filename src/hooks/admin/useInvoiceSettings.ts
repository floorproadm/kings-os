import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InvoiceSettings {
  id: string;
  org_id: string;
  logo_url: string | null;
  company_name: string | null;
  tagline: string | null;
  website: string | null;
  company_address: string | null;
  company_phone: string | null;
  company_email: string | null;
  accent_color: string;
  default_notes: string | null;
  footer_text: string;
}

const DEFAULTS: Omit<InvoiceSettings, "id" | "org_id"> = {
  logo_url: null,
  company_name: null,
  tagline: null,
  website: null,
  company_address: null,
  company_phone: null,
  company_email: null,
  accent_color: "#c9a84c",
  default_notes: null,
  footer_text: "Thank you for choosing Hardwood Kings!",
};

export function useInvoiceSettings() {
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("invoice_settings")
      .select("*")
      .maybeSingle();
    setSettings(data as InvoiceSettings | null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (values: Partial<InvoiceSettings>) => {
    const orgRes = await supabase.rpc("get_user_org_id");
    const orgId = orgRes.data!;

    if (settings?.id) {
      const { error } = await supabase
        .from("invoice_settings")
        .update(values)
        .eq("id", settings.id);
      if (error) throw error;
    } else {
      const payload = { ...values, org_id: orgId };
      const { error } = await supabase
        .from("invoice_settings")
        .insert(payload);
      if (error) throw error;
    }
    await load();
  };

  return { settings, loading, save, defaults: DEFAULTS };
}
