export const DEFAULT_FIN = {
    totalLots: 50, landCost: 3000000, closingCosts: 90000, hardCostPerLot: 65000,
    softCostPct: 18, contingencyPct: 10, salesPricePerLot: 185000, salesCommission: 3,
    absorbRate: 3, planningFees: 120000, permitFeePerLot: 8500, schoolFee: 3200,
    impactFeePerLot: 12000, reservePercentage: 5, grm: 14.2, irr: 18.4,
};

export const DEFAULT_RISKS = [
    { id: 1, cat: "Market", risk: "Home price softening during sell-out", likelihood: "Medium", impact: "High", severity: "High", mitigation: "Phased lot releases; forward sale agreements", status: "Open" },
    { id: 2, cat: "Entitlement", risk: "CEQA challenge or appeal by neighbors", likelihood: "Medium", impact: "High", severity: "High", mitigation: "Community outreach; robust EIR; legal reserve", status: "Open" },
    { id: 3, cat: "Construction", risk: "Labor and material cost escalation", likelihood: "High", impact: "Medium", severity: "High", mitigation: "Fixed-price contractor agreements; 15% contingency", status: "Mitigated" },
    { id: 4, cat: "Environmental", risk: "Undiscovered contamination on site", likelihood: "Low", impact: "Critical", severity: "High", mitigation: "Phase I/II ESA; environmental indemnity from seller", status: "Open" },
    { id: 5, cat: "Financial", risk: "Construction loan maturity before sell-out", likelihood: "Low", impact: "High", severity: "Medium", mitigation: "Structure loan with 12-month extension option", status: "Open" },
    { id: 6, cat: "Regulatory", risk: "Impact fee increases mid-entitlement", likelihood: "Medium", impact: "Medium", severity: "Medium", mitigation: "Vesting Tentative Map; Development Agreement", status: "Open" },
];

export const DEFAULT_PERMITS = [
    { name: "Tentative Map Approval", agency: "Planning Dept", duration: "16-24 wks", cost: "$25,000", status: "Not Started", req: true },
    { name: "Final Map Recordation", agency: "County Recorder", duration: "8-12 wks", cost: "$8,500", status: "Not Started", req: true },
    { name: "Grading Permit", agency: "Building Dept", duration: "4-6 wks", cost: "$45,000", status: "Not Started", req: true },
    { name: "NPDES / SWPPP", agency: "State Water Board", duration: "2-4 wks", cost: "$3,200", status: "Not Started", req: true },
    { name: "404 Wetlands Permit", agency: "Army Corps", duration: "12-52 wks", cost: "$18,000", status: "N/A", req: false },
    { name: "CEQA Compliance", agency: "Lead Agency", duration: "12-26 wks", cost: "$35,000", status: "Not Started", req: true },
    { name: "Improvement Plans", agency: "City Engineer", duration: "8-12 wks", cost: "$55,000", status: "Not Started", req: true },
    { name: "Street Improvement Permit", agency: "Public Works", duration: "2-4 wks", cost: "$12,000", status: "Not Started", req: true },
    { name: "Utility Agreements", agency: "Various Districts", duration: "4-8 wks", cost: "Varies", status: "Not Started", req: true },
];

export const DD_CATS = [
    {
        cat: "Title & Legal", items: [
            { t: "Preliminary Title Report ordered", r: "High" }, { t: "CC&Rs and deed restrictions reviewed", r: "High" },
            { t: "ALTA Survey ordered and received", r: "High" }, { t: "Easements mapped and plotted", r: "High" },
            { t: "Encumbrances cleared or budgeted", r: "Medium" }, { t: "Entity / ownership structure confirmed", r: "Medium" },
            { t: "Seller disclosure statement reviewed", r: "Medium" },
        ]
    },
    {
        cat: "Physical & Environmental", items: [
            { t: "Phase I ESA completed", r: "High" }, { t: "Geotechnical / soils report ordered", r: "High" },
            { t: "Flood zone determination (FEMA)", r: "High" }, { t: "Wetlands delineation (if applicable)", r: "High" },
            { t: "Biological survey completed", r: "Medium" }, { t: "Topographic survey completed", r: "Medium" },
            { t: "Cultural resources review completed", r: "Low" },
        ]
    },
    {
        cat: "Entitlements & Zoning", items: [
            { t: "Zoning verified and documented", r: "High" }, { t: "General Plan designation confirmed", r: "High" },
            { t: "Density and development standards extracted", r: "High" }, { t: "Pre-application meeting held", r: "Medium" },
            { t: "Entitlement pathway and timeline mapped", r: "Medium" }, { t: "School and impact fees quantified", r: "Medium" },
            { t: "Vesting tentative map strategy confirmed", r: "Medium" },
        ]
    },
    {
        cat: "Infrastructure", items: [
            { t: "Water availability letter obtained", r: "High" }, { t: "Sewer capacity confirmed in writing", r: "High" },
            { t: "Off-site improvement costs estimated", r: "High" }, { t: "Traffic study scope determined", r: "Medium" },
            { t: "Utility extension costs budgeted", r: "Medium" }, { t: "Dry utility franchise agreements identified", r: "Low" },
        ]
    },
    {
        cat: "Financial & Market", items: [
            { t: "Comparable sales analyzed (min 3)", r: "High" }, { t: "Development pro forma completed", r: "High" },
            { t: "Construction financing term sheet received", r: "High" }, { t: "Absorption rate supported by market data", r: "High" },
            { t: "Contingency reserve adequate (>=10%)", r: "Medium" }, { t: "Fee schedule verified with municipality", r: "Medium" },
            { t: "Equity partner / JV terms agreed", r: "Medium" },
        ]
    },
];

export const ALL_DD = DD_CATS.flatMap(c => c.items);
