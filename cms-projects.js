(() => {
  const QUERY = `{
    "projects": *[_type == "project" && visibility == "public"] | order(displayOrder asc, _createdAt asc) {
      _id, titleEn, titleZh, "slug": slug.current, summaryEn, summaryZh, tagEn, tagZh,
      year, clientLabel, roleEn, roleZh, featured, collection, displayOrder, visibility,
      "category": category->{"slug": slug.current, titleEn, titleZh, displayOrder},
      coverImage{altEn, altZh, captionEn, captionZh, crop, hotspot, asset->{url, metadata{dimensions}}},
      sections[] | order(displayOrder asc) {
        _key, number, labelEn, labelZh, headingEn, headingZh, bodyEn, bodyZh, displayOrder,
        images[]{_key, altEn, altZh, captionEn, captionZh, layoutMode, image{crop, hotspot, asset->{url, metadata{dimensions}}}}
      }
    },
    "categories": *[_type == "category" && active != false] | order(displayOrder asc, titleEn asc) {
      _id, "slug": slug.current, titleEn, titleZh, displayOrder
    }
  }`;

  const numberOr = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const text = value => typeof value === 'string' ? value : '';
  const aspectOf = asset => numberOr(asset?.metadata?.dimensions?.aspectRatio, 1.4);
  const inferLayout = (mode, aspect) => {
    const explicit = text(mode).toLowerCase();
    if (explicit && explicit !== 'auto') return ['wide', 'standard', 'portrait'].includes(explicit) ? explicit : 'standard';
    if (aspect >= 1.6) return 'wide';
    if (aspect <= .82) return 'portrait';
    return 'standard';
  };
  const imageUrl = (url, width = 1400) => {
    if (!url || !/^https:\/\/cdn\.sanity\.io\//.test(url)) return text(url);
    const parsed = new URL(url);
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('fit', 'max');
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('q', '85');
    return parsed.toString();
  };
  const imagePosition = image => image?.hotspot ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%` : '50% 50%';
  const normalizeImage = entry => {
    const image = entry?.image || entry || {};
    const asset = image.asset || entry?.asset || {};
    const aspect = aspectOf(asset);
    const mode = entry?.layoutMode || 'AUTO';
    return {
      src: imageUrl(asset.url, inferLayout(mode, aspect) === 'wide' ? 1800 : 1200),
      originalSrc: text(asset.url),
      altEn: text(entry?.altEn || image.altEn),
      altZh: text(entry?.altZh || image.altZh),
      captionEn: text(entry?.captionEn || image.captionEn),
      captionZh: text(entry?.captionZh || image.captionZh),
      layoutMode: text(mode).toUpperCase() || 'AUTO',
      layout: inferLayout(mode, aspect),
      aspectRatio: aspect,
      objectPosition: imagePosition(image)
    };
  };
  const normalizeSection = (section, index) => ({
    number: text(section?.number) || String(index + 1).padStart(2, '0'),
    labelEn: text(section?.labelEn), labelZh: text(section?.labelZh),
    headingEn: text(section?.headingEn), headingZh: text(section?.headingZh),
    bodyEn: text(section?.bodyEn), bodyZh: text(section?.bodyZh),
    displayOrder: numberOr(section?.displayOrder, (index + 1) * 10),
    images: Array.isArray(section?.images) ? section.images.map(normalizeImage).filter(image => image.src) : []
  });
  const normalizeProject = (project, index) => {
    const cover = project?.coverImage ? normalizeImage(project.coverImage) : null;
    return {
      id: text(project?._id) || `cms-project-${index + 1}`,
      slug: text(project?.slug),
      en: text(project?.titleEn) || text(project?.en) || 'Untitled project',
      zh: text(project?.titleZh) || text(project?.zh) || text(project?.titleEn) || text(project?.en) || '未命名项目',
      summaryEn: text(project?.summaryEn), summaryZh: text(project?.summaryZh),
      tagEn: text(project?.tagEn) || text(project?.clientLabel),
      tagZh: text(project?.tagZh) || text(project?.clientLabel) || text(project?.tagEn),
      year: text(project?.year), clientLabel: text(project?.clientLabel),
      roleEn: text(project?.roleEn), roleZh: text(project?.roleZh),
      category: text(project?.category?.slug || project?.category) || 'personal',
      featured: Boolean(project?.featured), displayOrder: numberOr(project?.displayOrder, (index + 1) * 10),
      visibility: text(project?.visibility) || 'public', collection: Boolean(project?.collection),
      image: cover?.src || text(project?.image), originalImage: cover?.originalSrc || text(project?.image),
      imageAltEn: cover?.altEn || text(project?.imageAltEn), imageAltZh: cover?.altZh || text(project?.imageAltZh),
      imagePosition: cover?.objectPosition || '50% 50%',
      sections: Array.isArray(project?.sections) ? project.sections.map(normalizeSection).sort((a,b) => a.displayOrder - b.displayOrder) : [],
      steps: project?.steps, galleryGroups: project?.galleryGroups
    };
  };
  const normalizeCategories = (categories, fallbackCategories) => {
    const fallback = Array.isArray(fallbackCategories) ? fallbackCategories : [];
    const normalized = (Array.isArray(categories) ? categories : []).filter(item => item?.slug).map(item => [item.slug, text(item.titleEn) || item.slug, text(item.titleZh) || text(item.titleEn) || item.slug]);
    const rows = normalized.length ? normalized : fallback.filter(row => row?.[0] !== 'all');
    return [['all', 'All Work', '全部作品'], ...rows.filter(row => row[0] !== 'all')];
  };
  const normalizePayload = (payload, fallbackProjects, fallbackCategories) => {
    const visible = (Array.isArray(payload?.projects) ? payload.projects : []).filter(project => (project.visibility || 'public') === 'public');
    if (!visible.length) return {projects: fallbackProjects, categories: fallbackCategories, source: 'fallback'};
    const projects = visible.map(normalizeProject).sort((a,b) => a.displayOrder - b.displayOrder);
    return {projects, categories: normalizeCategories(payload.categories, fallbackCategories), source: 'sanity'};
  };
  async function loadProjects(fallbackProjects = [], fallbackCategories = []) {
    const config = window.SANITY_PUBLIC_CONFIG || {};
    if (!/^[a-z0-9-]+$/i.test(config.projectId || '') || !/^[a-z0-9_-]+$/i.test(config.dataset || '')) return {projects: fallbackProjects, categories: fallbackCategories, source: 'fallback'};
    const apiVersion = config.apiVersion || '2026-09-21';
    const endpoint = new URL(`https://${config.projectId}.api.sanity.io/v${apiVersion}/data/query/${config.dataset}`);
    endpoint.searchParams.set('query', QUERY);
    endpoint.searchParams.set('perspective', 'published');
    try {
      const response = await fetch(endpoint, {headers: {Accept: 'application/json'}});
      if (!response.ok) throw new Error('CMS request failed');
      const body = await response.json();
      return normalizePayload(body.result, fallbackProjects, fallbackCategories);
    } catch {
      return {projects: fallbackProjects, categories: fallbackCategories, source: 'fallback'};
    }
  }
  window.portfolioCms = {QUERY, inferLayout, imageUrl, normalizePayload, loadProjects};
})();
