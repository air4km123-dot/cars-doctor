// Core domain types for the Cars Doctor prototype.
// All mock data is intentionally cross-referenced from a single source (mockData.ts)
// so every screen agrees on the same numbers.

export type TrackerKey =
  | "oil"
  | "battery"
  | "tire"
  | "brake"
  | "aircon"
  | "injector";

export type StatusLevel = "healthy" | "warning" | "dueSoon" | "urgent";

export type FeatureStatus = "FREE" | "PREMIUM" | "COMING_SOON" | "MARKETPLACE";

export type LifecycleStage =
  | "birth"
  | "life"
  | "sick"
  | "presell"
  | "transfer"
  | "eol"
  | "marketplace";

export interface FeatureMeta {
  id: string;
  title: string;
  englishTitle?: string;
  description: string;
  status: FeatureStatus;
  newIdea?: boolean;
  stage: LifecycleStage;
  category: string;
  icon: string;
  route: string;
  /** Optional: what a confirmed action here updates elsewhere (for Data Connection demo copy) */
  connects?: string[];
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  plate: string;
  province: string;
  color: string;
  vin: string;
  mileage: number;
  purchaseDate: string;
  purchasePrice: number;
  image: string;
}

export interface MaintenanceEvent {
  id: string;
  category: TrackerKey | "general";
  title: string;
  date: string;
  mileage: number;
  cost: number;
  notes?: string;
  location?: string;
}

export interface TrackerInfo {
  key: TrackerKey;
  label: string;
  labelEn: string;
  lastDate: string;
  lastMileage: number;
  intervalKm: number;
  intervalMonths: number;
  nextDueMileage: number;
  nextDueDate: string;
  status: StatusLevel;
  icon: string;
}

export interface Expense {
  id: string;
  category:
    | "fuel"
    | "maintenance"
    | "insurance"
    | "tax"
    | "parking"
    | "toll"
    | "carwash"
    | "other";
  title: string;
  date: string;
  amount: number;
}

export interface FuelLog {
  id: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  mileage: number;
  fuelType: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: "date" | "mileage" | "recurring";
  dueDate?: string;
  dueMileage?: number;
  category: string;
  status: StatusLevel;
  icon: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category:
    | "registration"
    | "insurance"
    | "cmi"
    | "roadtax"
    | "inspection"
    | "warranty"
    | "finance"
    | "license"
    | "invoice"
    | "service"
    | "photo";
  status: "active" | "dueSoon" | "expired";
  expireDate?: string;
  addedDate: string;
}

export interface HealthCategory {
  key: TrackerKey | "legal";
  label: string;
  score: number;
  status: StatusLevel;
  summary: string;
}

export interface SymptomRecord {
  id: string;
  title: string;
  date: string;
  severity: "low" | "medium" | "high" | "urgent";
  notes: string;
}

export interface Accident {
  id: string;
  date: string;
  location: string;
  detail: string;
  claimId?: string;
}

export interface Claim {
  id: string;
  accidentId?: string;
  insurer: string;
  date: string;
  status: "open" | "processing" | "closed";
  amount: number;
}

export interface PassportEvent {
  id: string;
  date: string;
  type: string;
  title: string;
  detail: string;
  icon: string;
  source?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  priceLevel: "฿" | "฿฿" | "฿฿฿";
  specialty: string[];
  availableToday: boolean;
  estimatedPrice: string;
}

export interface DriverProfile {
  name: string;
  licenseNumberMasked: string;
  licenseType: string;
  expireDate: string;
  photo?: string;
}

export interface AppUser {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  plan: string;
}
