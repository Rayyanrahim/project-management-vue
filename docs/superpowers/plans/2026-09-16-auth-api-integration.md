# Authentication API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the Vue authentication UI to every auth endpoint currently exposed by `project-management-backend`, with cookie sessions, automatic refresh, route protection, and tested error handling.

**Architecture:** Axios remains the transport boundary and normalizes all backend envelopes into data or `ApiError`. A Pinia auth store owns session state and safe profile persistence, while a small router guard module enforces guest, authenticated, and verified-user navigation. Views contain only form behavior and delegate transport/session work to the store.

**Tech Stack:** Vue 3, Vue Router, Pinia, Axios, Zod, Vitest, Vue Test Utils, TypeScript-aware JavaScript modules

**Spec:** `docs/superpowers/specs/2026-09-16-auth-api-integration-design.md`

## Global Constraints

- Integrate only the seven auth endpoints currently exposed below `/api/v1/auth`; do not invent OAuth, resend-OTP, current-user, project, task, inbox, or workspace APIs.
- Use the backend's HTTP-only cookies with `withCredentials: true`; never persist or expose passwords, OTPs, reset tokens, access tokens, or refresh tokens.
- Preserve the existing layout, reusable form components, toast system, and all unrelated uncommitted user changes.
- Accept backend validation errors whose field values are either strings or arrays of strings.
- Use the backend-configured six-digit OTP length.
- Introduce each production behavior only after a focused test fails for the expected reason.
- Completion requires the full Vitest suite, type checker, and production build to pass.

---

### Task 1: Cookie HTTP client and auth endpoint module

**Files:**
- Create: `tests/api/http.test.ts`
- Create: `tests/api/auth.test.ts`
- Modify: `src/api/http.js`
- Modify: `src/api/auth.js`

**Interfaces:**
- Produces: `ApiError`, `http`, `createHttpClient(config)`, and `configureHttpAuth({ refresh, onUnauthorized })`.
- Produces: `registerApi`, `loginApi`, `verifyOtpApi`, `refreshSessionApi`, `logoutApi`, `forgotPasswordApi`, and `resetPasswordApi`.
- API functions return `response.data.data` when present and the complete success envelope when an action has no `data`.

- [ ] **Step 1: Write failing HTTP client tests**

Use a custom Axios adapter so tests exercise interceptors without adding a mocking dependency:

```ts
import type { AxiosAdapter, AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, configureHttpAuth, createHttpClient } from '@/api/http'

const response = (config: any, status: number, data: unknown): AxiosResponse => ({
  config, status, data, statusText: String(status), headers: {},
})

describe('HTTP client', () => {
  beforeEach(() => configureHttpAuth({}))

  it('uses credentials and converts backend validation failures to ApiError', async () => {
    const adapter: AxiosAdapter = async (config) =>
      Promise.reject({
        isAxiosError: true,
        config,
        response: response(config, 422, {
          status: 'error', message: 'Validation errors found',
          messageCode: 'VALIDATION_ERROR', errors: { email: 'Email is required' },
        }),
      })
    const client = createHttpClient({ adapter })
    await expect(client.post('auth/login', {})).rejects.toMatchObject<ApiError>({
      messageCode: 'VALIDATION_ERROR', httpStatus: 422,
      errors: { email: 'Email is required' },
    })
    expect(client.defaults.withCredentials).toBe(true)
  })

  it('refreshes concurrent unauthorized requests once and retries each once', async () => {
    let authenticated = false
    const adapter = vi.fn<AxiosAdapter>(async (config) => {
      if (!authenticated) throw Object.assign(new Error('expired'), {
        isAxiosError: true,
        config,
        response: response(config, 401, { status: 'error', messageCode: 'ACCESS_TOKEN_EXPIRED' }),
      })
      return response(config, 200, { status: 'success', data: config.url })
    })
    const refresh = vi.fn(async () => { authenticated = true })
    configureHttpAuth({ refresh })
    const client = createHttpClient({ adapter })
    const results = await Promise.all([client.get('one'), client.get('two')])
    expect(refresh).toHaveBeenCalledOnce()
    expect(results.map(({ data }) => data.data)).toEqual(['one', 'two'])
  })

  it('does not loop and reports terminal refresh failure', async () => {
    const adapter: AxiosAdapter = async (config) => { throw Object.assign(new Error('unauthorized'), {
      isAxiosError: true, config,
      response: response(config, 401, { status: 'error', message: 'Session expired' }),
    }) }
    const onUnauthorized = vi.fn()
    configureHttpAuth({ refresh: vi.fn().mockRejectedValue(new Error('refresh failed')), onUnauthorized })
    await expect(createHttpClient({ adapter }).get('private')).rejects.toThrow('refresh failed')
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run the HTTP tests and confirm RED**

Run: `npm run test:unit -- tests/api/http.test.ts --run`

Expected: FAIL because the current client uses bearer-token handlers and has no refresh/retry coordination.

- [ ] **Step 3: Implement minimal cookie refresh behavior**

Refactor `src/api/http.js` so its request path no longer looks up a bearer token. Keep existing error normalization, accept string/string-array validation fields, and add:

```js
let authHandlers = {}
let refreshPromise = null

export const configureHttpAuth = (handlers = {}) => { authHandlers = handlers }

async function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = Promise.resolve(authHandlers.refresh?.()).finally(() => { refreshPromise = null })
  }
  return refreshPromise
}
```

The rejected-response interceptor must skip configs marked `skipAuthRefresh`, mark retried configs with `_authRetry`, refresh only a 401, retry the original config once, and call `onUnauthorized` only when refresh fails.

- [ ] **Step 4: Run the HTTP tests and confirm GREEN**

Run: `npm run test:unit -- tests/api/http.test.ts --run`

Expected: PASS.

- [ ] **Step 5: Write failing auth API tests**

Mock `http` and assert exact paths and payloads:

```ts
vi.mock('@/api/http', () => ({
  http: { post: vi.fn() },
}))

it.each([
  ['registerApi', 'auth/register', { name: 'A', email: 'a@example.com', password: 'password1' }],
  ['loginApi', 'auth/login', { email: 'a@example.com', password: 'password1' }],
  ['verifyOtpApi', 'auth/verify-otp', { otp: '123456' }],
  ['forgotPasswordApi', 'auth/forgot-password', { email: 'a@example.com' }],
  ['resetPasswordApi', 'auth/reset-password', { token: 'a'.repeat(64), password: 'password1', confirmPassword: 'password1' }],
])('%s posts to %s', async (exportName, path, payload) => {
  vi.mocked(http.post).mockResolvedValueOnce({ data: { status: 'success', data: { id: '1' } } })
  await (authApi as any)[exportName](payload)
  expect(http.post).toHaveBeenCalledWith(path, payload)
})
```

Add explicit assertions that refresh uses `{ skipAuthRefresh: true }`, logout posts to `auth/logout`, data responses unwrap `data`, and no-data responses preserve their message envelope.

- [ ] **Step 6: Run auth API tests and confirm RED**

Run: `npm run test:unit -- tests/api/auth.test.ts --run`

Expected: FAIL because only `loginApi` exists.

- [ ] **Step 7: Implement the seven focused API functions**

Use a shared internal unwrapping helper and pass `{ skipAuthRefresh: true }` only for `refreshSessionApi`. Do not add view or store behavior here.

- [ ] **Step 8: Run Task 1 tests and commit**

Run: `npm run test:unit -- tests/api/http.test.ts tests/api/auth.test.ts --run`

Expected: PASS.

```bash
git add src/api/http.js src/api/auth.js tests/api/http.test.ts tests/api/auth.test.ts
git commit -m "feat: add cookie auth API client"
```

---

### Task 2: Central auth session store

**Files:**
- Create: `tests/stores/auth.test.ts`
- Modify: `src/stores/auth.js`

**Interfaces:**
- Consumes: all API functions from Task 1.
- Produces state: `user`, `sessionStatus`, `loadingAction`, `isAuthenticated`, `isVerified`, `loading`.
- Produces actions: `initialize`, `register`, `login`, `verifyOtp`, `forgotPassword`, `resetPassword`, `refreshSession`, `logout`, `clearAuth`.
- Persists only the normalized user profile under `project-management.auth-profile`.

- [ ] **Step 1: Write failing store tests**

Mock `@/api/auth` and cover each state transition:

```ts
it('stores a login user without persisting verification transport data', async () => {
  vi.mocked(loginApi).mockResolvedValueOnce({
    id: '7', email: 'person@example.com', emailVerifiedAt: null,
    verification: { id: '10', status: 'PENDING' }, workspaceMemberships: [],
  })
  const store = useAuthStore()
  const result = await store.login({ email: 'person@example.com', password: 'password1' })
  expect(store.sessionStatus).toBe('authenticated')
  expect(store.user).not.toHaveProperty('verification')
  expect(result.verification.status).toBe('PENDING')
  expect(localStorage.getItem('project-management.auth-profile')).not.toContain('verification')
})

it('deduplicates initialization and validates the cached profile with refresh', async () => {
  localStorage.setItem('project-management.auth-profile', JSON.stringify({ id: '7', emailVerifiedAt: '2026-09-16' }))
  vi.mocked(refreshSessionApi).mockResolvedValue({ status: 'success' })
  const store = useAuthStore()
  await Promise.all([store.initialize(), store.initialize()])
  expect(refreshSessionApi).toHaveBeenCalledOnce()
  expect(store.sessionStatus).toBe('authenticated')
})

it('always clears local auth when remote logout fails', async () => {
  vi.mocked(loginApi).mockResolvedValueOnce({ id: '7', email: 'person@example.com' })
  vi.mocked(logoutApi).mockRejectedValueOnce(new Error('offline'))
  const store = useAuthStore()
  await store.login({ email: 'person@example.com', password: 'password1' })
  await expect(store.logout()).rejects.toThrow('offline')
  expect(store.sessionStatus).toBe('guest')
  expect(localStorage.getItem('project-management.auth-profile')).toBeNull()
})
```

Also test register, OTP replacement, forgot/reset delegation, refresh failure, and loading cleanup in `finally`.

- [ ] **Step 2: Run store tests and confirm RED**

Run: `npm run test:unit -- tests/stores/auth.test.ts --run`

Expected: FAIL because the current store only implements login and derives authentication from `user`.

- [ ] **Step 3: Implement the store state machine**

Implement explicit status rather than treating cached profile presence as authentication. Use a store-instance-local initialization promise so each Pinia instance is isolated in tests. Keep the settled promise for the lifetime of that store to prevent duplicate bootstrap calls, and centralize profile normalization:

```js
function splitAuthPayload(payload = {}) {
  const { verification, ...user } = payload
  return { user, verification }
}

function applyAuthenticatedProfile(profile) {
  user.value = profile
  sessionStatus.value = 'authenticated'
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
```

Guard JSON parsing and storage access so corrupt or unavailable browser storage never blocks authentication.

- [ ] **Step 4: Run store tests and commit**

Run: `npm run test:unit -- tests/stores/auth.test.ts --run`

Expected: PASS.

```bash
git add src/stores/auth.js tests/stores/auth.test.ts
git commit -m "feat: centralize auth session state"
```

---

### Task 3: Session wiring and route guards

**Files:**
- Create: `src/router/guards.ts`
- Create: `tests/router/guards.test.ts`
- Modify: `src/router/index.ts`
- Modify: `src/router/app.ts`
- Modify: `src/router/auth.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `useAuthStore`, `configureHttpAuth`, and Vue Router route metadata.
- Produces: `safeRedirect(value)`, `createAuthGuard(authStore)`, and installed global navigation behavior.
- Route metadata: `requiresAuth`, `guestOnly`, and `allowUnverified`.

- [ ] **Step 1: Write failing guard tests**

Exercise the guard as a pure function using route-shaped objects:

```ts
it('redirects a guest from a protected route and keeps a safe return path', async () => {
  const store = fakeStore({ sessionStatus: 'guest' })
  const result = await createAuthGuard(store)(
    { fullPath: '/inbox', meta: { requiresAuth: true }, name: 'Inbox' } as any,
  )
  expect(result).toEqual({ name: 'Login', query: { redirect: '/inbox' } })
})

it('sends an authenticated unverified user to verification', async () => {
  const store = fakeStore({ sessionStatus: 'authenticated', isVerified: false })
  expect(await createAuthGuard(store)(protectedRoute)).toEqual({ name: 'VerifyEmail' })
})

it('sends a verified user away from guest-only routes', async () => {
  const store = fakeStore({ sessionStatus: 'authenticated', isVerified: true })
  expect(await createAuthGuard(store)(guestRoute)).toEqual({ name: 'Dashboard' })
})

expect(safeRedirect('/inbox')).toBe('/inbox')
expect(safeRedirect('//evil.example')).toBeUndefined()
expect(safeRedirect('https://evil.example')).toBeUndefined()
```

Include cases for Verify Email's `requiresAuth + allowUnverified`, a verified user visiting Verify Email, and reset-password access for guests.

- [ ] **Step 2: Run guard tests and confirm RED**

Run: `npm run test:unit -- tests/router/guards.test.ts --run`

Expected: FAIL because `guards.ts` does not exist.

- [ ] **Step 3: Implement route metadata and guard helpers**

Add `meta: { requiresAuth: true }` to the app layout route, `meta: { guestOnly: true }` to login/signup/forgot/reset routes, and `meta: { requiresAuth: true, allowUnverified: true }` to Verify Email. Keep `router/index.ts` responsible only for router construction; install `router.beforeEach(createAuthGuard(authStore))` in `main.ts` after creating the Pinia-bound store.

- [ ] **Step 4: Wire HTTP refresh after Pinia creation**

Change `src/main.ts` to retain the Pinia instance, create the auth store with it, and configure:

```ts
configureHttpAuth({
  refresh: () => authStore.refreshSession(),
  onUnauthorized: () => authStore.clearAuth(),
})
```

Then install router and mount the app. Avoid importing `router` into the store.

- [ ] **Step 5: Run guard tests and commit**

Run: `npm run test:unit -- tests/router/guards.test.ts --run`

Expected: PASS.

```bash
git add src/router/guards.ts src/router/index.ts src/router/app.ts src/router/auth.ts src/main.ts tests/router/guards.test.ts
git commit -m "feat: guard authenticated routes"
```

---

### Task 4: Registration, verification, forgot-password, and reset-password forms

**Files:**
- Modify: `src/schemas/auth.js`
- Modify: `src/views/auth/Signup.vue`
- Modify: `src/views/auth/VerifyEmail.vue`
- Modify: `src/views/auth/ForgotPassword.vue`
- Modify: `src/views/auth/ConfirmPassword.vue`
- Create: `tests/auth/Signup.test.ts`
- Create: `tests/auth/VerifyEmail.test.ts`
- Create: `tests/auth/ForgotPassword.test.ts`
- Create: `tests/auth/ConfirmPassword.test.ts`

**Interfaces:**
- Consumes: store actions from Task 2 and route names from Task 3.
- Produces Zod schemas: `registerSchema`, `forgotPasswordSchema`, `verifyOtpSchema`, and `resetPasswordSchema` alongside `loginSchema`.

- [ ] **Step 1: Write failing schema and form tests**

Cover one success and the important failure behavior for each form. Representative assertions:

```ts
it('registers valid input without sending confirmPassword and opens verification', async () => {
  const register = vi.spyOn(useAuthStore(), 'register').mockResolvedValue({ user: { emailVerifiedAt: null } } as any)
  const wrapper = mountSignup()
  await fill(wrapper, { name: 'Rayyan', email: 'rayyan@example.com', password: 'password1', confirmPassword: 'password1' })
  await wrapper.get('form').trigger('submit')
  expect(register).toHaveBeenCalledWith({ name: 'Rayyan', email: 'rayyan@example.com', password: 'password1' })
  expect(push).toHaveBeenCalledWith({ name: 'VerifyEmail' })
})

it('submits the six digit OTP and shows the authenticated email', async () => {
  const store = useAuthStore()
  store.user = { email: 'rayyan@example.com' } as any
  const verifyOtp = vi.spyOn(store, 'verifyOtp').mockResolvedValue({} as any)
  const wrapper = mountVerifyEmail()
  await wrapper.get('[data-testid="pin-input"]').setValue('123456')
  await wrapper.get('form').trigger('submit')
  expect(wrapper.text()).toContain('rayyan@example.com')
  expect(verifyOtp).toHaveBeenCalledWith({ otp: '123456' })
})

it('passes the query token when resetting a matching password', async () => {
  useRouteMock.mockReturnValue({ query: { token: 'a'.repeat(64) } })
  // fill both password fields and submit
  expect(resetPassword).toHaveBeenCalledWith({
    token: 'a'.repeat(64), password: 'password1', confirmPassword: 'password1',
  })
})
```

Also assert inline `VALIDATION_ERROR` mapping, mismatched password rejection, missing reset token presentation, duplicate-submit protection, forgot-password navigation, and removal of the fake resend action.

- [ ] **Step 2: Run the four view tests and confirm RED**

Run: `npm run test:unit -- tests/auth/Signup.test.ts tests/auth/VerifyEmail.test.ts tests/auth/ForgotPassword.test.ts tests/auth/ConfirmPassword.test.ts --run`

Expected: FAIL because the views contain placeholders and schemas are missing.

- [ ] **Step 3: Add the four Zod schemas**

Use trimmed names/emails, eight-character password minimums, exactly six numeric OTP characters, a 64-character hexadecimal token, and a `superRefine` password-match issue assigned to `confirmPassword`.

- [ ] **Step 4: Implement registration and verification flows**

Refactor both views onto `useZodForm`. Map `ApiError.errors` through `setErrors`, show general errors through `FormError`/toast, and use store loading state. Verify Email reads `authStore.user.email`, uses PinInput length 6, and replaces resend with a logout-to-login action explaining that login sends a new code.

- [ ] **Step 5: Implement forgot/reset flows**

Forgot Password calls the store and routes to `LoginRecover` after the privacy-preserving success response. Confirm Password reads `route.query.token`, submits all three backend fields, shows a success toast, and routes to Login. Keep invalid/expired reset failures visible without clearing password fields until navigation.

- [ ] **Step 6: Run Task 4 tests and commit**

Run: `npm run test:unit -- tests/auth/Signup.test.ts tests/auth/VerifyEmail.test.ts tests/auth/ForgotPassword.test.ts tests/auth/ConfirmPassword.test.ts --run`

Expected: PASS.

```bash
git add src/schemas/auth.js src/views/auth/Signup.vue src/views/auth/VerifyEmail.vue src/views/auth/ForgotPassword.vue src/views/auth/ConfirmPassword.vue tests/auth
git commit -m "feat: connect account auth flows"
```

---

### Task 5: Login routing and authenticated top bar

**Files:**
- Modify: `src/views/auth/Login.vue`
- Modify: `src/components/app/AppTopbar.vue`
- Modify: `tests/Login.test.ts`
- Create: `tests/app/AppTopbar.test.ts`

**Interfaces:**
- Consumes: `safeRedirect`, auth-store `user`, `isVerified`, `loading`, and `logout`.
- Produces: verified/unverified login routing and real profile/workspace display with functional logout.

- [ ] **Step 1: Extend login tests and confirm RED**

Add tests that an unverified result routes to Verify Email, a verified result honors only a safe `redirect` query, and an unsafe redirect falls back to Dashboard:

```ts
expect(push).toHaveBeenCalledWith({ name: 'VerifyEmail' })
expect(push).toHaveBeenCalledWith('/inbox')
expect(push).toHaveBeenCalledWith({ name: 'Dashboard' })
```

Run: `npm run test:unit -- tests/Login.test.ts --run`

Expected: FAIL because Login always routes to Dashboard.

- [ ] **Step 2: Implement login branching and confirm GREEN**

Use the store action result for verification state and `safeRedirect(route.query.redirect)` for the post-login target. Preserve the existing validation-error toast and inline-field behavior.

- [ ] **Step 3: Write failing top-bar tests**

Set a store user with name/email/workspace memberships, mount the component, and assert rendered workspace name, email, derived initial, disabled duplicate logout, local cleanup, and `router.replace({ name: 'Login' })`.

- [ ] **Step 4: Run top-bar tests and confirm RED**

Run: `npm run test:unit -- tests/app/AppTopbar.test.ts --run`

Expected: FAIL because the current component contains static identity labels and an inert logout item.

- [ ] **Step 5: Implement top-bar identity and logout**

Derive display values with computed properties and connect the existing Logout dropdown item. If remote logout rejects, show an informational/error toast but still navigate to Login because the store guarantees local cleanup.

- [ ] **Step 6: Run Task 5 tests and commit**

Run: `npm run test:unit -- tests/Login.test.ts tests/app/AppTopbar.test.ts --run`

Expected: PASS.

```bash
git add src/views/auth/Login.vue src/components/app/AppTopbar.vue tests/Login.test.ts tests/app/AppTopbar.test.ts
git commit -m "feat: complete authenticated navigation"
```

---

### Task 6: Integration verification and configuration documentation

**Files:**
- Modify: `README.md`
- Modify only if required by verified failures: files changed in Tasks 1-5

**Interfaces:**
- Documents the required frontend/backend origins and cookie prerequisites.
- Produces no new runtime interface.

- [ ] **Step 1: Run the complete unit suite**

Run: `npm run test:unit -- --run`

Expected: all tests PASS with no unhandled rejections or Vue warnings caused by the auth integration.

- [ ] **Step 2: Run static and production checks**

Run: `npm run type-check`

Expected: PASS.

Run: `npm run build-only`

Expected: PASS.

- [ ] **Step 3: Add concise local setup documentation**

Document:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1/
```

State that the backend must allow `http://localhost:5173` with credentials, frontend/backend should use the same hostname, and both services require HTTPS in production for secure cookies.

- [ ] **Step 4: Re-run final verification**

Run: `npm run test:unit -- --run`

Run: `npm run type-check`

Run: `npm run build-only`

Expected: all three commands exit 0.

- [ ] **Step 5: Inspect the final diff and commit**

Run: `git diff --check`

Expected: no whitespace errors.

Confirm `git status --short` contains no accidental backend, environment, generated, distribution, or unrelated user files staged by this work.

```bash
git add README.md
git commit -m "docs: document auth API setup"
```
