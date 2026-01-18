export type OccasionType =
    | "birthday"
    | "wedding"
    | "engagement"
    | "anniversary"
    | "baby_shower"
    | "house_warming"
    | "corporate"
    | "product_launch"
    | "portfolio"
    | "business"
    | "festival"
    | "invitation";

export interface FieldDefinition {
    id: string;
    label: string;
    type: "text" | "date" | "time" | "textarea" | "select" | "multiselect" | "switch";
    options?: string[];
    placeholder?: string;
    required?: boolean;
}

export const OCCASIONS: { value: OccasionType; label: string }[] = [
    { value: "birthday", label: "Birthday" },
    { value: "wedding", label: "Wedding" },
    { value: "engagement", label: "Engagement" },
    { value: "anniversary", label: "Anniversary" },
    { value: "baby_shower", label: "Baby Shower / Naming Ceremony" },
    { value: "house_warming", label: "House Warming" },
    { value: "corporate", label: "Corporate Event" },
    { value: "product_launch", label: "Product Launch" },
    { value: "portfolio", label: "Portfolio / Personal Website" },
    { value: "business", label: "Business / Service Website" },
    { value: "festival", label: "Festival Greeting" },
    { value: "invitation", label: "Invitation (Generic / Custom)" },
];

export const COMMON_FIELDS: FieldDefinition[] = [
    { id: "title", label: "Page Title", type: "text", placeholder: "e.g., Sarah's 5th Birthday", required: true },
    { id: "names", label: "Name(s)", type: "text", placeholder: "Person / Couple / Company Name", required: true },
    { id: "description", label: "Short Message / Description", type: "textarea", placeholder: "A brief welcome message...", required: true },
    { id: "date", label: "Date", type: "date", required: true },
    { id: "time", label: "Time", type: "time", required: false },
    { id: "location", label: "Location / Venue", type: "text", placeholder: "Venue Name & Address", required: true },
    { id: "contact", label: "Contact / RSVP Info", type: "text", placeholder: "Phone or Email", required: true },
];

export const DESIGN_PREFERENCES = {
    themes: [
        { value: "minimal", label: "Minimal" },
        { value: "modern", label: "Modern" },
        { value: "elegant", label: "Elegant" },
        { value: "traditional", label: "Traditional" },
        { value: "fun", label: "Fun / Colorful" },
    ],
    fonts: [
        { value: "serif", label: "Serif (Classic)" },
        { value: "sans", label: "Sans (Clean)" },
        { value: "handwritten", label: "Handwritten (Playful)" },
    ],
    languages: [
        { value: "english", label: "English" },
        { value: "telugu", label: "Telugu" },
        { value: "mixed", label: "Mixed (English + Telugu)" },
    ],
};

export const OCCASION_FIELDS: Record<OccasionType, FieldDefinition[]> = {
    birthday: [
        { id: "birthday_person", label: "Birthday Person Name", type: "text", required: true },
        { id: "age", label: "Age turning", type: "text", placeholder: "e.g., 5th, 21st" },
        { id: "relationship", label: "Relationship", type: "text", placeholder: "e.g., Son, Daughter, Friend" },
        { id: "special_message", label: "Special Message", type: "textarea" },
        { id: "event_type", label: "Event Type", type: "select", options: ["Party", "Surprise", "Simple Wish"] },
        { id: "dress_code", label: "Dress Code", type: "text" },
    ],
    wedding: [
        { id: "bride_name", label: "Bride Name", type: "text", required: true },
        { id: "groom_name", label: "Groom Name", type: "text", required: true },
        { id: "wedding_type", label: "Wedding Type", type: "select", options: ["Traditional", "Reception", "Destination"] },
        { id: "wedding_date", label: "Wedding Date", type: "date", required: true },
        { id: "wedding_time", label: "Wedding Time", type: "time" },
        { id: "venue_address", label: "Venue Address", type: "textarea", required: true },
        { id: "family_names", label: "Family Names", type: "textarea", placeholder: "Parents/Grantparents names..." },
        { id: "hashtags", label: "Hashtags", type: "text", placeholder: "#RahulWedsPriya" },
        { id: "dress_code", label: "Dress Code", type: "text" },
        { id: "map_link", label: "Map Link", type: "text" },
    ],
    engagement: [
        { id: "bride_name", label: "Bride Name", type: "text", required: true },
        { id: "groom_name", label: "Groom Name", type: "text", required: true },
        { id: "engagement_date_time", label: "Date & Time", type: "text", placeholder: "Example: 10th Aug at 7 PM" },
        { id: "venue", label: "Venue", type: "text", required: true },
        { id: "hosted_by", label: "Hosted By", type: "text", placeholder: "Families of..." },
        { id: "love_story", label: "Short Love Story", type: "textarea" },
    ],
    anniversary: [
        { id: "couple_names", label: "Couple Names", type: "text", required: true },
        { id: "anniversary_num", label: "Anniversary Number", type: "text", placeholder: "e.g., 1st, 25th Silver Jubilee" },
        { id: "marriage_year", label: "Marriage Year", type: "text" },
        { id: "celebration_type", label: "Celebration Type", type: "select", options: ["Private", "Party"] },
        { id: "message_from", label: "Message From", type: "text", placeholder: "Kids / Family / Friends" },
    ],
    baby_shower: [
        { id: "parent_names", label: "Parent Names", type: "text", required: true },
        { id: "baby_name", label: "Baby Name", type: "text", placeholder: "If revealed" },
        { id: "event_type", label: "Event Type", type: "select", options: ["Baby Shower", "Naming Ceremony"] },
        { id: "blessing_message", label: "Blessing Message", type: "textarea" },
        { id: "venue", label: "Venue", type: "text" },
        { id: "cultural_theme", label: "Cultural Theme", type: "text" },
    ],
    house_warming: [
        { id: "owner_names", label: "Owner Name(s)", type: "text", required: true },
        { id: "house_name", label: "House Name", type: "text" },
        { id: "event_date_time", label: "Event Date & Time", type: "text" },
        { id: "address", label: "Full Address", type: "textarea", required: true },
        { id: "puja_details", label: "Puja / Ceremony Details", type: "textarea" },
        { id: "hosted_by", label: "Hosted By", type: "text" },
    ],
    corporate: [
        { id: "company_name", label: "Company Name", type: "text", required: true },
        { id: "event_name", label: "Event Name", type: "text", required: true },
        { id: "purpose", label: "Event Purpose", type: "text" },
        { id: "speakers", label: "Speaker Names", type: "text" },
        { id: "agenda", label: "Agenda", type: "textarea" },
        { id: "registration_link", label: "Registration Link", type: "text" },
    ],
    product_launch: [
        { id: "product_name", label: "Product Name", type: "text", required: true },
        { id: "tagline", label: "Product Tagline", type: "text" },
        { id: "launch_date", label: "Launch Date & Time", type: "text" },
        { id: "features", label: "Key Features", type: "textarea", placeholder: "List key features..." },
        { id: "cta_text", label: "CTA Button Text", type: "text", placeholder: "Buy Now / Learn More" },
        { id: "website_link", label: "Website / Store Link", type: "text" },
    ],
    portfolio: [
        { id: "full_name", label: "Full Name", type: "text", required: true },
        { id: "profession", label: "Profession", type: "text", required: true },
        { id: "about", label: "About Me", type: "textarea" },
        { id: "skills", label: "Skills", type: "text", placeholder: "Comma separated (e.g. React, Python)" },
        { id: "projects", label: "Projects", type: "textarea", placeholder: "List project titles..." },
        { id: "contact_email", label: "Contact Email", type: "text" },
        { id: "social_links", label: "Social Links", type: "textarea", placeholder: "LinkedIn, GitHub, etc." },
    ],
    business: [
        { id: "business_name", label: "Business Name", type: "text", required: true },
        { id: "business_type", label: "Business Type", type: "text", placeholder: "e.g. Restaurant, Salon" },
        { id: "services", label: "Services Offered", type: "textarea", placeholder: "List services..." },
        { id: "service_area", label: "Service Area / Location", type: "text" },
        { id: "description", label: "Business Description", type: "textarea" },
        { id: "hours", label: "Working Hours", type: "text" },
        { id: "contact_details", label: "Contact Details", type: "text" },
        { id: "whatsapp", label: "WhatsApp Button", type: "select", options: ["Yes", "No"] },
    ],
    festival: [
        { id: "festival_name", label: "Festival Name", type: "text", required: true },
        { id: "greeting_message", label: "Greeting Message", type: "textarea" },
        { id: "from_name", label: "From Name / Family Name", type: "text" },
        { id: "cultural_style", label: "Cultural Style", type: "select", options: ["Traditional", "Modern"] },
        { id: "background", label: "Background Preference", type: "text" },
    ],
    invitation: [
        { id: "event_name", label: "Event Name", type: "text", required: true },
        { id: "host_name", label: "Host Name", type: "text" },
        { id: "description", label: "Event Description", type: "textarea" },
        { id: "date_time", label: "Date & Time", type: "text" },
        { id: "venue", label: "Venue", type: "text" },
        { id: "rsvp", label: "RSVP Details", type: "text" },
        { id: "notes", label: "Additional Notes", type: "textarea" },
    ],
};
