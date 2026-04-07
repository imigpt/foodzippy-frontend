const privacyPolicyText = `Privacy Policy - Foodzippy Customer App

Last Updated: April 7, 2026

1. Introduction
Foodzippy ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application Foodzippy Customer App (the "App"), including any related features, functionality, and services we provide through the App.

Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our App.

2. Information We Collect

2.1 Information You Provide Directly
We collect information you voluntarily provide when you:

User Account Registration
- Personal Identification Data:
  - Full name
  - Phone number (mobile)
  - Email address
  - Country code
  - Date of birth (optional)

Profile Information
- Profile picture
- Delivery address(es)
- Address type (Home, Work, Others)
- Residential details (house number, landmark)
- Latitude and longitude coordinates of delivery locations

Order Information
- Food items ordered
- Restaurant selection
- Order history and status
- Special instructions or notes
- Delivery preferences

Payment Information
- Credit/Debit card details
- PayPal account information
- Razorpay payment credentials
- Stripe payment token
- Paystack payment information
- Wallet balance and transactions
- Payment method preferences
- Subscription details

Communications
- Customer support inquiries
- Feedback and ratings
- Reviews for restaurants and food items
- Messages and inquiries sent through the App

Account Settings
- Preferred language
- Notification preferences
- Currency selection
- Device information
- Wallet and money-related settings

2.2 Information Collected Automatically

Location Data
- GPS/Fine Location: Real-time GPS coordinates when you enable location services
- Coarse Location: Approximate location based on network information
- Address History: Previously saved and used delivery addresses

Device Information
- Device type and model
- Operating system and version
- Device identifiers (IMEI, Android ID)
- App version
- Device manufacturer

Network Information
- IP address
- Network connectivity status
- Network type (WiFi, mobile data)

Usage Data
- Features accessed within the App
- Duration of App usage
- Restaurants viewed
- Products searched
- Cart items added/removed
- Order frequency and patterns
- Click-through patterns
- Pages or features accessed
- Time spent on specific sections

Camera and Microphone Data
- Camera access for QR code scanning
- Microphone access for voice calls (when calling delivery partners or restaurants)

Recording Data
- Audio recording for voice calls with delivery partners or restaurant staff
- Call duration and frequency

Call Phone Data
- Phone number of delivery partners
- Phone number of restaurants
- Call initiation and logs

2.3 Third-Party Information
We may receive information about you from:
- Payment Processors: Transaction history and payment status
- Analytics Providers: Aggregated usage statistics
- Firebase Services: User activity and crash reporting
- Location Services: Google Play Services location data
- Restaurants: Dietary preferences or allergies you may have shared
- Social Media (if applicable): If you link social accounts to your profile

3. How We Use Your Information
We use the collected information for the following purposes:

3.1 Service Delivery
- Processing and fulfilling your food orders
- Managing delivery routes and rider assignments
- Tracking real-time order status via WebSocket connections
- Calculating estimated delivery times
- Communicating order updates and status
- Route optimization using Google Maps API

3.2 Account Management
- Creating and maintaining your user account
- Authenticating your identity during login
- Resetting passwords and recovering accounts
- Updating account preferences and settings
- Managing subscription services

3.3 Location Services
- Determining your location for restaurant suggestions
- Finding nearby restaurants and delivery partners
- Calculating delivery distance and cost
- Providing location-based recommendations
- Real-time rider tracking during active deliveries
- Address validation and mapping

3.4 Payment Processing
- Processing payments via multiple payment gateways:
  - PayPal
  - Razorpay
  - Stripe
  - Paystack
- Managing wallet transactions
- Processing refunds
- Handling payment-related disputes
- Generating billing and transaction records

3.5 Communication
- Sending order confirmation emails and SMS
- Push notifications for order updates via Firebase Cloud Messaging (FCM)
- Notifications for offers, promotions, and deals
- Responding to customer support queries
- Sending newsletters and marketing communications (with opt-in)
- Call initiation between customers and delivery partners/restaurants

3.6 Quality and Improvement
- Analyzing App usage patterns
- Identifying bugs and technical issues
- Improving App UI/UX
- Developing new features
- Generating analytics and business insights
- Testing new functionality
- Performing A/B testing

3.7 Safety and Security
- Preventing fraudulent transactions
- Detecting unauthorized access attempts
- Protecting against security threats
- Complying with legal obligations
- Storing server access logs
- Monitoring WebSocket connections for reliability

3.8 Marketing and Personalization
- Displaying personalized food recommendations
- Offering targeted promotions and discounts
- Creating user segments based on preferences
- Sending targeted marketing communications
- Analyzing customer behavior for business strategy

3.9 Voice Calls
- Enabling voice calls between customers and delivery partners
- Using Agora RTC SDK for audio transmission
- Recording call details for quality assurance
- Storing call history for customer service

3.10 Real-Time Tracking
- Providing live rider location tracking
- Updating delivery status in real-time
- WebSocket-based live location updates
- Route polyline visualization on maps

4. Legal Basis for Processing
We process your personal data based on:
- Contractual Necessity: Information required to fulfill your orders and provide services
- Consent: For marketing communications and optional features
- Legal Obligation: Compliance with applicable laws and regulations
- Legitimate Business Interest: Service improvement, fraud prevention, and security
- User Consent: For location services and permissions explicitly granted

5. Third-Party Data Sharing

5.1 Mandatory Data Sharing
We share your information with:

Payment Processors
- Razorpay: Payment processing and verification
- Stripe: Card payment handling
- PayPal: Alternative payment processing
- Paystack: Payment gateway services
- Information Shared: Card details, payment amount, transaction ID, customer email

Location and Mapping Services
- Google Play Services: Location data for GPS functionality
- Google Maps API: Route calculation and restaurant location mapping
- Information Shared: Current coordinates, destination address

Cloud Services
- Firebase (Google): Real-time database, authentication, messaging
- Firebase Database: Order data, user preferences, real-time updates
- Firebase Analytics: Usage patterns and crash reports
- Information Shared: App activity, crash logs, user ID, analytics data

Voice Communication
- Agora RTC: Real-time voice call transmission
- Information Shared: Audio stream, call duration, participant IDs
- Note: Calls are transmitted in real-time; minimal data stored

Delivery Partners
- Your name, phone number, delivery address
- Order details and special instructions
- Current location (real-time)
- Preferred contact method

Restaurants
- Your delivery address
- Order details and preferences
- Special dietary requirements
- Phone number for delivery coordination

Push Notification Services
- OneSignal and Firebase Cloud Messaging (FCM): Push notification delivery
- Information Shared: Device token, user ID, delivery status

5.2 Optional Data Sharing
- Analytics Partners: Aggregated, anonymized usage data
- Social Media: If you choose to link your social account
- Business Partners: Only with explicit user consent for special offers

5.3 Data NOT Shared
- Credit/debit card numbers (stored only by payment processors)
- Passwords (encrypted and never shared)
- Biometric data (if any)
- Full transaction history (shared only with authorized payment processors)

6. Data Storage and Security

6.1 Storage Location
- Primary Storage: Backend servers at http://zippy.truebasket.in/
- Firebase Database: Google Cloud infrastructure (Asia Southeast 1 region)
- Local Device Storage: SharedPreferences and local cache
- Geographic: Data may be stored in compliance with applicable data residency laws

6.2 Security Measures
- Encryption: HTTPS/TLS for data in transit
- Authentication: Firebase Authentication with phone number verification
- Access Control: Role-based access to sensitive data
- Password Hashing: Secure algorithms for password storage
- Session Management: Secure session tokens
- Firewall Protection: Server-side security measures
- API Logging: OkHttp interceptors for monitoring
- Code Obfuscation: ProGuard rules for release builds

6.3 Data Retention
- Order History: 6 years (for accounting/compliance)
- User Account: Until deletion requested
- Location History: 30 days (for completed deliveries)
- Payment Records: 7 years (per regulatory requirements)
- FCM Tokens: Until device unregistration
- Chat/Support Messages: 1 year (then archived)
- Call Logs: 90 days
- Device Analytics: 35 days

7. Your Privacy Rights

7.1 Access
- Right to access your personal data stored with us
- Request data export in machine-readable format

7.2 Correction
- Right to correct inaccurate information
- Update your profile at any time through App settings

7.3 Deletion
- Right to request deletion of your account and associated data
- Some data may be retained for legal/compliance purposes
- Contact: privacy@foodzippy.com or in-app support

7.4 Withdrawal of Consent
- Opt-out of marketing communications at any time
- Disable location services in device settings
- Disable push notifications in App settings
- Disable camera and microphone permissions

7.5 Data Portability
- Request your data in portable format (CSV/JSON)
- Transfer data to another service

7.6 Objection to Processing
- Opt-out of analytics and tracking
- Disable personalized recommendations

8. Children's Privacy
- Minimum Age: The App is intended for users 18 years or older
- No Intentional Collection: We do not knowingly collect data from children under 18
- Parental Consent: If a parent/guardian discovers unauthorized data collection, contact us immediately
- Account Suspension: Identified underage accounts will be terminated

9. Permissions Required

9.1 Mandatory Permissions
- INTERNET: API communication
- ACCESS_NETWORK_STATE: Check connectivity
- ACCESS_FINE_LOCATION: GPS tracking for orders
- ACCESS_COARSE_LOCATION: Network-based location
- CALL_PHONE: Direct calling to delivery partners/restaurants

9.2 Optional Permissions
- CAMERA: QR code scanning, video calls (future)
- RECORD_AUDIO: Voice calls with Agora
- POST_NOTIFICATIONS: Push notifications (Android 13+)
- FOREGROUND_SERVICE: Real-time tracking service (contextual)

9.3 Permission Withdrawal
Users can disable permissions anytime in device Settings -> Apps -> Foodzippy -> Permissions.

10. Third-Party Services

10.1 Analytics and Tracking
- Firebase Analytics: Tracks usage patterns (optional)
- Google Play Services: Location and map services
- Shimmer Facebook: Loading state animation (no data collection)
- Glide: Image loading and caching

10.2 Payment Gateways
- Razorpay: PCI-DSS compliant payment processing
- Stripe: Industry-standard payment security
- PayPal: Secure third-party payment
- Paystack: Regional payment solution

10.3 Communication Services
- Firebase Cloud Messaging (FCM): Push notifications
- One Signal: Additional notification layer
- Agora SDK: Real-time voice calls (v4.3.2)

10.4 Maps and Location
- Google Maps API: Routing, geocoding, distance calculation
- Google Places API: Restaurant location and details
- Fused Location Provider: Accurate location

10.5 Authentication
- Firebase Authentication: Phone number based OTP verification
- Firebase Dynamic Links: Deep linking and referral support

11. WebSocket Connections

11.1 Real-Time Tracking
- Protocol: WebSocket for live rider location updates
- Connection Candidates: Multiple failover servers for reliability
- Reconnection: Exponential backoff retry mechanism (max 30 seconds)
- Stale Detection: 12-second timeout for detecting stale connections
- Polling Fallback: REST API fallback if WebSocket unavailable

11.2 Data Transmitted
- Real-time GPS coordinates (lat/lng)
- Order ID
- Client ID
- Delivery status updates
- Live ETA calculations

12. Cookies and Tracking

12.1 Shared Preferences
- App settings and user preferences stored locally
- Device-specific cache for performance
- Auto-login tokens

12.2 Analytics Tracking
- Firebase Analytics for understanding user behavior
- Session tracking (optional)
- Event tracking (app interactions)

12.3 Disabling Tracking
- Disable in device Settings -> Privacy -> Advertising ID
- Opt-out via App settings menu

13. International Data Transfers

13.1 Data Locations
- Primary Server: zippy.truebasket.in (location: India)
- Firebase Database: Google Cloud (Asia Southeast 1)
- Payment Processors: International
- Third-party Services: May be US-based or international

13.2 International Compliance
- GDPR compliance (if applicable)
- Data protection agreements with service providers
- Standard contractual clauses with international partners
- Data localization checks for sensitive markets

14. Policy Updates

14.1 Changes to This Policy
- We may update this Privacy Policy periodically
- Material changes will be communicated via:
  - In-app notification banner
  - Email to registered email address
  - Updated Last Updated date

14.2 Effective Date
- Changes effective upon posting to the App
- Continued use implies acceptance of updated policy

15. Contact Information
For privacy-related inquiries, requests, or complaints:

15.1 Primary Contact
- Email: privacy@foodzippy.com
- In-App Support: Help menu -> Privacy Issues -> Contact Support
- Phone: Support phone number from app

15.2 Data Protection Officer
- Email: dpo@foodzippy.com (if applicable)
- Response Time: 30 days from receipt of valid request

15.3 Mailing Address
- Contact via in-app support for physical address

16. Compliance Statements

16.1 Regulatory Compliance
- GDPR: Compliant with General Data Protection Regulation (if serving EU users)
- CCPA: Compliant with California Consumer Privacy Act (if applicable)
- India Data Protection: Adheres to Digital Personal Data Protection Act, 2023 (if applicable)
- Grievance Redressal: As per local regulations

16.2 User Rights
Users in specific jurisdictions have additional rights:
- EU Residents: GDPR rights including data portability, right to be forgotten
- California Residents: CCPA rights including opt-out of sale
- India Residents: Data protection complaint mechanisms

17. App-Specific Disclosures

17.1 Restaurant and Rider Integration
- Restaurant data shared with delivery partners includes order details
- Rider real-time location shared with customers during active delivery
- Customer name and address shared with restaurants and riders only for order fulfillment

17.2 Offers and Promotions
- Personalized offers based on order history and preferences
- Opt-out available in settings
- No data sold to third parties for marketing (except with explicit consent)

17.3 Wallet and Subscription
- Wallet balance stored securely
- Monthly subscription auto-renewal terms visible at checkout
- Cancellation available anytime in App settings

17.4 In-App Purchases
- Food items added to cart stored locally
- Cart data synced with backend
- Purchase history accessible in Order History

18. Security Incident Response

18.1 Incident Notification
- In case of data breach: Affected users notified within 72 hours
- Notification via email and in-app notification
- Incident details shared transparently

18.2 User Action
- Change password immediately
- Review recent order history
- Contact support for suspicious activity

19. Acknowledgment and Consent
By using the Foodzippy Customer App, you:
- Acknowledge you have read and understood this Privacy Policy
- Consent to the collection and use of data as described
- Agree to the terms and conditions of data handling
- Accept that continued App usage implies acceptance of these terms
- Understand that some data is necessary for service delivery

20. Additional Information

20.1 Version Information
- App Package: com.cscodetech.foodzippy
- Min API Level: 24 (Android 7.0+)
- Target API Level: 35
- App Version: 1.2
- Last Policy Review: April 7, 2026

20.2 App Features Referenced
- Real-time order tracking
- Voice calls with riders
- Food cart management
- Wallet functionality
- Subscription services
- Multiple payment methods
- Restaurant search and filtering
- Address management
- Offer and discount system

Quick Reference - Data Summary
- Name, Phone | Collection: User input | Usage: Account identification | Sharing: Riders, Restaurants | Retention: Account lifetime
- Email | Collection: User input | Usage: Communication, Account recovery | Sharing: Not shared | Retention: Account lifetime
- GPS Location | Collection: Automatic (GPS) | Usage: Order delivery, Tracking | Sharing: Riders (live), Maps API | Retention: 30 days
- Delivery Address | Collection: User input | Usage: Order fulfillment | Sharing: Riders, Restaurants | Retention: Account lifetime
- Payment Info | Collection: User input to processor | Usage: Payment processing | Sharing: Payment processors only | Retention: Processor secures
- Order History | Collection: Automatic | Usage: Recommendations, Compliance | Sharing: Not shared | Retention: 6 years (audit)
- Device ID | Collection: Automatic | Usage: Analytics, Notifications | Sharing: Firebase, OneSignal | Retention: Device lifetime
- Call Data | Collection: Automatic | Usage: Agora transmission | Sharing: Agora RTC | Retention: 90 days

Document Information
- Created: April 7, 2026
- Scope: Foodzippy Customer App (com.cscodetech.foodzippy)
- Status: Active Privacy Policy
- Next Review: April 7, 2027 (or upon material changes)

This Privacy Policy is a comprehensive documentation of data practices. Users should review this policy regularly for updates.
`;

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-gray-600 font-century-gothic">Foodzippy Customer App</p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed font-century-gothic text-sm md:text-base">
            {privacyPolicyText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
