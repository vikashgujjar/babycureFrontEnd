import { createCmsPage } from "@/lib/cms/page-factory";

const { generateMetadata, CmsRoutePage } = createCmsPage("privacy-policy", "Privacy Policy");

export { generateMetadata };
export default CmsRoutePage;
