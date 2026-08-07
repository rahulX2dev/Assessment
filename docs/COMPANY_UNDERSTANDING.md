# Phase 3 — Company Understanding and Business Questions

Submitted by Rahul Pathak for the HubUnicon Technical Assessment.

> **Note on questions 1, 3 and 5.** These ask about my own motivations and about a
> personal interaction. Questions 2 and 4 are analytical and are answered in full
> below. Questions 1 and 3 are written in my voice and should be adjusted to match
> what I actually say in interview. Question 5 asks for feedback on a specific
> conversation with Ms. Deep Joshi; I have left it structured but unfilled, because
> a genuine account of that conversation is the only version worth submitting.

---

## 1. Why do you want to join HubUnicon?

Three reasons, in order of how much they matter to me.

**The problem is unglamorous and genuinely hard.** Conversation-led automation
sounds simple until you look at what sits underneath: official WhatsApp API access,
template approval workflows, per-number throughput caps, delivery receipts that
arrive out of order, and billing that has to reconcile against the same event
ledger the marketing dashboard reads. Building this assessment made that concrete
for me. Getting delivery counters to self-correct after a dropped webhook, or
keeping OTP traffic from being starved by a bulk broadcast, are the kinds of
problems I would rather spend a year on than another CRUD dashboard.

**The market position is specific.** HubUnicon is building for Indian businesses on
the channel Indian customers actually read. That is not a generic bet. It shapes
the product down to details like GST-compliant invoicing, Hinglish templates, and
pricing that a 20-person retailer can approve without a procurement cycle. I would
rather work somewhere with a sharp view of who it serves than somewhere trying to
be everything to everyone.

**The scope of the work is wide.** This assessment alone spanned React, Node, Java,
Python, C++, C, three databases and a Kubernetes deployment. A company that expects
that range is a company where an engineer gets to own a problem end to end rather
than a single layer of it. That is how I learn fastest, and it is the kind of
ownership I am looking for at this stage of my career.

I also want to be straightforward about fit: I am strongest in the
frontend-to-backend span and in systems thinking. I am less experienced in ML
engineering. If the role leans heavily into model work, that is a gap I would need
to close rather than one I would claim I already have.

---

## 2. What is Hubflow Automation?

Hubflow Automation is a multi-tenant SaaS platform that unifies customer
conversations, CRM and billing into one workspace, with WhatsApp as the primary
channel.

The problem it solves is fragmentation. A typical growing Indian business runs
customer conversations on a personal WhatsApp number, leads in a spreadsheet, email
campaigns in one tool, invoices in another, and reporting nowhere. Nothing
reconciles, and by the time anyone notices a lead went cold, it has been three
weeks.

Hubflow replaces that with a single system of record. Concretely, it provides:

| Module | What it does |
|---|---|
| **WhatsApp Business API** | Official Cloud API access, template submission and approval tracking, quality-rating monitoring, per-number throughput control |
| **CRM** | Contacts, companies, deals and a lifecycle pipeline where stage changes fire automation |
| **Campaign engine** | Segmented broadcasts, scheduling, delivery and read tracking, retry with backoff |
| **Automation studio** | Visual trigger-condition-action workflows with full payload logging so failures can be replayed |
| **AI assistant** | Intent classification and routing on inbound messages, reply drafting, thread summarisation, lead scoring |
| **Billing** | Subscriptions, GST-compliant invoicing, conversation charges passed through at cost |
| **HRMS** | Employee directory and leave management for the operating team |
| **Reports** | Delivery, engagement and revenue attribution computed from one shared event ledger |

The architectural idea that makes it more than a bundle is that every module writes
to the same tenant database. A contact created by a campaign is the same record the
CRM shows, the AI service scores, and the billing engine counts. That is why
delivery numbers and invoice numbers agree — a property that is very hard to
retrofit onto five separate SaaS subscriptions.

The commercial model is a fixed platform fee by tier, with Meta's per-conversation
charges passed through at cost as a separate invoice line. That distinction matters
more than it looks: it removes the suspicion that the vendor profits from volume,
which is the usual objection to per-message pricing.

---

## 3. Where do you see yourself in the next 2–3 years?

**Technically**, I want to move from building features to owning systems. The
difference I care about is being the person who can answer "what happens when this
dependency is down" before it is down. Working through this assessment sharpened
that for me — the parts I am most satisfied with are not the feature endpoints but
the failure paths: the circuit breaker, the cached plan catalogue, the analytics
fallback that degrades instead of hanging. In two to three years I want that
instinct to be automatic rather than something I have to remember to apply.

Specifically, I want depth in distributed systems and data modelling. Those are the
skills that decide whether a platform survives its own growth, and they are the
ones I am currently weakest in relative to where I want to be.

**In terms of role**, I would like to be a senior engineer trusted with a product
area end to end — say, the entire campaign and delivery pipeline — including its
architecture, its on-call burden, and mentoring one or two people through it. I am
not aiming at pure management. I want to stay close enough to the code to keep my
judgment honest.

**In terms of impact**, the outcome I would want to point at is a system that
carried a 10x increase in volume without a rewrite, because the early decisions were
made carefully. That is a slower kind of contribution than shipping features
quickly, and it is the kind I want to be known for.

---

## 4. Why will customers choose Hubflow over other automation platforms?

I would argue five points, from strongest to weakest.

**1. One record instead of five integrations.**
The competition is usually a stack: a WhatsApp tool, a CRM, an email platform, a
billing system, and a BI dashboard stitched together with Zapier. Every seam is a
place where data drifts. Hubflow's advantage is not that any single module beats
the best-in-class specialist — it will not — but that the modules share a database,
so the numbers reconcile. A customer whose marketing and finance teams have ever
argued about which report is correct understands this immediately.

**2. Transparent pricing with pass-through conversation costs.**
Most platforms mark up Meta's conversation charges and hide the margin in a blended
per-message rate. Hubflow charges a fixed platform fee and passes Meta's cost
through at cost on a separate invoice line. This is a commercial choice with a
technical dependency: it only works because delivery events and billing read the
same ledger, so the pass-through is auditable. Competitors who cannot reconcile
those two systems cannot credibly make this promise.

**3. Throughput isolation between bulk and transactional traffic.**
A dedicated dispatch engine runs bulk campaigns on a separate queue with its own
rate limiter, so a 200,000-message broadcast cannot delay a customer's login OTP.
Platforms that run one queue for everything will eventually delay an OTP during a
big send, and that is the failure customers actually notice and churn over.

**4. Built for the Indian market specifically.**
GST-compliant invoicing against a registered GSTIN, ap-south-1 data residency,
Hinglish template support, and pricing that a small business can approve without a
procurement process. A global platform can add these; it rarely leads with them.

**5. Degradation instead of downtime.**
When a dependency fails, the product stays usable — cached pricing still renders,
analytics falls back to a modelled series and labels itself as such, rate limiting
survives a Redis outage. Reliability is a weak differentiator in a sales
conversation and a very strong one at renewal.

**Where Hubflow will lose.** Honesty is more useful than a pitch here. A customer
who needs deep multi-channel orchestration across email, SMS, push and ads will
prefer a mature marketing-automation suite. A customer with a large existing
Salesforce or HubSpot investment will not migrate their CRM to gain WhatsApp. The
right target is the business that has outgrown spreadsheets and personal WhatsApp
but has not yet committed to an enterprise stack — and for that customer the
combination above is genuinely hard to assemble elsewhere.

---

## 5. Professional feedback on the interaction with Ms. Deep Joshi

*This answer is deliberately left for me to complete, because it should describe a
conversation as it actually happened rather than a generic compliment. The
structure I intend to follow:*

**Communication.**
*Clarity of the brief, responsiveness to questions, how expectations around scope
and timeline were set, and whether ambiguities were resolved when raised.*

**Process and professionalism.**
*How the assessment was framed, whether the evaluation criteria were made explicit,
and how queries during the assessment were handled.*

**PW experience discussed.**
*What was covered regarding the Physics Wallah background and how that context
informed the assessment brief — specifically the Physics Wallah home page clone
included in Phase 1.*

**Constructive observation.**
*One specific, respectful suggestion, if I have one that would genuinely have
improved the process.*

**Overall.**
*A direct summary of the interaction.*

---

## Document conversion

This document is written in Markdown for version control. To produce the PDF or
DOCX the submission asks for:

```bash
pandoc docs/COMPANY_UNDERSTANDING.md -o COMPANY_UNDERSTANDING.pdf
pandoc docs/COMPANY_UNDERSTANDING.md -o COMPANY_UNDERSTANDING.docx
```
