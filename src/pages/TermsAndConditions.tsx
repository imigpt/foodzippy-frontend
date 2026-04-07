const termsAndConditionsText = `Terms and Conditions - Foodzippy App

Last Updated: April 7, 2026

1. Introduction
Welcome to Foodzippy App ("App"), operated by Foodzippy ("Company", "we", "our", "us").

These Terms and Conditions ("Terms") govern your use of the App, including all services, features, and functionalities provided through it.

By accessing or using the App, you agree to be bound by these Terms.
If you do not agree, please do not use the App.

2. Eligibility
- You must be at least 18 years old to use this App.
- By using the App, you confirm:
  - You have legal capacity to enter into a binding agreement
  - All information provided is accurate and complete

3. User Account

3.1 Account Registration
To use certain features, you must create an account using:
- Phone number (OTP verification)
- Email (optional)

3.2 Account Responsibility
You are responsible for:
- Maintaining confidentiality of your account
- All activities under your account
- Providing accurate and updated information

3.3 Account Suspension
We may suspend or terminate your account if:
- You violate these Terms
- Suspicious or fraudulent activity is detected
- False information is provided

4. Services Provided
Foodzippy provides:
- Food ordering from restaurants
- Delivery partner coordination
- Real-time order tracking
- Wallet and payment services
- Customer support and communication

Note: Foodzippy acts as an intermediary between users, restaurants, and delivery partners.

5. Orders and Payments

5.1 Order Placement
- Orders placed through the App are final once confirmed
- Ensure correct delivery address and contact details

5.2 Pricing
- Prices include taxes unless stated otherwise
- Delivery charges may apply
- Prices may vary by restaurant

5.3 Payments
Payments can be made via:
- Credit/Debit Cards
- Wallet
- Third-party gateways (Razorpay)

5.4 Failed Transactions
- If payment fails but amount is deducted:
  - Refund will be processed as per payment provider timelines

6. Cancellation and Refund Policy

6.1 Order Cancellation
- Orders can be cancelled before restaurant acceptance
- Once accepted/prepared, cancellation may not be possible

6.2 Refunds
Refunds may be issued in cases of:
- Failed delivery
- Wrong or damaged items
- Payment errors

Refund methods:
- Original payment method or wallet credit

7. Delivery Terms
- Delivery time is estimated, not guaranteed
- Delays may occur due to:
  - Traffic
  - Weather
  - Restaurant preparation time

User Responsibilities:
- Be available at delivery location
- Provide accurate address and contact details

8. User Conduct
You agree NOT to:
- Provide false or misleading information
- Abuse delivery partners or restaurant staff
- Use the App for unlawful purposes
- Attempt hacking, reverse engineering, or misuse
- Place fake or prank orders

Violation may lead to:
- Account suspension
- Legal action

9. Communication and Calls
- Calls between users and delivery partners may be facilitated
- Calls may be recorded for quality and safety
- Misuse of communication features is strictly prohibited

10. Wallet and Subscription

Wallet
- Wallet balance is non-transferable
- Cannot be exchanged for cash (unless required by law)

Subscription
- Auto-renewal may apply
- You can cancel anytime via App settings

11. Third-Party Services
We integrate third-party services including:
- Payment gateways
- Google Maps and location services
- Firebase services
- Communication platforms (Agora)

We are not responsible for:
- Failures or issues from third-party services

12. Intellectual Property
- All content in the App (logo, design, code) belongs to Foodzippy
- You may not copy, modify, or distribute without permission

13. Limitation of Liability
Foodzippy is not liable for:
- Food quality issues (responsibility of restaurants)
- Delivery delays beyond reasonable control
- Losses due to incorrect user information
- Service interruptions or technical errors

14. Indemnification
You agree to indemnify and hold Foodzippy harmless from:
- Claims arising from misuse of the App
- Violation of these Terms
- Fraudulent or illegal activity

15. Privacy
Your use of the App is also governed by our Privacy Policy.

16. Termination
We may terminate or suspend your account:
- Without prior notice for violations
- For security or legal reasons

You may stop using the App anytime.

17. Changes to Terms
- We may update these Terms periodically
- Updates will be notified via:
  - App notifications
  - Email

Continued use means acceptance of updated Terms.

18. Governing Law
- These Terms are governed by the laws of India
- Jurisdiction lies in applicable courts of India

19. Dispute Resolution
- Disputes should first be raised via support
- If unresolved, subject to legal jurisdiction in India

20. Contact Information
For support or legal queries:
- Email:
- In-App Support: Available within the App

21. Force Majeure
We are not liable for failure due to:
- Natural disasters
- Government actions
- Network or system failures
- Events beyond our control

22. Acknowledgment
By using the App, you:
- Agree to these Terms
- Confirm legal eligibility
- Accept all policies and guidelines
- Understand service limitations

23. App Information
- App Name: Foodzippy App
- Package: com.cscodetech.foodzippy
- Platform: Android (API 24+)
- Version: 1.2

END OF TERMS AND CONDITIONS
`;

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms and Conditions</h1>
        <p className="mt-2 text-gray-600 font-century-gothic">Foodzippy App</p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed font-century-gothic text-sm md:text-base">
            {termsAndConditionsText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
