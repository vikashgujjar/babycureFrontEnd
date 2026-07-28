import { createCmsPage } from "@/lib/cms/page-factory";

const { generateMetadata, CmsRoutePage } = createCmsPage("refund-policy", "Refund Policy");

export { generateMetadata };
export default CmsRoutePage;
