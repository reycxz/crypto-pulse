// Vercel Serverless Function — /api/markets
// Proxies the CoinGecko request server-side so the API key is never
// exposed in the browser bundle.

export default async function handler(req, res) {
    // Allow GET requests only
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.COINGECKO_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    // Forward query params from the browser (vs_currency, per_page, page, etc.)
    const { vs_currency = 'usd', order = 'market_cap_desc', per_page = 10, page = 1 } = req.query;

    const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
    url.searchParams.set('vs_currency', vs_currency);
    url.searchParams.set('order', order);
    url.searchParams.set('per_page', per_page);
    url.searchParams.set('page', page);

    try {
        const upstream = await fetch(url.toString(), {
            headers: {
                'x-cg-demo-api-key': apiKey,
                'Accept': 'application/json',
            },
        });

        if (!upstream.ok) {
            const text = await upstream.text();
            return res.status(upstream.status).json({
                error: `CoinGecko error ${upstream.status}`,
                detail: text,
            });
        }

        const data = await upstream.json();

        // Cache the response on Vercel's CDN edge for 60 seconds to stay within
        // the Demo plan's 30 calls/min rate limit.
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch from CoinGecko', detail: err.message });
    }
}
