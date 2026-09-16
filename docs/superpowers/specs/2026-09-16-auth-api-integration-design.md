# Authentication API Integration Design

## Goal

Integrate every authentication endpoint currently exposed by the sibling `project-management-backend` into the Vue application, using the frontend's existing Axios, Pinia, Zod, router, form, and toast patterns.

The completed flow covers registration, login, email OTP verification, forgotten-password requests, password reset, access-token refresh, logout, session bootstrap, protected routes, guest-only routes, and authenticated user/workspace display.

## Scope

### Included

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- Cookie-based session restoration and access-token refresh
- Auth and guest route guards
- Backend validation and general error presentation
- User and workspace data in the application top bar
- Automated tests for the HTTP client, store, router guards, and auth views

### Excluded

- Google or GitHub authentication, because the backend exposes no OAuth endpoints
- OTP resend, because the backend exposes no resend endpoint and the frontend must never retain a password to repeat login
- Project, task, inbox, or workspace mutation APIs, because the backend currently exposes authentication routes only
- Backend changes

## Existing Backend Contract

All endpoints use JSON request and response bodies under `/api/v1/auth`. Authentication is held in HTTP-only `accessToken` and `refreshToken` cookies. Frontend requests therefore use `withCredentials: true` and never read, store, or attach JWTs.

Successful responses follow this shape:

```js
{
  status: 'success',
  message: 'Human-readable message',
  messageCode: 'MACHINE_READABLE_CODE',
  data: {} // omitted for refresh, logout, forgot password, and reset password
}
```

Error responses follow this shape:

```js
{
  status: 'error',
  message: 'Human-readable message',
  messageCode: 'MACHINE_READABLE_CODE',
  errors: { field: 'Field-specific message' } // validation failures only
}
```

Login, registration, and OTP verification return a user-shaped `data` object. It includes workspace memberships and may include a `verification` property. The frontend normalizes that response in the API/store boundary so views do not depend on transport details.

## Architecture

### HTTP Client

`src/api/http.js` remains the shared Axios boundary. It will:

- use `VITE_API_BASE_URL`, JSON headers, a 15-second timeout, and `withCredentials: true`;
- normalize Axios failures and backend error envelopes into `ApiError`;
- preserve `messageCode`, HTTP status, field errors, response data, and the original cause;
- retry a failed authenticated request once after a successful refresh;
- coordinate concurrent expired requests through one shared refresh promise;
- never refresh the refresh request itself or retry a request more than once;
- notify the auth store when refresh fails so local session state is cleared.

The existing bearer-token request interceptor will be removed because it conflicts with the backend's HTTP-only cookie contract.

### Auth API Module

`src/api/auth.js` owns endpoint paths and request/response unwrapping. It exports one function per backend operation:

- `registerApi(payload)`
- `loginApi(payload)`
- `verifyOtpApi(payload)`
- `refreshSessionApi()`
- `logoutApi()`
- `forgotPasswordApi(payload)`
- `resetPasswordApi(payload)`

Views call store actions rather than importing these functions directly.

### Auth Store

`src/stores/auth.js` is the single source of truth for frontend session state. It owns:

- the normalized user profile;
- an explicit session status: `unknown`, `authenticated`, or `guest`;
- per-operation loading state;
- a one-time initialization promise to prevent duplicate bootstrap calls;
- safe profile persistence for display continuity only.

Only the non-sensitive user response is cached. Cookies remain the authority for authentication. Passwords, OTPs, reset tokens, access tokens, and refresh tokens are never persisted.

On bootstrap, the store calls refresh. Success marks the session authenticated and reuses cached display data; failure clears the cache and marks it guest. This is the strongest restoration supported by the current backend because refresh returns no user and no current-user endpoint exists.

Login and registration store the user response. Unverified users proceed to email verification; verified users proceed to the dashboard. OTP verification replaces the stored user with the verified response. Logout calls the backend when possible and always clears local session state in a `finally` path.

### HTTP/Store Wiring

`src/main.ts` configures HTTP auth callbacks after Pinia is active and before the app mounts. The HTTP layer can request refresh and report terminal unauthorized failures without importing the store directly, avoiding circular dependencies between `http.js`, `auth.js`, and `auth.js` store modules.

### Router Guards

App routes receive `meta.requiresAuth: true`. Auth routes receive `meta.guestOnly: true`, except email verification, which is available only to an authenticated but unverified session.

A global guard initializes the auth store once, then applies these rules:

- guests visiting protected pages go to Login with a safe internal redirect query;
- authenticated unverified users visiting application pages go to Verify Email;
- authenticated verified users visiting guest-only pages go to Dashboard;
- successful login honors a valid internal redirect and otherwise uses Dashboard;
- reset-password links remain accessible through the `token` query parameter.

Redirect values beginning with a single `/` are accepted. Absolute or protocol-relative URLs are rejected to prevent open redirects.

## User Flows

### Registration

The sign-up form validates name, email, password, and confirmed password. It calls `register`, maps backend validation failures to matching fields, shows non-field failures clearly, stores the returned user, and navigates to Verify Email.

### Login

The existing login validation and error presentation remain. A successful verified login navigates to the intended protected page or Dashboard. A successful unverified login navigates to Verify Email, because the backend generates a new OTP on login.

### Email Verification

The screen shows the current user's email rather than a hard-coded address. It submits the backend-configured six-digit OTP through `verifyOtp`, then navigates to Dashboard. The unsupported resend link is replaced with guidance to log in again for a new code and an action that logs out before returning to Login.

### Forgotten Password

The form validates email, calls `forgotPassword`, and always presents the backend's privacy-preserving success copy before routing to the existing inbox confirmation screen.

### Reset Password

The reset screen reads the token from the route query and validates token presence, password length, and password confirmation. A successful reset shows a success toast and routes to Login. Invalid or expired token errors remain on the page with a clear route back to requesting another link.

### Logout

The top-bar Logout item calls the store action, displays progress safely, clears local state even if the remote session is already invalid, and replaces the current route with Login.

## UI Integration

Auth forms reuse `useZodForm`, `FormError`, `Button`, `Input`, and the existing toast service. Each form:

- disables duplicate submissions;
- exposes loading state through the button;
- maps `VALIDATION_ERROR` fields inline;
- uses the backend message for actionable failures;
- uses a stable fallback message for network or unexpected failures;
- clears obsolete submission errors on the next attempt.

The top bar derives initials, email, and the first workspace name from the auth store. Static fallback labels are removed. Existing layout and visual styling remain unchanged except where necessary to represent loading/error states.

## Error Handling

`ApiError` is the only error type the UI needs to understand. The API boundary accepts both string and string-array field errors because the backend validator currently emits strings while other APIs may emit arrays.

Refresh behavior is limited to authentication failures indicating an expired or missing session. Login/register validation failures are never refreshed. A failed refresh clears local auth state once; it does not create retry loops or duplicate logout/navigation events.

Network errors preserve a useful fallback message. Forms keep user-entered non-secret values after failure but never persist secret fields.

## Testing Strategy

Vitest and Vue Test Utils cover behavior at four boundaries:

1. HTTP tests verify response normalization, cookie configuration, one-time retry, single-flight refresh, and terminal refresh failure.
2. Store tests verify user normalization, state transitions, safe caching, initialization deduplication, verified/unverified branching data, and guaranteed local logout.
3. Router tests verify guest, unverified, verified, reset-link, and safe-redirect behavior.
4. View tests verify submitted payloads, navigation, inline backend errors, loading protection, query-token handling, and top-bar logout/user rendering.

Tests mock only network and router boundaries. Store and form behavior is exercised through real production code. Each behavior is introduced test-first and the complete suite, type checker, and production build must pass before completion.

## Operational Requirements

- `VITE_API_BASE_URL` must point to the backend API prefix, normally `http://localhost:3000/api/v1/`.
- The backend CORS origin must match the frontend origin and allow credentials.
- Browser requests and backend cookies must use compatible hostnames; mixing `localhost` and `127.0.0.1` can prevent cookie behavior.
- Production must serve both applications over HTTPS so secure cookies can be enabled safely.

## Acceptance Criteria

- Every currently available backend auth endpoint is reachable through a focused frontend API function and store action.
- A user can register, verify email, log in, request a password reset, reset the password, and log out through the UI.
- Expired access cookies refresh once and the original request retries once without loops.
- Protected and guest routes enforce session and email-verification state.
- Backend field validation appears beside the correct input; general failures remain understandable.
- The top bar displays real authenticated user/workspace information.
- No password, OTP, reset token, access token, or refresh token is persisted by frontend code.
- Existing unrelated working-tree changes remain intact.
- Unit tests, type checking, and the production build pass.
