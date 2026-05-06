import { randomBytes } from "crypto";

type ApiKey = {
  id: string;
  user_id: string;
  key: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
};

const fakeDb: ApiKey[] = [];

export function generateKey(): string {
  return "sk_" + randomBytes(24).toString("hex");
}

export async function createApiKey(userId: string, name: string) {
  const newKey: ApiKey = {
    id: crypto.randomUUID(),
    user_id: userId,
    key: generateKey(),
    name,
    created_at: new Date().toISOString(),
    last_used_at: null,
    is_active: true,
  };

  fakeDb.push(newKey);

  return newKey;
}

export async function listApiKeys(userId: string) {
  return fakeDb.filter((k) => k.user_id === userId);
}

export async function deleteApiKey(id: string, userId: string) {
  const index = fakeDb.findIndex(
    (k) => k.id === id && k.user_id === userId
  );

  if (index !== -1) {
    fakeDb.splice(index, 1);
  }
}

export async function validateApiKey(key: string) {
  const found = fakeDb.find(
    (k) => k.key === key && k.is_active
  );

  if (!found) return null;

  found.last_used_at = new Date().toISOString();

  return found.user_id;
}