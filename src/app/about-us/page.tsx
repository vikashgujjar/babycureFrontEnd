import { createCmsPage } from "@/lib/cms/page-factory";

const { generateMetadata, CmsRoutePage } = createCmsPage("about-us", "About Us");

export { generateMetadata };
export default CmsRoutePage;
