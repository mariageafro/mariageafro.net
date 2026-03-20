export const ZONES_DISPONIBILITE = [
  { value: "france", label: "France", shortLabel: "France" },
  { value: "belgique", label: "Belgique", shortLabel: "Belgique" },
  { value: "france_belgique", label: "France & Belgique", shortLabel: "FR & BE" },
  { value: "europe", label: "Europe", shortLabel: "Europe" },
  { value: "international", label: "International", shortLabel: "International" },
] as const;

export type ZoneDisponibilite = (typeof ZONES_DISPONIBILITE)[number]["value"];

export function getZoneLabel(value: string | null | undefined): string {
  if (!value) return "Disponibilité à confirmer";
  const zone = ZONES_DISPONIBILITE.find((z) => z.value === value);
  return zone ? `Disponible en ${zone.label}` : "Disponibilité à confirmer";
}

export function getZoneShortLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  const zone = ZONES_DISPONIBILITE.find((z) => z.value === value);
  return zone?.shortLabel ?? null;
}
