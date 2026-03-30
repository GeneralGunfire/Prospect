import { test, expect, type Page } from '@playwright/test';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Navigate to the auth page by clicking the header CTA */
async function goToAuth(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Quiz' }).first().click();
  await expect(page.getByRole('heading', { name: 'Prospect' })).toBeVisible();
}

/** Switch to Sign Up tab */
async function switchToSignUp(page: Page) {
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
}

/** Switch to Log In tab */
async function switchToLogIn(page: Page) {
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByRole('button', { name: 'Log In' }).nth(1)).toBeVisible();
}

// Unique email so re-runs don't hit duplicate-email errors
function uniqueEmail() {
  return `test_${Date.now()}@test.com`;
}

const STRONG_PASSWORD = 'Test@1234'; // length + upper + lower + number + special

// ─── 1. Page Load & Navigation ─────────────────────────────────────────────

test.describe('Page load & navigation', () => {
  test('auth page loads from "Start Quiz" CTA', async ({ page }) => {
    await goToAuth(page);
    await expect(page.getByText('Know your path')).toBeVisible();
  });

  test('auth page loads from hero "Explore Careers" CTA', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Explore Careers' }).click();
    await expect(page.getByRole('heading', { name: 'Prospect' })).toBeVisible();
  });

  test('"Back to home" returns to landing page', async ({ page }) => {
    await goToAuth(page);
    await page.getByRole('button', { name: 'Back to home' }).click();
    await expect(page.getByRole('heading', { name: /Find Your Career/i })).toBeVisible();
  });

  test('Log In tab is active by default', async ({ page }) => {
    await goToAuth(page);
    // The submit button inside the login form should be visible
    const loginBtn = page.getByRole('button', { name: 'Log In' }).nth(1);
    await expect(loginBtn).toBeVisible();
  });
});

// ─── 2. Toggle Between Modes ───────────────────────────────────────────────

test.describe('Login ↔ Sign Up toggle', () => {
  test('switches to Sign Up form', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await expect(page.getByPlaceholder('Thabo Nkosi')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('switches back to Login form', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await switchToLogIn(page);
    await expect(page.getByRole('button', { name: 'Log In' }).nth(1)).toBeVisible();
    // Sign-up-specific field should be gone
    await expect(page.getByPlaceholder('Thabo Nkosi')).not.toBeVisible();
  });

  test('"Sign up free" link inside login form switches modes', async ({ page }) => {
    await goToAuth(page);
    await page.getByRole('button', { name: 'Sign up free' }).click();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('"Log in" link inside signup form switches modes', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('button', { name: 'Log In' }).nth(1)).toBeVisible();
  });
});

// ─── 3. Email Validation (permissive format) ───────────────────────────────

test.describe('Email format validation', () => {
  const cases = [
    { email: 'test@test.com', valid: true },
    { email: 'anything@anything.com', valid: true },
    { email: 'user@domain.co.za', valid: true },
    { email: 'a@b', valid: true },            // something@something — should pass
    { email: 'noatsign.com', valid: false },
    { email: 'missing@', valid: false },
    { email: '@nodomain', valid: false },
    { email: '   @space.com', valid: false }, // leading space
  ];

  for (const { email, valid } of cases) {
    test(`"${email}" is ${valid ? 'accepted' : 'rejected'}`, async ({ page }) => {
      await goToAuth(page);
      await page.locator('input[type="email"]').fill(email);
      await page.locator('input[type="password"]').fill('dummy');
      await page.getByRole('button', { name: 'Log In' }).nth(1).click();

      if (valid) {
        // No email field error shown
        await expect(page.getByText('Enter a valid email.')).not.toBeVisible();
      } else {
        await expect(page.getByText('Enter a valid email.')).toBeVisible();
      }
    });
  }
});

// ─── 4. Password Show/Hide ─────────────────────────────────────────────────

test.describe('Password show/hide toggle', () => {
  test('password is hidden by default on login form', async ({ page }) => {
    await goToAuth(page);
    const input = page.locator('#login-password');
    await expect(input).toHaveAttribute('type', 'password');
  });

  test('clicking eye icon reveals password on login form', async ({ page }) => {
    await goToAuth(page);
    const input = page.locator('#login-password');
    await input.fill('MySecret1!');
    // The toggle button is the sibling button inside the same relative wrapper
    await input.locator('..').getByRole('button').click();
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('password is hidden by default on signup form', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await expect(page.locator('#signup-password')).toHaveAttribute('type', 'password');
    await expect(page.locator('#confirm-password')).toHaveAttribute('type', 'password');
  });

  test('clicking eye icon reveals signup password', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    const input = page.locator('#signup-password');
    await input.fill('MySecret1!');
    await input.locator('..').getByRole('button').click();
    await expect(input).toHaveAttribute('type', 'text');
  });
});

// ─── 5. Password Strength Indicator ───────────────────────────────────────

test.describe('Password strength indicator', () => {
  test('strength bar is hidden when password field is empty', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await expect(page.getByText('weak')).not.toBeVisible();
    await expect(page.getByText('medium')).not.toBeVisible();
    await expect(page.getByText('strong')).not.toBeVisible();
  });

  test('shows "weak" for short/simple password', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.locator('#signup-password').fill('abc');
    await expect(page.getByText('weak')).toBeVisible();
  });

  test('shows "medium" for moderately complex password', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.locator('#signup-password').fill('Abcdef1');
    await expect(page.getByText('medium')).toBeVisible();
  });

  test('shows "strong" for fully complex password', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await expect(page.getByText('strong')).toBeVisible();
  });

  test('all 5 requirement checkmarks appear for strong password', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await expect(page.getByText('8+ characters')).toBeVisible();
    await expect(page.getByText('Uppercase letter')).toBeVisible();
    await expect(page.getByText('Lowercase letter')).toBeVisible();
    await expect(page.getByText('Number')).toBeVisible();
    await expect(page.getByText('Special character')).toBeVisible();
  });
});

// ─── 6. Login Form Validation ──────────────────────────────────────────────

test.describe('Login form validation', () => {
  test('shows required errors when submitting empty form', async ({ page }) => {
    await goToAuth(page);
    await page.getByRole('button', { name: 'Log In' }).nth(1).click();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('clears email error as user types', async ({ page }) => {
    await goToAuth(page);
    await page.getByRole('button', { name: 'Log In' }).nth(1).click();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await page.locator('input[type="email"]').fill('a');
    await expect(page.getByText('Email is required.')).not.toBeVisible();
  });
});

// ─── 7. Sign Up Form Validation ────────────────────────────────────────────

test.describe('Sign up form validation', () => {
  test('shows required errors when submitting empty form', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Full name is required.')).toBeVisible();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('rejects weak password on submit', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByPlaceholder('Thabo Nkosi').fill('Test User');
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('#signup-password').fill('abc');
    await page.locator('#confirm-password').fill('abc');
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Password is too weak.')).toBeVisible();
  });

  test('rejects mismatched passwords', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByPlaceholder('Thabo Nkosi').fill('Test User');
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill('Different@99');
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Passwords do not match.')).toBeVisible();
  });

  test('requires terms checkbox to be checked', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByPlaceholder('Thabo Nkosi').fill('Test User');
    await page.locator('input[type="email"]').fill(uniqueEmail());
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill(STRONG_PASSWORD);
    // Leave checkbox unchecked
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('You must accept the terms')).toBeVisible();
  });
});

// ─── 8. Remember Me & Forgot Password ─────────────────────────────────────

test.describe('Remember me & forgot password', () => {
  test('"Forgot password?" opens reset form', async ({ page }) => {
    await goToAuth(page);
    await page.getByRole('button', { name: 'Forgot password?' }).click();
    await expect(page.getByText('Reset your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
  });

  test('"Back to Login" from forgot form returns to login', async ({ page }) => {
    await goToAuth(page);
    await page.getByRole('button', { name: 'Forgot password?' }).click();
    await page.getByRole('button', { name: /Back to Login/i }).click();
    await expect(page.getByRole('button', { name: 'Log In' }).nth(1)).toBeVisible();
  });

  test('remember me checkbox can be toggled', async ({ page }) => {
    await goToAuth(page);
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });
});

// ─── 9. Live Auth Tests (require running Supabase project) ─────────────────
// These tests hit the real Supabase backend.
// They are tagged @live so they can be skipped in CI without Supabase access:
//   npx playwright test --grep-invert @live

test.describe('Live Supabase — Sign Up flow @live', () => {
  let testEmail: string;

  test.beforeEach(() => {
    testEmail = uniqueEmail();
  });

  test('successfully signs up with test@test.com format email', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);

    await page.getByPlaceholder('Thabo Nkosi').fill('Test Student');
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill(STRONG_PASSWORD);
    await page.locator('input[type="checkbox"]').check();

    await page.getByRole('button', { name: 'Create Account' }).click();

    // Either success banner OR direct redirect to dashboard
    await expect(
      page.getByText(/Account created|Welcome/).or(page.getByText('Your career journey starts here'))
    ).toBeVisible({ timeout: 12_000 });
  });

  test('no rate-limit error on first signup attempt', async ({ page }) => {
    await goToAuth(page);
    await switchToSignUp(page);

    await page.getByPlaceholder('Thabo Nkosi').fill('Rate Test');
    await page.locator('input[type="email"]').fill(uniqueEmail());
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill(STRONG_PASSWORD);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText(/Too many attempts|rate limit/i)).not.toBeVisible({ timeout: 8_000 });
  });

  test('shows "Email already in use" for duplicate signup', async ({ page }) => {
    // First signup
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByPlaceholder('Thabo Nkosi').fill('First User');
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill(STRONG_PASSWORD);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(
      page.getByText(/Account created|Welcome|career journey/i)
    ).toBeVisible({ timeout: 12_000 });

    // Sign out and try same email again
    if (await page.getByRole('button', { name: 'Log Out' }).isVisible()) {
      await page.getByRole('button', { name: 'Log Out' }).click();
    }
    await page.getByRole('button', { name: 'Start Quiz' }).first().click();
    await switchToSignUp(page);

    await page.getByPlaceholder('Thabo Nkosi').fill('Duplicate User');
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill(STRONG_PASSWORD);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText(/Email already in use/i)).toBeVisible({ timeout: 8_000 });
  });

  test('successfully logs in after signing up', async ({ page }) => {
    // Sign up first
    await goToAuth(page);
    await switchToSignUp(page);
    await page.getByPlaceholder('Thabo Nkosi').fill('Login Test');
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('#signup-password').fill(STRONG_PASSWORD);
    await page.locator('#confirm-password').fill(STRONG_PASSWORD);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText(/career journey/i)).toBeVisible({ timeout: 12_000 });

    // Sign out
    await page.getByRole('button', { name: 'Log Out' }).click();

    // Log back in
    await page.getByRole('button', { name: 'Start Quiz' }).first().click();
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('#login-password').fill(STRONG_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).nth(1).click();

    await expect(page.getByText(/Welcome back|career journey/i)).toBeVisible({ timeout: 12_000 });
  });

  test('shows friendly error for wrong credentials', async ({ page }) => {
    await goToAuth(page);
    await page.locator('input[type="email"]').fill('nobody@test.com');
    await page.locator('#login-password').fill('WrongPass1!');
    await page.getByRole('button', { name: 'Log In' }).nth(1).click();
    await expect(
      page.getByText(/Incorrect email or password/i)
    ).toBeVisible({ timeout: 8_000 });
  });
});

// ─── 10. Responsive / Mobile ───────────────────────────────────────────────

test.describe('Responsive layout', () => {
  test('auth card is full-width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToAuth(page);
    const card = page.locator('.rounded-3xl').first();
    const box = await card.boundingBox();
    expect(box!.width).toBeGreaterThan(340); // nearly full width on 390px
  });

  test('auth card is centered and constrained on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await goToAuth(page);
    const card = page.locator('.rounded-3xl').first();
    const box = await card.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(448); // max-w-md = 448px
    // Horizontally centered: left margin roughly equal to right margin
    const leftGap = box!.x;
    const rightGap = 1280 - box!.x - box!.width;
    expect(Math.abs(leftGap - rightGap)).toBeLessThan(10);
  });
});
