import withAuth from '@/lib/auth/auth';

import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchLogoHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { domain, theme } = req.query;

    if (!domain || typeof domain !== 'string') {
        return res.status(400).json({ error: 'Domain parameter is required' });
    }

    try {
        let iconUrl = await extractIconFromHtml(domain, typeof theme === 'string' ? theme : undefined);

        if (!iconUrl) {
            iconUrl = `https://${domain}/favicon.ico`;
        }

        const response = await fetch(iconUrl, {
            headers: {
                Referer: `https://${domain}/`,
            },
        });

        if (!response.ok) {
            return res.status(404).json({ error: 'Icon not found' });
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        const contentType = getContentType(iconUrl, response);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', buffer.length.toString());
        res.setHeader('Cache-Control', 'max-age=315360000');

        return res.status(200).send(buffer);
    } catch {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function extractIconFromHtml(domain: string, theme?: string): Promise<string | null> {
    try {
        const htmlUrl = `https://${domain}`;

        const response = await fetch(htmlUrl);
        if (!response.ok) {
            return null;
        }

        const html = await response.text();
        const iconLinks = parseIconLinks(html);
        const iconUrl = selectBestIcon(iconLinks, domain, theme);
        return iconUrl;
    } catch {
        return null;
    }
}

function parseIconLinks(html: string): Array<{ href: string; type?: string; sizes?: string }> {
    const iconLinks: Array<{ href: string; type?: string; sizes?: string }> = [];

    const linkRegex = /<link[^>]*>/gi;
    const linkTags = html.match(linkRegex) || [];

    for (const tag of linkTags) {
        const iconMatch = tag.match(/rel=["'](icon|shortcut icon|apple-touch-icon|apple-touch-icon-precomposed)["']/i);
        if (iconMatch) {
            const hrefMatch = tag.match(/href=["']([^"']+)["']/);
            if (hrefMatch) {
                const href = hrefMatch[1];
                const typeMatch = tag.match(/type=["']([^"']+)["']/);
                const sizesMatch = tag.match(/sizes=["']([^"']+)["']/);

                iconLinks.push({
                    href,
                    type: typeMatch ? typeMatch[1] : undefined,
                    sizes: sizesMatch ? sizesMatch[1] : undefined,
                });
            }
        }
    }

    return iconLinks;
}

function selectBestIcon(
    iconLinks: Array<{ href: string; type?: string; sizes?: string }>,
    domain: string,
    theme?: string
): string | null {
    if (iconLinks.length === 0) {
        return null;
    }

    const normalizeUrl = (url: string): string => {
        return url.split('#')[0].split('?')[0];
    };

    const parseSize = (sizesStr?: string): number => {
        if (!sizesStr) return 0;
        if (sizesStr.toLowerCase() === 'any') return Number.MAX_SAFE_INTEGER;
        const match = sizesStr.match(/(\d+)x\1/);
        if (match) {
            return parseInt(match[1], 10);
        }
        return 0;
    };

    // Step 1: Filter valid icons (remove data: and javascript: URLs)
    const validIcons = iconLinks.filter(link => {
        const href = normalizeUrl(link.href);
        return !href.startsWith('data:') && !href.startsWith('javascript:');
    });

    // Step 2: Filter by theme first (if specified)
    const themeFiltered = (() => {
        if (!theme) return validIcons;

        const isDarkTheme = theme === 'dark';
        return validIcons.filter(link => {
            const href = link.href.toLowerCase();
            const isDarkIcon = href.includes('dark') || href.includes('_dark') || href.includes('-dark');
            return isDarkTheme ? isDarkIcon : !isDarkIcon;
        });
    })();

    // Step 3: Prioritize SVG icons (no size comparison needed)
    const svgIcons = themeFiltered.filter(link => {
        const type = link.type?.toLowerCase();
        const href = link.href.toLowerCase();
        return type === 'image/svg+xml' || href.endsWith('.svg');
    });

    if (svgIcons.length > 0) {
        // Step 4a: Use first SVG icon (no size comparison needed)
        const selectedIcon = svgIcons[0];
        const iconUrl = buildAbsoluteUrl(selectedIcon.href, domain);

        return iconUrl;
    }

    // Step 4b: No SVG available, sort by size for bitmap icons
    const sortedIcons = themeFiltered
        .map(link => ({
            ...link,
            size: parseSize(link.sizes)
        }))
        .sort((a, b) => b.size - a.size);

    if (sortedIcons.length === 0) {
        return null;
    }

    // Step 5: Build absolute URL for bitmap icon
    const selectedIcon = sortedIcons[0];
    const iconUrl = buildAbsoluteUrl(selectedIcon.href, domain);

    return iconUrl;
}

function buildAbsoluteUrl(href: string, domain: string): string {
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
        return `https://${domain}${href.startsWith('/') ? '' : '/'}${href}`;
    } else if (!href.startsWith('http://') && !href.startsWith('https://')) {
        return `https://${domain}/${href}`;
    }
    return href;
}

function getContentType(url: string, response: Response): string {
    const contentType = response.headers.get('content-type');
    if (contentType) {
        return contentType;
    }

    if (url.endsWith('.svg') || url.includes('image/svg+xml')) {
        return 'image/svg+xml';
    } else if (url.endsWith('.png')) {
        return 'image/png';
    } else if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
        return 'image/jpeg';
    } else if (url.endsWith('.gif')) {
        return 'image/gif';
    } else if (url.endsWith('.ico')) {
        return 'image/x-icon';
    }

    return 'application/octet-stream';
}

export default withAuth(fetchLogoHandler);
