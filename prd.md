# Pop Up - Product Requirements Document

## Executive Summary

**Product Name:** Pop Up

**Version:** 1.0 (MVP)

**Target Launch:** 4 weeks from project start

**Mission:** Connect event organizers with pop-up vendors, streamlining the sponsorship and booth booking process.

---

## 1. Problem Statement

### Current Pain Points

- **Event Organizers:** Struggle to find reliable sponsors and vendors, relying on fragmented Facebook groups and word-of-mouth
- **Pop-up Vendors:** Difficulty discovering events, lack of centralized application system, uncertainty about application status
- **Both Parties:** No structured communication channel, manual negotiation processes, missed opportunities

### Market Opportunity

- Growing gig economy and pop-up retail market
- Increase in local events, festivals, and community gatherings
- Digital transformation of event management

---

## 2. Product Vision & Goals

### Vision

Create the go-to marketplace connecting event organizers with quality vendors, making event sponsorship as easy as booking a hotel.

### Success Metrics (3-month targets)

- 50+ active hosts
- 200+ registered vendors
- 100+ event listings
- 30% application-to-booking conversion rate
- 4.0+ star average rating

---

## 3. User Personas

### Persona 1: Sarah - Event Organizer

- Age: 28-35
- Role: Community event coordinator, festival organizer
- Pain Points: Limited budget, needs diverse vendors, time-consuming outreach
- Goals: Fill vendor spots quickly, maintain event quality, reduce administrative burden

### Persona 2: Miguel - Pop-up Vendor

- Age: 25-40
- Role: Small business owner, artisan, food truck operator
- Pain Points: Inconsistent sales opportunities, competition for limited spots
- Goals: Regular bookings, discover new events, build reputation

---

## 4. Core Features (MVP)

### 4.1 Authentication & User Management

**Priority:** P0 (Critical)

**Requirements:**
- Email/password registration and login
- OAuth integration (Google, Facebook) for faster signup
- Role selection during registration: Host or Vendor
- Email verification for security
- Password reset functionality
- Profile completion wizard (first-time users)

**User Stories:**
- As a new user, I want to sign up quickly using my Google account
- As a returning user, I want to securely log in to access my dashboard
- As a user, I want to reset my password if I forget it

---

### 4.2 Host Dashboard

**Priority:** P0 (Critical)

### 4.2.1 Event Creation & Management

**Requirements:**
- Create event form with fields:
- Event name, description, category (festival, market, conference, etc.)
- Date range (start/end), time
- Location (address with map integration)
- Vendor spots available (number)
- Booth pricing (free, paid, negotiable)
- Booth dimensions/specifications
- Amenities provided (electricity, WiFi, tables, etc.)
- Application deadline
- Event images (up to 5)
- Edit/delete events (with safeguards if vendors have applied)
- Event status: Draft, Published, Closed, Completed
- Duplicate event feature for recurring events

### 4.2.2 Application Management

**Requirements:**
- View all applications per event in a table/card view
- Application statuses: Pending, Accepted, Rejected, Withdrawn
- One-click accept/reject actions
- Bulk actions for multiple applications
- Filter applications by status, date applied, vendor type
- View vendor profile and past event history
- Add private notes to applications

### 4.2.3 Analytics (Nice-to-have for MVP)

**Requirements:**
- Total events posted
- Application rate per event
- Acceptance rate
- Most popular event categories

**User Stories:**
- As a host, I want to post my event quickly with all relevant details
- As a host, I want to review vendor applications and make decisions efficiently
- As a host, I want to see which events attract the most vendors

---

### 4.3 Vendor Dashboard

**Priority:** P0 (Critical)

### 4.3.1 Event Discovery

**Requirements:**
- Browse all available events in grid/list view
- Event card preview showing:
- Event image, name, date, location
- Price range, spots available
- Application deadline
- Quick apply button
- Detailed event view with full information
- Save/bookmark events for later

### 4.3.2 Application System

**Requirements:**
- Application form with:
- Business description
- Products/services offered
- Booth requirements
- Portfolio images (up to 5)
- Links (website, social media)
- Special requests/notes
- Save draft applications
- Submit application with confirmation
- Withdraw application before host reviews

### 4.3.3 Application Tracking

**Requirements:**
- View all applications with status indicators
- Filter by status (Pending, Accepted, Rejected)
- Sort by application date, event date
- Notifications for status changes
- View rejection reasons if provided

### 4.3.4 Vendor Profile

**Requirements:**
- Business name, logo, description
- Product categories/tags
- Contact information
- Portfolio gallery
- Past events participated (auto-populated)
- Reviews/ratings from hosts (future feature)

**User Stories:**
- As a vendor, I want to discover events that match my business
- As a vendor, I want to apply to events with my business information
- As a vendor, I want to track the status of all my applications in one place

---

### 4.4 Search & Filter System

**Priority:** P0 (Critical)

**Requirements:**
- Search by event name, location, description keywords
- Filter events by:
- **Price:** Free, $0-$50, $50-$100, $100-$200, $200+, Negotiable
- **Date:** This week, This month, Next month, Custom range
- **Location:** By city, radius from user location, specific venue
- **Category:** Food & Beverage, Arts & Crafts, Fashion, Tech, etc.
- **Spots Available:** 1-5, 5-10, 10+ spots
- Sort by: Relevance, Date (nearest first), Price (low to high), Newest posted
- Clear all filters button
- Filter persistence (remembers last search)

**User Stories:**
- As a vendor, I want to find events within 20 miles of my location
- As a vendor, I want to see only affordable events under $100
- As a vendor, I want to find events happening next month

---

### 4.5 Real-time Messaging

**Priority:** P1 (High, but can be simplified for MVP)

**Requirements:**
- One-to-one chat between host and vendor
- Chat unlocked only after application acceptance
- Message thread per event application
- Real-time message delivery
- Read receipts
- Message notifications (in-app and email)
- File sharing (contracts, floor plans, images)
- Search message history

**Simplified MVP Alternative:**
- Simple messaging system without real-time (refresh to see new messages)
- Email notifications for new messages
- Upgrade to real-time post-MVP

**User Stories:**
- As a host, I want to discuss booth details with accepted vendors
- As a vendor, I want to ask questions about event logistics
- As both, I want to receive notifications when I get a new message

---

## 5. User Flows

### Host Flow

1. Sign up → Select “Host” role → Complete profile
2. Create event → Fill event details → Upload images → Publish
3. Receive application notifications → Review applications → Accept/Reject
4. Message accepted vendors → Coordinate event details
5. Mark event as completed

### Vendor Flow

1. Sign up → Select “Vendor” role → Complete business profile
2. Browse events → Apply filters → View event details
3. Submit application → Wait for response → Receive notification
4. If accepted: Message host → Finalize details
5. Attend event → Event marked complete

---

## 6. Technical Architecture (Recommended)

### Frontend

- **Framework:** React.js with Vite (faster than Create React App)
- **Styling:** Tailwind CSS for rapid UI development
- **State Management:** React Context API or Zustand (simpler than Redux)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios or Fetch API

### Backend

- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL (structured data) or MongoDB (flexibility)
- **ORM:** Prisma (for PostgreSQL) or Mongoose (for MongoDB)
- **Authentication:** JWT tokens + bcrypt for passwords
- **Real-time:** Socket.io for messaging (or use Supabase Realtime)
- **File Storage:** AWS S3, Cloudinary, or Supabase Storage

### Recommended Stack for Speed (All-in-one)

- **Supabase:** Backend-as-a-Service providing:
    - PostgreSQL database with automatic APIs
    - Authentication (email, OAuth)
    - Real-time subscriptions
    - File storage
    - Row-level security
- This reduces backend development by 60-70%

### Hosting & Deployment

- **Frontend:** Vercel or Netlify (free tier)
- **Backend:** Railway, Render, or Fly.io (free/cheap tier)
- **Database:** Supabase (free tier) or Railway

---

## 7. Data Models

### Users Table

```
id (UUID, PK)
email (string, unique)
password_hash (string)
role (enum: HOST, VENDOR)
created_at (timestamp)
updated_at (timestamp)
is_verified (boolean)
```

### Host Profiles Table

```
id (UUID, PK)
user_id (UUID, FK → Users)
organization_name (string)
contact_phone (string)
bio (text)
avatar_url (string)
```

### Vendor Profiles Table

```
id (UUID, PK)
user_id (UUID, FK → Users)
business_name (string)
business_description (text)
categories (array/tags)
portfolio_images (array of URLs)
website_url (string)
social_links (JSON)
logo_url (string)
```

### Events Table

```
id (UUID, PK)
host_id (UUID, FK → Users)
title (string)
description (text)
category (enum)
start_date (date)
end_date (date)
location_address (string)
location_lat (decimal)
location_lng (decimal)
booth_price (decimal)
price_negotiable (boolean)
spots_available (integer)
spots_filled (integer)
application_deadline (date)
booth_specifications (text)
amenities (array)
images (array of URLs)
status (enum: DRAFT, PUBLISHED, CLOSED, COMPLETED)
created_at (timestamp)
```

### Applications Table

```
id (UUID, PK)
event_id (UUID, FK → Events)
vendor_id (UUID, FK → Users)
status (enum: PENDING, ACCEPTED, REJECTED, WITHDRAWN)
business_description (text)
products_offered (text)
booth_requirements (text)
portfolio_images (array)
special_requests (text)
applied_at (timestamp)
reviewed_at (timestamp)
host_notes (text, private)
```

### Messages Table

```
id (UUID, PK)
application_id (UUID, FK → Applications)
sender_id (UUID, FK → Users)
receiver_id (UUID, FK → Users)
content (text)
attachments (array of URLs)
is_read (boolean)
created_at (timestamp)
```

---

## 8. Security & Privacy

### Authentication

- Passwords hashed with bcrypt (12+ rounds)
- JWT tokens with 24-hour expiration
- Refresh tokens for extended sessions
- Rate limiting on login attempts

### Authorization

- Role-based access control (RBAC)
- Hosts can only edit their own events
- Vendors can only view/edit their own applications
- Messages only visible to sender/receiver

### Data Protection

- HTTPS only in production
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF tokens for forms
- File upload validation (type, size limits)

---

## 9. Nice-to-Have Features (Post-MVP)

### Phase 2 (Month 2-3)

- Payment integration (Stripe) for booth bookings
- Reviews and ratings system
- Vendor verification badges
- Calendar integration (Google Calendar, iCal)
- Push notifications (Progressive Web App)
- Advanced analytics dashboard

### Phase 3 (Month 4-6)

- Mobile app (React Native)
- Multi-language support
- Contract generation and e-signatures
- Event promotion tools
- Vendor discovery algorithm (recommendations)
- Public vendor profiles/portfolios

---

## 10. MVP Scope Decisions

### What’s IN for MVP (4 weeks)

✅ Basic authentication (email/password)

✅ Host can create/edit events

✅ Vendor can browse and apply to events

✅ Basic filtering (price, date, location)

✅ Application management (accept/reject)

✅ Simple messaging system

✅ Responsive design (mobile-friendly)

### What’s OUT for MVP

❌ Payment processing (can coordinate offline)

❌ Reviews/ratings

❌ OAuth (Google/Facebook login)

❌ Advanced analytics

❌ Real-time notifications (use email instead)

❌ File uploads beyond profile images

❌ Public vendor portfolios

---

## 11. Success Criteria for MVP

### Technical

- Platform loads in <3 seconds
- No critical bugs at launch
- Mobile responsive (works on phones)
- 99% uptime

### User Experience

- User can sign up and create profile in <5 minutes
- Host can post event in <10 minutes
- Vendor can apply to event in <5 minutes
- Messaging works reliably

### Business

- 10+ beta users (5 hosts, 5 vendors) providing feedback
- At least 1 successful vendor-host connection
- Collect user feedback for iteration

---

## 12. Development Timeline (4 Weeks)

### Week 1: Foundation

- Project setup, database design
- Authentication system
- Basic UI components
- User profile pages

### Week 2: Core Features

- Event creation and listing
- Application submission
- Host application review system
- Search and filter

### Week 3: Communication & Polish

- Messaging system
- Notifications (email)
- UI/UX refinements
- Responsive design

### Week 4: Testing & Launch

- Bug fixing
- User testing with beta users
- Documentation
- Deployment
- Soft launch

---

## 13. Risks & Mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Scope creep | High | Stick to MVP features ruthlessly |
| Complex real-time messaging | Medium | Use simple polling or Supabase Realtime |
| Low initial adoption | High | Start with local community, offer free tier |
| Time overrun | High | Use AI tools, pre-built components, focus on core |
| Technical complexity | Medium | Use BaaS like Supabase to reduce backend work |

---

## Appendix A: Competitive Analysis

**Competitors:**
- Eventbrite (event ticketing, not vendor-focused)
- Facebook Events/Groups (unstructured, no application system)
- Direct vendor outreach (manual, time-consuming)

**Competitive Advantages:**
- Purpose-built for vendor-host matching
- Structured application process
- Centralized communication
- Better discovery for vendors

---

## Appendix B: Future Monetization Ideas

- Commission on successful bookings (10-15%)
- Premium vendor profiles with featured placement
- Subscription tier for hosts (unlimited events)
- Promoted event listings
- Analytics and insights packages