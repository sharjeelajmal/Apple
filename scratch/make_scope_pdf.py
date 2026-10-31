from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    Flowable, PageBreak, KeepTogether,
)

OUTPUT = "../Apple-Official-Project-Scope.pdf"

INK = colors.HexColor("#1d1d1f")
MUTED = colors.HexColor("#6e6e73")
ACCENT = colors.HexColor("#0071e3")
ACCENT_SOFT = colors.HexColor("#e8f1fc")
VIOLET = colors.HexColor("#7c5cf5")
VIOLET_SOFT = colors.HexColor("#f1edff")
SOFT = colors.HexColor("#f5f5f7")
LINE = colors.HexColor("#e5e5ea")
WARN = colors.HexColor("#b25000")
WARN_SOFT = colors.HexColor("#fff4e5")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

styles = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=32, leading=38, textColor=INK),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=14, leading=20, textColor=MUTED),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=19, leading=24, textColor=INK, spaceBefore=4, spaceAfter=4),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=INK, spaceBefore=6, spaceAfter=4),
    "lead": ParagraphStyle("lead", fontName="Helvetica", fontSize=10.5, leading=15.5, textColor=MUTED, spaceAfter=10),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8.8, leading=12.5, textColor=MUTED),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=12.5, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=12.5, textColor=INK),
    "head": ParagraphStyle("head", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=MUTED),
    "eyebrow": ParagraphStyle("eyebrow", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=ACCENT),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK, leftIndent=12, bulletIndent=0, spaceAfter=3),
}


def para(text, style="body"):
    return Paragraph(text, styles[style])


def section(eyebrow, title, lead):
    return [para(eyebrow.upper(), "eyebrow"), Spacer(1, 3), para(title, "h1"), para(lead, "lead")]


def bullets(items):
    return [Paragraph(item, styles["bullet"], bulletText="•") for item in items]


def table(header, rows, widths):
    data = [[para(h.upper(), "head") for h in header]]
    for row in rows:
        data.append([para(cell, "cellb" if i == 0 else "cell") for i, cell in enumerate(row)])
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("BACKGROUND", (0, 0), (-1, 0), SOFT),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
    ]))
    return t


class StatCards(Flowable):
    def __init__(self, stats, width):
        super().__init__()
        self.stats = stats
        self.width = width
        self.height = 64

    def draw(self):
        c = self.canv
        gap = 10
        w = (self.width - gap * (len(self.stats) - 1)) / len(self.stats)
        for i, (value, label) in enumerate(self.stats):
            x = i * (w + gap)
            c.setFillColor(SOFT)
            c.roundRect(x, 0, w, self.height, 10, fill=1, stroke=0)
            c.setFillColor(ACCENT)
            c.setFont("Helvetica-Bold", 22)
            c.drawCentredString(x + w / 2, 30, value)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 8.8)
            c.drawCentredString(x + w / 2, 14, label)


def arrow(c, x1, y1, x2, y2, color=MUTED):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(1)
    c.line(x1, y1, x2, y2)
    size = 4
    p = c.beginPath()
    if x1 == x2:
        direction = -1 if y2 < y1 else 1
        p.moveTo(x2, y2)
        p.lineTo(x2 - size, y2 - direction * size * 1.6)
        p.lineTo(x2 + size, y2 - direction * size * 1.6)
    else:
        direction = 1 if x2 > x1 else -1
        p.moveTo(x2, y2)
        p.lineTo(x2 - direction * size * 1.6, y2 - size)
        p.lineTo(x2 - direction * size * 1.6, y2 + size)
    p.close()
    c.drawPath(p, fill=1, stroke=0)


def box(c, x, y, w, h, title, lines, fill=colors.white, stroke=LINE, title_color=INK):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    c.setFillColor(title_color)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(x + w / 2, y + h - 17, title)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.3)
    for i, line in enumerate(lines):
        c.drawCentredString(x + w / 2, y + h - 31 - i * 11, line)


def columns(width, count, gap=12):
    w = (width - gap * (count - 1)) / count
    return w, [i * (w + gap) for i in range(count)]


class ArchitectureDiagram(Flowable):
    def __init__(self, width):
        super().__init__()
        self.width = width
        self.height = 270

    def draw(self):
        c = self.canv
        top_w, top_xs = columns(self.width, 3, 14)
        top_y, top_h = 205, 58
        for x, (title, lines) in zip(top_xs, [
            ("Shoppers", ["Browse, ask, compare, buy"]),
            ("Customers", ["Orders, returns, alerts"]),
            ("Store owner", ["Runs it all from /admin"]),
        ]):
            box(c, x, top_y, top_w, top_h, title, lines)

        app_y, app_h = 82, 98
        c.setFillColor(ACCENT_SOFT)
        c.setStrokeColor(ACCENT)
        c.setLineWidth(1.4)
        c.roundRect(0, app_y, self.width, app_h, 10, fill=1, stroke=1)
        c.setFillColor(ACCENT)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(12, app_y + app_h - 16, "The website (Next.js, hosted on Vercel)")
        inner_w, inner_xs = columns(self.width - 24, 3, 10)
        for x, (title, lines) in zip(inner_xs, [
            ("Store pages", ["Always show live prices"]),
            ("Shop logic", ["Orders, stock, returns"]),
            ("AI layer", ["Chat, voice, advice"]),
        ]):
            box(c, 12 + x, app_y + 10, inner_w, 54, title, lines)

        bottom_w, bottom_xs = columns(self.width, 4, 12)
        bottom_h = 58
        for x, (title, lines) in zip(bottom_xs, [
            ("MongoDB Atlas", ["Products, orders, chats"]),
            ("Cloudinary", ["Photos and AR models"]),
            ("Google", ["Continue with Google"]),
            ("Claude AI", ["Through OpenRouter"]),
        ]):
            box(c, x, 0, bottom_w, bottom_h, title, lines, fill=SOFT, stroke=SOFT)

        for x in top_xs:
            arrow(c, x + top_w / 2, top_y, x + top_w / 2, app_y + app_h + 2)
        for x in bottom_xs:
            arrow(c, x + bottom_w / 2, app_y, x + bottom_w / 2, bottom_h + 2)


class StepFlow(Flowable):
    def __init__(self, steps, width):
        super().__init__()
        self.steps = steps
        self.width = width
        self.height = 92

    def draw(self):
        c = self.canv
        gap = 26
        w, xs = columns(self.width, len(self.steps), gap)
        for i, (x, (title, line1, line2)) in enumerate(zip(xs, self.steps)):
            c.setFillColor(colors.white)
            c.setStrokeColor(LINE)
            c.setLineWidth(0.8)
            c.roundRect(x, 0, w, 72, 10, fill=1, stroke=1)
            c.setFillColor(ACCENT)
            c.circle(x + w / 2, 72, 12, fill=1, stroke=0)
            c.setFillColor(colors.white)
            c.setFont("Helvetica-Bold", 11)
            c.drawCentredString(x + w / 2, 68, str(i + 1))
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 10.5)
            c.drawCentredString(x + w / 2, 44, title)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 8.5)
            c.drawCentredString(x + w / 2, 29, line1)
            c.drawCentredString(x + w / 2, 17, line2)
            if i < len(self.steps) - 1:
                arrow(c, x + w + 4, 36, x + w + gap - 4, 36, ACCENT)


class ModuleCards(Flowable):
    def __init__(self, modules, width, columns_count=3, tint=ACCENT):
        super().__init__()
        self.modules = modules
        self.width = width
        self.columns_count = columns_count
        self.tint = tint
        self.card_h = 50 + 12 * max(len(lines) for _, lines in modules)
        rows = (len(modules) + columns_count - 1) // columns_count
        self.height = rows * self.card_h + (rows - 1) * 10

    def draw(self):
        c = self.canv
        w, xs = columns(self.width, self.columns_count, 10)
        for i, (title, lines) in enumerate(self.modules):
            row, col = divmod(i, self.columns_count)
            x = xs[col]
            y = self.height - (row + 1) * self.card_h - row * 10
            c.setFillColor(SOFT)
            c.roundRect(x, y, w, self.card_h, 10, fill=1, stroke=0)
            c.setFillColor(self.tint)
            c.roundRect(x + 12, y + self.card_h - 22, 4, 12, 2, fill=1, stroke=0)
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 10.5)
            c.drawString(x + 22, y + self.card_h - 20, title)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 8.4)
            for j, line in enumerate(lines):
                c.drawString(x + 12, y + self.card_h - 40 - j * 12, line)


class CategoryBars(Flowable):
    def __init__(self, data, width):
        super().__init__()
        self.data = data
        self.width = width
        self.height = len(data) * 26

    def draw(self):
        c = self.canv
        label_w = 90
        bar_max = self.width - label_w - 40
        top = max(v for _, v in self.data)
        for i, (label, value) in enumerate(self.data):
            y = self.height - (i + 1) * 26 + 6
            c.setFillColor(INK)
            c.setFont("Helvetica", 9.5)
            c.drawString(0, y + 4, label)
            c.setFillColor(SOFT)
            c.roundRect(label_w, y, bar_max, 14, 7, fill=1, stroke=0)
            c.setFillColor(ACCENT)
            c.roundRect(label_w, y, bar_max * value / top, 14, 7, fill=1, stroke=0)
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 9.5)
            c.drawString(label_w + bar_max + 8, y + 4, str(value))


class NoteBox(Flowable):
    def __init__(self, title, text, width, tone="warn"):
        super().__init__()
        self.title = title
        self.para = Paragraph(text, styles["body"])
        self.width = width
        self.tone = tone
        _, h = self.para.wrap(width - 32, 1000)
        self.height = h + 40

    def draw(self):
        c = self.canv
        fill, accent = {"warn": (WARN_SOFT, WARN), "info": (ACCENT_SOFT, ACCENT), "ai": (VIOLET_SOFT, VIOLET)}[self.tone]
        c.setFillColor(fill)
        c.roundRect(0, 0, self.width, self.height, 10, fill=1, stroke=0)
        c.setFillColor(accent)
        c.roundRect(0, 0, 4, self.height, 2, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 10.5)
        c.drawString(16, self.height - 20, self.title)
        self.para.drawOn(c, 16, 10)


def on_page(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(MARGIN, 12 * mm, "Apple Official · Project scope")
        canvas.drawRightString(PAGE_W - MARGIN, 12 * mm, f"Page {doc.page}")
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN, 15 * mm, PAGE_W - MARGIN, 15 * mm)
    canvas.restoreState()


def cover(s):
    s += [Spacer(1, 38 * mm), para("PROJECT SCOPE", "eyebrow"), Spacer(1, 8)]
    s += [para("Apple Official", "title"), Spacer(1, 6)]
    s += [para("What the online store does, how it's built, and what's left before launch", "subtitle"), Spacer(1, 18)]
    s += [para(
        "Apple Official is an online store for the latest iPhone, iPad, Mac and Apple Watch models. "
        "Shoppers can browse, compare and buy, and they can get help from an AI assistant that talks "
        "in English, Urdu or Hindi, by text or by voice. The store owner runs everything from one admin "
        "panel: products, home page, orders, returns, reviews and the AI conversations.", "body")]
    s += [Spacer(1, 8), para(
        "This document is meant to be read in ten minutes. It covers what's in the store today, "
        "what each part is for, and the few things we still need to do before real customers arrive.", "body")]
    s += [Spacer(1, 22), StatCards([("74", "products"), ("12", "AI features"), ("8", "admin tools"), ("3", "languages")], CONTENT_W)]
    s += [Spacer(1, 22), para("October 2026 · Status: complete and tested, payments not connected yet", "small")]
    s.append(PageBreak())


def architecture(s):
    s += section("The big picture", "How it fits together",
                 "It's one website used by three kinds of people. Behind it sit four online services: one keeps "
                 "the data, one stores pictures, one handles Google sign-in and one powers the AI.")
    s += [ArchitectureDiagram(CONTENT_W), Spacer(1, 16)]
    s += [table(
        ["Part", "What we use", "Why we picked it"],
        [
            ["Website", "Next.js 16, React 19, TypeScript", "Pages load fast and always show the latest prices and stock."],
            ["Design", "Tailwind CSS with one shared set of colours and sizes", "The whole site looks the same everywhere and is easy to restyle."],
            ["Database", "MongoDB Atlas", "Keeps products, orders, customers, reviews, alerts and AI chat history."],
            ["Pictures", "Cloudinary", "Stores product photos, review photos and the 3D models used for AR."],
            ["Sign-in", "Better Auth, email or Google", "Safe customer accounts. The admin has a separate login of its own."],
            ["AI", "Claude through OpenRouter", "Opus 5.5 answers typed chats; Sonnet 5.5 is used for voice because it replies faster."],
            ["Hosting", "Vercel", "Works on localhost, the Vercel preview link and appleofficial.com."],
        ],
        [26 * mm, 58 * mm, CONTENT_W - 84 * mm],
    )]
    s.append(PageBreak())


def storefront(s):
    s += section("For shoppers", "The shopping experience",
                 "Everything on the store comes straight from the database, so when the owner changes a price "
                 "or a banner, shoppers see it on their next page load.")
    s += [table(
        ["Area", "What shoppers get"],
        [
            ["Home page", "Sliding banners, category banners, newest iPhones, trending products by category, a sale countdown and a short list picked for them by AI."],
            ["Collections", "Every category with filters for model, stock and price, plus sorting and 12, 24 or 36 products per page."],
            ["Search", "Forgives typos (\"macbok air\" still finds MacBook Air), remembers recent searches, takes voice input and can search with a photo."],
            ["Product page", "Photo gallery, storage and colour choices with their own prices, \"frequently bought together\", AR view on iPhone and iPad, and a price drop or back-in-stock alert."],
            ["Reviews and Q&amp;A", "Star ratings with photos and a \"verified purchase\" badge, an AI summary of what people like and dislike, and questions answered by the store."],
            ["Help me choose", "A five-question quiz that suggests the best three products for the shopper's budget and needs."],
            ["Compare", "Pick two or three products and get a side-by-side table with a plain verdict for each need."],
            ["Bag and wishlist", "The bag checks live stock on its own. The wishlist follows the shopper to any device once they sign in."],
            ["Information pages", "About, Contact, Jobs, FAQ, Blog, Site Map and the four policy pages."],
        ],
        [34 * mm, CONTENT_W - 34 * mm],
    )]
    s.append(PageBreak())


def ai_features(s):
    s += section("Built-in AI", "Twelve ways AI helps",
                 "The AI only recommends products that are actually in the store, at the price shown on the site. "
                 "Answers are saved for a while, so popular pages like a comparison open instantly the second time.")
    s += [ModuleCards([
        ("Shopping assistant", ["Chat about any product or order,", "send a photo of a device"]),
        ("Voice shopping", ["Speak, hear the answer, keep", "talking; looks and feels like Siri"]),
        ("Ask about a product", ["Opens the chat already knowing", "which product you're looking at"]),
        ("Compare with AI", ["Side-by-side table and a clear", "\"best for camera\" style verdict"]),
        ("Review summaries", ["What customers like and dislike,", "on every product with reviews"]),
        ("Search with a photo", ["Upload any phone or laptop and", "find it, or the closest match"]),
        ("Picked for you", ["Suggestions based on what you've", "viewed, saved and bought"]),
        ("Upgrade advisor", ["\"I have an iPhone 13, should I", "upgrade?\" with an honest answer"]),
        ("Gift finder", ["Who it's for, the occasion and the", "budget, and it picks the gift"]),
        ("Smart bag check", ["Storage advice, accessories that", "pair well, better-value options"]),
        ("Address check", ["Catches typos in city, street or", "postal code before payment"]),
        ("Orders in chat", ["Cancel an order or start a return", "by asking, with a confirm step"]),
    ], CONTENT_W, tint=VIOLET), Spacer(1, 16)]
    s += [NoteBox(
        "Voice, languages and safety",
        "The assistant understands English, Urdu, Roman Urdu and Hindi, and replies in the same language. "
        "In voice mode it waits until you've actually finished your sentence before answering, starts speaking "
        "as soon as the first sentence is ready, and listens again when it's done. "
        "Only signed-in customers can use the chat, and it never cancels or returns an order without asking first.",
        CONTENT_W, tone="ai",
    )]
    s.append(PageBreak())


def checkout_accounts(s):
    s += section("Buying", "Checkout in three steps",
                 "Shoppers never leave the site to pay. The server always takes the real price and stock from the "
                 "database, so nobody can change a price from their browser.")
    s += [StepFlow([
        ("Shipping", "Contact details and address,", "checked by AI for typos"),
        ("Payment", "Visa, Mastercard, other cards,", "PayPal or Google Pay"),
        ("Confirmation", "Order number, delivery date", "and a summary of the order"),
    ], CONTENT_W), Spacer(1, 14)]
    s += bullets([
        "Card numbers, expiry dates and security codes are checked as you type, and the card type is picked from the number.",
        "Stock goes down the moment an order is placed, so two people can't buy the last item. Cancelling puts it back.",
        "Order statuses: Placed, Processing, Shipped, Delivered and Cancelled. Delivered orders can be returned within 14 days.",
    ])
    s += [Spacer(1, 14)]
    s += section("For customers", "Customer accounts",
                 "Customers sign up with email or continue with Google. Once signed in they get their own space.")
    s += [ModuleCards([
        ("Overview", ["Orders, spending and products", "picked for them by AI"]),
        ("Orders", ["Every order with its status,", "plus return progress"]),
        ("Alerts", ["Price drops and back-in-stock", "news for watched products"]),
        ("Wishlist", ["Saved products, on any device"]),
        ("Addresses", ["Add, edit, remove and choose", "a default address"]),
        ("Settings", ["Name, password and the", "connected Google account"]),
    ], CONTENT_W)]
    s.append(PageBreak())


def admin(s):
    s += section("For the store owner", "The admin panel",
                 "The admin panel lives at /admin and has its own login, separate from customer accounts. "
                 "It has eight tools, and nothing in it needs any coding.")
    s += [ModuleCards([
        ("Overview", ["Revenue, orders,", "customers, low stock", "and new messages"]),
        ("Home Page CMS", ["Edit every section:", "text, images, buttons", "and products"]),
        ("Inventory", ["Products, photos,", "prices, stock and", "AR models"]),
        ("Orders", ["Update status and", "approve or decline", "return requests"]),
        ("Customers", ["Each customer with", "their orders, addresses", "and cards used"]),
        ("Reviews & Q&A", ["Hide or delete", "reviews and answer", "questions"]),
        ("AI Chats", ["Every chat with the", "assistant, kept even", "if cleared"]),
        ("Messages", ["Messages sent", "from the Contact", "page"]),
    ], CONTENT_W, columns_count=4), Spacer(1, 16)]
    s += bullets([
        "Each chat shows the time of every message, the photos sent, what the AI looked up and anything it did with an order.",
        "Product ratings update on their own from customer reviews.",
        "Products can be saved as drafts, which keeps them hidden until they're ready.",
        "A demo account and sample data can be added with one command for presentations, and removed with another.",
    ])
    s += [Spacer(1, 14)]
    s += section("Products", "The catalog",
                 "The store starts with 74 of the newest Apple products, with Apple's own photos, colour names and specs.")
    s += [CategoryBars([("iPhone", 20), ("iPad", 20), ("MacBook", 20), ("Apple Watch", 14)], CONTENT_W), Spacer(1, 8)]
    s += [para("Prices are in US dollars. Current models use Apple's live prices and older models use their launch price. "
               "16 products also have a 3D model for AR.", "small")]
    s.append(PageBreak())


def next_steps(s):
    s += section("Before launch", "What's left to do",
                 "The store works end to end and every feature has been tested. These are the things to finish before "
                 "real customers start paying.")
    s += [NoteBox(
        "Must do before launch",
        "<b>1. Connect real payments.</b> Orders are saved today, but no money is taken yet. A payment provider "
        "needs to be connected so cards are charged securely.<br/>"
        "<b>2. Stop storing full card numbers.</b> For testing, orders keep the whole card number. Card industry "
        "rules (PCI DSS) don't allow this, so it must be removed. A payment provider makes it unnecessary anyway.<br/>"
        "<b>3. Remove the demo data.</b> The sample reviews, demo customer and test chats have to go before launch. "
        "One command does it: <font name=\"Courier\">npm run demo:remove</font>.",
        CONTENT_W,
    ), Spacer(1, 14)]
    s += [para("Good to know", "h2")]
    s += bullets([
        "Voice works best in Chrome and Edge. Edge has a natural Urdu voice; in Chrome, Urdu replies are read out in Hindi script, which sounds the same.",
        "AR models bigger than 10 MB can't be uploaded on Cloudinary's free plan (MacBook Pro and MacBook Neo for now).",
        "The AI is billed per use through OpenRouter. Saved answers keep the cost low, but it's worth checking the bill each month.",
        "The store uses Apple's name and photos. If the store applies for a payment account, the provider may ask about this.",
    ])
    s += [Spacer(1, 12)]
    s += [KeepTogether([
        para("Suggested next phases", "h2"), Spacer(1, 4),
        table(
            ["Phase", "What it covers"],
            [
                ["1. Payments", "Connect a payment provider, mark orders as paid, refund from the admin, remove stored card numbers."],
                ["2. Emails", "Order confirmation, shipping updates, password reset, and price drop alerts sent by email too."],
                ["3. Growth", "Discount codes, more admin users with roles, courier tracking and sales reports by AI."],
            ],
            [32 * mm, CONTENT_W - 32 * mm],
        ),
    ])]


def build():
    doc = BaseDocTemplate(
        OUTPUT, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=22 * mm,
        title="Apple Official - Project Scope", author="Apple Official",
    )
    frame = Frame(MARGIN, 22 * mm, CONTENT_W, PAGE_H - MARGIN - 22 * mm, id="main",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="page", frames=[frame], onPage=on_page)])

    story = []
    for part in (cover, architecture, storefront, ai_features, checkout_accounts, admin, next_steps):
        part(story)
    doc.build(story)


if __name__ == "__main__":
    build()
    print("written", OUTPUT)
