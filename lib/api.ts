// lib/api.ts
// Mock API matching the exact Supabase schema.

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  balance: number;
};

export type TariffCategory = "internet" | "tv" | "mobile";

export type Tariff = {
  id: string;
  name: string;
  speed_mbps: number | null;
  price: number;
  description: string;
  category: TariffCategory;
};

export type SubscriptionStatus = "active" | "pending" | "cancelled";

export type Subscription = {
  id: string;
  user_id: string;
  tariff_id: string;
  status: SubscriptionStatus;
  next_billing_date: string; // ISO String
};

export type PaymentStatus = "success" | "pending";

export type Payment = {
  id: string;
  user_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
};

export type TicketStatus = "open" | "in_progress" | "closed";

export type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  created_at: string;
};

export type NetworkStatusItem = {
  id: string;
  region: string;
  status: "online" | "degraded" | "offline";
  updated_at: string;
};

// --- MOCK DATA ---
const MOCK_USER_ID = "user-123";

let MOCK_PROFILE: Profile = {
  id: MOCK_USER_ID,
  full_name: "Иван Иванов",
  phone: "+7 (777) 123-4567",
  address: "г. Алматы, ул. Абая 14, кв 55",
  balance: 1500,
};

const MOCK_TARIFFS: Tariff[] = [
  {
    id: "t-1",
    name: "Интернет 100",
    speed_mbps: 100,
    price: 3500,
    description: "Надежный интернет для дома. Подходит для серфинга и видео в HD.",
    category: "internet",
  },
  {
    id: "t-2",
    name: "Геймер 500",
    speed_mbps: 500,
    price: 5990,
    description: "Максимальная скорость для стриминга и киберспорта. Низкий пинг.",
    category: "internet",
  },
  {
    id: "t-3",
    name: "Базовый ТВ",
    speed_mbps: null,
    price: 2000,
    description: "Более 120 каналов в цифровом качестве.",
    category: "tv",
  },
  {
    id: "t-4",
    name: "Вместе лучше",
    speed_mbps: null,
    price: 2500,
    description: "Мобильная связь: 20 Гб интернета, безлимит внутри сети.",
    category: "mobile",
  },
];

let MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-1",
    user_id: MOCK_USER_ID,
    tariff_id: "t-1",
    status: "active",
    next_billing_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    user_id: MOCK_USER_ID,
    amount: 3500,
    status: "success",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let MOCK_TICKETS: Ticket[] = [
  {
    id: "tick-1",
    user_id: MOCK_USER_ID,
    subject: "Проблема со скоростью вечером",
    description: "Уже несколько дней после 20:00 скорость падает до 10 Мбит/с.",
    status: "in_progress",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tick-2",
    user_id: MOCK_USER_ID,
    subject: "Настройка роутера",
    description: "Помогите настроить новый роутер.",
    status: "closed",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let MOCK_NETWORK_STATUS: NetworkStatusItem[] = [
  { id: "ns-1", region: "Алматы", status: "online", updated_at: new Date().toISOString() },
  { id: "ns-2", region: "Астана", status: "online", updated_at: new Date().toISOString() },
  { id: "ns-3", region: "Шымкент", status: "degraded", updated_at: new Date().toISOString() },
  { id: "ns-4", region: "Караганда", status: "offline", updated_at: new Date().toISOString() },
];

// --- ASYNC WRAPPERS (Simulating Supabase) ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProfile(): Promise<Profile> {
  await delay(400);
  return MOCK_PROFILE;
}

export async function addBalance(amount: number): Promise<Profile> {
  await delay(800);
  MOCK_PROFILE = { ...MOCK_PROFILE, balance: MOCK_PROFILE.balance + amount };
  
  MOCK_PAYMENTS = [
    {
      id: `pay-${Date.now()}`,
      user_id: MOCK_USER_ID,
      amount,
      status: "success",
      created_at: new Date().toISOString(),
    },
    ...MOCK_PAYMENTS,
  ];

  return MOCK_PROFILE;
}

export async function getTariffs(): Promise<Tariff[]> {
  await delay(300);
  return MOCK_TARIFFS;
}

export async function getSubscriptions(): Promise<(Subscription & { tariff: Tariff })[]> {
  await delay(500);
  return MOCK_SUBSCRIPTIONS.map((sub) => {
    const tariff = MOCK_TARIFFS.find((t) => t.id === sub.tariff_id);
    return { ...sub, tariff: tariff! };
  });
}

export async function getPayments(): Promise<Payment[]> {
  await delay(400);
  return MOCK_PAYMENTS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getTickets(): Promise<Ticket[]> {
  await delay(600);
  return MOCK_TICKETS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createTicket(subject: string, description: string): Promise<Ticket> {
  await delay(800);
  const newTicket: Ticket = {
    id: `tick-${Date.now()}`,
    user_id: MOCK_USER_ID,
    subject,
    description,
    status: "open",
    created_at: new Date().toISOString(),
  };
  MOCK_TICKETS = [newTicket, ...MOCK_TICKETS];
  return newTicket;
}

export async function getNetworkStatus(): Promise<NetworkStatusItem[]> {
  await delay(200);
  return MOCK_NETWORK_STATUS;
}
