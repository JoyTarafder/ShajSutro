import transporter from "../config/mailer";

const YEAR = new Date().getFullYear();

// ─── Shared layout shell ──────────────────────────────────────────────────────

function emailShell(bodyContent: string, previewText = ""): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>ShajSutro</title>
  ${previewText ? `<span style="display:none;max-height:0;overflow:hidden;">${previewText}</span>` : ""}
</head>
<body style="margin:0;padding:0;background-color:#f0efeb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0efeb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background-color:#111827;border-radius:12px 12px 0 0;padding:32px 48px 28px;text-align:center;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.25em;color:#9ca3af;text-transform:uppercase;">Official Communication</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:2px;color:#ffffff;">SHAJSUTRO</h1>
              <p style="margin:6px 0 0;font-size:12px;color:#6b7280;font-weight:300;letter-spacing:0.1em;">Fashion · Elegance · You</p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background-color:#ffffff;padding:44px 48px 40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="background-color:#ffffff;padding:0 48px;">
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" />
            </td>
          </tr>

          <!-- ── HELP ROW ── -->
          <tr>
            <td style="background-color:#ffffff;padding:24px 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;padding-right:24px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#374151;">Need help?</p>
                    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                      Our support team is available<br />Monday – Saturday, 10 AM – 6 PM
                    </p>
                  </td>
                  <td style="vertical-align:top;text-align:right;">
                    <a href="mailto:support@shajsutro.com" style="display:inline-block;background-color:#111827;color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.08em;text-decoration:none;padding:9px 20px;border-radius:100px;">
                      Contact Support
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#f9fafb;border-radius:0 0 12px 12px;padding:24px 48px;border-top:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding-bottom:12px;">
                    <a href="#" style="font-size:11px;color:#6b7280;text-decoration:none;margin:0 10px;">Privacy Policy</a>
                    <span style="color:#d1d5db;font-size:11px;">·</span>
                    <a href="#" style="font-size:11px;color:#6b7280;text-decoration:none;margin:0 10px;">Terms of Service</a>
                    <span style="color:#d1d5db;font-size:11px;">·</span>
                    <a href="#" style="font-size:11px;color:#6b7280;text-decoration:none;margin:0 10px;">Unsubscribe</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.7;">
                      &copy; ${YEAR} ShajSutro. All rights reserved.<br />
                      Dhaka, Bangladesh · shajsutro.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// ─── OTP code box ─────────────────────────────────────────────────────────────

function otpBox(code: string): string {
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr>
    <td align="center">
      <div style="display:inline-block;background-color:#f9fafb;border:1.5px solid #e5e7eb;border-radius:12px;padding:22px 52px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:600;letter-spacing:0.2em;color:#9ca3af;text-transform:uppercase;">Your Code</p>
        <p style="margin:0;font-size:38px;font-weight:800;letter-spacing:12px;color:#111827;font-family:'Courier New',monospace;">${code}</p>
      </div>
    </td>
  </tr>
</table>
  `.trim();
}

// ─── Info row (icon + text) ───────────────────────────────────────────────────

function infoRow(icon: string, text: string): string {
  return `
<tr>
  <td style="padding:5px 0;">
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:14px;width:22px;vertical-align:top;padding-top:1px;">${icon}</td>
        <td style="font-size:13px;color:#6b7280;line-height:1.6;padding-left:8px;">${text}</td>
      </tr>
    </table>
  </td>
</tr>
  `.trim();
}

// ─── Alert box ────────────────────────────────────────────────────────────────

function alertBox(text: string): string {
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
  <tr>
    <td style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;">
      <p style="margin:0;font-size:12px;color:#92400e;line-height:1.6;">
        <strong>⚠️ Security notice:</strong> ${text}
      </p>
    </td>
  </tr>
</table>
  `.trim();
}

// ─── Send: Email Verification ─────────────────────────────────────────────────

export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<void> => {
  const body = `
    <!-- Greeting -->
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">Verify your email address</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      Welcome to <strong style="color:#111827;">ShajSutro</strong>! You&apos;re just one step away from exploring our latest fashion collections.
      Please confirm your email address to activate your account.
    </p>

    <!-- OTP -->
    ${otpBox(code)}

    <!-- Steps -->
    <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.08em;">How to verify</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow("1️⃣", "Copy the 6-digit code shown above.")}
      ${infoRow("2️⃣", "Go back to the ShajSutro sign-up page in your browser.")}
      ${infoRow("3️⃣", "Paste or type the code in the verification field.")}
      ${infoRow("4️⃣", "Hit <strong>Verify Email</strong> — and you&apos;re all set!")}
    </table>

    <!-- Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${infoRow("⏱️", "This code is valid for <strong>10 minutes</strong> from the time this email was sent.")}
      ${infoRow("🔄", "If it expires, you can request a new one from the verification screen.")}
      ${infoRow("📧", `This code was sent to <strong>${email}</strong>.`)}
    </table>

    <!-- Security alert -->
    ${alertBox("ShajSutro will never ask for your password or payment details over email. If you did not create this account, please ignore this email — no action is required and your email address will not be used.")}
  `;

  await transporter.sendMail({
    from: `"ShajSutro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ShajSutro account",
    html: emailShell(body, "Your ShajSutro verification code is inside — valid for 10 minutes."),
  });
};

// ─── Send: Password Reset ─────────────────────────────────────────────────────

export const sendPasswordResetEmail = async (
  email: string,
  code: string
): Promise<void> => {
  const body = `
    <!-- Greeting -->
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">Reset your password</p>
    <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.7;">
      We received a request to reset the password for the ShajSutro account linked to
      <strong style="color:#111827;">${email}</strong>.
      Use the code below to create a new password.
    </p>

    <!-- OTP -->
    ${otpBox(code)}

    <!-- Steps -->
    <p style="margin:0 0 14px;font-size:13px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.08em;">How to reset</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow("1️⃣", "Copy the 6-digit code shown above.")}
      ${infoRow("2️⃣", "Return to the ShajSutro password reset page in your browser.")}
      ${infoRow("3️⃣", "Enter the code in the provided field to confirm your identity.")}
      ${infoRow("4️⃣", "Choose a strong new password (minimum 6 characters).")}
      ${infoRow("5️⃣", "Sign in with your new password — your account is secured!")}
    </table>

    <!-- Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${infoRow("⏱️", "This code expires in <strong>10 minutes</strong>. Request a new one if it runs out.")}
      ${infoRow("🔒", "After a successful reset, all existing sessions will remain active. Consider signing out of other devices.")}
      ${infoRow("💡", "Choose a unique password that you don&apos;t use on other websites.")}
    </table>

    <!-- Security alert -->
    ${alertBox("If you did NOT request a password reset, please ignore this email. Your password will not change unless you complete the reset process. If you believe your account is at risk, contact our support team immediately.")}
  `;

  await transporter.sendMail({
    from: `"ShajSutro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your ShajSutro password",
    html: emailShell(body, "Your ShajSutro password reset code is inside — valid for 10 minutes."),
  });
};
