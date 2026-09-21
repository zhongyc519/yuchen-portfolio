import vm from 'node:vm';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const context = vm.createContext({window: {}});
for (const file of ['content.js', 'cv-content.js']) {
  vm.runInContext(await readFile(join(root, file), 'utf8'), context, {filename: file});
}

const source = context.window.portfolioContent;
const slugify = value => String(value || 'project').toLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';
const key = (...parts) => slugify(parts.filter(Boolean).join('-')).slice(0, 80);

const categoryDocuments = source.workCategories.filter(row => row[0] !== 'all').map((row, index) => ({
  _id: `category-${slugify(row[0])}`,
  _type: 'category',
  titleEn: row[1],
  titleZh: row[2],
  slug: {_type: 'slug', current: row[0]},
  displayOrder: (index + 1) * 10,
  active: true,
}));

const imageEntry = (image, projectIndex, sectionIndex, imageIndex) => ({
  _key: key('image', projectIndex, sectionIndex, imageIndex),
  _type: 'projectImage',
  migrationSourcePath: image.src,
  altEn: image.altEn || '',
  altZh: image.altZh || '',
  captionEn: image.captionEn || '',
  captionZh: image.captionZh || '',
  layoutMode: 'AUTO',
});

const projectDocuments = source.cases.map((item, projectIndex) => {
  const textSections = (item.steps || []).map((step, sectionIndex) => ({
    _key: key('section', projectIndex, sectionIndex, step[0]),
    _type: 'projectSection',
    number: String(sectionIndex + 1).padStart(2, '0'),
    labelEn: step[0] || '',
    labelZh: step[1] || '',
    headingEn: step[0] || '',
    headingZh: step[1] || '',
    bodyEn: step[2] || '',
    bodyZh: step[3] || '',
    displayOrder: (sectionIndex + 1) * 10,
    images: [],
  }));
  const gallerySections = (item.galleryGroups || []).map((group, groupIndex) => {
    const sectionIndex = textSections.length + groupIndex;
    return {
      _key: key('section', projectIndex, sectionIndex, group.en),
      _type: 'projectSection',
      number: String(sectionIndex + 1).padStart(2, '0'),
      labelEn: group.en || '',
      labelZh: group.zh || '',
      headingEn: group.en || '',
      headingZh: group.zh || '',
      bodyEn: '',
      bodyZh: '',
      displayOrder: (sectionIndex + 1) * 10,
      images: (group.images || []).map((image, imageIndex) => imageEntry(image, projectIndex, sectionIndex, imageIndex)),
    };
  });
  if (item.image && !gallerySections.length) {
    const sectionIndex = textSections.length;
    gallerySections.push({
      _key: key('section', projectIndex, sectionIndex, 'project-image'),
      _type: 'projectSection',
      number: String(sectionIndex + 1).padStart(2, '0'),
      labelEn: 'Project Image', labelZh: '项目图片', headingEn: '', headingZh: '', bodyEn: '', bodyZh: '',
      displayOrder: (sectionIndex + 1) * 10,
      images: [imageEntry({src: item.image, altEn: item.imageAltEn, altZh: item.imageAltZh}, projectIndex, sectionIndex, 0)],
    });
  }
  const contribution = (item.steps || []).find(step => /contribution/i.test(step[0])) || [];
  const summary = (item.steps || [])[0] || [];
  const slug = slugify(item.tagEn || item.en);
  return {
    _id: `project-${slug}-${projectIndex + 1}`,
    _type: 'project',
    titleEn: item.en,
    titleZh: item.zh,
    slug: {_type: 'slug', current: slug},
    summaryEn: summary[2] || '',
    summaryZh: summary[3] || '',
    tagEn: item.tagEn || '',
    tagZh: item.tagZh || '',
    clientLabel: item.tagEn || '',
    roleEn: contribution[2] || '',
    roleZh: contribution[3] || '',
    category: {_type: 'reference', _ref: `category-${slugify(item.category || 'personal')}`},
    legacyCoverPath: item.image || '',
    featured: projectIndex < 3,
    collection: Boolean(item.collection),
    displayOrder: (projectIndex + 1) * 10,
    visibility: 'preview',
    sections: [...textSections, ...gallerySections],
  };
});

const outputDirectory = join(root, 'studio', 'seed');
await mkdir(outputDirectory, {recursive: true});
const documents = [...categoryDocuments, ...projectDocuments];
await writeFile(join(outputDirectory, 'selected-work.ndjson'), `${documents.map(document => JSON.stringify(document)).join('\n')}\n`, 'utf8');
console.log(`Created Sanity seed with ${projectDocuments.length} projects and ${categoryDocuments.length} categories.`);
