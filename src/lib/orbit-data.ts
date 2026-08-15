export type Role = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

export type Session = {
  id: string;
  title: string;
  tag: string;
  group: string;
  preview: string;
};

export const SESSIONS: Session[] = [
  {
    id: "s1",
    title: "Refactor auth middleware",
    tag: "backend",
    group: "Today",
    preview: "Split token verification into its own module",
  },
  {
    id: "s2",
    title: "Streaming diff viewer",
    tag: "ui",
    group: "Today",
    preview: "Virtualized rows with sticky hunk headers",
  },
  {
    id: "s3",
    title: "Flaky e2e in checkout",
    tag: "tests",
    group: "Yesterday",
    preview: "Race between cart hydration and the stub",
  },
  {
    id: "s4",
    title: "Postgres index review",
    tag: "db",
    group: "Yesterday",
    preview: "Composite index on (org_id, created_at)",
  },
  {
    id: "s5",
    title: "Worker cold start budget",
    tag: "perf",
    group: "Last 7 days",
    preview: "Trim the bundle to 480kb",
  },
  {
    id: "s6",
    title: "Rewrite CLI arg parser",
    tag: "tooling",
    group: "Last 7 days",
    preview: "Drop the dependency, 60 lines instead",
  },
];

export const MODELS = [
  { id: "orbit-sonnet", label: "Orbit Sonnet" },
  { id: "orbit-opus", label: "Orbit Opus" },
  { id: "orbit-mini", label: "Orbit Mini" },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Our rate limiter drops bursts. Can you make it token bucket instead?",
  },
  {
    id: "m2",
    role: "assistant",
    content: `Yes — the current fixed-window counter resets hard on the boundary, so a burst that straddles two windows gets rejected while a slow client sails through. A token bucket smooths that out.

Here's the replacement:

\`\`\`ts
export class TokenBucket {
  private tokens: number;
  private last = Date.now();

  constructor(
    private capacity: number,
    private refillPerSecond: number,
  ) {
    this.tokens = capacity;
  }

  take(cost = 1): boolean {
    const now = Date.now();
    this.tokens = Math.min(
      this.capacity,
      this.tokens + ((now - this.last) / 1000) * this.refillPerSecond,
    );
    this.last = now;

    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }
}
\`\`\`

Three things to decide before this ships:

1. **Capacity** — how large a burst you want to forgive, independent of sustained rate.
2. **Storage** — in-memory works per instance; Redis if you run more than one.
3. **Cost weighting** — expensive endpoints can take more than one token.`,
  },
  {
    id: "m3",
    role: "user",
    content: "Use Redis. We run four instances behind the load balancer.",
  },
  {
    id: "m4",
    role: "assistant",
    content: `Then the refill has to be atomic, otherwise four instances read the same token count and all four allow the request. A Lua script keeps it to a single round trip:

\`\`\`lua
local tokens = tonumber(redis.call("HGET", KEYS[1], "tokens") or ARGV[1])
local last   = tonumber(redis.call("HGET", KEYS[1], "last")   or ARGV[4])
local delta  = math.max(0, ARGV[4] - last) / 1000
tokens = math.min(ARGV[1], tokens + delta * ARGV[2])

if tokens < ARGV[3] then return 0 end
redis.call("HSET", KEYS[1], "tokens", tokens - ARGV[3], "last", ARGV[4])
redis.call("PEXPIRE", KEYS[1], 60000)
return 1
\`\`\`

Pass the clock in from the caller rather than using \`TIME\` inside the script — that keeps it replica-safe and makes the whole thing trivial to test.`,
  },
];
