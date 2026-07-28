import { createCmsPage } from "@/lib/cms/page-factory";

const { generateMetadata, CmsRoutePage } = createCmsPage("shipping-policy", "Shipping Policy");

export { generateMetadata };
export default CmsRoutePage;
