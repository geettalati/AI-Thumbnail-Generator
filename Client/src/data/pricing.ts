import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Basic",
        price: 29,
        period: "month",
        features: [
            "50 AI THUMBNAILS/mo",
            "Basic templates",
            "Standard Resolution",
            "No watermark",
            "Email Support"
        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 79,
        period: "month",
        features: [
            "Unlimited AI thumbnails",
            "Premium Templates",
            "4K resolution",
            "A/B testing tools",
            "Priority Support",
            "Custom Fonts",
        ],
        mostPopular: true
    },
    {
        name: "Enterprise",
        price: 199,
        period: "month",
        features: [
            "Everything in Pro",
            "Api access",
            "Team collaboration",
            "Custom Branding",
            "Dedicated Account Manager",
        ],
        mostPopular: false
    }
];